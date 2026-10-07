// Billing and utility service for computing rent and utilities
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface UtilityRates {
  waterRatePerCubicMeter: number; // Standard: ₱45.00/m³
  electricRatePerKwh: number; // Standard: ₱14.50/kWh
}

export const DEFAULT_UTILITY_RATES: UtilityRates = {
  waterRatePerCubicMeter: 45.00,
  electricRatePerKwh: 14.50,
};

export interface UtilityReadingInput {
  waterPrevious: number;
  waterCurrent: number;
  electricPrevious: number;
  electricCurrent: number;
  rates?: UtilityRates;
}

export interface ComputedUtilities {
  waterConsumption: number; // m³
  waterRate: number;
  waterTotal: number;
  electricConsumption: number; // kWh
  electricRate: number;
  electricTotal: number;
}

export type InvoiceStayType = 
  | 'Monthly Dorm Rent' 
  | 'Transient Stay' 
  | 'Transient Booking' 
  | 'Utility Settlement' 
  | 'Security Deposit';

export interface InvoiceGenerationInput {
  tenantOrGuestName: string;
  tenantEmail?: string;
  roomOrBed: string;
  stayType: InvoiceStayType;
  billingPeriod: string;
  baseRent: number;
  utilityReadings?: UtilityReadingInput;
  depositAmount?: number;
  dueDate: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  tenantOrGuestName: string;
  tenantEmail?: string;
  roomOrBed: string;
  stayType: InvoiceStayType;
  billingPeriod: string;
  rentAmount: number;
  waterAmount: number;
  electricityAmount: number;
  depositAmount: number;
  totalAmount: number;
  dueDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  paymentReference?: string;
  receiptUrl?: string;
  paidAt?: string;
  utilitiesBreakdown?: ComputedUtilities;
  createdAt: string;
}

export interface OnlinePaymentSubmission {
  invoiceId: string;
  paymentMethod: 'GCash' | 'Maya' | 'Bank Transfer' | 'Cash';
  referenceNumber: string;
  accountName?: string;
  receiptFileOrUrl?: string;
  amount: number;
}

// Compute water and electric utility consumption
export const computeUtilityReadings = (
  input: UtilityReadingInput
): ComputedUtilities => {
  const rates = input.rates || DEFAULT_UTILITY_RATES;
  
  const waterConsumption = Math.max(0, Number(input.waterCurrent) - Number(input.waterPrevious));
  const waterTotal = Math.round(waterConsumption * rates.waterRatePerCubicMeter * 100) / 100;

  const electricConsumption = Math.max(0, Number(input.electricCurrent) - Number(input.electricPrevious));
  const electricTotal = Math.round(electricConsumption * rates.electricRatePerKwh * 100) / 100;

  return {
    waterConsumption,
    waterRate: rates.waterRatePerCubicMeter,
    waterTotal,
    electricConsumption,
    electricRate: rates.electricRatePerKwh,
    electricTotal
  };
};

// Generate invoice with utility breakdown
export const generateAutomatedInvoice = async (
  input: InvoiceGenerationInput
): Promise<ClientInvoice> => {
  let waterAmount = 0;
  let electricityAmount = 0;
  let breakdown: ComputedUtilities | undefined;

  if (input.utilityReadings) {
    breakdown = computeUtilityReadings(input.utilityReadings);
    waterAmount = breakdown.waterTotal;
    electricityAmount = breakdown.electricTotal;
  }

  const rentAmount = Number(input.baseRent) || 0;
  const depositAmount = Number(input.depositAmount) || 0;
  const totalAmount = rentAmount + waterAmount + electricityAmount + depositAmount;

  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInvoice: ClientInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber,
    tenantOrGuestName: input.tenantOrGuestName,
    tenantEmail: input.tenantEmail,
    roomOrBed: input.roomOrBed,
    stayType: input.stayType,
    billingPeriod: input.billingPeriod,
    rentAmount,
    waterAmount,
    electricityAmount,
    depositAmount,
    totalAmount,
    dueDate: input.dueDate,
    paymentStatus: 'Pending',
    utilitiesBreakdown: breakdown,
    createdAt: new Date().toISOString()
  };

  // If Supabase is connected, insert record
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            invoice_number: newInvoice.invoiceNumber,
            tenant_or_guest_name: newInvoice.tenantOrGuestName,
            room_or_bed: newInvoice.roomOrBed,
            stay_type: newInvoice.stayType,
            billing_period: newInvoice.billingPeriod,
            rent_amount: newInvoice.rentAmount,
            water_amount: newInvoice.waterAmount,
            electricity_amount: newInvoice.electricityAmount,
            deposit_amount: newInvoice.depositAmount,
            total_amount: newInvoice.totalAmount,
            due_date: newInvoice.dueDate,
            payment_status: newInvoice.paymentStatus
          }
        ])
        .select()
        .single();

      if (!error && data) {
        newInvoice.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase invoice sync notice:', e);
    }
  }

  saveLocalInvoice(newInvoice);
  return newInvoice;
};

