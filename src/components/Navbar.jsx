import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Search, 
  Lock, 
  MessageCircle, 
  Menu as MenuIcon, 
  X, 
  Sparkles,
  MapPin,
  HelpCircle
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
  whatsappNumber = '2348012345678',
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Royal Gold Eatery! I'd like to make an inquiry.")}`;

  return (
    <header className="sticky top-0 z-40 bg-navy-950/85 backdrop-blur-md border-b border-gold/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Crest */}
          <div 
            onClick={() => onNavigateSection('hero')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 via-gold to-gold-600 p-[2px] shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-gold transition-colors duration-300 group-hover:text-gold-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-gold-200 transition-colors">
                  ROMEE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/30">
                  Go-Bite Eatery
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                Dine-In Lounge & Express Bites
              </p>
            </div>
          </div>

          {/* Center Mode Switcher: DINE-IN vs GO BITES */}
          <div className="hidden md:flex items-center bg-navy-900/90 p-1.5 rounded-full border border-gold/30 shadow-inner">
            <button
              onClick={() => setActiveMode('dinein')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeMode === 'dinein'
                  ? 'bg-gradient-to-r from-gold to-gold-600 text-navy-950 shadow-gold-sm font-bold scale-[1.02]'
                  : 'text-slate-300 hover:text-gold hover:bg-navy-800/50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>DINE-IN LOUNGE</span>
              {activeMode === 'dinein' && (
                <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveMode('gobites')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeMode === 'gobites'
                  ? 'bg-gradient-to-r from-gold to-gold-600 text-navy-950 shadow-gold-sm font-bold scale-[1.02]'
                  : 'text-slate-300 hover:text-gold hover:bg-navy-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>GO BITES EXPRESS</span>
              {activeMode === 'gobites' && (
                <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Right Action Icons: Search, Cart, WhatsApp, Admin */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Search Input on Desktop */}
            <div className="relative hidden lg:block w-48 xl:w-60">
              <input
                type="text"
                placeholder={`Search ${activeMode === 'dinein' ? 'swallows, fish, rice...' : 'combos, snacks, moi moi...'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900/80 border border-gold/25 rounded-full py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <Search className="w-4 h-4 text-gold/70 absolute left-3 top-2.5 pointer-events-none" />
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
              className="lg:hidden p-2 text-slate-300 hover:text-gold transition-colors"
              title="Search menu"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Quick Link */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-medium hover:bg-emerald-900/40 transition-colors"
              title="Chat with Reception"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Plate / Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-gold-500/20 to-gold/30 hover:from-gold-500/30 hover:to-gold/40 border border-gold/40 px-3.5 sm:px-4 py-2 rounded-full text-gold-300 font-semibold transition-all duration-300 hover:shadow-gold-sm hover:scale-[1.03]"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  {activeMode === 'dinein' ? 'Your Plate' : 'Your Bag'}
                </span>
                <span className="text-xs font-bold text-gold-200">
                  {currency}{cartTotal.toLocaleString()}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-400 hover:text-gold hover:bg-navy-900/60 rounded-full border border-transparent hover:border-gold/20 transition-all"
              title="Admin & Pricing Dashboard"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-gold focus:outline-none"
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
                placeholder={`Search ${activeMode === 'dinein' ? 'swallows, catfish, rice...' : 'combos, snacks...'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-gold/40 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <Search className="w-4 h-4 text-gold absolute left-3.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold/20 bg-navy-950/95 backdrop-blur-xl animate-in slide-in-from-top-2">
            
            {/* Mode Toggle on Mobile */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-navy-900 rounded-xl mb-4 border border-gold/30">
              <button
                onClick={() => {
                  setActiveMode('dinein');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'dinein'
                    ? 'bg-gold text-navy-950 shadow-gold-sm'
                    : 'text-slate-300'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dine-In Lounge</span>
              </button>
              <button
                onClick={() => {
                  setActiveMode('gobites');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeMode === 'gobites'
                    ? 'bg-gold text-navy-950 shadow-gold-sm'
                    : 'text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go Bites Express</span>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <button
                onClick={() => {
                  onNavigateSection('menu');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-gold hover:bg-navy-900 rounded-lg flex items-center justify-between"
              >
                <span>Explore Full Menu</span>
                <span className="text-xs text-gold capitalize">{activeMode}</span>
              </button>
              <button
                onClick={() => {
                  onNavigateSection('outlets');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-gold hover:bg-navy-900 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-gold" />
                <span>Our Outlets & Branches</span>
              </button>
              <button
                onClick={() => {
                  onNavigateSection('faqs');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-gold hover:bg-navy-900 rounded-lg flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>Frequently Asked Questions</span>
              </button>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 text-emerald-400 hover:bg-emerald-950/40 rounded-lg flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Manager on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gold/80 hover:text-gold hover:bg-navy-900 rounded-lg flex items-center gap-2 border-t border-gold/10 pt-3"
              >
                <Lock className="w-4 h-4" />
                <span>Admin & Product Pricing</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
