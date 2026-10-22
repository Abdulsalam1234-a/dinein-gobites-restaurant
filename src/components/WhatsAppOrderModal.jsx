import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WhatsAppOrderModal = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A84C', '#E5C368', '#0A1F44', '#FFFFFF']
        });
      } catch (e) {
        // Fallback silently if canvas not available
      }
    }
  }, [isOpen]);

  if (!isOpen || !orderDetails) return null;

  const { rawMessage, whatsappUrl, mode } = orderDetails;
  const isDineIn = mode === 'dinein';

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-navy-950/85 backdrop-blur-md animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-navy-900 border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-lg">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-white mb-1">
            Order Ready to Dispatch!
          </h2>
          <p className="text-xs text-slate-300">
            Your {isDineIn ? 'Dine-In table' : 'Go Bites takeaway'} order has been compiled. Click below to send it to our kitchen on WhatsApp.
          </p>
        </div>

        {/* WhatsApp Message Preview Box */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] text-gold-300 mb-1.5 font-semibold">
            <span>WhatsApp Message Preview:</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-gold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-navy-950 border border-gold/25 rounded-2xl p-4 text-[11px] font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap max-h-56 scrollbar-thin">
            {rawMessage}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.01]"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Open in WhatsApp Now</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold border border-gold/20 transition-all"
          >
            Return to Menu
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-4">
          If WhatsApp does not open automatically, click <strong>"Copy Text"</strong> above and paste it directly into our WhatsApp chat.
        </p>

      </div>
    </div>
  );
};
