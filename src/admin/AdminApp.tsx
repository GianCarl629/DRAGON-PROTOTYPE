import React, { useState, useEffect } from 'react';
import { 
  AdminDataManager, 
  AdminStoreState, 
  AdminReservation, 
  AdminRoom, 
  AdminDormSlot, 
  AdminBillingRecord, 
  AdminCustomer, 
  AdminInquiry,
  INITIAL_ADMIN_RESERVATIONS,
  INITIAL_ADMIN_ROOMS,
  INITIAL_ADMIN_DORM_SLOTS,
  INITIAL_ADMIN_BILLING,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_INQUIRIES
} from './data/adminMockData';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { DashboardView } from './views/DashboardView';
import { ReservationsView } from './views/ReservationsView';
import { RoomsView } from './views/RoomsView';
import { DormitoryView } from './views/DormitoryView';
import { BillingView } from './views/BillingView';
import { CustomersView } from './views/CustomersView';
import { InquiriesView } from './views/InquiriesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { 
  sendStaffReply, 
  resolveInquiry, 
  reopenInquiry, 
  syncInquiriesWithSupabase, 
  subscribeToInquiryChanges 
} from '../services/db/inquiryService';

export const AdminApp: React.FC = () => {
  // Admin Session State (Completely separated from customer authentication)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!AdminDataManager.getAdminSession();
  });
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return AdminDataManager.getAdminSession()?.username || 'admin';
  });

  // Active Tab & Filter
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [tabFilter, setTabFilter] = useState<string | undefined>(undefined);

  // Main Admin Store State
  const [store, setStore] = useState<AdminStoreState>(() => {
    return AdminDataManager.loadStore();
  });

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['dashboard', 'reservations', 'rooms', 'dormitory', 'billing', 'customers', 'inquiries', 'reports', 'settings'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Sync inquiries from Supabase cloud on initial load
    syncInquiriesWithSupabase().then(() => {
      setStore(AdminDataManager.loadStore());
    });

    // Realtime channel listener for cloud updates
    const unsubscribeRealtime = subscribeToInquiryChanges(() => {
      setStore(AdminDataManager.loadStore());
    });

    // Sync inquiries when customer submits or replies locally
    const handleInquirySync = () => {
      setStore(AdminDataManager.loadStore());
    };
    window.addEventListener('dragon_treasure_inquiry_updated', handleInquirySync);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('dragon_treasure_inquiry_updated', handleInquirySync);
      unsubscribeRealtime();
    };
  }, []);

  // Save changes to localStorage whenever store updates
  const updateStore = (updater: (prev: AdminStoreState) => AdminStoreState) => {
    setStore((prev) => {
      const next = updater(prev);
      AdminDataManager.saveStore(next);
      return next;
    });
  };

  // Handlers for admin operations

  const handleLoginSuccess = (user: string) => {
    AdminDataManager.setAdminSession(user);
    setAdminUsername(user);
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    AdminDataManager.clearAdminSession();
    setIsAdminLoggedIn(false);
  };

  const handleSelectTab = (tab: string, filter?: string) => {
    setActiveTab(tab);
    setTabFilter(filter);
    window.location.hash = tab;
  };

  // Reservation actions
  const handleConfirmReservation = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === id ? { ...r, status: 'Confirmed' as const } : r
      )
    }));
  };

  const handleCancelReservation = (id: string, reason: string) => {
    updateStore((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Cancelled' as const,
              cancellationReason: reason
            }
          : r
      )
    }));
  };

  const handleUpdatePaymentStatus = (id: string, paymentStatus: AdminReservation['paymentStatus']) => {
    updateStore((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) =>
        r.id === id ? { ...r, paymentStatus } : r
      )
    }));
  };

  const handleUpdateReservation = (updated: AdminReservation) => {
    updateStore((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) => (r.id === updated.id ? updated : r))
    }));
  };

  const handleAddReservation = (newRes: AdminReservation) => {
    updateStore((prev) => ({
      ...prev,
      reservations: [newRes, ...prev.reservations]
    }));
  };

  const handleDeleteReservation = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      reservations: prev.reservations.filter((r) => r.id !== id)
    }));
  };

  // Room actions
  const handleAddRoom = (newRoom: AdminRoom) => {
    updateStore((prev) => ({
      ...prev,
      rooms: [newRoom, ...prev.rooms]
    }));
  };

  const handleUpdateRoom = (updated: AdminRoom) => {
    updateStore((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === updated.id ? updated : r))
    }));
  };

  const handleDeleteRoom = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== id)
    }));
  };

  // Dormitory actions
  const handleUpdateDormSlot = (updated: AdminDormSlot) => {
    updateStore((prev) => ({
      ...prev,
      dormSlots: prev.dormSlots.map((s) => (s.id === updated.id ? updated : s))
    }));
  };

  // Billing actions
  const handleUpdateBillingStatus = (id: string, newStatus: AdminBillingRecord['paymentStatus']) => {
    updateStore((prev) => ({
      ...prev,
      billing: prev.billing.map((b) =>
        b.id === id
          ? {
              ...b,
              paymentStatus: newStatus,
              paidAt: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : b.paidAt
            }
          : b
      )
    }));
  };

  const handleAddBillingRecord = (newRec: AdminBillingRecord) => {
    updateStore((prev) => ({
      ...prev,
      billing: [newRec, ...prev.billing]
    }));
  };

  // Customer actions
  const handleAddCustomer = (newCustomer: AdminCustomer) => {
    updateStore((prev) => ({
      ...prev,
      customers: [newCustomer, ...prev.customers]
    }));
  };

  const handleUpdateCustomer = (updated: AdminCustomer) => {
    updateStore((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === updated.id ? updated : c))
    }));
  };

  // Inquiry actions
  const handleReplyInquiry = async (id: string, replyText: string, markAsResolved?: boolean) => {
    await sendStaffReply(id, replyText, adminUsername || 'Front Desk Concierge', markAsResolved);
    setStore(AdminDataManager.loadStore());
  };

  const handleResolveInquiry = async (id: string) => {
    await resolveInquiry(id, adminUsername || 'Front Desk Staff');
    setStore(AdminDataManager.loadStore());
  };

  const handleReopenInquiry = async (id: string) => {
    await reopenInquiry(id);
    setStore(AdminDataManager.loadStore());
  };

  const handleMarkReadInquiry = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id && inq.status === 'New' ? { ...inq, status: 'Replied' as const } : inq
      )
    }));
  };

  const handleArchiveInquiry = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status: 'Archived' as const } : inq
      )
    }));
  };

  // Reset Data to defaults
  const handleResetData = () => {
    const defaultStore: AdminStoreState = {
      reservations: INITIAL_ADMIN_RESERVATIONS,
      rooms: INITIAL_ADMIN_ROOMS,
      dormSlots: INITIAL_ADMIN_DORM_SLOTS,
      billing: INITIAL_ADMIN_BILLING,
      customers: INITIAL_ADMIN_CUSTOMERS,
      inquiries: INITIAL_ADMIN_INQUIRIES
    };
    AdminDataManager.saveStore(defaultStore);
    setStore(defaultStore);
  };

  // If not authenticated, protect admin.html by rendering ONLY the login screen (Section 7)
  if (!isAdminLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Once authenticated, render full professional admin dashboard (Section 8)
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onLogout={handleLogout}
      adminUsername={adminUsername}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          onNavigateTab={handleSelectTab}
          onConfirmReservation={handleConfirmReservation}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {activeTab === 'reservations' && (
        <ReservationsView
          initialFilter={tabFilter}
        />
      )}

      {activeTab === 'rooms' && (
        <RoomsView
          initialFilter={tabFilter}
        />
      )}

      {activeTab === 'dormitory' && (
        <DormitoryView />
      )}

      {activeTab === 'billing' && (
        <BillingView
          initialFilter={tabFilter}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersView />
      )}

      {activeTab === 'inquiries' && (
        <InquiriesView
          initialFilter={tabFilter}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsView />
      )}

      {activeTab === 'settings' && (
        <SettingsView onResetData={handleResetData} />
      )}
    </AdminLayout>
  );
};
