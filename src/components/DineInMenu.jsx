import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Plus, 
  Minus, 
  Utensils, 
  Info
} from 'lucide-react';

export const DineInMenu = ({
  items,
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  currency = '₦',
}) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeItemNotes, setActiveItemNotes] = useState({});
  const [showNoteInputId, setShowNoteInputId] = useState(null);

  const handleOptionChange = (itemId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [itemId]: option }));
  };

  const handleNoteChange = (itemId, text) => {
    setActiveItemNotes((prev) => ({ ...prev, [itemId]: text }));
  };

  const handleAdd = (item) => {
    const chosenOption = item.options ? (selectedOptions[item.id] || item.options[0]) : null;
    const note = activeItemNotes[item.id] || '';
    onAddToCart({
      ...item,
      selectedOption: chosenOption,
      notes: note,
    });
    // Reset note input state for this item
    setShowNoteInputId(null);
  };

  // Find quantity in cart
  const getItemCartQuantity = (itemId) => {
    const cartItem = cart.find((i) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <Utensils className="w-12 h-12 text-gold/40 mx-auto mb-3" />
        <h3 className="text-lg font-serif font-bold text-white mb-1">No Dine-In Dishes Found</h3>
        <p className="text-xs text-slate-400">Try adjusting your search query or category filter above.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Notice Pill for Dine-In Experience */}
      <div className="mb-8 p-4 rounded-2xl bg-navy-900/90 border border-gold/30 flex items-start sm:items-center gap-3.5 shadow-gold-sm">
        <div className="p-2 rounded-xl bg-gold/15 text-gold shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-gold mr-1.5">Dine-In Seated Dining:</span>
          Enjoy table-side hospitality with piping hot swallows and fresh grilled specialties. 
          When adding items, choose your soup accompaniment and feel free to add custom preparation notes. 
          You will input your <strong className="text-white">Table Number</strong> at checkout!
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {items.map((item) => {
          const cartQty = getItemCartQuantity(item.id);
          const currentOption = item.options ? (selectedOptions[item.id] || item.options[0]) : null;

          return (
            <div
              key={item.id}
              className={`group bg-glass-card rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                item.isAvailable 
                  ? 'border-gold/20 hover:border-gold/50 hover:shadow-gold-md hover:-translate-y-1' 
                  : 'border-slate-800 opacity-60'
              }`}
            >
              {/* Top Image Container */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-navy-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Dark Gradient Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  {item.badge ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-gold/90 text-navy-950 shadow-md">
                      {item.badge}
                    </span>
                  ) : <span />}

                  <div className="flex items-center gap-1.5">
                    {item.isSpicy && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40">
                        <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                        Spicy
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-navy-950/80 text-slate-300 border border-slate-700">
                      <Clock className="w-3 h-3 text-gold/80" />
                      {item.prepTime}
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
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-gold-200 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Soup / Accompaniment Selection for Swallows */}
                  {item.options && (
                    <div className="mb-4 pt-3 border-t border-gold/15">
                      <label className="block text-[11px] font-semibold text-gold-300 mb-1.5">
                        Select Soup Accompaniment:
                      </label>
                      <select
                        value={currentOption}
                        onChange={(e) => handleOptionChange(item.id, e.target.value)}
                        className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold"
                      >
                        {item.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-navy-950 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Special Cooking Note Prompt */}
                  {showNoteInputId === item.id ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="e.g. Mild pepper, extra soup, no onions..."
                        value={activeItemNotes[item.id] || ''}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNoteInputId(item.id)}
                      className="text-[11px] text-slate-400 hover:text-gold transition-colors mb-4 block"
                    >
                      + Add preparation note
                    </button>
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
                          onClick={() => handleAdd(item)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full gold-gradient-btn text-xs font-bold shadow-gold-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plate</span>
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
