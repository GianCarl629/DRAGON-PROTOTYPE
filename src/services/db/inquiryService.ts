// Service for handling customer concierge inquiries, message threads, and resolution
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminInquiry, InquiryMessage, AdminDataManager } from '../../admin/data/adminMockData';
import { getPhilippineNow } from '../../utils/philippineTime';

export interface CustomerInquiryInput {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  roomOfInterest?: string;
  targetDate?: string;
}

export interface InquirySubmissionResult {
  success: boolean;
  inquiry?: AdminInquiry;
  referenceCode: string;
  message: string;
}

// Helper to normalize message history on inquiries
export const ensureInquiryMessages = (inq: AdminInquiry): InquiryMessage[] => {
  if (inq.messages && inq.messages.length > 0) {
    return inq.messages;
  }

  const list: InquiryMessage[] = [
    {
      id: `msg-${inq.id}-orig`,
      sender: 'guest',
      senderName: inq.guestName || 'Guest',
      message: inq.message,
      timestamp: inq.receivedAt || 'Submitted'
    }
  ];

  if (inq.replyText) {
    list.push({
      id: `msg-${inq.id}-reply`,
      sender: 'staff',
      senderName: 'Front Desk Concierge',
      message: inq.replyText,
      timestamp: 'Staff Response'
    });
  }

  return list;
};

// Dispatch change event to notify all components
const notifyInquiryChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dragon_treasure_inquiry_updated'));
  }
};

