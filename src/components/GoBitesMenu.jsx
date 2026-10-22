import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Package, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Flame, 
  AlertCircle
} from 'lucide-react';

export const GoBitesMenu = ({
  items,
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  currency = '₦',
}) => {
  // Find quantity in cart
  const getItemCartQuantity = (itemId) => {
    const cartItem = cart.find((i) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <Sparkles className="w-12 h-12 text-gold/40 mx-auto mb-3" />
        <h3 className="text-lg font-serif font-bold text-white mb-1">No Go Bites Items Found</h3>
        <p className="text-xs text-slate-400">Try adjusting your search query or category filter above.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Notice Banner - Highlighting Fast Turnaround & Strictly No Swallows */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start sm:items-center gap-3.5 shadow-gold-sm">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300 mr-1.5">Express Takeaway & Combos:</span>
          Designed for speed and commuters! Food is packed hot in insulated containers ready in 3–5 minutes. 
          <span className="text-white font-medium ml-1">Note: Swallows are served exclusively in our Dine-In Lounge for optimal dining quality.</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {items.map((item) => {
          const cartQty = getItemCartQuantity(item.id);

          return (
            <div
              key={item.id}
              className={`group bg-glass-card rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                item.isAvailable 
                  ? 'border-gold/20 hover:border-gold/50 hover:shadow-gold-md hover:-translate-y-1' 
                  : 'border-slate-800 opacity-60'
              }`}
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-navy-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-navy-950 shadow-md">
                    {item.badge || 'Go Bites Fast'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {item.isSpicy && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40">
                        <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                        Spicy
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-navy-950/80 text-slate-300 border border-slate-700">
                      <Clock className="w-3 h-3 text-gold/80" />
                      {item.prepTime || '3-5 mins'}
                    </span>
                  </div>
                </div>

                {/* Sold Out Banner */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-red-400 px-4 py-2 rounded-full border border-red-500/40 bg-red-950/80">
                      Sold Out for Today
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-gold-200 transition-colors mb-2">
                    {item.name}
                  </h3>

                  <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Combo Items List if applicable */}
                  {item.comboItems && (
                    <div className="mb-4 p-3 rounded-2xl bg-navy-950/80 border border-gold/15 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Package className="w-3 h-3" /> Included in this Box:
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                        {item.comboItems.map((ci, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{ci}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer: Price & Add Button */}
                <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-lg sm:text-xl font-bold text-gold-200">
                      {currency}{item.price.toLocaleString()}
                    </span>
                  </div>

                  {item.isAvailable && (
                    <div>
                      {cartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-navy-900 border border-gold/40 rounded-full p-1 shadow-gold-sm">
                          <button
                            onClick={() => onUpdateCartQuantity(item.id, cartQty - 1)}
                            className="w-7 h-7 rounded-full bg-navy-800 text-gold flex items-center justify-center hover:bg-gold hover:text-navy-950 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">
                            {cartQty}
                          </span>
                          <button
                            onClick={() => onUpdateCartQuantity(item.id, cartQty + 1)}
                            className="w-7 h-7 rounded-full bg-gold text-navy-950 flex items-center justify-center hover:bg-gold-400 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full gold-gradient-btn text-xs font-bold shadow-gold-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Grab to Bag</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
