import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getActiveTheme } from '../utils/theme';

export const WelcomeModal = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const navigate = useNavigate();

  const theme = getActiveTheme(settings?.theme || 'classic');

  useEffect(() => {
    // Check if popup is enabled in admin settings
    if (settings?.welcomePopupEnabled === false) {
      return;
    }

    // Check localStorage for dismissal within the last 24 hours
    try {
      const dismissedUntil = localStorage.getItem('romee_welcome_dismissed_until');
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return; // Suppressed for 24 hours
      }
    } catch {
      // fallback
    }

    // Small delay for smooth entrance after page paints
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [settings?.welcomePopupEnabled]);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        // Suppress for 24 hours
        localStorage.setItem(
          'romee_welcome_dismissed_until',
          (Date.now() + 24 * 60 * 60 * 1000).toString()
        );
      } catch (e) {
        console.error(e);
      }
    }
    setIsOpen(false);
  };

  const handleExploreMenu = () => {
    handleClose();
    navigate('/menu');
  };

  const handleWhatsAppDirect = () => {
    handleClose();
    const cleanPhone = (settings?.whatsappNumber || '07068371295').replace(/[^0-9]/g, '');
    const wa = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;
    const msg = `Hello ROMEE Go-Bite Eatery! 🍲 I am visiting your website and would like to place an order or inquire about your menu.`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  const headline = settings?.welcomeHeadline || 'Welcome to ROMEE Go-Bite Eatery! 🍲';
  const subtitle = settings?.welcomeSubtitle || 'Home of steaming authentic swallows (Amala, Semo, Pounded Yam) & express takeaway favorites (Jollof, Fried Rice, Moi Moi).';
  const promoBadge = settings?.welcomePromoBadge || '🔥 Special Welcome Offer';
  const promoText = settings?.welcomePromoText || 'Enjoy complimentary fast packaging or 10% discount on bulk orders above ₦15,000!';
  const buttonText = settings?.welcomeButtonText || 'Explore Menu & Order Now';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-petrol-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-scaleUp transform transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Banner matching Active Theme */}
        <div className={`p-6 bg-gradient-to-r ${theme.headerBg} text-white relative overflow-hidden`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/25 text-white/90 hover:text-white hover:bg-black/40 transition-colors"
            aria-label="Close welcome modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Logo & Theme badge */}
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/80 border border-white/20 p-1 shrink-0 shadow-lg">
              <img src="/images/romee-logo.jpg" alt="ROMEE Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <span className="text-base">{theme.icon}</span>
                <span>{theme.name}</span>
              </div>
              <p className="text-[10px] text-white/80 italic mt-0.5 font-medium">...serving the difference</p>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
            {headline}
          </h2>

          <p className="text-white/80 text-xs sm:text-sm mt-2 leading-relaxed max-w-md">
            {subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Promo Offer Box */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md inline-block">
                {promoBadge}
              </span>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {promoText}
              </p>
            </div>
          </div>

          {/* Branch Outlets Highlight */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-petrol-900 font-bold text-xs">
                <UtensilsCrossed className="w-3.5 h-3.5 text-mustard" />
                <span>Dine-In Lounge</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Seated swallows: Amala, Semo, Pounded Yam & Soups.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-petrol-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Go-Bites Express</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Quick combos: Jollof, Fried Rice, Spaghetti, Moi Moi.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleExploreMenu}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] ${theme.buttonBg}`}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppDirect}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Order via WhatsApp ({settings?.whatsappNumber || '07068371295'})</span>
            </button>
          </div>

          {/* Footer with "Don't show again today" checkbox */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-petrol-900 focus:ring-mustard border-slate-300"
              />
              <span>Don't show again today</span>
            </label>

            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 underline transition-colors"
            >
              Skip
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