// Submit a new customer inquiry
export const submitCustomerInquiry = async (
  input: CustomerInquiryInput
): Promise<InquirySubmissionResult> => {
  const pht = getPhilippineNow();
  const timestampStr = `Today at ${pht.shortTimeStr}`;
  const referenceCode = `INQ-${pht.year}-${Math.floor(1000 + Math.random() * 9000)}`;

  const composedMessage = input.roomOfInterest || input.targetDate
    ? `${input.message}\n\n[Details: ${input.roomOfInterest ? `Room: ${input.roomOfInterest}; ` : ''}${input.targetDate ? `Target Date: ${input.targetDate}` : ''}]`
    : input.message;

  const initialMsg: InquiryMessage = {
    id: `msg-${Date.now()}-1`,
    sender: 'guest',
    senderName: input.name.trim(),
    message: composedMessage.trim(),
    timestamp: timestampStr,
    createdAtIso: new Date().toISOString()
  };

  const newInquiry: AdminInquiry = {
    id: `inq-${Date.now()}`,
    guestName: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    topic: input.topic,
    message: composedMessage.trim(),
    receivedAt: timestampStr,
    status: 'New',
    messages: [initialMsg],
    isReadByCustomer: true
  };

  // Sync with Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      // First try guest_inquiries (live Supabase table)
      const { data: guestData, error: guestErr } = await supabase
        .from('guest_inquiries')
        .insert([
          {
            guest_name: newInquiry.guestName,
            guest_email: newInquiry.email,
            guest_phone: newInquiry.phone,
            topic: newInquiry.topic,
            message: newInquiry.message,
            status: 'New',
            received_at: timestampStr
          }
        ])
        .select()
        .single();

      if (!guestErr && guestData) {
        newInquiry.id = guestData.id;
      } else {
        // Fallback to inquiries table
        const { data, error } = await supabase
          .from('inquiries')
          .insert([
            {
              reference_code: referenceCode,
              guest_name: newInquiry.guestName,
              email: newInquiry.email,
              phone: newInquiry.phone,
              topic: newInquiry.topic,
              message: newInquiry.message,
              status: 'New',
              messages: newInquiry.messages,
              is_read_by_customer: true,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (!error && data) {
          newInquiry.id = data.id;
        }
      }
    } catch (err) {
      console.warn('Notice: Storing inquiry in local admin store:', err);
    }
  }

  // Persist in Admin Data Store
  try {
    const store = AdminDataManager.loadStore();
    const updatedInquiries = [newInquiry, ...(store.inquiries || [])];
    AdminDataManager.saveStore({
      ...store,
      inquiries: updatedInquiries
    });
    notifyInquiryChange();
  } catch (err) {
    console.error('Error saving inquiry locally:', err);
  }

  return {
    success: true,
    inquiry: newInquiry,
    referenceCode,
    message: 'Your inquiry has been received! Our front desk team will contact you shortly.'
  };
};

// Fetch inquiries for a specific registered user
export const getCustomerInquiries = (userEmail: string): AdminInquiry[] => {
  if (!userEmail) return [];
  const normalizedEmail = userEmail.trim().toLowerCase();
  const store = AdminDataManager.loadStore();
  const list = store.inquiries || [];

  return list
    .filter((inq) => inq.email.trim().toLowerCase() === normalizedEmail)
    .map((inq) => ({
      ...inq,
      messages: ensureInquiryMessages(inq)
    }));
};

// Customer replies back to an ongoing inquiry
export const sendCustomerReply = async (
  inquiryId: string,
  replyText: string,
  customerName: string
): Promise<{ success: boolean; message: string; inquiry?: AdminInquiry }> => {
  if (!replyText.trim()) {
    return { success: false, message: 'Reply message cannot be empty.' };
  }

  const store = AdminDataManager.loadStore();
  const existingIndex = store.inquiries.findIndex((i) => i.id === inquiryId);
  if (existingIndex === -1) {
    return { success: false, message: 'Inquiry thread not found.' };
  }

  const target = store.inquiries[existingIndex];

  // If already resolved, user is strictly not allowed to reply
  if (target.status === 'Resolved') {
    return {
      success: false,
      message: 'This inquiry has been marked as resolved by front-desk staff. You cannot reply to this thread.'
    };
  }

  const pht = getPhilippineNow();
  const timeStr = `Today at ${pht.shortTimeStr}`;

  const currentMessages = ensureInquiryMessages(target);
  const newMsg: InquiryMessage = {
    id: `msg-${Date.now()}`,
    sender: 'guest',
    senderName: customerName || target.guestName || 'Guest',
    message: replyText.trim(),
    timestamp: timeStr,
    createdAtIso: new Date().toISOString()
  };

  const updatedInquiry: AdminInquiry = {
    ...target,
    status: 'New', // Marks as New so staff gets notified of incoming customer reply
    messages: [...currentMessages, newMsg],
    isReadByCustomer: true
  };

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { error: guestErr } = await supabase
        .from('guest_inquiries')
        .update({
          status: 'New'
        })
        .eq('id', inquiryId);

      if (guestErr) {
        await supabase
          .from('inquiries')
          .update({
            status: 'New',
            messages: updatedInquiry.messages,
            is_read_by_customer: true
          })
          .eq('id', inquiryId);
      }
    } catch (err) {
      console.warn('Notice: Updating customer reply in Supabase failed, cached locally:', err);
    }
  }

  const updatedList = [...store.inquiries];
  updatedList[existingIndex] = updatedInquiry;
  AdminDataManager.saveStore({
    ...store,
    inquiries: updatedList
  });
  notifyInquiryChange();

  return {
    success: true,
    message: 'Reply sent to front desk staff.',
    inquiry: updatedInquiry
  };
};

