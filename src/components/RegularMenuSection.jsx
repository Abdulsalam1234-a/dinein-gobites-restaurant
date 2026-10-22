import React, { useState } from 'react';
import { UtensilsCrossed, Sparkles, Plus, Flame, Clock } from 'lucide-react';

export const RegularMenuSection = ({
  menuItems,
  activeMode,
  setActiveMode,
  onAddToCart,
  currency = '₦',
}) => {
  const [showAllItems, setShowAllItems] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  const isDineIn = activeMode === 'dinein';

  // Filter items by activeMode
  const modeFilteredItems = menuItems.filter((item) => {
    if (isDineIn) {
      return item.channel === 'dinein' || item.channel === 'both';
    } else {
      // Go bites: strictly no swallows
      if (item.category === 'swallow') return false;
      return item.channel === 'gobites' || item.channel === 'both';
    }
  });

  // Filter by category if selected
  const categoryItems = modeFilteredItems.filter((item) => {
    if (selectedCategoryTab === 'all') return true;
    return item.category === selectedCategoryTab;
  });

  // Display subset or all
  const displayedItems = showAllItems ? categoryItems : categoryItems.slice(0, 8);

  // Split into left and right columns
  const half = Math.ceil(displayedItems.length / 2);
  const leftCol = displayedItems.slice(0, half);
  const rightCol = displayedItems.slice(half);

  return (
    <section id="regular-menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Our Regular <span className="text-sage">Menu</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore our signature recipes prepared fresh with authentic Nigerian herbs and spices
        </p>

        {/* Experience Mode Toggle Switcher - Exact Match */}
        <div className="inline-flex items-center bg-slate-200/80 p-1.5 rounded-full mt-5 shadow-inner">
          <button
            onClick={() => {
              setActiveMode('dinein');
              setSelectedCategoryTab('all');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              isDineIn
                ? 'bg-petrol-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dine-In Lounge (Swallows & Plates)</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('gobites');
              setSelectedCategoryTab('all');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              !isDineIn
                ? 'bg-mustard text-petrol-950 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Go Bites Express (Combos & Snacks)</span>
          </button>
        </div>
      </div>

      {/* Top 2 Panoramic Photos - Exact Match to Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="h-60 rounded-3xl overflow-hidden shadow-card-soft group relative">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
            alt="Master Chef in Action"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <span className="text-white font-serif font-bold text-lg">
              Fresh Daily Chef Preparation
            </span>
          </div>
        </div>

        <div className="h-60 rounded-3xl overflow-hidden shadow-card-soft group relative">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
            alt="Dine-In Restaurant Table"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <span className="text-white font-serif font-bold text-lg">
              Exclusive Seated Dining Experience
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills if expanded */}
      {showAllItems && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(isDineIn 
            ? ['all', 'swallow', 'rice', 'spaghetti', 'catfish', 'panla', 'protein', 'plantain'] 
            : ['all', 'combo', 'rice', 'spaghetti', 'moimoi', 'snack']
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryTab(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCategoryTab === cat
                  ? 'bg-petrol-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Dishes' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Two-Column Dotted Leader Menu List - Exact Match to Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 mb-10">
        
        {/* Left Column */}
        <div className="space-y-6">
          {leftCol.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif font-bold text-sm text-slate-800 group-hover:text-petrol-800 transition-colors truncate">
                    {item.name}
                  </span>
                  
                  {/* Dotted Leader Line */}
                  <span className="flex-1 border-b-2 border-dotted border-slate-300 mx-2" />

                  <span className="font-bold text-sm text-sage shrink-0">
                    {currency}{item.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">
                    {item.description}
                  </p>
                  
                  <button
                    onClick={() => onAddToCart(item)}
                    className="p-1 rounded-full bg-slate-100 hover:bg-mustard text-slate-700 hover:text-petrol-950 transition-colors ml-2"
                    title="Add to plate"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightCol.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif font-bold text-sm text-slate-800 group-hover:text-petrol-800 transition-colors truncate">
                    {item.name}
                  </span>
                  
                  {/* Dotted Leader Line */}
                  <span className="flex-1 border-b-2 border-dotted border-slate-300 mx-2" />

                  <span className="font-bold text-sm text-sage shrink-0">
                    {currency}{item.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">
                    {item.description}
                  </p>
                  
                  <button
                    onClick={() => onAddToCart(item)}
                    className="p-1 rounded-full bg-slate-100 hover:bg-mustard text-slate-700 hover:text-petrol-950 transition-colors ml-2"
                    title="Add to plate"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* View All Menu Button - Styled Yellow like in Screenshot */}
      <div className="text-center pt-4">
        <button
          onClick={() => setShowAllItems(!showAllItems)}
          className="px-8 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
        >
          {showAllItems ? 'Show Less Menu' : 'View All Menu'}
        </button>
      </div>

    </section>
  );
};
