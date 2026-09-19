import React from 'react';
import { Phone, Mail, Clock, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { DEMO_CONTACT, PROPERTY_INFO } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-pine-950 text-slate-300 pt-16 pb-12 border-t border-pine-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-pine-900/80">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/70 shadow-lg bg-pine-950 flex-shrink-0">
                <img
                  src="/dragon-treasure-logo.jpg"
                  alt="Dragon Treasure Transient & Condotel Logo"
                  className="w-full h-full object-cover scale-[1.09]"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white tracking-tight">
                  {PROPERTY_INFO.name}
                </span>
                <p className="text-xs text-slate-400">
                  Transient & Condotel • {PROPERTY_INFO.location}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              {PROPERTY_INFO.description}
            </p>

            <div className="inline-block px-3 py-1 rounded-lg bg-pine-900/80 border border-pine-800 text-xs text-cedar-200">
              Capstone Project: Web-Based Hybrid Booking, Dormitory Management & Billing System
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#home" className="hover:text-cedar-300 transition-colors">Home</a></li>
              <li><a href="#rooms" className="hover:text-cedar-300 transition-colors">Rooms & Inventory</a></li>
              <li><a href="#amenities" className="hover:text-cedar-300 transition-colors">Amenities & Facilities</a></li>
              <li><a href="#why-us" className="hover:text-cedar-300 transition-colors">Why Choose Us</a></li>
              <li><a href="#about" className="hover:text-cedar-300 transition-colors">About Property</a></li>
              <li><a href="#location" className="hover:text-cedar-300 transition-colors">Location & Landmarks</a></li>
              <li><a href="#faq" className="hover:text-cedar-300 transition-colors">FAQs & Policies</a></li>
            </ul>
          </div>

          {/* Demo Contact Information (4 cols) */}
          {/* DEMO CONTACT DATA ONLY - Replace with verified business credentials */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-white">
                Contact & Inquiries
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/50">
                Demo Data
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Caretaker & front assistance operational during demo hours:
            </p>

            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cedar-400 flex-shrink-0" />
                <span>{DEMO_CONTACT.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cedar-400 flex-shrink-0" />
                <span>{DEMO_CONTACT.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cedar-400 flex-shrink-0" />
                <span>Staff Hours: {DEMO_CONTACT.hours}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cedar-400 flex-shrink-0" />
                <span>{DEMO_CONTACT.city}, {DEMO_CONTACT.province}</span>
              </div>

              <div className="pt-1">
                <a
                  href={`https://${DEMO_CONTACT.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cedar-300 hover:text-white transition-colors"
                >
                  <span>{DEMO_CONTACT.facebook}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Dragon Treasure Transient & Condotel. Frontend Prototype Stage.
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            Designed with hospitality aesthetics for Baguio City visitors & students
          </p>
        </div>

      </div>
    </footer>
  );
};