// Admin/staff sends a reply to an inquiry
export const sendStaffReply = async (
  inquiryId: string,
  replyText: string,
  staffName: string = 'Front Desk Concierge',
  markAsResolved: boolean = false
): Promise<{ success: boolean; inquiry?: AdminInquiry }> => {
  if (!replyText.trim()) return { success: false };

  const store = AdminDataManager.loadStore();
  const idx = store.inquiries.findIndex((i) => i.id === inquiryId);
  if (idx === -1) return { success: false };

  const target = store.inquiries[idx];
  const pht = getPhilippineNow();
  const timeStr = `Today at ${pht.shortTimeStr}`;

  const currentMessages = ensureInquiryMessages(target);
  const newMsg: InquiryMessage = {
    id: `msg-${Date.now()}`,
    sender: 'staff',
    senderName: staffName,
    message: replyText.trim(),
    timestamp: timeStr,
    createdAtIso: new Date().toISOString()
  };

  const updatedInquiry: AdminInquiry = {
    ...target,
    status: markAsResolved ? 'Resolved' : 'Replied',
    replyText: replyText.trim(),
    messages: [...currentMessages, newMsg],
    isReadByCustomer: false, // Customer has unread reply
    ...(markAsResolved
      ? {
          resolvedAt: timeStr,
          resolvedBy: staffName
        }
      : {})
  };

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { error: guestErr } = await supabase
        .from('guest_inquiries')
        .update({
          status: markAsResolved ? 'Resolved' : 'Replied'
        })
        .eq('id', inquiryId);

      if (guestErr) {
        await supabase
          .from('inquiries')
          .update({
            status: markAsResolved ? 'Resolved' : 'Replied',
            reply_text: replyText.trim(),
            messages: updatedInquiry.messages,
            is_read_by_customer: false,
            ...(markAsResolved
              ? {
                  resolved_at: new Date().toISOString(),
                  resolved_by: staffName
                }
              : {})
          })
          .eq('id', inquiryId);
      }
    } catch (err) {
      console.warn('Notice: Updating staff reply in Supabase failed, cached locally:', err);
    }
  }

  const updatedList = [...store.inquiries];
  updatedList[idx] = updatedInquiry;
  AdminDataManager.saveStore({
    ...store,
    inquiries: updatedList
  });
  notifyInquiryChange();

  return { success: true, inquiry: updatedInquiry };
};

// Admin marks an inquiry as resolved
export const resolveInquiry = async (
  inquiryId: string,
  staffName: string = 'Front Desk Staff',
  resolutionNote?: string
): Promise<{ success: boolean; inquiry?: AdminInquiry }> => {
  const store = AdminDataManager.loadStore();
  const idx = store.inquiries.findIndex((i) => i.id === inquiryId);
  if (idx === -1) return { success: false };

  const target = store.inquiries[idx];
  const pht = getPhilippineNow();
  const timeStr = `Today at ${pht.shortTimeStr}`;

  const currentMessages = ensureInquiryMessages(target);
  const updatedMessages = [...currentMessages];

  if (resolutionNote && resolutionNote.trim()) {
    updatedMessages.push({
      id: `msg-${Date.now()}`,
      sender: 'staff',
      senderName: staffName,
      message: `[Resolved]: ${resolutionNote.trim()}`,
      timestamp: timeStr,
      createdAtIso: new Date().toISOString()
    });
  }

  const updatedInquiry: AdminInquiry = {
    ...target,
    status: 'Resolved',
    resolvedAt: timeStr,
    resolvedBy: staffName,
    messages: updatedMessages,
    isReadByCustomer: false // Notify customer that it was marked resolved
  };

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('inquiries')
        .update({
          status: 'Resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: staffName,
          messages: updatedMessages,
          is_read_by_customer: false
        })
        .eq('id', inquiryId);
    } catch (err) {
      console.warn('Notice: Updating inquiry resolution in Supabase failed:', err);
    }
  }

  const updatedList = [...store.inquiries];
  updatedList[idx] = updatedInquiry;
  AdminDataManager.saveStore({
    ...store,
    inquiries: updatedList
  });
  notifyInquiryChange();

  return { success: true, inquiry: updatedInquiry };
};

// Admin reopens an inquiry
export const reopenInquiry = async (
  inquiryId: string
): Promise<{ success: boolean; inquiry?: AdminInquiry }> => {
  const store = AdminDataManager.loadStore();
  const idx = store.inquiries.findIndex((i) => i.id === inquiryId);
  if (idx === -1) return { success: false };

  const target = store.inquiries[idx];
  const updatedInquiry: AdminInquiry = {
    ...target,
    status: 'Replied'
  };

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('inquiries')
        .update({
          status: 'Replied'
        })
        .eq('id', inquiryId);
    } catch (err) {
      console.warn('Notice: Updating inquiry reopen in Supabase failed:', err);
    }
  }

  const updatedList = [...store.inquiries];
  updatedList[idx] = updatedInquiry;
  AdminDataManager.saveStore({
    ...store,
    inquiries: updatedList
  });
  notifyInquiryChange();

  return { success: true, inquiry: updatedInquiry };
};

