import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BookTableBar } from '../components/BookTableBar';
import { PopularDishesSection } from '../components/PopularDishesSection';
import { HomeAmbienceSection } from '../components/HomeAmbienceSection';
import { MobileAppPromo } from '../components/MobileAppPromo';
import { useNavigate } from 'react-router-dom';
import { Utensils, Zap, ArrowRight, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export const HomePage = ({
  menuItems,
  onAddToCart,
  currency,
  activeMode,
  setActiveMode,
  onSelectTable,
  whatsappNumber,
  ambienceMedia = [],
}) => {
  const navigate = useNavigate();

  const handleExploreFood = () => {
    navigate('/menu');
  };

  const handleBookTableSubmit = () => {
    navigate('/menu');
  };

  return (
    <div className="space-y-0">
      
      {/* 1. Curved Hero Section: "We serve the taste you love" */}
      <HeroSection
        onExploreFood={handleExploreFood}
        onOpenWhatsAppGuide={() => {
          const el = document.getElementById('home-mobile-promo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Floating Overlapping Book Table Bar */}
      <BookTableBar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onSelectTable={onSelectTable}
        onExploreMenu={handleBookTableSubmit}
      />

      {/* 3. Popular Dishes Carousel with 3 plates */}
      <PopularDishesSection
        items={menuItems}
        onAddToCart={onAddToCart}
        currency={currency}
      />

      {/* 4. Live Ambience & Behind The Scenes Banner (Kitchen, Seating, Go-Bites Videos/Photos) */}
      <HomeAmbienceSection
        ambienceMedia={ambienceMedia}
      />

      {/* 5. Dual Outlet Experience Banner - Highlighting Dine-In vs Go-Bites */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-petrol-900 text-white rounded-3xl p-8 sm:p-12 border border-petrol-800 shadow-card-elevated relative overflow-hidden">
          
          <div className="max-w-3xl text-left space-y-3 mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-mustard text-petrol-950 text-[10px] font-black uppercase tracking-wider">
              Two Unique Dining Concepts
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
              Choose How You Want To Feast Today
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Whether you are craving steaming hot swallows served at our tranquil Dine-In Lounge or speedy rice combos at our Go-Bites Express Counter, ROMEE has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Dine In Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-petrol-950/70 border border-mustard/30 space-y-4 hover:border-mustard transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-mustard/20 flex items-center justify-center text-mustard">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Dine-In Lounge (Swallows & Plated Feasts)
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Sit back in air-conditioned luxury. Relish authentic hand-kneaded <strong>Amala Dudu, Semovita, Eba, and Pounded Yam</strong> paired with piping-hot Efo Riro, Egusi, fresh Catfish, and fried Panla fish.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">✓ Full seated table service & VIP booth lounges</li>
                <li className="flex items-center gap-2">✓ Slow-simmered goat meat, catfish & assortment</li>
                <li className="flex items-center gap-2">✓ Perfect for family dinners and business meetings</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveMode('dinein');
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>Explore Dine-In Swallows</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Go Bites Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-petrol-950/70 border border-sage/40 space-y-4 hover:border-sage transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Go Bites Express (Combos & Fast Packs)
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                On the move? Order our speedy meal combos. <strong>Beefcombo, Chickencombo, Ofada combo, Spicy Spaghetti combo, gourmet Moi Moi</strong>, and quick snacks. Packed hot in insulated containers.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">✓ Strictly zero swallows: 100% fast takeout focus</li>
                <li className="flex items-center gap-2">✓ Ready in under 5 minutes at our express counter</li>
                <li className="flex items-center gap-2">✓ Fast doorstep dispatch to office or home</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveMode('gobites');
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>Explore Go Bites Combos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Mobile App Promo / WhatsApp Checkout Banner */}
      <div id="home-mobile-promo">
        <MobileAppPromo 
          whatsappNumber={whatsappNumber}
        />
      </div>

    </div>
  );
};
