// Admin view for inspecting, responding to, and resolving concierge inquiries
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Archive, 
  User, 
  Reply, 
  X,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminInquiry } from '../data/adminMockData';
import { ensureInquiryMessages } from '../../services/db/inquiryService';

interface InquiriesViewProps {
  initialFilter?: string;
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({
  initialFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Replied' | 'Resolved' | 'Archived'>(
    (initialFilter as any) || 'All'
  );

  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Kumuha ng inquiries mula sa Supabase
  const fetchInquiries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guest_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const formatted: AdminInquiry[] = data.map((i: any) => ({
        id: i.id,
        guestName: i.guest_name,
        email: i.guest_email || 'No email',
        phone: i.guest_phone || 'No phone',
        topic: i.topic,
        message: i.message,
        status: i.status as any,
        receivedAt: i.received_at || 'Recent',
        replyText: i.reply_text,
        resolvedAt: i.resolved_at
      }));
      setInquiries(formatted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();

    // Live real-time subscription on guest_inquiries table
    const channel = supabase
      .channel('admin-inquiries-live-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_inquiries' }, () => {
        fetchInquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter as any);
    }
  }, [initialFilter]);
  
  const [replyingInquiry, setReplyingInquiry] = useState<AdminInquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [markResolvedOnSend, setMarkResolvedOnSend] = useState(false);

  const handleReplyAction = async (id: string, replyText: string, markAsResolved = false) => {
    const newStatus = markAsResolved ? 'Resolved' : 'Replied';
    const nowTimestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const { error } = await supabase
      .from('guest_inquiries')
      .update({ 
        status: newStatus, 
        reply_text: replyText,
        resolved_at: markAsResolved ? nowTimestamp : null 
      })
      .eq('id', id);

    if (error) {
      await supabase
        .from('guest_inquiries')
        .update({ status: newStatus })
        .eq('id', id);
    }

    fetchInquiries();
  };

  const handleMarkRead = async (id: string) => {
    await supabase
      .from('guest_inquiries')
      .update({ status: 'Replied' })
      .eq('id', id);

    fetchInquiries();
  };

  const handleArchive = async (id: string) => {
    await supabase
      .from('guest_inquiries')
      .update({ status: 'Archived' })
      .eq('id', id);

    fetchInquiries();
  };

  const handleResolve = async (id: string) => {
    const nowTimestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const { error } = await supabase
      .from('guest_inquiries')
      .update({ status: 'Resolved', resolved_at: nowTimestamp })
      .eq('id', id);

    if (error) {
      await supabase
        .from('guest_inquiries')
        .update({ status: 'Resolved' })
        .eq('id', id);
    }

    fetchInquiries();
  };

  const handleReopen = async (id: string) => {
    const { error } = await supabase
      .from('guest_inquiries')
      .update({ status: 'Replied', resolved_at: null })
      .eq('id', id);

    if (error) {
      await supabase
        .from('guest_inquiries')
        .update({ status: 'Replied' })
        .eq('id', id);
    }

    fetchInquiries();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this guest inquiry?')) {
      await supabase
        .from('guest_inquiries')
        .delete()
        .eq('id', id);

      fetchInquiries();
    }
  };

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
    setMarkResolvedOnSend(inq.status === 'Resolved');
    setReplyMessage(
      `Hello ${inq.guestName.split(' ')[0]},\n\nThank you for reaching out to Dragon Treasure Transient & Condotel. Regarding your inquiry on "${inq.topic}":\n\n`
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyingInquiry && replyMessage.trim()) {
      handleReplyAction(replyingInquiry.id, replyMessage.trim(), markResolvedOnSend);
      setReplyingInquiry(null);
      setReplyMessage('');
      setMarkResolvedOnSend(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-pine-950 flex items-center gap-2">
            <span>Website & Concierge Inquiries</span>
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
              {inquiries.length} Messages
            </span>
          </h2>
          <p className="text-xs text-slate-800 font-medium">
            Incoming inquiries from prospective and registered guests. Reply back or mark as resolved once questions are settled.
          </p>
        </div>

        <div className="text-xs bg-[#fffdfa] border-2 border-gold-300 shadow-card px-4 py-2 rounded-2xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-slate-950 font-bold">
            {inquiries.filter(i => i.status === 'New').length} New Unanswered Inquiries
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-gold-300 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by guest, topic, inquiry message text, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-stone-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['All', 'New', 'Replied', 'Resolved', 'Archived'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-pine-900 text-gold-200 shadow-sm'
                    : 'text-slate-700 hover:text-pine-950 hover:bg-stone-200'
                }`}
              >
                {tab}
                {tab === 'New' && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                    {inquiries.filter(i => i.status === 'New').length}
                  </span>
                )}
                {tab === 'Resolved' && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-bold">
                    {inquiries.filter(i => i.status === 'Resolved').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500 font-semibold text-xs flex justify-center items-center gap-2">
            <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            Loading guest inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-[#fffdfa] border-2 border-gold-300 rounded-2xl p-12 text-center text-slate-800 font-bold text-xs shadow-card">
            No inquiries match the current filter.
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const threadMessages = ensureInquiryMessages(inq);

            return (
              <div
                key={inq.id}
                className={`p-5 rounded-2xl border-2 transition-all space-y-4 shadow-card ${
                  inq.status === 'New'
                    ? 'bg-[#fffdfa] border-amber-400 shadow-md ring-1 ring-amber-300'
                    : inq.status === 'Resolved'
                    ? 'bg-[#fbfdfa] border-emerald-400'
                    : 'bg-[#fffdfa] border-gold-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-stone-200 gap-2.5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 text-pine-950 flex items-center justify-center border border-gold-300 shadow-xs flex-shrink-0 mt-0.5 sm:mt-0">
                      <User className="w-5 h-5 text-pine-900" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-pine-950">{inq.guestName}</span>
                        <span className="text-slate-500 font-bold">•</span>
                        <span className="text-xs text-amber-950 font-bold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                          {inq.topic}
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 font-medium flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="font-bold text-slate-950 break-all">{inq.email}</span>
                        <span className="text-slate-500 font-bold hidden sm:inline">•</span>
                        <span className="text-slate-900 font-semibold">{inq.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs pt-1 sm:pt-0">
                    <span className="text-slate-800 font-bold text-xs">{inq.receivedAt}</span>
                    {inq.status === 'New' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400 shadow-2xs">
                        New
                      </span>
                    ) : inq.status === 'Replied' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 shadow-2xs">
                        Replied
                      </span>
                    ) : inq.status === 'Resolved' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-slate-900 border border-stone-300">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 bg-stone-100/70 p-4 rounded-2xl border border-stone-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    Message History ({threadMessages.length} {threadMessages.length === 1 ? 'Message' : 'Messages'})
                  </span>

                  <div className="space-y-2.5">
                    {threadMessages.map((msg, idx) => {
                      const isGuest = msg.sender === 'guest';
                      return (
                        <div
                          key={msg.id || idx}
                          className={`p-3.5 rounded-xl text-xs space-y-1.5 shadow-2xs ${
                            isGuest
                              ? 'bg-white border-2 border-stone-300 text-slate-950'
                              : 'bg-pine-950 border-2 border-pine-900 text-white ml-3 sm:ml-8'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs pb-1 border-b border-black/10">
                            <div className="flex items-center gap-1.5 font-bold">
                              {isGuest ? (
                                <span className="text-pine-950 flex items-center gap-1.5 font-bold">
                                  <User className="w-3.5 h-3.5 text-pine-900" />
                                  <span>{msg.senderName} (Guest)</span>
                                </span>
                              ) : (
                                <span className="text-gold-300 flex items-center gap-1.5 font-bold">
                                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                                  <span>{msg.senderName} (Staff Concierge)</span>
                                </span>
                              )}
                            </div>
                            <span className={`text-[11px] font-semibold ${isGuest ? 'text-slate-700' : 'text-gold-200/90'}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className={`whitespace-pre-line leading-relaxed font-sans text-xs ${isGuest ? 'text-slate-900 font-medium' : 'text-stone-100 font-normal'}`}>
                            {msg.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {inq.status === 'Resolved' && (
                  <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs text-emerald-950 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span className="font-medium">
                        Marked as <strong>Resolved</strong> {inq.resolvedAt ? `on ${inq.resolvedAt}` : ''}. Guest cannot reply to this thread anymore.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReopen(inq.id)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-emerald-400 text-emerald-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Reopen</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between pt-1 text-xs gap-2">
                  <div className="text-xs text-slate-800 font-medium">
                    Topic: <strong className="text-pine-950 font-bold">{inq.topic}</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReply(inq)}
                      className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{inq.replyText || threadMessages.length > 1 ? 'Send Reply' : 'Reply'}</span>
                    </button>

                    {inq.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => handleResolve(inq.id)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        title="Mark inquiry as resolved. The guest will no longer be able to reply."
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Resolved</span>
                      </button>
                    )}

                    {inq.status === 'New' && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(inq.id)}
                        className="px-3 py-2 bg-white hover:bg-stone-100 text-slate-900 border-2 border-stone-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}

                    {inq.status !== 'Archived' && (
                      <button
                        type="button"
                        onClick={() => handleArchive(inq.id)}
                        className="p-2 bg-white hover:bg-stone-100 text-slate-700 hover:text-slate-950 border-2 border-stone-300 rounded-xl transition-colors cursor-pointer"
                        title="Archive Inquiry"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id)}
                      className="p-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border-2 border-stone-300 hover:border-rose-300 rounded-xl transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {replyingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/70 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleSendReply} className="bg-[#fffdfa] border-2 border-gold-300 rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-pine-950">
                  Reply to {replyingInquiry.guestName}
                </h3>
                <p className="text-xs text-slate-800 font-medium">
                  Direct message and email response to <strong className="text-pine-950">{replyingInquiry.email}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingInquiry(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-100 p-3.5 rounded-xl border-2 border-stone-300 text-slate-950 font-medium max-h-32 overflow-y-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Guest Question:</span>
                "{replyingInquiry.message}"
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-pine-950 block">
                  Staff Response Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-white border-2 border-stone-300 rounded-xl p-3 text-xs text-slate-950 font-medium focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 shadow-inner"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={markResolvedOnSend}
                  onChange={(e) => setMarkResolvedOnSend(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 rounded border-stone-400 focus:ring-emerald-500"
                />
                <span className="text-xs text-emerald-950 font-bold">
                  Mark as Resolved after sending (closes thread so guest cannot reply further)
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gold-200">
              <button
                type="button"
                onClick={() => setReplyingInquiry(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
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