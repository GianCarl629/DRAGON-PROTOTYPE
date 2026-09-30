import React from 'react';
import { Phone, Mail, Clock, MapPin, ExternalLink, ShieldCheck, Heart, ArrowUp, Sparkles } from 'lucide-react';
import { DEMO_CONTACT, PROPERTY_INFO } from '../../data/mockData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-pine-950 text-slate-300 pt-20 pb-12 border-t-2 border-gold-500/40 relative overflow-hidden">
      {/* Decorative radial lighting in footer */}
      <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[300px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-pine-900">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/90 shadow-glow-gold bg-pine-950 flex-shrink-0">
                <img
                  src="/dragon-treasure-logo.jpg"
                  alt="Dragon Treasure Transient & Condotel Logo"
                  className="w-full h-full object-cover scale-[1.10]"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-white tracking-tight">
                  {PROPERTY_INFO.name}
                </span>
                <p className="text-xs text-gold-400 font-medium tracking-wide">
                  Transient Lodging & Monthly Condotel • {PROPERTY_INFO.location}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300/90 max-w-sm leading-relaxed font-normal">
              {PROPERTY_INFO.description} Enjoy our peaceful mountain sanctuary designed for both vacationers and students in the City of Pines.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pine-900/90 border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" strokeWidth={2} />
              <span>Comfortable Mountain Lodging & Student Accommodations</span>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Quick Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li><a href="#home" className="hover:text-gold-300 transition-colors block py-0.5">Home</a></li>
              <li><a href="#rooms" className="hover:text-gold-300 transition-colors block py-0.5">Rooms & Accommodations</a></li>
              <li><a href="#amenities" className="hover:text-gold-300 transition-colors block py-0.5">Amenities & Facilities</a></li>
              <li><a href="#why-us" className="hover:text-gold-300 transition-colors block py-0.5">Why Choose Us</a></li>
              <li><a href="#about" className="hover:text-gold-300 transition-colors block py-0.5">About Property</a></li>
              <li><a href="#location" className="hover:text-gold-300 transition-colors block py-0.5">Location & Map</a></li>
              <li><a href="#faq" className="hover:text-gold-300 transition-colors block py-0.5">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Contact Information (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Contact & Front Desk</span>
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              On-site caretaker and front assistance available during operational hours:
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-pine-900/60 border border-pine-800/80">
                <div className="w-8 h-8 rounded-lg bg-pine-800 text-gold-300 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone / Mobile</span>
                  <a href={`tel:${DEMO_CONTACT.phone}`} className="font-semibold text-white hover:text-gold-300 transition-colors">
                    {DEMO_CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-pine-900/60 border border-pine-800/80">
                <div className="w-8 h-8 rounded-lg bg-pine-800 text-gold-300 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Inquiries</span>
                  <a href={`mailto:${DEMO_CONTACT.email}`} className="font-semibold text-white hover:text-gold-300 transition-colors">
                    {DEMO_CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-pine-900/60 border border-pine-800/80">
                <div className="w-8 h-8 rounded-lg bg-pine-800 text-gold-300 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Staff Assistance Hours</span>
                  <span className="font-semibold text-white">{DEMO_CONTACT.hours}</span>
                </div>
              </div>

              <a
                href={DEMO_CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-pine-900/60 border border-pine-800/80 hover:border-gold-500/50 hover:bg-pine-900/90 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-gold-500/30 bg-pine-950">
                  <img
                    src="/facebook-icon.png"
                    alt="Facebook"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Official Facebook</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-gold-300 group-hover:text-white transition-colors text-xs sm:text-sm">
                    <span>Dragon Treasure Baguio</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Dragon Treasure Transient & Condotel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Baguio City, Benguet, Philippines
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pine-900 hover:bg-pine-800 text-gold-300 text-xs font-semibold border border-pine-800 hover:border-gold-500/40 transition-colors shadow-xs"
              title="Return to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
