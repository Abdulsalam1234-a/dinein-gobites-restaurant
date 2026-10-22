import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';

export const FAQSection = ({ whatsappNumber = '2348012345678' }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="faqs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gold/15">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/30 bg-navy-900 text-gold text-xs font-bold uppercase tracking-widest mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          Got Questions?
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
          Frequently Asked <span className="gold-gradient-text">Questions</span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          Everything you need to know about our Dine-In Lounge, Go Bites express takeaway, ordering via WhatsApp, and catering.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-navy-900/90 border-gold/40 shadow-gold-sm' 
                  : 'bg-navy-950/60 border-gold/15 hover:border-gold/30'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-white">
                  {faq.question}
                </span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'bg-gold text-navy-950 rotate-180' : 'bg-navy-900 text-gold'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-gold/10 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions prompt */}
      <div className="mt-10 p-6 rounded-3xl bg-glass-card border border-gold/30 text-center max-w-xl mx-auto">
        <p className="text-sm font-bold text-white mb-1">Still have a question or special diet request?</p>
        <p className="text-xs text-slate-400 mb-4">Our team is available right now on WhatsApp to answer your inquiries.</p>
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello! I have a question about Royal Gold Eatery.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask Us on WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
