import React from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Flame,
  Award
} from 'lucide-react';

export const SplashScreen = ({ onSelectMode, _onExploreOverview }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-navy-800/40 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-gold-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Luxury Brand Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-navy-900/80 shadow-gold-sm">
          <Award className="w-4 h-4 text-gold animate-bounce" />
          <span className="text-xs uppercase font-bold tracking-widest text-gold-300">
            Welcome to ROMEE Go-Bite Eatery
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
          Where Nigerian Culinary Heritage Meets <span className="gold-gradient-text">Modern Elegance</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Select your dining experience today. Choose our relaxed <strong className="text-gold">Dine-In Lounge</strong> for hot swallows, fresh soups, and seated feasts; or grab rapid combos from <strong className="text-gold">Go Bites Express</strong> on the go.
        </p>
      </div>

      {/* Dual Experience Interactive Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl w-full mb-12">
        
        {/* CARD 1: DINE-IN LOUNGE */}
        <div 
          onClick={() => onSelectMode('dinein')}
          className="group relative bg-glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 hover:border-gold transition-all duration-500 hover:shadow-gold-md hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Top highlight glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/15 rounded-full blur-2xl group-hover:bg-gold/25 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 border border-gold/40 flex items-center justify-center shadow-gold-sm group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6 text-gold" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest bg-gold/15 text-gold px-3 py-1 rounded-full border border-gold/30">
                Seated & Relaxed
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 group-hover:text-gold-200 transition-colors">
              Dine-In Lounge
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Experience the full aroma of Nigerian hospitality. Sit back in our air-conditioned lounge or terrace while we serve steaming hot swallows, fresh catches, and rich native soups to your table.
            </p>

            {/* Specialties List */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Traditional Swallows:</strong> Semovita, Pounded Yam, Amala, Eba</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Native Soups:</strong> Egusi, Rich Efo Riro, Ogbono, Gbegiri & Ewedu</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Fish Specials:</strong> Grilled Whole Catfish & Crispy Peppered Panla</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Plated Feasts:</strong> Party Jollof, Ofada, Fried Rice & Asun</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Table Service Ordering
            </span>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold to-gold-500 px-4 py-2 rounded-full shadow-gold-sm group-hover:translate-x-1 transition-all">
              <span>Enter Lounge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* CARD 2: GO BITES EXPRESS */}
        <div 
          onClick={() => onSelectMode('gobites')}
          className="group relative bg-glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 hover:border-gold transition-all duration-500 hover:shadow-gold-md hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Top highlight glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-gold/25 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 border border-gold/40 flex items-center justify-center shadow-gold-sm group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40">
                Express Takeaway
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 group-hover:text-gold-200 transition-colors">
              Go Bites Express
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Short on time? Grab delicious chef-crafted combos, gourmet rice boxes, and warm snacks packed tight in leak-proof food containers with zero delay. <strong className="text-amber-400">Strictly no swallows.</strong>
            </p>

            {/* Specialties List */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Value Combos:</strong> Chicken Combo, Beef Combo, Ofada & Spag Combos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Rice Boxes:</strong> Smoky Party Jollof, Fried Rice & Designer Ofada Bowls</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Gourmet Moi Moi:</strong> Leaf-steamed bean cake with egg & flaked fish</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span><strong>Warm Snacks:</strong> Flaky Meat Pies, Scotch Eggs, Sausage Rolls</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gold/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Ready in 3-5 Mins
            </span>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold to-gold-500 px-4 py-2 rounded-full shadow-gold-sm group-hover:translate-x-1 transition-all">
              <span>Order Express</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Quick Feature Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-300 text-xs sm:text-sm pt-4 border-t border-gold/15 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>2 Outlets (Main Hub & Express Depot)</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Direct WhatsApp Order Dispatch</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>100% Fresh Daily Preparation</span>
        </div>
      </div>

    </section>
  );
};
