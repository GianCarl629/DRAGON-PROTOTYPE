# Supabase Database Integration Guide

This guide is for the team member responsible for setting up and managing the Supabase database for **Dragon Treasure Transient & Condotel**.

The website is **100% prepared and pre-wired** to connect to Supabase. As soon as you configure your project credentials, the website will automatically connect.

---

## 1. Quick Setup (How to Connect the Website)

1. Open your project in [Supabase](https://supabase.com) and go to **Project Settings** → **API**.
2. Copy your **Project URL** and **anon public API Key**.
3. In this website project, open or create `.env` in the root folder and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

4. Restart the Vite development server:
```bash
npm run dev
```

*Note: The website features an automatic fallback (`isSupabaseConfigured()`) in `src/lib/supabase.ts` — if the database is not yet connected or offline, the website continues to work smoothly using local storage.*

---

## 2. Expected Database Tables & Columns

The website frontend services are pre-built to interact with the following tables created in your database.

### Table 1: `reservations` (Objective 1: Live Calendar & Availability)
Used by `src/services/db/reservationService.ts` and `src/components/Booking/BookingModal.tsx`.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary Key (default `uuid_generate_v4()`) |
| `reservation_code` | `TEXT` | Unique code (e.g., `DT-2026-1042`) |
| `room_id` | `TEXT` | References room identifier |
| `guest_name` | `TEXT` | Guest full name |
| `guest_email` | `TEXT` | Guest email address |
| `guest_phone` | `TEXT` | Guest contact number |
| `stay_type` | `TEXT` | `'transient'` or `'dormitory'` |
| `check_in_date` | `DATE` | Check-in date (`YYYY-MM-DD`) |
| `check_out_date` | `DATE` | Check-out date (`YYYY-MM-DD`) |
| `number_of_guests`| `INTEGER` | Guest count |
| `rate_applied` | `NUMERIC` | Applied nightly/monthly rate |
| `total_price` | `NUMERIC` | Total computed booking price |
| `special_requests`| `TEXT` | Optional guest notes |
| `status` | `TEXT` | `'Pending Review'`, `'Confirmed'`, `'Checked In'`, `'Completed'`, `'Cancelled'` |
| `cancellation_reason` | `TEXT` | Optional reason if cancelled |
| `created_at` | `TIMESTAMPTZ` | Timestamp of reservation |

> **Double-Booking Protection:** You can configure a PostgreSQL trigger or constraint to automatically prevent overlapping reservation dates for the same room.

---

### Table 2: `invoices` (Objective 2: Automated Billing & Utilities)
Used by `src/services/db/billingService.ts` and `src/components/Auth/MyReservationsModal.tsx` (Client Dashboard).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary Key |
| `invoice_number` | `TEXT` | Unique invoice code (e.g., `INV-2026-1042`) |
| `tenant_or_guest_name` | `TEXT` | Tenant or guest name |
| `room_or_bed` | `TEXT` | Room or Bed space description |
| `stay_type` | `TEXT` | `'Monthly Dorm Rent'`, `'Transient Stay'`, `'Utility Settlement'`, etc. |
| `billing_period` | `TEXT` | e.g. `'October 2026'` |
| `rentAmount` / `rent_amount` | `NUMERIC` | Base rental fee |
| `waterAmount` / `water_amount` | `NUMERIC` | Computed water utility (₱45/m³) |
| `electricityAmount` / `electricity_amount` | `NUMERIC` | Computed electric utility (₱14.50/kWh) |
| `depositAmount` / `deposit_amount` | `NUMERIC` | Security deposit (if applicable) |
| `totalAmount` / `total_amount` | `NUMERIC` | Sum of rent + water + electric + deposit |
| `dueDate` / `due_date` | `DATE` | Payment due date |
| `paymentStatus` / `payment_status` | `TEXT` | `'Paid'`, `'Pending'`, or `'Overdue'` |
| `payment_method` | `TEXT` | e.g., `'GCash'`, `'Maya'`, `'Bank Transfer'` |
| `paid_at` | `TIMESTAMPTZ` | Timestamp when paid |

---

### Table 3: `payments` (Objective 4: Client Online Payment Uploads)
Used when clients upload online payment proofs in the Client Dashboard.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary Key |
| `invoice_id` | `UUID` or `TEXT` | Target invoice identifier |
| `amount` | `NUMERIC` | Amount paid |
| `payment_method` | `TEXT` | `'GCash'`, `'Maya'`, `'Bank Transfer'`, `'Cash'` |
| `reference_number` | `TEXT` | Transaction reference code |
| `sender_account_name` | `TEXT` | Account name of sender |
| `receipt_url` | `TEXT` | Storage URL or Base64 of receipt image |
| `verification_status`| `TEXT` | `'Pending Review'`, `'Verified'`, `'Rejected'` |
| `created_at` | `TIMESTAMPTZ` | Submission timestamp |

---

### Table 4: `profiles` (User Management)
Used by `src/services/authService.ts` for registered customer profiles.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | References `auth.users(id)` |
| `full_name` | `TEXT` | Customer full name |
| `email` | `TEXT` | Email address |
| `phone` | `TEXT` | Contact phone |
| `role` | `TEXT` | `'guest'`, `'tenant'`, `'staff'`, `'admin'` |
| `tier` | `TEXT` | Default `'Guest Member'` |

### Table 5: `rooms` (Live Room Inventory & Rates)
Used by `src/services/db/roomService.ts` and `src/components/Rooms/RoomSection.tsx`.

| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary Key (e.g. `'room-a-twin'`) |
| `name` | `TEXT` | Display name (e.g. `'Premium Twin Room'`) |
| `code` | `TEXT` | Unit code |
| `category` | `TEXT` | `'transient'` or `'dormitory'` |
| `capacity` | `INTEGER` | Max occupants count |
| `capacity_label` | `TEXT` | e.g. `'4 Pax'` |
| `rate` | `NUMERIC` | e.g. `2000.00` |
| `rate_period` | `TEXT` | `'night'` or `'month/person'` |
| `total_units` | `INTEGER` | Quantity of units available |
| `description` | `TEXT` | Room description |
| `image_url` | `TEXT` | Path or image URL |
| `features` | `JSONB` | Array of feature strings |
| `shared_amenities`| `JSONB` | Array of shared amenity strings |

---

### Table 6: `inquiries` (Concierge Inquiries, Message History & Resolution)
Used by `src/services/db/inquiryService.ts`, `src/components/Inquiry/InquiryModal.tsx`, `src/components/Inquiry/InquirySection.tsx`, `src/components/Auth/MyReservationsModal.tsx`, and `src/admin/views/InquiriesView.tsx`.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` or `TEXT` | Primary Key |
| `reference_code` | `TEXT` | Unique inquiry code (e.g., `INQ-2026-4821`) |
| `guest_name` | `TEXT` | Guest full name |
| `email` | `TEXT` | Contact email (matches customer account for logged-in history) |
| `phone` | `TEXT` | Contact mobile number |
| `topic` | `TEXT` | Inquiry topic category |
| `message` | `TEXT` | Initial inquiry message text |
| `status` | `TEXT` | `'New'`, `'Replied'`, `'Resolved'`, `'Archived'` |
| `reply_text` | `TEXT` | Latest staff reply text |
| `messages` | `JSONB` | Thread history array: `[{ id, sender: 'guest'|'staff', senderName, message, timestamp, createdAtIso }]` |
| `resolved_at` | `TIMESTAMPTZ` | Timestamp when marked as resolved |
| `resolved_by` | `TEXT` | Staff member who resolved the inquiry |
| `is_read_by_customer`| `BOOLEAN` | `true` if read, `false` for unread replies notification badge |
| `created_at` | `TIMESTAMPTZ` | Submission timestamp |

> **Thread Resolution Behavior:** When `status` is set to `'Resolved'`, customer reply input is strictly locked/disabled on the client side.

---

## 3. Realtime Updates (Optional but Recommended)

To enable live calendar and message updates without page refreshing:
1. Go to **Database** → **Replication** in Supabase.
2. Enable replication for the `reservations`, `invoices`, and `inquiries` tables.
3. The website will automatically receive live updates for reservations, staff replies, and resolution changes.

---

## 4. Frontend Code Reference

If you need to adjust any queries to match your preferred table or column names:
- Client Initialization: `src/lib/supabase.ts`
- Reservations & Calendar: `src/services/db/reservationService.ts`
- Billing & Payments: `src/services/db/billingService.ts`
- Concierge Inquiries & Messages: `src/services/db/inquiryService.ts`
- Authentication & Profiles: `src/services/authService.ts`

---

## 5. SQL Table Creation Script (Copy & Paste in Supabase SQL Editor)

You can run this query in your Supabase SQL editor to create the `inquiries` table:

```sql
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  reply_text TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  is_read_by_customer BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated insert & select for guest concierge
CREATE POLICY "Allow public insert to inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select inquiries" ON public.inquiries
  FOR SELECT USING (true);

CREATE POLICY "Allow update inquiries" ON public.inquiries
  FOR UPDATE USING (true);
```
