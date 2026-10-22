import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export const HeroSection = ({ onExploreFood, onOpenWhatsAppGuide }) => {
  return (
    <section id="hero" className="relative bg-petrol-900 text-white overflow-hidden pt-8 pb-32 sm:pb-36 px-4 sm:px-6 lg:px-8 hero-curved-bottom">
      
      {/* Decorative background aura */}
      <div className="absolute top-10 right-20 w-96 h-96 bg-petrol-700/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Content - Exact Match to Design */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/60 border border-mustard/30 text-mustard text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to ROMEE Go-Bite Eatery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.15] text-white">
            We serve the taste <br className="hidden sm:inline" />
            <span className="text-mustard">you love</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed">
            This is an authentic Afro-fusion restaurant serving steaming hot swallows (Amala, Semovita, Eba, Pounded Yam) in our seated Dine-In Lounge, and fast delicious rice combos & snacks at Go Bites Express.
          </p>

          {/* Action Buttons - Matching Design */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreFood}
              className="px-7 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
            >
              Explore Food
            </button>

            <button
              onClick={onOpenWhatsAppGuide}
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-mustard transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-mustard flex items-center justify-center text-white group-hover:text-petrol-950 transition-all shadow-sm">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span className="underline decoration-mustard/60 underline-offset-4">How to order on WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Right Circular Platter with Halo Rings - Exact Match to Design */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          
          {/* Outer Concentric Halo Rings */}
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Green halo layer */}
            <div className="absolute inset-0 rounded-full bg-[#3FB584] opacity-90 scale-100" />
            
            {/* Yellow halo ring layer */}
            <div className="absolute inset-3 rounded-full bg-mustard opacity-95 scale-95" />

            {/* Inner Red Rim Plate Layer */}
            <div className="absolute inset-7 rounded-full bg-[#B91C1C] p-1.5 shadow-2xl scale-95 flex items-center justify-center">
              
              {/* Main Circular Food Dish */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner relative group">
                <img
                  src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"
                  alt="Signature Dish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

            </div>

            {/* Floating garnish leaf cutouts around the plate */}
            <div className="absolute -top-4 -left-2 w-14 h-14 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-emerald-400/40 text-xl animate-bounce">
              🌿
            </div>
            <div className="absolute -bottom-3 -right-2 w-12 h-12 bg-amber-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-amber-400/40 text-lg">
              🌶️
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-md text-base">
              🥬
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
