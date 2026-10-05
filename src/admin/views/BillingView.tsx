import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  FileText, 
  X, 
  Zap, 
  Droplet, 
  ShieldCheck 
} from 'lucide-react';
import { AdminBillingRecord } from '../data/adminMockData';

interface BillingViewProps {
  billingRecords: AdminBillingRecord[];
  onUpdateStatus: (id: string, newStatus: 'Paid' | 'Pending' | 'Overdue') => void;
  onAddRecord: (newRec: AdminBillingRecord) => void;
  initialFilter?: string;
}

export const BillingView: React.FC<BillingViewProps> = ({
  billingRecords,
  onUpdateStatus,
  onAddRecord,
  initialFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>(
    (initialFilter as any) || 'All'
  );

  React.useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter as any);
    }
  }, [initialFilter]);
  const [selectedRecord, setSelectedRecord] = useState<AdminBillingRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    tenantOrGuest: '',
    roomOrBed: 'Dormitory Room (Shared Bedspace) - Bed 1',
    type: 'Monthly Dorm Rent' as AdminBillingRecord['type'],
    billingPeriod: 'October 2026',
    rentAmount: 3000,
    waterAmount: 150,
    electricityAmount: 350,
    depositAmount: 0,
    dueDate: '2026-10-15',
    paymentStatus: 'Pending' as 'Paid' | 'Pending' | 'Overdue'
  });

  const filteredRecords = billingRecords.filter((b) => {
    const matchesSearch =
      b.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tenantOrGuest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomOrBed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.billingPeriod.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = billingRecords.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = billingRecords.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalOutstanding = billingRecords.filter(b => b.paymentStatus !== 'Paid').reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const rent = Number(invoiceForm.rentAmount) || 0;
    const water = Number(invoiceForm.waterAmount) || 0;
    const electricity = Number(invoiceForm.electricityAmount) || 0;
    const deposit = Number(invoiceForm.depositAmount) || 0;
    const total = rent + water + electricity + deposit;

    const newRecord: AdminBillingRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      tenantOrGuest: invoiceForm.tenantOrGuest.trim() || 'Guest',
      roomOrBed: invoiceForm.roomOrBed,
      type: invoiceForm.type,
      billingPeriod: invoiceForm.billingPeriod,
      rentAmount: rent,
      waterAmount: water,
      electricityAmount: electricity,
      depositAmount: deposit,
      totalAmount: total,
      paymentStatus: invoiceForm.paymentStatus,
      dueDate: invoiceForm.dueDate
    };

    onAddRecord(newRecord);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Billing & Financial Settlements</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-pine-900 border border-gold-300">
              {billingRecords.length} Invoices
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Track transient lodging receipts, monthly dormitory rent, water & electricity utilities, and security deposits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Statement / Invoice</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fffdfa] border border-gold-200/90 p-5 rounded-3xl space-y-1 shadow-card">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Billed (This Cycle)
          </span>
          <div className="text-2xl font-serif font-bold text-pine-950">
            ₱{totalBilled.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Across {billingRecords.length} statements</span>
        </div>

        <div className="bg-[#fffdfa] border border-emerald-300/80 p-5 rounded-3xl space-y-1 shadow-card">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Collected / Settled
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            ₱{totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {((totalCollected / (totalBilled || 1)) * 100).toFixed(1)}% Collection Rate
          </span>
        </div>

        <div className="bg-[#fffdfa] border border-rose-300/80 p-5 rounded-3xl space-y-1 shadow-card">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Outstanding / Due
          </span>
          <div className="text-2xl font-serif font-bold text-rose-700">
            ₱{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">
            {billingRecords.filter(b => b.paymentStatus !== 'Paid').length} Unsettled accounts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#fffdfa] border border-gold-200/90 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-pine-700" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice number (e.g. INV-2026-081), tenant, room, or period..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-pine-900 hover:bg-gold-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Billing Table (Section 13) */}
      <div className="bg-[#fffdfa] border border-gold-200/90 rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-pine-950 border-b border-gold-200/80 bg-gold-50/60 font-bold">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Tenant / Guest</th>
                <th className="py-3.5 px-4">Room / Unit</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4">Rent</th>
                <th className="py-3.5 px-4">Water</th>
                <th className="py-3.5 px-4">Electricity</th>
                <th className="py-3.5 px-4">Deposit</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100/70">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    No billing statements found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gold-50/40 transition-colors">
                    
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-pine-900 whitespace-nowrap">
                      {rec.invoiceNumber}
                    </td>

                    {/* Tenant / Guest */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                      {rec.tenantOrGuest}
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      {rec.roomOrBed}
                    </td>

                    {/* Billing Period */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {rec.billingPeriod}
                    </td>

                    {/* Rent */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                      {rec.rentAmount > 0 ? `₱${rec.rentAmount.toLocaleString()}` : '—'}
                    </td>

                    {/* Water */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                      {rec.waterAmount > 0 ? `₱${rec.waterAmount.toLocaleString()}` : '—'}
                    </td>

                    {/* Electricity */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                      {rec.electricityAmount > 0 ? `₱${rec.electricityAmount.toLocaleString()}` : '—'}
                    </td>

                    {/* Deposit */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                      {rec.depositAmount > 0 ? `₱${rec.depositAmount.toLocaleString()}` : '—'}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-pine-900 text-sm">
                      ₱{rec.totalAmount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={rec.paymentStatus}
                        onChange={(e) => onUpdateStatus(rec.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none bg-stone-50 ${
                          rec.paymentStatus === 'Paid'
                            ? 'text-emerald-800 border-emerald-300 bg-emerald-50/70'
                            : rec.paymentStatus === 'Pending'
                            ? 'text-amber-800 border-amber-300 bg-amber-50/70'
                            : 'text-rose-800 border-rose-300 bg-rose-50/70'
                        }`}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(rec)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-gold-100 text-slate-700 hover:text-pine-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 border border-stone-200"
                      >
                        <Receipt className="w-3 h-3 text-pine-700" />
                        <span>Breakdown</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILLING BREAKDOWN MODAL (Section 13) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-bold text-pine-900 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                  {selectedRecord.invoiceNumber}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1 font-serif">
                  Billing Statement Breakdown
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="text-slate-600">Account: <strong className="text-slate-900">{selectedRecord.tenantOrGuest}</strong></div>
                <div className="text-slate-600">Unit: <strong className="text-slate-900">{selectedRecord.roomOrBed}</strong></div>
                <div className="text-slate-600">Period: <strong className="text-slate-900">{selectedRecord.billingPeriod}</strong></div>
              </div>

              {/* Exact Formula Breakdown */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 font-mono">
                <div className="flex justify-between text-slate-800">
                  <span>Monthly / Stay Rent:</span>
                  <span>₱{selectedRecord.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-800">
                  <span>Water Utility:</span>
                  <span>₱{selectedRecord.waterAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-800">
                  <span>Electricity Utility:</span>
                  <span>₱{selectedRecord.electricityAmount.toLocaleString()}</span>
                </div>
                {selectedRecord.depositAmount > 0 && (
                  <div className="flex justify-between text-slate-800">
                    <span>Security Deposit Bond:</span>
                    <span>₱{selectedRecord.depositAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-pine-900 text-sm font-sans">
                  <span>Total Due:</span>
                  <span className="font-serif">₱{selectedRecord.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-slate-600 text-[11px] px-1">
                <span>Due Date: {selectedRecord.dueDate}</span>
                <span className={`font-bold ${
                  selectedRecord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-800'
                }`}>
                  Status: {selectedRecord.paymentStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-stone-200">
              {selectedRecord.paymentStatus !== 'Paid' ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedRecord.id, 'Paid');
                    setSelectedRecord({ ...selectedRecord, paymentStatus: 'Paid' });
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Mark as Paid
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment Verified</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE STATEMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateInvoice} className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-slate-900 font-serif">
                Generate Statement of Account
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 block font-semibold">Tenant or Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mark Santos"
                  value={invoiceForm.tenantOrGuest}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, tenantOrGuest: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Room or Bed Slot</label>
                <input
                  type="text"
                  value={invoiceForm.roomOrBed}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, roomOrBed: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Billing Period</label>
                <input
                  type="text"
                  value={invoiceForm.billingPeriod}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, billingPeriod: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Rent (₱)</label>
                <input
                  type="number"
                  value={invoiceForm.rentAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, rentAmount: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Water (₱)</label>
                <input
                  type="number"
                  value={invoiceForm.waterAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, waterAmount: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Electricity (₱)</label>
                <input
                  type="number"
                  value={invoiceForm.electricityAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, electricityAmount: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Security Deposit (₱)</label>
                <input
                  type="number"
                  value={invoiceForm.depositAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, depositAmount: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-semibold">Initial Status</label>
                <select
                  value={invoiceForm.paymentStatus}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentStatus: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