// Mark an inquiry as read by the customer
export const markInquiryReadByCustomer = (inquiryId: string): void => {
  const store = AdminDataManager.loadStore();
  const idx = store.inquiries.findIndex((i) => i.id === inquiryId);
  if (idx === -1) return;

  if (store.inquiries[idx].isReadByCustomer === false) {
    store.inquiries[idx].isReadByCustomer = true;
    AdminDataManager.saveStore(store);
    notifyInquiryChange();

    if (isSupabaseConfigured()) {
      try {
        supabase
          .from('inquiries')
          .update({ is_read_by_customer: true })
          .eq('id', inquiryId)
          .then(() => {});
      } catch {
        // silent
      }
    }
  }
};

// Count unread replies or updates for customer
export const getUnreadRepliesCountForCustomer = (userEmail: string): number => {
  if (!userEmail) return 0;
  const list = getCustomerInquiries(userEmail);
  return list.filter((i) => (i.status === 'Replied' || i.status === 'Resolved') && i.isReadByCustomer === false).length;
};

// Synchronize all inquiries from Supabase cloud into memory/local cache
export const syncInquiriesWithSupabase = async (): Promise<AdminInquiry[]> => {
  if (!isSupabaseConfigured()) {
    return AdminDataManager.loadStore().inquiries || [];
  }

  try {
    // 1. Try fetching from guest_inquiries first (live Supabase table)
    const { data: guestData, error: guestErr } = await supabase
      .from('guest_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!guestErr && guestData) {
      const remoteInquiries: AdminInquiry[] = guestData.map((row: any) => ({
        id: row.id,
        guestName: row.guest_name,
        email: row.guest_email || row.email || '',
        phone: row.guest_phone || row.phone || '',
        topic: row.topic,
        message: row.message,
        status: (row.status as any) || 'New',
        replyText: row.reply_text || undefined,
        messages: [
          {
            id: `msg-${row.id}-orig`,
            sender: 'guest' as const,
            senderName: row.guest_name,
            message: row.message,
            timestamp: row.received_at || (row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Submitted')
          }
        ],
        receivedAt: row.received_at || (row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent'),
        resolvedAt: row.resolved_at ? new Date(row.resolved_at).toLocaleDateString() : undefined,
        resolvedBy: row.resolved_by || undefined,
        isReadByCustomer: true
      }));

      // Remote Supabase database is source of truth (deleted rows are removed)
      AdminDataManager.saveStore({
        ...AdminDataManager.loadStore(),
        inquiries: remoteInquiries
      });
      notifyInquiryChange();
      return remoteInquiries;
    }

    // 2. Fallback to inquiries table
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return AdminDataManager.loadStore().inquiries || [];
    }

    const remoteInquiries: AdminInquiry[] = data.map((row: any) => ({
      id: row.id,
      guestName: row.guest_name,
      email: row.email,
      phone: row.phone || '',
      topic: row.topic,
      message: row.message,
      status: (row.status as any) || 'New',
      replyText: row.reply_text || undefined,
      messages: row.messages && row.messages.length > 0 ? row.messages : [
        {
          id: `msg-${row.id}-orig`,
          sender: 'guest' as const,
          senderName: row.guest_name,
          message: row.message,
          timestamp: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Submitted'
        }
      ],
      receivedAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent',
      resolvedAt: row.resolved_at ? new Date(row.resolved_at).toLocaleDateString() : undefined,
      resolvedBy: row.resolved_by || undefined,
      isReadByCustomer: row.is_read_by_customer ?? true
    }));

    AdminDataManager.saveStore({
      ...AdminDataManager.loadStore(),
      inquiries: remoteInquiries
    });
    notifyInquiryChange();
    return remoteInquiries;
  } catch (err) {
    console.warn('Error during Supabase inquiry sync:', err);
    return AdminDataManager.loadStore().inquiries || [];
  }
};

// Real-time subscription helper for live inquiry messages and updates
export const subscribeToInquiryChanges = (
  onUpdate: (payload: any) => void
): (() => void) => {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const channel = supabase
    .channel('live-inquiries-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'guest_inquiries' },
      async (payload) => {
        await syncInquiriesWithSupabase();
        onUpdate(payload);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'inquiries' },
      async (payload) => {
        await syncInquiriesWithSupabase();
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

