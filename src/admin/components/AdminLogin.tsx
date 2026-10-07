import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { CursorSettingsDropdown } from '../../components/UI/CursorSettingsDropdown';

interface AdminLoginProps {
  onLoginSuccess: (username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Standard administrator authentication: admin / admin123
      if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
        onLoginSuccess('admin');
      } else {
        setError('Invalid administrator credentials. (Hint: admin / admin123)');
      }
    }, 350);
  };

  const handleUseDefaultCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf5ea] text-slate-800 relative overflow-hidden font-sans">
      {/* Top right cursor toggle */}
      <div className="absolute top-4 right-4 z-20">
        <CursorSettingsDropdown />
      </div>
      
      {/* Background Atmospheric Glows matching index.html */}
      <div className="absolute top-0 right-0 z-0 w-[550px] h-[550px] bg-gradient-to-br from-gold-200/40 via-pine-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 z-0 w-[500px] h-[500px] bg-gradient-to-tr from-cedar-200/40 via-gold-100/30 to-transparent rounded-full blur-3xl transform -translate-x-1/3 pointer-events-none" />

      {/* Golden Dragon Watermark Centered in the Middle of the Page */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[620px] sm:h-[620px] lg:w-[720px] lg:h-[720px] pointer-events-none select-none flex items-center justify-center opacity-25 z-0"
      >
        <img
          src="/golden-dragon-watermark.png"
          alt="Dragon Treasure Watermark"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Oriental Golden Wave Pattern in Bottom Corner */}
      <div 
        className="absolute -bottom-2 right-0 w-80 sm:w-[420px] h-40 z-0 pointer-events-none opacity-45 select-none bg-repeat"
        style={{ backgroundImage: 'url(/oriental-waves.svg)', backgroundSize: '60px 30px' }}
      />

      {/* Main Login Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Top Eyebrow Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-gold-400/60 text-pine-950 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
            <span className="font-bold">Dragon Treasure Internal Management</span>
          </div>
        </div>

        {/* Card Box matching main website cards */}
        <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 shadow-luxury border-2 border-gold-300/80 backdrop-blur-xl relative">
          
          {/* Header Brand */}
          <div className="text-center space-y-2.5 pb-6 border-b border-gold-200/70">
            <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-gold-400 shadow-glow-gold bg-pine-950 flex items-center justify-center p-0.5">
              <img
                src="/dragon-treasure-logo.jpg"
                alt="Dragon Treasure Crest"
                className="w-full h-full object-cover scale-[1.10]"
              />
            </div>
            
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-pine-900 tracking-tight">
                Dragon Treasure
              </h1>
              <p className="text-xs uppercase tracking-widest text-gold-700 font-bold mt-0.5">
                Administration Portal
              </p>
            </div>

            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Property management console for Baguio transient rooms, dormitory leases, and guest reservations.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-pine-950 uppercase tracking-wider block">
                Staff Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pine-700">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 focus:border-pine-700 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-pine-950 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pine-700">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pine-700 focus:border-pine-700 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button matching main site shimmer-btn */}
            <button
              type="submit"
              disabled={isLoading}
              className="shimmer-btn w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pine-900 via-pine-800 to-pine-900 hover:from-pine-800 hover:to-pine-950 active:scale-98 shadow-md hover:shadow-glow-pine transition-all duration-300 flex items-center justify-center gap-2 border border-pine-700/50 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating staff credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </>
              )}
            </button>
          </form>

          {/* Administrative Access Hint & Quick Fill */}
          <div className="mt-6 pt-5 border-t border-gold-200/70 text-center space-y-2">
            <div className="text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Default Administrative Access:</span>
            </div>
            
            <button
              type="button"
              onClick={handleUseDefaultCredentials}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-100/90 hover:bg-gold-200 text-xs font-mono text-gold-950 border border-gold-300/90 transition-all cursor-pointer shadow-2xs"
            >
              <span className="font-bold">admin</span>
              <span className="text-gold-500">/</span>
              <span className="font-bold">admin123</span>
              <span className="text-[10px] uppercase font-sans text-white bg-pine-900 px-1.5 py-0.5 rounded font-bold ml-1">
                Auto-Fill
              </span>
            </button>
          </div>

        </div>

        {/* Security Notice Note */}
        <p className="text-center text-[11px] text-slate-600 mt-4 font-medium">
          Dragon Treasure Transient & Condotel Administration • Baguio City
        </p>

      </div>
    </div>
  );
};
