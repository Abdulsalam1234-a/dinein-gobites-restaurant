import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  ShoppingBag, 
  Flame, 
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const MenuPage = ({
  menuItems = [],
  activeMode,
  setActiveMode,
  onAddToCart,
  currency = '₦',
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isDineIn = activeMode === 'dinein';

  // Filter items by channel (dinein vs gobites)
  const channelItems = menuItems.filter((item) => {
    if (isDineIn) {
      return item.channel === 'dinein' || item.channel === 'both';
    } else {
      return item.channel === 'gobites' || item.channel === 'both';
    }
  });

  // Unique categories for the current active mode
  const availableCategories = ['all', ...new Set(channelItems.map(item => item.category))];

  // Apply category and search filter
  const filteredItems = channelItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 pb-28">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ROMEE Master Menu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Freshly Prepared Feasts <br />
            <span className="text-mustard">& Rapid Combos</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Choose your dining experience below: Seated swallow banquets with simmering soups, or express takeout combos and snacks.
          </p>

          {/* Mode Switcher Pill Banner */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-full bg-petrol-950/90 border border-mustard/40 shadow-xl max-w-md w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveMode('dinein');
                  setSelectedCategory('all');
                }}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isDineIn
                    ? 'bg-mustard text-petrol-950 shadow-md scale-100'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dine-In Lounge (Swallows)</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('gobites');
                  setSelectedCategory('all');
                }}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  !isDineIn
                    ? 'bg-mustard text-petrol-950 shadow-md scale-100'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go Bites Express (Combos)</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Menu Controls: Search & Category Pills */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card-elevated border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder={isDineIn ? "Search swallows, soups, fish..." : "Search combos, rice, snacks..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-9 pr-4 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sage"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-petrol-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Mode Policy Banner Alert */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-left text-xs ${
          isDineIn 
            ? 'bg-amber-50/80 border-amber-200/80 text-amber-900' 
            : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-700" />
            <span>
              {isDineIn ? (
                <><strong>Dine-In Mode Active:</strong> Featuring piping-hot swallows (Amala, Semo, Eba, Pounded Yam) with soup & fish selections. Orders will be served at your table.</>
              ) : (
                <><strong>Go Bites Express Mode:</strong> Strictly fast combos and takeaway packs. No swallows available on this counter to guarantee 3-minute rapid dispatch.</>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveMode(isDineIn ? 'gobites' : 'dinein');
              setSelectedCategory('all');
            }}
            className="underline font-bold whitespace-nowrap hover:opacity-80 text-[11px]"
          >
            Switch to {isDineIn ? 'Go Bites Combos' : 'Dine-In Swallows'}
          </button>
        </div>
      </section>

      {/* 4. Menu Items Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredItems.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">No dishes found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              We couldn't find any dishes matching "{searchQuery}" in this category. Try clearing your search or switching dining mode.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-full bg-petrol-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card-soft hover:shadow-card-elevated transition-all duration-300 flex flex-col group"
              >
                {/* Dish Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-petrol-950/80 text-mustard border border-mustard/30 backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-petrol-950 bg-mustard shadow-sm">
                      {currency}{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-petrol-900 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Options list if available */}
                    {item.options && item.options.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {item.options.map((opt) => (
                          <span
                            key={opt}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            + {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Portion Price</span>
                      <span className="text-base font-bold text-petrol-900 font-serif">
                        {currency}{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-4 py-2 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow transition-all hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5 text-mustard" />
                      <span>Add to Plate</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Sticky Floating Cart Bar if cart has items */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-30 px-4 max-w-xl mx-auto">
          <div className="bg-petrol-950 text-white border border-mustard/40 rounded-full px-5 py-3 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mustard flex items-center justify-center text-petrol-950 font-black relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">
                  {cartCount} {cartCount === 1 ? 'Dish' : 'Dishes'} Selected
                </span>
                <span className="text-[11px] text-mustard font-semibold">
                  Total: {currency}{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="px-5 py-2 rounded-full bg-mustard hover:bg-mustard-hover text-petrol-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <span>View Plate & Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
