import React from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

export const MobileAppPromo = ({ whatsappNumber = '07068371295' }) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent("Hello ROMEE Go-Bite Eatery! I'd like to order directly.")}`;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Yellow Promo Banner matching screenshot */}
      <div className="relative bg-gradient-to-r from-mustard via-[#F6C343] to-mustard rounded-3xl p-8 sm:p-12 shadow-card-elevated overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Floating food cutout on top left */}
        <div className="absolute top-4 left-6 hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
            alt="Burger Snack"
            className="w-16 h-16 rounded-full object-cover shadow-md transform -rotate-12"
          />
        </div>

        {/* Left Information */}
        <div className="max-w-xl text-left space-y-4 text-petrol-950 z-10">
          
          <span className="inline-block px-3 py-1 rounded-full bg-petrol-950 text-white text-[10px] font-bold uppercase tracking-wider">
            Express Order Flow
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-petrol-950 leading-tight">
            Order Directly on <br />
            <span className="underline decoration-petrol-950/40">WhatsApp or Web</span>
          </h2>

          <p className="text-xs sm:text-sm font-medium text-petrol-900 leading-relaxed">
            Get your meals prepared hot and dispatched rapidly. Simply compile your order, select your table or delivery location, and submit directly to our kitchen line at <strong>07068371295</strong>.
          </p>

          {/* Social Proof Avatars */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Diner" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Diner" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Diner" />
            </div>
            <span className="text-xs font-bold text-petrol-950">
              5,000+ Happy Foodies in Lagos
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-petrol-950 hover:bg-petrol-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Kitchen (07068371295)</span>
            </a>
          </div>

        </div>

        {/* Right Phone Mockup - Exact Match to Design */}
        <div className="relative z-10 flex justify-center items-center">
          
          <div className="w-64 sm:w-72 bg-white rounded-[38px] p-3 shadow-2xl border-4 border-slate-900/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            
            {/* Phone Screen Container */}
            <div className="w-full bg-slate-50 rounded-[30px] overflow-hidden border border-slate-200 p-4 text-center">
              
              {/* Phone Speaker Notch */}
              <div className="w-16 h-3 bg-slate-300 rounded-full mx-auto mb-3" />

              {/* Chef Picture inside phone */}
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-mustard shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"
                  alt="Chef"
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-serif font-bold text-xs text-slate-800">
                The Fastest in Delivery Food
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 mb-3">
                Hot swallows & express combo packs delivered in under 20 mins.
              </p>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kitchen Online & Ready</span>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold block shadow-sm"
              >
                Get Started
              </a>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
