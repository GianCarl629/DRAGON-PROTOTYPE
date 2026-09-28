import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, ShieldCheck, Award, Sparkles, Check, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Lock background scrolling while modal is open & synchronize user data
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setEditName(user.name || '');
        setEditPhone(user.phone || '');
      }
      setIsEditing(false);
      setSaveSuccess(false);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, user]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated = {
      ...user,
      name: editName.trim(),
      phone: editPhone.trim()
    };
    updateUser(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/75 backdrop-blur-sm animate-fade-in overflow-hidden"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200/90 overflow-hidden transform-gpu flex flex-col max-h-[90vh]">
        
        {/* Pinned Header */}
        <div className="p-5 pb-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0 bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-pine-900 text-gold-300 font-bold flex items-center justify-center font-serif text-sm border-2 border-gold-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-pine-950 leading-tight">
                Guest Profile
              </h2>
              <p className="text-xs text-slate-500">
                Dragon Treasure Member Account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-pine-950 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Membership Tier Card */}
          <div className="bg-gradient-to-br from-pine-900 via-pine-800 to-pine-950 text-white rounded-2xl p-4 shadow-md space-y-2.5 border border-gold-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300">
                Loyalty Status
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gold-500/20 text-gold-300 px-2.5 py-0.5 rounded-full border border-gold-400/30">
                <Award className="w-3 h-3 text-gold-400" />
                <span>{user.tier || 'Guest Member'}</span>
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                {user.name}
              </h3>
              <p className="text-xs text-pine-200">
                Member since {user.joinedDate || '2026'}
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-pine-200">
              <span>Baguio Highland Perks</span>
              <span className="text-gold-300 font-semibold">Priority Reservation Active</span>
            </div>
          </div>

          {/* Account Details Form / View */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pine-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pine-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-950 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-pine-700" />
                    <span>Email Address</span>
                  </span>
                  <span className="font-semibold text-pine-950">{user.email}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pine-700" />
                    <span>Contact Number</span>
                  </span>
                  <span className="font-semibold text-pine-950">{user.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Demo Authentication</span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Session
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditName(user.name);
                  setEditPhone(user.phone);
                  setIsEditing(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile Information</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
