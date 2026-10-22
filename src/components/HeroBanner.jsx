import React from 'react';
import { UtensilsCrossed, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const HeroBanner = ({
  activeMode,
  setActiveMode,
  categories,
  selectedCategory,
  setSelectedCategory,
  _itemCount,
}) => {
  const isDineIn = activeMode === 'dinein';

  return (
    <div className="relative py-8 px-4 sm:px-6 lg:px-8 border-b border-gold/15 bg-gradient-to-b from-navy-900/60 to-navy-950/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isDineIn 
                  ? 'bg-gold/15 text-gold border border-gold/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isDineIn ? <UtensilsCrossed className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isDineIn ? 'Dine-In Menu' : 'Go Bites Menu'}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-gold/70" />
                {isDineIn ? 'Table Service' : 'Express Takeaway (3-5 mins)'}
              </span>

              <span className="text-xs text-emerald-400 flex items-center gap-1 ml-2">
                <CheckCircle2 className="w-3 h-3" />
                Kitchen Open Now
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {isDineIn ? (
                <>Traditional Swallows, Catfish & <span className="gold-gradient-text">Plated Specialties</span></>
              ) : (
                <>Fast Takeaway Combos, Rice Boxes & <span className="gold-gradient-text">Gourmet Snacks</span></>
              )}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl">
              {isDineIn 
                ? 'Indulge in authentic Nigerian hospitality. Select dishes to build your plate, then input your table number for direct table service.' 
                : 'Speed, quality, and flavor packed in ready-to-go meal boxes. Please note: swallows are exclusively served in the Dine-In lounge.'}
            </p>
          </div>

          {/* Quick Mode Toggle Switch on Header */}
          <div className="flex items-center self-start md:self-auto bg-navy-950 p-1 rounded-full border border-gold/30 shadow-gold-sm">
            <button
              onClick={() => setActiveMode('dinein')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isDineIn
                  ? 'bg-gold text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Dine-In</span>
            </button>
            <button
              onClick={() => setActiveMode('gobites')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                !isDineIn
                  ? 'bg-gold text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Go Bites</span>
            </button>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-gold to-gold-600 text-navy-950 font-bold shadow-gold-sm scale-105'
                  : 'bg-navy-900/90 text-slate-300 hover:text-gold hover:bg-navy-800 border border-gold/20'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {cat.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-navy-950/20 text-navy-950' : 'bg-navy-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
