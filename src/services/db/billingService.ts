// Billing and utility service for computing rent and utilities (Full & Connected with Email Filtering)
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface UtilityRates {
  waterRatePerCubicMeter: number;
  electricRatePerKwh: number;
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

// Get invoices (Supabase with LocalStorage fallback and User Email Filtering)
export const getLocalInvoices = async (userEmail?: string): Promise<ClientInvoice[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedInvoices: ClientInvoice[] = data.map((b: any) => ({
          id: b.id,
          invoiceNumber: b.invoice_number || `INV-${b.id.substring(0, 5)}`,
          tenantOrGuestName: b.tenant_or_guest_name || 'Guest',
          tenantEmail: b.tenant_email || '',
          roomOrBed: b.room_or_bed || 'Dormitory Room',
          stayType: b.stay_type || 'Monthly Dorm Rent',
          billingPeriod: b.billing_period || 'Current Period',
          rentAmount: Number(b.rent_amount) || 0,
          waterAmount: Number(b.water_amount) || 0,
          electricityAmount: Number(b.electricity_amount) || 0,
          depositAmount: Number(b.deposit_amount) || 0,
          totalAmount: Number(b.total_amount) || 0,
          dueDate: b.due_date || '2026-10-30',
          paymentStatus: b.payment_status || 'Pending',
          paymentMethod: b.payment_method || '',
          paymentReference: b.payment_reference || '',
          paidAt: b.paid_at || '',
          createdAt: b.created_at || new Date().toISOString()
        }));

        if (userEmail) {
          const cleanEmail = userEmail.toLowerCase().trim();
          return mappedInvoices.filter(inv => inv.tenantEmail && inv.tenantEmail.toLowerCase().trim() === cleanEmail);
        }
        return mappedInvoices;
      }
    } catch (e) {
      console.warn('Supabase fetch invoices error, falling back to local:', e);
    }
  }

  // Fallback to local storage if supabase is empty or unconfigured
  try {
    const data = localStorage.getItem('dragon_treasure_invoices');
    if (data) {
      const existing: ClientInvoice[] = JSON.parse(data);
      if (userEmail) {
        const cleanEmail = userEmail.toLowerCase().trim();
        return existing.filter(inv => inv.tenantEmail && inv.tenantEmail.toLowerCase().trim() === cleanEmail);
      }
      return existing;
    }

    // Kung walang-wala, talagang blangko lang i-return
    const initial: ClientInvoice[] = [];
    localStorage.setItem('dragon_treasure_invoices', JSON.stringify(initial));
    return [];
  } catch {
    return [];
  }
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

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            invoice_number: newInvoice.invoiceNumber,
            tenant_or_guest_name: newInvoice.tenantOrGuestName,
            tenant_email: newInvoice.tenantEmail || '',
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
        await supabase
          .from('invoices')
          .update({
            payment_status: 'Paid',
            payment_method: payment.paymentMethod,
            payment_reference: payment.referenceNumber,
            paid_at: paidAt
          })
          .eq('id', payment.invoiceId);

        updateLocalInvoicePayment(payment.invoiceId, payment.paymentMethod, payment.referenceNumber, paidAt);
        return { success: true, message: 'Payment successfully submitted for verification!' };
      }
    } catch (err: any) {
      console.warn('Supabase payment sync notice:', err?.message);
    }
  }

  updateLocalInvoicePayment(payment.invoiceId, payment.paymentMethod, payment.referenceNumber, paidAt);
  return { success: true, message: 'Payment recorded and queued for verification.' };
};

// Local storage helper functions
export const saveLocalInvoice = (invoice: ClientInvoice): void => {
  try {
    const data = localStorage.getItem('dragon_treasure_invoices');
    const existing: ClientInvoice[] = data ? JSON.parse(data) : [];
    const updated = [invoice, ...existing.filter(i => i.id !== invoice.id)];
    localStorage.setItem('dragon_treasure_invoices', JSON.stringify(updated));
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
    const data = localStorage.getItem('dragon_treasure_invoices');
    const existing: ClientInvoice[] = data ? JSON.parse(data) : [];
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
    localStorage.setItem('dragon_treasure_invoices', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update invoice payment locally', e);
  }
};