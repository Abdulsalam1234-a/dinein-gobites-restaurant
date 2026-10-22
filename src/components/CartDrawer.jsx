import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  UtensilsCrossed, 
  Sparkles, 
  MapPin, 
  ShieldCheck,
  Send,
  ArrowRight
} from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  activeMode,
  setActiveMode,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToWhatsApp,
  currency = '₦',
  serviceChargeDineIn = 500,
  packagingFeeGoBites = 300,
  prefilledTable = '',
}) => {
  const isDineIn = activeMode === 'dinein';

  // Customer Details Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    tableNumber: prefilledTable || '',
    phone: '',
    location: '',
    specialInstructions: '',
  });

  React.useEffect(() => {
    if (prefilledTable) {
      setCustomerInfo((prev) => ({
        ...prev,
        tableNumber: prev.tableNumber || prefilledTable,
      }));
    }
  }, [prefilledTable]);

  const [formError, setFormError] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const extraFee = isDineIn ? (cart.length > 0 ? serviceChargeDineIn : 0) : (cart.length > 0 ? packagingFeeGoBites : 0);
  const total = subtotal + extraFee;

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError('');
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setFormError('Your plate is currently empty.');
      return;
    }

    if (isDineIn && !customerInfo.tableNumber.trim()) {
      setFormError('Please enter your Table Number or seating section (e.g. Table 4 or Terrace).');
      return;
    }

    if (!isDineIn && !customerInfo.location.trim()) {
      setFormError('Please specify your delivery address or select Pickup Counter.');
      return;
    }

    onProceedToWhatsApp({
      cart,
      mode: activeMode,
      customerInfo,
      totals: {
        subtotal,
        serviceCharge: isDineIn ? extraFee : 0,
        packagingFee: !isDineIn ? extraFee : 0,
        total,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-navy-950 border-l border-gold/30 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gold/20 flex items-center justify-between bg-navy-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              {isDineIn ? <UtensilsCrossed className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                {isDineIn ? 'Your Dining Plate' : 'Your Takeaway Bag'}
              </h2>
              <p className="text-[11px] text-gold uppercase tracking-wider font-semibold">
                {isDineIn ? 'Dine-In Lounge Order' : 'Go Bites Express Order'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher pill inside cart */}
        <div className="px-4 py-2 bg-navy-900/80 border-b border-gold/15 flex items-center justify-between text-xs">
          <span className="text-slate-400">Ordering Mode:</span>
          <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-full border border-gold/30">
            <button
              onClick={() => setActiveMode('dinein')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                isDineIn ? 'bg-gold text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={() => setActiveMode('gobites')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                !isDineIn ? 'bg-gold text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Go Bites
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-navy-900 border border-gold/20 flex items-center justify-center mx-auto mb-3 text-gold/40">
                {isDineIn ? <UtensilsCrossed className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <p className="text-sm font-bold text-white mb-1">Your plate is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                Explore our menu and add your favorite swallows, rice plates, fish, or combos.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30 hover:bg-gold hover:text-navy-950 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Selected Dishes ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                <button
                  onClick={onClearCart}
                  className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedOption || ''}`}
                  className="p-3 rounded-2xl bg-navy-900/70 border border-gold/15 flex items-start gap-3 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gold/20"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-400 p-0.5"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedOption && (
                      <p className="text-[10px] text-gold-300 font-medium">
                        Choice: {item.selectedOption}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-[10px] text-slate-400 italic truncate">
                        Note: {item.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-gold-200">
                        {currency}{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 bg-navy-950 rounded-full border border-gold/20 px-1 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy-950 transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-navy-950 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form for Table / Delivery Location */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-gold/20 space-y-3.5">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {isDineIn ? 'Dine-In Seating Information' : 'Takeaway & Delivery Destination'}
              </h3>

              {isDineIn ? (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Table Number / Section <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 5, VIP Booth 2, Terrace Table A"
                      value={customerInfo.tableNumber}
                      onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                      className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                      required
                    />
                    {/* Quick Table Selection Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'VIP Lounge', 'Outdoor Terrace'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleInputChange('tableNumber', t)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            customerInfo.tableNumber === t
                              ? 'bg-gold text-navy-950 font-bold border-gold'
                              : 'bg-navy-950 text-slate-400 border-gold/20 hover:border-gold/40'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Guest Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Your name for table reference"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Customer Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your name for package pickup"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 08012345678"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Pickup Window or Delivery Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Express Counter Pickup or Office 3B, Admiralty Way"
                      value={customerInfo.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                      required
                    />
                    {/* Quick destination chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Branch 1 Pickup Window', 'Branch 2 Express Counter', 'Office Delivery', 'Home Dispatch'].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleInputChange('location', loc)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            customerInfo.location === loc
                              ? 'bg-gold text-navy-950 font-bold border-gold'
                              : 'bg-navy-950 text-slate-400 border-gold/20 hover:border-gold/40'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kitchen / Dining Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please bring extra pepper, pack drinks cold, no ice..."
                  value={customerInfo.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="w-full bg-navy-900 border border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs text-center">
                  {formError}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer with Totals & Place Order Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gold/20 bg-navy-900/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Items Subtotal:</span>
                <span>{currency}{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isDineIn ? 'Table Hospitality / Service:' : 'Packaging & Handling:'}</span>
                <span>{currency}{extraFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-1.5 border-t border-gold/15">
                <span className="font-serif">Total Payable:</span>
                <span className="text-gold-200">{currency}{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-full gold-gradient-btn font-bold text-sm flex items-center justify-center gap-2 shadow-gold-sm hover:shadow-gold-md"
            >
              <Send className="w-4 h-4" />
              <span>Place Order on WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gold" />
              Your order compiles into WhatsApp for instant chef confirmation
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