// Submit online payment proof
export const submitOnlinePayment = async (
  payment: OnlinePaymentSubmission
): Promise<{ success: boolean; message: string }> => {
  const paidAt = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (isSupabaseConfigured()) {
    try {
      // 1. Insert payment proof record
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          invoice_id: payment.invoiceId,
          amount: payment.amount,
          payment_method: payment.paymentMethod,
          reference_number: payment.referenceNumber,
          sender_account_name: payment.accountName || '',
          receipt_url: payment.receiptFileOrUrl || null,
          verification_status: 'Pending Review'
        }
      ]);

      if (!paymentError) {
        // 2. Update invoice status to Paid/Pending Verification
        await supabase
          .from('invoices')
          .update({
            payment_status: 'Paid',
            payment_method: payment.paymentMethod,
            paid_at: new Date().toISOString()
          })
          .eq('id', payment.invoiceId);

        updateLocalInvoicePayment(payment.invoiceId, payment.paymentMethod, payment.referenceNumber, paidAt);
        return { success: true, message: 'Payment successfully submitted for verification!' };
      }
    } catch (err: any) {
      console.warn('Supabase payment sync notice:', err?.message);
    }
  }

  // Local persistence update
  updateLocalInvoicePayment(payment.invoiceId, payment.paymentMethod, payment.referenceNumber, paidAt);
  return { success: true, message: 'Payment recorded and queued for verification.' };
};

// Local storage helpers for invoices
const INVOICES_STORAGE_KEY = 'dragon_treasure_invoices';

export const getLocalInvoices = (): ClientInvoice[] => {
  try {
    const data = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (data) return JSON.parse(data);

    // Initial default invoices for current tenants
    const initial: ClientInvoice[] = [
      {
        id: 'inv-oct-01',
        invoiceNumber: 'INV-2026-1042',
        tenantOrGuestName: 'Bea Alonzo',
        tenantEmail: 'bea.alonzo@gmail.com',
        roomOrBed: 'Dormitory Room - Bed 1 (Female)',
        stayType: 'Monthly Dorm Rent',
        billingPeriod: 'October 2026',
        rentAmount: 3000,
        waterAmount: 180, // 4m³ @ ₱45/m³
        electricityAmount: 435, // 30kWh @ ₱14.50/kWh
        depositAmount: 0,
        totalAmount: 3615,
        dueDate: '2026-10-15',
        paymentStatus: 'Pending',
        utilitiesBreakdown: {
          waterConsumption: 4,
          waterRate: 45,
          waterTotal: 180,
          electricConsumption: 30,
          electricRate: 14.5,
          electricTotal: 435
        },
        createdAt: '2026-10-01'
      },
      {
        id: 'inv-sep-01',
        invoiceNumber: 'INV-2026-0921',
        tenantOrGuestName: 'Bea Alonzo',
        tenantEmail: 'bea.alonzo@gmail.com',
        roomOrBed: 'Dormitory Room - Bed 1 (Female)',
        stayType: 'Monthly Dorm Rent',
        billingPeriod: 'September 2026',
        rentAmount: 3000,
        waterAmount: 135,
        electricityAmount: 377,
        depositAmount: 0,
        totalAmount: 3512,
        dueDate: '2026-09-15',
        paymentStatus: 'Paid',
        paymentMethod: 'GCash',
        paymentReference: 'GC-9402859132',
        paidAt: 'Sep 12, 2026',
        createdAt: '2026-09-01'
      }
    ];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return [];
  }
};

export const saveLocalInvoice = (invoice: ClientInvoice): void => {
  try {
    const existing = getLocalInvoices();
    const updated = [invoice, ...existing.filter(i => i.id !== invoice.id)];
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save invoice locally', e);
  }
};

export const updateLocalInvoicePayment = (
  invoiceId: string,
  method: string,
  reference: string,
  paidAtDate: string
): void => {
  try {
    const existing = getLocalInvoices();
    const updated = existing.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            paymentStatus: 'Paid' as const,
            paymentMethod: method,
            paymentReference: reference,
            paidAt: paidAtDate
          }
        : inv
    );
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update invoice payment locally', e);
  }
};
