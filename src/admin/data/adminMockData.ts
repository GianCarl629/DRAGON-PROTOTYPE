// State Management & System Baseline Records for Dragon Treasure Administration Portal
import { SAMPLE_ROOMS, PROPERTY_INFO } from '../../data/mockData';

export interface AdminReservation {
  id: string;
  reservationCode: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  roomType: string;
  category: 'transient' | 'dormitory';
  checkIn: string;
  checkOut: string;
  guests: number;
  rate: number;
  ratePeriod: string;
  totalAmount: number;
  status: 'Pending Review' | 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Paid' | 'Pending' | 'Partial' | 'Unpaid';
  specialRequests?: string;
  cancellationReason?: string;
  bookedAt: string;
  adminNotes?: string;
}

export interface AdminRoom {
  id: string;
  roomNumber: string;
  name: string;
  category: 'transient' | 'dormitory';
  roomType: string;
  capacity: number;
  price: number;
  ratePeriod: 'night' | 'month';
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  floor: string;
  amenities: string[];
}

export interface AdminDormSlot {
  id: string;
  dormRoom: string;
  wing: 'Male Wing' | 'Female Wing' | 'Co-ed Executive';
  bedSlot: string;
  tenantName: string | null;
  tenantPhone?: string;
  monthlyRate: number;
  dueDate: string | null;
  status: 'Occupied' | 'Available' | 'Reserved' | 'Under Cleaning';
  utilityStatus: string;
  contractEnd?: string;
}

export interface AdminBillingRecord {
  id: string;
  invoiceNumber: string;
  tenantOrGuest: string;
  roomOrBed: string;
  type: 'Transient Stay' | 'Monthly Dorm Rent' | 'Security Deposit' | 'Utility Settlement';
  billingPeriod: string;
  rentAmount: number;
  waterAmount: number;
  electricityAmount: number;
  depositAmount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
  dueDate: string;
  paidAt?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: 'Active' | 'VIP Member' | 'Past Guest';
  reservationCount: number;
  latestReservation: string;
  memberSince: string;
  notes?: string;
}

export interface AdminInquiry {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  receivedAt: string;
  status: 'New' | 'Replied' | 'Archived';
  replyText?: string;
}

