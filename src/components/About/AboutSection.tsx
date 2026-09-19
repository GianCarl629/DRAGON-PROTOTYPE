import React from 'react';
import { PROPERTY_INFO } from '../../data/mockData';
import { MapPin, Building2, BookOpen, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story Images Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-cream-100">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
                alt="Dragon Treasure Lodging Atmosphere"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-cedar-300 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Baguio City, Benguet</span>
                </div>
                <h3 className="font-serif text-xl font-bold">
                  City of Pines Hospitality
                </h3>
              </div>
            </div>

            {/* Overlapping floating highlight card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-elevated border border-slate-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-md flex-shrink-0 bg-pine-950">
                  <img
                    src="/dragon-treasure-logo.jpg"
                    alt="Dragon Treasure Official Logo"
                    className="w-full h-full object-cover scale-[1.09]"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dragon Treasure</h4>
                  <p className="text-xs text-slate-600">Transient Lodging & Condotel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-100 text-pine-800 text-xs font-semibold tracking-wide uppercase">
              <BookOpen className="w-3.5 h-3.5 text-pine-600" />
              <span>About The Property</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pine-950 leading-tight">
              A Welcoming Haven for Travelers and Students Alike
            </h2>

            <p className="text-base text-slate-700 leading-relaxed font-normal">
              <span className="font-semibold text-pine-900">{PROPERTY_INFO.name}</span> is a lodging property located in <span className="font-semibold text-slate-800">Baguio City, Benguet</span> that specializes in providing comfortable short-term accommodations for visiting tourists and budget-friendly monthly dormitory rentals for students, reviewers, and local workers.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We understand the dual needs of our highland community: vacationers wanting a tranquil, accessible home base to tour Baguio's sights, and students or professionals seeking a dependable, study-friendly environment with hot showers, high-speed Wi-Fi, and 24/7 security.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-pine-700 flex-shrink-0 mt-0.5" />
                <span><strong>Short-Term Transient:</strong> Fully furnished rooms with flexible bed arrangements, private hot showers, and cable TV.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-pine-700 flex-shrink-0 mt-0.5" />
                <span><strong>Monthly Dormitory:</strong> Secure shared spaces with individual lockers, study areas, full common kitchen access, and laundry provisions.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-pine-700 flex-shrink-0 mt-0.5" />
                <span><strong>Safe & Accessible:</strong> Round-the-clock caretaker support and strategic access to public transit routes across Baguio.</span>
              </div>
            </div>

            {/* Capstone Prototype Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Capstone Project Note:</span> This interface is part of the Web-Based Hybrid Booking, Dormitory Management, and Billing System prototype for Dragon Treasure Transient & Condotel.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
