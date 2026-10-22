import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Search, 
  Lock, 
  MessageCircle, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';

export const Navbar = ({
  activeMode,
  setActiveMode,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
  currency = '₦',
  whatsappNumber = '07068371295',
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent("Hello ROMEE Go-Bite Eatery! I'd like to make an inquiry.")}`;

  return (
    <header className="bg-petrol-900 border-b border-petrol-800/80 sticky top-0 z-40 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Styled like Foodel in screenshot */}
          <div 
            onClick={() => onNavigateSection('hero')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-full bg-mustard flex items-center justify-center text-petrol-950 font-black shadow-md">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ROMEE
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-mustard bg-petrol-950/60 px-2 py-0.5 rounded-full border border-mustard/30">
                Go-Bite
              </span>
            </div>
          </div>

          {/* Center Navigation Links - Styled like reference image */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide">
            <button
              onClick={() => onNavigateSection('hero')}
              className="text-white hover:text-mustard transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigateSection('popular')}
              className="text-slate-200 hover:text-mustard transition-colors"
            >
              Popular Dishes
            </button>
            <button
              onClick={() => onNavigateSection('book-table')}
              className="text-slate-200 hover:text-mustard transition-colors"
            >
              Reservation / Table
            </button>
            <button
              onClick={() => onNavigateSection('regular-menu')}
              className="text-slate-200 hover:text-mustard transition-colors flex items-center gap-1.5"
            >
              <span>Our Menu</span>
              <span className="w-2 h-2 rounded-full bg-mustard"></span>
            </button>
            <button
              onClick={() => onNavigateSection('outlets')}
              className="text-slate-200 hover:text-mustard transition-colors"
            >
              Branches
            </button>
            <button
              onClick={() => onNavigateSection('faqs')}
              className="text-slate-200 hover:text-mustard transition-colors"
            >
              FAQs
            </button>
          </nav>

          {/* Right Action Icons: Search, WhatsApp Contact Us, Cart, Admin */}
          <div className="flex items-center gap-3">
            
            {/* Search Input on Desktop */}
            <div className="relative hidden lg:block w-44">
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-petrol-950/70 border border-petrol-700 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-mustard transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-300 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="lg:hidden p-2 text-slate-200 hover:text-mustard"
              title="Search menu"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Contact Us / WhatsApp Pill Button matching screenshot */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300/40 hover:border-mustard text-xs font-semibold hover:text-mustard transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-mustard" />
              <span>Contact us</span>
            </a>

            {/* Shopping Plate / Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold px-3.5 sm:px-4 py-2 rounded-full text-xs shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">
                {currency}{cartTotal.toLocaleString()}
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-petrol-950 text-white text-[10px] font-black flex items-center justify-center -ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-300 hover:text-mustard hover:bg-petrol-800 rounded-full transition-all"
              title="Admin & Pricing Dashboard"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-mustard focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {showSearchInput && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search swallows, rice, combos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <Search className="w-4 h-4 text-mustard absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-petrol-800 bg-petrol-950 text-xs space-y-2">
            <button
              onClick={() => {
                onNavigateSection('popular');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-200 hover:text-mustard rounded-lg"
            >
              Popular Dishes
            </button>
            <button
              onClick={() => {
                onNavigateSection('book-table');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-200 hover:text-mustard rounded-lg"
            >
              Book A Table / Seated Order
            </button>
            <button
              onClick={() => {
                onNavigateSection('regular-menu');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-200 hover:text-mustard rounded-lg"
            >
              Our Regular Menu
            </button>
            <button
              onClick={() => {
                onNavigateSection('outlets');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-200 hover:text-mustard rounded-lg"
            >
              Our Outlets & Branches
            </button>
            <button
              onClick={() => {
                onNavigateSection('faqs');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-200 hover:text-mustard rounded-lg"
            >
              FAQs
            </button>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2 text-emerald-400 hover:bg-petrol-900 rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us: 07068371295</span>
            </a>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-mustard hover:bg-petrol-900 rounded-lg flex items-center gap-2 border-t border-petrol-800 pt-3"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Management</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