// Baseline Property Data aligned directly with active units and rates
export const INITIAL_ADMIN_RESERVATIONS: AdminReservation[] = [
  {
    id: 'res-dt-001',
    reservationCode: 'DT-001',
    guestName: 'Juan Dela Cruz',
    email: 'juan.delacruz@gmail.com',
    phone: '0917-123-4567',
    roomName: 'Premium Twin Room',
    roomType: 'Premium Twin Room',
    category: 'transient',
    checkIn: '2026-10-01',
    checkOut: '2026-10-03',
    guests: 4,
    rate: 2000,
    ratePeriod: 'night',
    totalAmount: 4000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Prefer mountain view window with red blinds; arriving 3 PM',
    bookedAt: 'Sep 28, 2026'
  },
  {
    id: 'res-dt-002',
    reservationCode: 'DT-002',
    guestName: 'Maria Santos',
    email: 'maria.santos@yahoo.com',
    phone: '0918-987-6543',
    roomName: 'Premium Twin Room',
    roomType: 'Premium Twin Room',
    category: 'transient',
    checkIn: '2026-10-04',
    checkOut: '2026-10-07',
    guests: 4,
    rate: 2000,
    ratePeriod: 'night',
    totalAmount: 6000,
    status: 'Pending Review',
    paymentStatus: 'Unpaid',
    specialRequests: 'Arriving late at 7:00 PM; extra red blanket requested',
    bookedAt: 'Sep 29, 2026'
  },
  {
    id: 'res-dt-003',
    reservationCode: 'DT-003',
    guestName: 'Kevin Lim',
    email: 'k.lim@techworks.ph',
    phone: '0920-555-8899',
    roomName: 'Premium Large Room',
    roomType: 'Premium Large Room',
    category: 'transient',
    checkIn: '2026-10-02',
    checkOut: '2026-10-04',
    guests: 2,
    rate: 1500,
    ratePeriod: 'night',
    totalAmount: 3000,
    status: 'Pending Review',
    paymentStatus: 'Unpaid',
    specialRequests: 'Need wooden vanity desk and stable Wi-Fi for remote work',
    bookedAt: 'Sep 30, 2026'
  },
  {
    id: 'res-dt-004',
    reservationCode: 'DT-004',
    guestName: 'Grace Bautista',
    email: 'grace.b@outlook.com',
    phone: '0995-333-1212',
    roomName: 'Compact Solo Room',
    roomType: 'Compact Solo Room',
    category: 'transient',
    checkIn: '2026-10-08',
    checkOut: '2026-10-10',
    guests: 1,
    rate: 800,
    ratePeriod: 'night',
    totalAmount: 1600,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Quiet solo room with scenic view',
    bookedAt: 'Sep 27, 2026'
  },
  {
    id: 'res-dt-005',
    reservationCode: 'DT-005',
    guestName: 'Eduardo Ramos',
    email: 'ed.ramos@corp.ph',
    phone: '0919-444-2233',
    roomName: 'Dormitory Room (Shared Bedspace)',
    roomType: 'Dormitory Room (Shared Bedspace)',
    category: 'dormitory',
    checkIn: '2026-10-01',
    checkOut: '2026-10-31',
    guests: 1,
    rate: 3000,
    ratePeriod: 'month/person',
    totalAmount: 3000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'SLU graduate student; lower bunk requested with study desk',
    bookedAt: 'Sep 25, 2026'
  },
  {
    id: 'res-dt-006',
    reservationCode: 'DT-006',
    guestName: 'Patricia Tan',
    email: 'pat.tan@gmail.com',
    phone: '0908-111-9988',
    roomName: 'Compact Solo Room',
    roomType: 'Compact Solo Room',
    category: 'transient',
    checkIn: '2026-10-12',
    checkOut: '2026-10-14',
    guests: 2,
    rate: 800,
    ratePeriod: 'night',
    totalAmount: 1600,
    status: 'Cancelled',
    paymentStatus: 'Unpaid',
    cancellationReason: 'Change in travel plans or dates',
    bookedAt: 'Sep 26, 2026'
  }
];

