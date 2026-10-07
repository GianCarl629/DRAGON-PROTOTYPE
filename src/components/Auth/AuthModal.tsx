import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModalMode } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
  onSuccessAuth?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessAuth
}) => {
  const { login, register, pendingBookingIntent } = useAuth();

  const [mode, setMode] = useState<AuthModalMode>(initialMode);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setIsLoading(false);
      setForgotSuccess(false);

      // Lock background scrolling while modal is open
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(loginEmail, loginPassword);
      setIsLoading(false);
      onClose();
      if (onSuccessAuth) onSuccessAuth();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Login failed. Please check your inputs.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }
    if (!regPassword) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword
      });
      setIsLoading(false);
      onClose();
      if (onSuccessAuth) onSuccessAuth();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg('');
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-pine-950/75 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200/90 overflow-hidden transform-gpu flex flex-col max-h-[92vh]">
        
        {/* Pinned Header */}
        <div className="p-5 pb-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500 shadow-glow-gold flex-shrink-0 bg-pine-950">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Logo"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-pine-950 leading-tight">
                Dragon Treasure
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Transient & Condotel • Baguio City
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-pine-950 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4">
          
          {/* Reservation Intent Pill (Shown if user attempted to book before logging in) */}
          {pendingBookingIntent && (
            <div className="p-3 bg-gradient-to-r from-gold-50 via-cream-100 to-gold-50 border border-gold-300/80 rounded-2xl flex items-center gap-2.5 text-xs text-pine-950">
              <CalendarCheck className="w-4 h-4 text-gold-700 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold block truncate">
                  Reservation in Progress: {pendingBookingIntent.roomType || 'Accommodations'}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Sign in or register to complete your reservation without losing your dates.
                </span>
              </div>
            </div>
          )}

          {/* Login prompt */}
          {mode === 'prompt' && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-pine-50 border border-pine-200/80 text-pine-800 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-7 h-7 text-pine-800" strokeWidth={2} />
                </div>
                <h2 className="font-serif font-bold text-2xl text-pine-950">
                  Login Required
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Please log in or create an account before continuing with your room reservation.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('login');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pine-900 to-pine-800 hover:from-pine-800 hover:to-pine-950 shadow-md hover:shadow-glow-pine active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Log In to Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('register');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-pine-950 bg-stone-100 hover:bg-stone-200/80 active:scale-98 transition-all flex items-center justify-center gap-2 border border-stone-200 cursor-pointer"
                >
                  <span>Create New Account</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Continue Browsing As Guest
                </button>
              </div>
            </div>
          )}

          {/* Login form */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-pine-950">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Sign in to continue with your reservation.
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. guest@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-pine-800 hover:text-gold-700 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-pine-900 hover:bg-pine-950 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Log In</span>
                  )}
                </button>
              </form>

              {/* Client Portal Security Notice */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-pine-700 flex-shrink-0" />
                <span>Secure client access for reservation tracking, live calendar, and automated billing.</span>
              </div>

              {/* Switch to Register */}
              <div className="text-center pt-2 text-xs text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('register');
                  }}
                  className="font-bold text-pine-900 hover:text-gold-700 hover:underline transition-colors"
                >
                  Register here
                </button>
              </div>
            </div>
          )}

          {/* Register form */}
          {mode === 'register' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-pine-950">
                  Create Your Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Create an account to manage your reservations and bookings.
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0907 861 4267"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                    />
                  </div>
                </div>

                {/* Password and Confirm Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                      Confirm *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-pine-900 hover:bg-pine-950 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 pt-2.5"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              {/* Switch to Login */}
              <div className="text-center pt-2 text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('login');
                  }}
                  className="font-bold text-pine-900 hover:text-gold-700 hover:underline transition-colors"
                >
                  Log in here
                </button>
              </div>
            </div>
          )}

          {/* Forgot password form */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-pine-950">
                  Reset Password
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your email address and we'll send instructions to reset your password.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold">
                    Password reset instructions have been sent to <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccess(false);
                      setMode('login');
                    }}
                    className="inline-block mt-2 px-4 py-2 rounded-xl bg-pine-900 text-white text-xs font-bold"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-pine-950 uppercase tracking-wider">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. guest@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine-800 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-pine-900 hover:bg-pine-950 shadow-md transition-all cursor-pointer"
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-pine-900 hover:text-gold-700 hover:underline"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
