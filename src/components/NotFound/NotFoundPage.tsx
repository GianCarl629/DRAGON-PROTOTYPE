import React from 'react';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-pine-200 selection:text-pine-900 relative">
      {/* Top spacing balance */}
      <div className="w-full py-3" aria-hidden="true" />

      {/* Main Centered 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Animated Dragon GIF - Contains 404 Page Not Found */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <img
              src="/dragon-404.gif"
              alt="404 Page Not Found - Lost dragon"
              className="error-dragon w-full max-w-[460px] sm:max-w-[500px] h-auto object-contain rounded-2xl drop-shadow-sm select-none"
            />
          </div>

          <h1 className="sr-only">404 - Page Not Found</h1>

          {/* Description */}
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mt-2 sm:mt-3 leading-relaxed font-normal">
            Looks like our dragon got lost while searching for this page.
          </p>

          {/* Navigation Action: Go Back Home */}
          <div className="mt-8 flex items-center justify-center">
            <a
              href="/"
              className="home-button inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-pine-800 via-pine-900 to-pine-950 text-gold-200 hover:text-white font-semibold text-sm border border-gold-500/40 hover:border-gold-400 shadow-luxury hover:shadow-luxury-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Home className="w-4 h-4 text-gold-400" strokeWidth={2} />
              <span>Go Back Home</span>
            </a>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-slate-400 border-t border-amber-900/10">
        <p>
          &copy; {new Date().getFullYear()} Dragon Treasure Transient &amp; Condotel. Baguio City, Benguet, Philippines.
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;
