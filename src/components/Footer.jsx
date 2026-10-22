import React from 'react';
import { UtensilsCrossed, Clock, MessageCircle, Lock } from 'lucide-react';

export const Footer = ({ onNavigateSection, onOpenAdmin, whatsappNumber = '2348012345678' }) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-navy-950 border-t border-gold/20 pt-16 pb-12 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-gold" />
                </div>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                ROMEE Go-Bite
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Serving the finest Nigerian cuisine across our seated Dine-In Lounge and rapid Go Bites Express counters. Authentic flavors, unmatched hygiene, and warm hospitality.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer Care</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigateSection('hero')} 
                  className="hover:text-gold transition-colors"
                >
                  Home / Welcome Splash
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('menu')} 
                  className="hover:text-gold transition-colors"
                >
                  Our Complete Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('outlets')} 
                  className="hover:text-gold transition-colors"
                >
                  Branches & Outlets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('faqs')} 
                  className="hover:text-gold transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAdmin} 
                  className="hover:text-gold transition-colors flex items-center gap-1.5 text-gold/80"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Outlets & Branches */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold">
              Our Locations
            </h4>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-white">Main Branch (Dual Outlets)</p>
                <p className="text-slate-400 text-[11px]">Dine-In Lounge & Go Bites Counter</p>
                <p className="text-slate-400 text-[11px]">14 Admiralty Way, Lekki / VI, Lagos</p>
              </div>
              <div>
                <p className="font-bold text-white">Express Depot (Branch 2)</p>
                <p className="text-slate-400 text-[11px]">Fast Takeaway & Delivery Hub</p>
                <p className="text-slate-400 text-[11px]">28 Allen Avenue, Ikeja, Lagos</p>
              </div>
            </div>
          </div>

          {/* Col 4: Operating Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold">
              Service Hours
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Mon – Sat: 7:30 AM – 10:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Sundays: 9:00 AM – 10:00 PM</span>
              </div>
              <div className="pt-2 text-[11px] text-gold-300">
                ✨ Live kitchen preparation daily.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ROMEE Go-Bite Eatery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern elegance for authentic African culinary excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
