import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Archive, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Reply, 
  X,
  Sparkles
} from 'lucide-react';
import { AdminInquiry } from '../data/adminMockData';

interface InquiriesViewProps {
  inquiries: AdminInquiry[];
  onReply: (id: string, replyText: string) => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({
  inquiries,
  onReply,
  onMarkRead,
  onArchive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Replied' | 'Archived'>('All');
  
  const [replyingInquiry, setReplyingInquiry] = useState<AdminInquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReply = (inq: AdminInquiry) => {
    setReplyingInquiry(inq);
    setReplyMessage(
      `Hello ${inq.guestName.split(' ')[0]},\n\nThank you for reaching out to Dragon Treasure Transient & Condotel. Regarding your inquiry on "${inq.topic}":\n\n`
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyingInquiry && replyMessage.trim()) {
      onReply(replyingInquiry.id, replyMessage.trim());
      setReplyingInquiry(null);
      setReplyMessage('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Website & Concierge Inquiries</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
              {inquiries.length} Messages
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Incoming inquiries from prospective guests regarding room availability, dormitory vacancies, and group seminars.
          </p>
        </div>

        {/* Quick Unread Badge */}
        <div className="text-xs bg-[#fffdfa] border border-gold-200/90 shadow-card px-4 py-2 rounded-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-slate-700 font-semibold">
            {inquiries.filter(i => i.status === 'New').length} New Unanswered Inquiries
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#fffdfa] border border-gold-200/90 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by guest, topic, inquiry message text, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'New', 'Replied', 'Archived'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-pine-900 text-gold-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                {tab}
                {tab === 'New' && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {inquiries.filter(i => i.status === 'New').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries Cards Grid (As specified in Section 15) */}
      <div className="space-y-3.5">
        {filteredInquiries.length === 0 ? (
          <div className="bg-[#fffdfa] border border-gold-200/90 rounded-2xl p-12 text-center text-slate-500 text-xs shadow-card">
            No inquiries match the current filter.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 shadow-card ${
                inq.status === 'New'
                  ? 'bg-[#fffdfa] border-amber-300 shadow-md ring-1 ring-amber-200'
                  : 'bg-[#fffdfa] border-gold-200/90'
              }`}
            >
              {/* Top Row: Sender, Topic, Time & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-50 text-pine-800 flex items-center justify-center border border-gold-200 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-pine-950">{inq.guestName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-gold-700 font-semibold">{inq.topic}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{inq.email}</span>
                      <span>•</span>
                      <span>{inq.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">{inq.receivedAt}</span>
                  {inq.status === 'New' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                      New
                    </span>
                  ) : inq.status === 'Replied' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                      Replied
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Archived
                    </span>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80 text-xs text-slate-700 leading-relaxed font-sans">
                "{inq.message}"
              </div>

              {/* Existing Staff Reply (if already replied) */}
              {inq.replyText && (
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Staff Reply Sent:
                  </span>
                  <p className="whitespace-pre-line text-[11px] font-mono text-emerald-900">
                    {inq.replyText}
                  </p>
                </div>
              )}

              {/* Action Buttons: Reply, Mark Read, Archive */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="text-[11px] text-slate-500">
                  Topic: <strong className="text-pine-900">{inq.topic}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReply(inq)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{inq.replyText ? 'Send Another Reply' : 'Reply'}</span>
                  </button>

                  {inq.status === 'New' && (
                    <button
                      type="button"
                      onClick={() => onMarkRead(inq.id)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  )}

                  {inq.status !== 'Archived' && (
                    <button
                      type="button"
                      onClick={() => onArchive(inq.id)}
                      className="p-1.5 bg-white hover:bg-stone-100 text-slate-500 hover:text-slate-800 border border-stone-200 rounded-xl transition-colors cursor-pointer"
                      title="Archive Inquiry"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* REPLY MODAL */}
      {replyingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSendReply} className="bg-[#fffdfa] border-2 border-gold-300/80 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200/80">
              <div>
                <h3 className="font-serif font-bold text-base text-pine-950">
                  Reply to {replyingInquiry.guestName}
                </h3>
                <p className="text-[11px] text-slate-600">
                  Sending email response to <strong className="text-pine-900">{replyingInquiry.email}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingInquiry(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-slate-700 italic">
                "{replyingInquiry.message}"
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">
                  Staff Email Response Message
                </label>
                <textarea
                  rows={6}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-gold-500 shadow-inner"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gold-200/80">
              <button
                type="button"
                onClick={() => setReplyingInquiry(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Response</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

