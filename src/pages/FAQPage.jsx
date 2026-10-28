import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Phone, 
  Search,
  ShieldCheck,
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';
import { Link } from 'react-router-dom';

export const FAQPage = ({ whatsappNumber = '07068371295' }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent("Hello ROMEE Support! I have a question regarding my order/visit.")}`;

  const filteredFaqs = FAQ_DATA.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 pb-24">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Help Desk & Guest Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Frequently Asked <br />
            <span className="text-mustard">Questions</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our Dine-In swallow service, Go-Bites express combos, WhatsApp checkout, and outlet operations.
          </p>
        </div>
      </section>

      {/* 2. Search & FAQ Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 text-left">
        
        {/* Search Input Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-card-elevated border border-slate-100 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search frequently asked questions (e.g. swallows, combos, delivery, payment)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sage"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No matching questions found</p>
              <p className="text-xs text-slate-500">
                Have a unique inquiry? Speak directly with our restaurant team on WhatsApp.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-petrol-900/10 text-petrol-900 font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                        {faq.question}
                      </h3>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Immediate Support Card */}
        <div className="mt-12 bg-gradient-to-r from-petrol-900 via-petrol-950 to-petrol-900 text-white rounded-3xl p-8 border border-mustard/30 shadow-card-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-mustard uppercase tracking-wider block">
              Still Have Questions?
            </span>
            <h4 className="text-xl font-serif font-bold text-white">
              Talk Directly with Our Floor Manager
            </h4>
            <p className="text-slate-300 text-xs">
              We are online on WhatsApp to answer questions, customize corporate trays, or take special requests.
            </p>
          </div>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat 07068371295</span>
          </a>
        </div>

      </section>

    </div>
  );
};
