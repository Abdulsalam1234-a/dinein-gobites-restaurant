import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  CreditCard, 
  UtensilsCrossed, 
  Sparkles, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { OUTLETS_DATA } from '../data/outletsData';

export const OutletsSection = ({ whatsappNumber = '2348012345678' }) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="outlets" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gold/15">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/30 bg-navy-900 text-gold text-xs font-bold uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5" />
          Our Physical Locations
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
          Branches & <span className="gold-gradient-text">Dual Outlets</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Our main branch features two distinct culinary destinations under one roof: our elegant Dine-In Lounge and the fast Go Bites Express counter. Visit us or order directly for dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {OUTLETS_DATA.map((branch) => (
          <div
            key={branch.id}
            className="bg-glass-card rounded-3xl border border-gold/25 p-6 sm:p-8 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-gold-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                    {branch.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-slate-400">{branch.tagline}</p>
                </div>
              </div>

              {/* Address & Meta */}
              <div className="space-y-2 mb-6 text-xs text-slate-300 pt-2 border-t border-gold/15">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>{branch.phone}</span>
                </div>
              </div>

              {/* Sub Outlets within this branch */}
              <div className="space-y-3 mb-6">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gold-300 block">
                  Outlets & Services Here:
                </span>
                {branch.outlets.map((outlet, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-navy-950/70 border border-gold/15">
                    <div className="flex items-center gap-2 mb-1">
                      {outlet.type === 'dinein' ? (
                        <UtensilsCrossed className="w-3.5 h-3.5 text-gold" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <h4 className="text-xs font-bold text-white">
                        {outlet.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                      {outlet.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {outlet.features.map((feat, fIdx) => (
                        <span key={fIdx} className="text-[10px] bg-navy-900 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gold" /> Accepted Payments
                </span>
                <div className="flex flex-wrap gap-2">
                  {branch.payments.map((p, pIdx) => (
                    <span key={pIdx} className="text-[11px] px-2.5 py-1 rounded-lg bg-navy-950 text-slate-200 border border-gold/20">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Branch Actions */}
            <div className="pt-4 border-t border-gold/20 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello, I would like directions or reservations for ${branch.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold to-gold-500 hover:from-gold-400 hover:to-gold-600 px-4 py-2 rounded-full transition-all shadow-gold-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Branch</span>
              </a>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};
