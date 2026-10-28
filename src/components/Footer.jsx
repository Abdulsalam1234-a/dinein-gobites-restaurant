import React, { useState } from 'react';
import { 
  Send, 
  Lock, 
  MessageCircle, 
  Camera 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = ({ onOpenAdmin, whatsappNumber = '07068371295' }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}`;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmailInput('');
    }
  };

  const instagramPhotos = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  ];

  return (
    <footer className="bg-[#18222F] text-slate-300 pt-16 pb-12 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12 items-start text-left">
          
          {/* Col 1: Newsletter & Socials - Matching Design (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">
              Subscribe Our <span className="text-sage">Newsletter</span>
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Stay updated with daily chef specials, weekend discounts, and fresh menu drops at ROMEE Go-Bite Eatery.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#111A24] border border-slate-700 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sage"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-sage hover:bg-sage-hover text-white transition-colors"
                title="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-sage font-bold">
                ✓ Thank you for subscribing!
              </p>
            )}

            {/* Social Icons row */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-[#111A24] flex items-center justify-center hover:text-mustard hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="w-8 h-8 rounded-lg bg-[#111A24] flex items-center justify-center hover:text-mustard hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-[#111A24] flex items-center justify-center hover:text-mustard hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-[#111A24] flex items-center justify-center hover:text-mustard hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66 0-.91-.74-1.65-1.66-1.65-.92 0-1.66.74-1.66 1.65 0 .92.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Services (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Dining Services
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/menu" className="hover:text-white transition-colors">Dine-In Lounge Swallows</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Go Bites Express Combos</Link></li>
              <li><a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Office & Bulk Catering</a></li>
              <li><Link to="/outlets" className="hover:text-white transition-colors">Table Priority Booking</Link></li>
            </ul>
          </div>

          {/* Col 3: About (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Heritage</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Managing Director & Staff</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Virtual Tour & Kitchen</Link></li>
              <li><Link to="/outlets" className="hover:text-white transition-colors">Outlets & Locations</Link></li>
              <li><button onClick={onOpenAdmin} className="text-mustard hover:underline flex items-center gap-1"><Lock className="w-3 h-3" /> Admin Portal</button></li>
            </ul>
          </div>

          {/* Col 4: Help (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Help & Support
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/faqs" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> 07068371295</a></li>
              <li className="text-slate-400">Island Hub: Victoria Island / Lekki</li>
              <li className="text-slate-400">Mainland Depot: Allen Ave, Ikeja</li>
            </ul>
          </div>

          {/* Col 5: Instagram Photo Grid (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-mustard" />
              <span>Instagram</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {instagramPhotos.map((photo, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shadow-sm group">
                  <img
                    src={photo}
                    alt="Instagram food"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ROMEE Go-Bite Eatery. All rights reserved.</p>
          <p>
            Authentic taste, rapid service, and uncompromised culinary hygiene
          </p>
        </div>

      </div>
    </footer>
  );
};
