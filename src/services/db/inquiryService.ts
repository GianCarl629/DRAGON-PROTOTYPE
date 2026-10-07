// Service for handling customer concierge inquiries
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminInquiry, AdminDataManager } from '../../admin/data/adminMockData';
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

  const newInquiry: AdminInquiry = {
    id: `inq-${Date.now()}`,
    guestName: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    topic: input.topic,
    message: composedMessage.trim(),
    receivedAt: timestampStr,
    status: 'New'
  };

  // 1. Sync with Supabase if configured
  if (isSupabaseConfigured()) {
    try {
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
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (!error && data) {
        newInquiry.id = data.id;
      }
    } catch (err) {
      console.warn('Notice: Storing inquiry in local admin store:', err);
    }
  }

  // 2. Persist in Admin Data Store
  try {
    const store = AdminDataManager.loadStore();
    const updatedInquiries = [newInquiry, ...(store.inquiries || [])];
    AdminDataManager.saveStore({
      ...store,
      inquiries: updatedInquiries
    });
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