export const INITIAL_ADMIN_ROOMS: AdminRoom[] = [
  {
    id: 'room-a-101',
    roomNumber: 'Room A-101',
    name: 'Premium Twin Room',
    category: 'transient',
    roomType: 'Premium Twin Room',
    capacity: 4,
    price: 2000,
    ratePeriod: 'night',
    status: 'Available',
    floor: '1st Floor',
    amenities: [
      'Two (2) single beds with solid white box base',
      'Thick red blankets',
      'Wooden vanity desk with chair and mirror',
      'Closed wooden wardrobe cabinet',
      'Warm bedside lamp',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-a-102',
    roomNumber: 'Room A-102',
    name: 'Premium Twin Room',
    category: 'transient',
    roomType: 'Premium Twin Room',
    capacity: 4,
    price: 2000,
    ratePeriod: 'night',
    status: 'Occupied',
    floor: '1st Floor',
    amenities: [
      'Two (2) single beds with solid white box base',
      'Thick red blankets',
      'Wooden vanity desk with chair and mirror',
      'Closed wooden wardrobe cabinet',
      'Warm bedside lamp',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-b-201',
    roomNumber: 'Room B-201',
    name: 'Premium Large Room',
    category: 'transient',
    roomType: 'Premium Large Room',
    capacity: 2,
    price: 1500,
    ratePeriod: 'night',
    status: 'Reserved',
    floor: '2nd Floor',
    amenities: [
      'One (1) queen size bed with solid white box base',
      'Thick red blanket',
      'Wooden vanity desk with chair and mirror',
      'Closed wooden wardrobe cabinet',
      'Warm bedside lamp',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-b-202',
    roomNumber: 'Room B-202',
    name: 'Premium Large Room',
    category: 'transient',
    roomType: 'Premium Large Room',
    capacity: 2,
    price: 1500,
    ratePeriod: 'night',
    status: 'Available',
    floor: '2nd Floor',
    amenities: [
      'One (1) queen size bed with solid white box base',
      'Thick red blanket',
      'Wooden vanity desk with chair and mirror',
      'Closed wooden wardrobe cabinet',
      'Warm bedside lamp',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-c-301',
    roomNumber: 'Room C-301',
    name: 'Compact Solo Room',
    category: 'transient',
    roomType: 'Compact Solo Room',
    capacity: 2,
    price: 800,
    ratePeriod: 'night',
    status: 'Occupied',
    floor: '3rd Floor',
    amenities: [
      'One (1) small bed with solid white box base',
      'Thick red blanket',
      'Compact wooden vanity desk and chair',
      'Narrow closed wooden wardrobe cabinet',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-c-302',
    roomNumber: 'Room C-302',
    name: 'Compact Solo Room',
    category: 'transient',
    roomType: 'Compact Solo Room',
    capacity: 2,
    price: 800,
    ratePeriod: 'night',
    status: 'Maintenance',
    floor: '3rd Floor',
    amenities: [
      'One (1) small bed with solid white box base',
      'Thick red blanket',
      'Compact wooden vanity desk and chair',
      'Narrow closed wooden wardrobe cabinet',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'View of Baguio'
    ]
  },
  {
    id: 'room-c-401',
    roomNumber: 'Room C-401',
    name: 'Compact Solo Room',
    category: 'transient',
    roomType: 'Compact Solo Room',
    capacity: 2,
    price: 800,
    ratePeriod: 'night',
    status: 'Available',
    floor: '4th Floor (Top Floor)',
    amenities: [
      'One (1) small bed with solid white box base',
      'Thick red blanket',
      'Compact wooden vanity desk and chair',
      'Narrow closed wooden wardrobe cabinet',
      'Matte black electric stand fan',
      'Glass sliding window with red pull-cord roller blinds',
      'Scenic view of Baguio'
    ]
  },
  {
    id: 'room-dorm-101',
    roomNumber: 'Dorm 101',
    name: 'Dormitory Room (Shared Bedspace)',
    category: 'dormitory',
    roomType: 'Dormitory Room (Shared Bedspace)',
    capacity: 4,
    price: 3000,
    ratePeriod: 'month',
    status: 'Available',
    floor: '1st Floor',
    amenities: [
      'Sturdy wooden double-deck (bunk) beds',
      'Two (2) minimalist wooden study desks with chair',
      'Closed wooden cabinets for dormers belongings',
      'Matte black electric stand fan',
      'High-speed Free Wi-Fi'
    ]
  },
  {
    id: 'room-dorm-201',
    roomNumber: 'Dorm 201',
    name: 'Dormitory Room (Shared Bedspace)',
    category: 'dormitory',
    roomType: 'Dormitory Room (Shared Bedspace)',
    capacity: 4,
    price: 3000,
    ratePeriod: 'month',
    status: 'Occupied',
    floor: '2nd Floor',
    amenities: [
      'Sturdy wooden double-deck (bunk) beds',
      'Two (2) minimalist wooden study desks with chair',
      'Closed wooden cabinets for dormers belongings',
      'Matte black electric stand fan',
      'High-speed Free Wi-Fi'
    ]
  }
];

export const INITIAL_ADMIN_DORM_SLOTS: AdminDormSlot[] = [
  {
    id: 'dorm-101-a',
    dormRoom: 'Dormitory Room 101 — Highland Wing (4-Bed Unit)',
    wing: 'Male Wing',
    bedSlot: 'Bed 1 (Lower Bunk)',
    tenantName: 'Juan Dela Cruz',
    tenantPhone: '0917-123-4567',
    monthlyRate: 3000,
    dueDate: '2026-10-05',
    status: 'Occupied',
    utilityStatus: 'Inclusive of Wi-Fi, Water & Security; sub-metered power',
    contractEnd: 'Dec 2026'
  },
  {
    id: 'dorm-101-b',
    dormRoom: 'Dormitory Room 101 — Highland Wing (4-Bed Unit)',
    wing: 'Male Wing',
    bedSlot: 'Bed 2 (Upper Bunk)',
    tenantName: 'Mark Santos',
    tenantPhone: '0928-888-7711',
    monthlyRate: 3000,
    dueDate: '2026-10-05',
    status: 'Occupied',
    utilityStatus: 'Inclusive of Wi-Fi, Water & Security; sub-metered power',
    contractEnd: 'Jan 2027'
  },
  {
    id: 'dorm-101-c',
    dormRoom: 'Dormitory Room 101 — Highland Wing (4-Bed Unit)',
    wing: 'Male Wing',
    bedSlot: 'Bed 3 (Lower Bunk)',
    tenantName: null,
    monthlyRate: 3000,
    dueDate: null,
    status: 'Available',
    utilityStatus: 'Ready for occupancy; includes study table & cabinet'
  },
  {
    id: 'dorm-101-d',
    dormRoom: 'Dormitory Room 101 — Highland Wing (4-Bed Unit)',
    wing: 'Male Wing',
    bedSlot: 'Bed 4 (Upper Bunk)',
    tenantName: null,
    monthlyRate: 3000,
    dueDate: null,
    status: 'Available',
    utilityStatus: 'Ready for occupancy; includes study table & cabinet'
  },
  {
    id: 'dorm-201-a',
    dormRoom: 'Dormitory Room 201 — Pine Blossom Wing (4-Bed Unit)',
    wing: 'Female Wing',
    bedSlot: 'Bed 1 (Lower Bunk)',
    tenantName: 'Camille Reyes',
    tenantPhone: '0917-999-1234',
    monthlyRate: 3000,
    dueDate: '2026-10-10',
    status: 'Occupied',
    utilityStatus: 'Inclusive of Wi-Fi, Water & Security; sub-metered power',
    contractEnd: 'Nov 2026'
  },
  {
    id: 'dorm-201-b',
    dormRoom: 'Dormitory Room 201 — Pine Blossom Wing (4-Bed Unit)',
    wing: 'Female Wing',
    bedSlot: 'Bed 2 (Upper Bunk)',
    tenantName: 'Angela Lopez',
    tenantPhone: '0939-222-3344',
    monthlyRate: 3000,
    dueDate: '2026-10-10',
    status: 'Occupied',
    utilityStatus: 'Inclusive of Wi-Fi, Water & Security; sub-metered power',
    contractEnd: 'Mar 2027'
  },
  {
    id: 'dorm-201-c',
    dormRoom: 'Dormitory Room 201 — Pine Blossom Wing (4-Bed Unit)',
    wing: 'Female Wing',
    bedSlot: 'Bed 3 (Lower Bunk)',
    tenantName: 'Rhea Villareal',
    tenantPhone: '0998-777-6655',
    monthlyRate: 3000,
    dueDate: '2026-10-15',
    status: 'Reserved',
    utilityStatus: 'Move-in scheduled Oct 5; deposit cleared',
    contractEnd: 'Apr 2027'
  },
  {
    id: 'dorm-201-d',
    dormRoom: 'Dormitory Room 201 — Pine Blossom Wing (4-Bed Unit)',
    wing: 'Female Wing',
    bedSlot: 'Bed 4 (Upper Bunk)',
    tenantName: null,
    monthlyRate: 3000,
    dueDate: null,
    status: 'Under Cleaning',
    utilityStatus: 'Maintenance deep clean & mattress sanitizing'
  }
];

export const INITIAL_ADMIN_BILLING: AdminBillingRecord[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-081',
    tenantOrGuest: 'Juan Dela Cruz',
    roomOrBed: 'Deluxe Room',
    type: 'Transient Stay',
    billingPeriod: 'Oct 1 - Oct 3, 2026 (2 nights)',
    rentAmount: 4000,
    waterAmount: 0,
    electricityAmount: 0,
    depositAmount: 0,
    totalAmount: 4000,
    paymentStatus: 'Paid',
    paymentMethod: 'GCash / Online Bank Transfer',
    dueDate: '2026-10-01',
    paidAt: '2026-09-28'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-082',
    tenantOrGuest: 'Maria Santos',
    roomOrBed: 'Family Room',
    type: 'Transient Stay',
    billingPeriod: 'Oct 4 - Oct 7, 2026 (3 nights)',
    rentAmount: 8400,
    waterAmount: 0,
    electricityAmount: 0,
    depositAmount: 1000,
    totalAmount: 9400,
    paymentStatus: 'Pending',
    dueDate: '2026-10-04'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-083',
    tenantOrGuest: 'Kevin Lim',
    roomOrBed: 'Standard Room',
    type: 'Transient Stay',
    billingPeriod: 'Oct 2 - Oct 4, 2026 (2 nights)',
    rentAmount: 3000,
    waterAmount: 0,
    electricityAmount: 0,
    depositAmount: 0,
    totalAmount: 3000,
    paymentStatus: 'Pending',
    dueDate: '2026-10-02'
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-084',
    tenantOrGuest: 'Eduardo Ramos',
    roomOrBed: 'Dormitory Room — Bed A',
    type: 'Monthly Dorm Rent',
    billingPeriod: 'October 2026 Monthly Dorm Lease',
    rentAmount: 8000,
    waterAmount: 0,
    electricityAmount: 0,
    depositAmount: 2000,
    totalAmount: 10000,
    paymentStatus: 'Paid',
    paymentMethod: 'Over-the-Counter Cash (Front Desk)',
    dueDate: '2026-10-01',
    paidAt: '2026-09-25'
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2026-085',
    tenantOrGuest: 'Grace Bautista',
    roomOrBed: 'Family Suite',
    type: 'Transient Stay',
    billingPeriod: 'Oct 8 - Oct 10, 2026 (2 nights)',
    rentAmount: 7000,
    waterAmount: 0,
    electricityAmount: 0,
    depositAmount: 0,
    totalAmount: 7000,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card / Maya',
    dueDate: '2026-10-08',
    paidAt: '2026-09-27'
  },
  {
    id: 'inv-006',
    invoiceNumber: 'INV-2026-086',
    tenantOrGuest: 'Danilo Cruz (Former)',
    roomOrBed: 'Dormitory Room — Bed C',
    type: 'Utility Settlement',
    billingPeriod: 'August Final Utility Adjustment',
    rentAmount: 0,
    waterAmount: 180,
    electricityAmount: 620,
    depositAmount: 0,
    totalAmount: 800,
    paymentStatus: 'Overdue',
    dueDate: '2026-09-15'
  }
];

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-01',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@gmail.com',
    phone: '0917-123-4567',
    accountStatus: 'VIP Member',
    reservationCount: 4,
    latestReservation: 'Deluxe Room (Oct 1 - Oct 3, 2026)',
    memberSince: 'Jan 2025',
    notes: 'Regular corporate guest; prefers high floors and early invoices'
  },
  {
    id: 'cust-02',
    name: 'Maria Santos',
    email: 'maria.santos@yahoo.com',
    phone: '0918-987-6543',
    accountStatus: 'Active',
    reservationCount: 2,
    latestReservation: 'Family Room (Oct 4 - Oct 7, 2026)',
    memberSince: 'Aug 2025',
    notes: 'Family visits during Panagbenga and long weekends'
  },
  {
    id: 'cust-03',
    name: 'Kevin Lim',
    email: 'k.lim@techworks.ph',
    phone: '0920-555-8899',
    accountStatus: 'Active',
    reservationCount: 1,
    latestReservation: 'Standard Room (Oct 2 - Oct 4, 2026)',
    memberSince: 'Sep 2026',
    notes: 'Remote digital nomad; requested stable Wi-Fi access'
  },
  {
    id: 'cust-04',
    name: 'Camille Reyes',
    email: 'camille.reyes@slu.edu.ph',
    phone: '0917-999-1234',
    accountStatus: 'Active',
    reservationCount: 6,
    latestReservation: 'Dormitory Room Female Bed A (Monthly Ongoing)',
    memberSince: 'Nov 2024',
    notes: 'Student tenant; punctual payer; quiet and respectful'
  },
  {
    id: 'cust-05',
    name: 'Patricia Tan',
    email: 'pat.tan@gmail.com',
    phone: '0908-111-9988',
    accountStatus: 'Past Guest',
    reservationCount: 1,
    latestReservation: 'Standard Room (Cancelled)',
    memberSince: 'Sep 2026',
    notes: 'Rescheduled travel due to typhoon advisory'
  }
];

export const INITIAL_ADMIN_INQUIRIES: AdminInquiry[] = [
  {
    id: 'inq-001',
    guestName: 'Atty. Roberto Mendoza',
    email: 'mendoza.law@gmail.com',
    phone: '0917-888-4422',
    topic: 'Group Booking & Seminar',
    message: 'Good day! We are planning a 3-night seminar in Baguio from Nov 14-17 for 12 guests. Do you have 4-5 adjacent rooms available with parking for 2 vans?',
    receivedAt: 'Today at 9:30 AM',
    status: 'New'
  },
  {
    id: 'inq-002',
    guestName: 'Jessica Alcantara',
    email: 'jess.alcantara@gmail.com',
    phone: '0922-333-7744',
    topic: 'Monthly Dormitory Inquiries',
    message: 'Hello, is Bed C in the Female Wing still available for October move-in? What are the requirements and security deposit details?',
    receivedAt: 'Yesterday at 3:15 PM',
    status: 'New'
  },
  {
    id: 'inq-003',
    guestName: 'Mark Villanueva',
    email: 'mvillanueva@gmail.com',
    phone: '0918-222-1100',
    topic: 'Early Check-in Question',
    message: 'Hi Dragon Treasure team, our night bus from Cubao arrives around 5:30 AM. Can we do an early check-in or leave our luggage with the caretaker?',
    receivedAt: 'Sep 29, 2026',
    status: 'Replied',
    replyText: 'Hi Mark! You are welcome to store your luggage with our 24/7 caretaker for free starting 5:30 AM. Standard room check-in is 2:00 PM, or early room entry if clean and vacant.'
  }
];

const ADMIN_STORAGE_KEY = 'dragon_treasure_admin_data_store_v5';
const ADMIN_SESSION_KEY = 'dragon_treasure_admin_session';

export interface AdminStoreState {
  reservations: AdminReservation[];
  rooms: AdminRoom[];
  dormSlots: AdminDormSlot[];
  billing: AdminBillingRecord[];
  customers: AdminCustomer[];
  inquiries: AdminInquiry[];
}

export const AdminDataManager = {
  loadStore(): AdminStoreState {
    try {
      // Purge any legacy non-aligned stores
      localStorage.removeItem('dragon_treasure_admin_data_store');
      localStorage.removeItem('dragon_treasure_admin_data_store_v2');
      localStorage.removeItem('dragon_treasure_admin_data_store_v3');
      localStorage.removeItem('dragon_treasure_admin_data_store_v4');

      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed.rooms &&
          parsed.rooms.some((r: any) => r.roomType === 'Premium Twin Room' || r.name === 'Premium Twin Room')
        ) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    const initialStore: AdminStoreState = {
      reservations: INITIAL_ADMIN_RESERVATIONS,
      rooms: INITIAL_ADMIN_ROOMS,
      dormSlots: INITIAL_ADMIN_DORM_SLOTS,
      billing: INITIAL_ADMIN_BILLING,
      customers: INITIAL_ADMIN_CUSTOMERS,
      inquiries: INITIAL_ADMIN_INQUIRIES
    };

    this.saveStore(initialStore);
    return initialStore;
  },

  saveStore(state: AdminStoreState): void {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  },

  resetStore(): AdminStoreState {
    const initialStore: AdminStoreState = {
      reservations: INITIAL_ADMIN_RESERVATIONS,
      rooms: INITIAL_ADMIN_ROOMS,
      dormSlots: INITIAL_ADMIN_DORM_SLOTS,
      billing: INITIAL_ADMIN_BILLING,
      customers: INITIAL_ADMIN_CUSTOMERS,
      inquiries: INITIAL_ADMIN_INQUIRIES
    };
    this.saveStore(initialStore);
    return initialStore;
  },

  // Admin Session Management (Strictly separated from customer session)
  getAdminSession(): { isLoggedIn: boolean; username: string } | null {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (session) return JSON.parse(session);
    } catch {
      // ignore
    }
    return null;
  },

  setAdminSession(username: string): void {
    try {
      sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ isLoggedIn: true, username, loggedInAt: new Date().toISOString() })
      );
    } catch {
      // ignore
    }
  },

  clearAdminSession(): void {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  }
};
