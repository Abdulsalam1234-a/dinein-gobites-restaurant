import React, { useState } from 'react';

export const BookTableBar = ({ activeMode, setActiveMode, onSelectTable, onExploreMenu }) => {
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [serviceHour, setServiceHour] = useState('12:00 PM');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelectTable(selectedTable);
    onExploreMenu();
  };

  return (
    <div id="book-table" className="relative -mt-20 sm:-mt-24 max-w-5xl mx-auto px-4 z-20">
      
      <div className="bg-white rounded-3xl shadow-card-elevated border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Left Floating Food Image Cutout - Styled like design */}
        <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-24">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
            alt="Delicious Snack"
            className="w-20 h-20 object-cover rounded-full shadow-lg transform -rotate-6 hover:rotate-0 transition-transform"
          />
        </div>

        {/* Center Booking / Experience Selector */}
        <div className="flex-1 w-full text-left">
          
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
              Book A Table & Seated Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Powered by ROMEE Go-Bite and they provide authentic good food
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            
            {/* Field 1: Dining Experience Mode */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Dining Outlet
              </label>
              <select
                value={activeMode}
                onChange={(e) => setActiveMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sage"
              >
                <option value="dinein">🍽️ Dine-In Lounge (Swallows)</option>
                <option value="gobites">⚡ Go Bites Express (Combos)</option>
              </select>
            </div>

            {/* Field 2: Table / Guests */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Table / Guests
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sage"
              >
                <option value="Table 1 (2 Persons)">Table 1 (2 Persons)</option>
                <option value="Table 2 (4 Persons)">Table 2 (4 Persons)</option>
                <option value="Table 3 (Family Table)">Table 3 (Family Table)</option>
                <option value="VIP Lounge Booth">VIP Lounge Booth</option>
                <option value="Outdoor Terrace Table">Outdoor Terrace</option>
                <option value="Takeaway Pickup Counter">Takeaway Pickup</option>
              </select>
            </div>

            {/* Field 3: Time */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Service Time
              </label>
              <select
                value={serviceHour}
                onChange={(e) => setServiceHour(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sage"
              >
                <option value="Immediate (Right Now)">Immediate (Right Now)</option>
                <option value="12:00 PM (Lunch Rush)">12:00 PM (Lunch Rush)</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="07:00 PM (Dinner)">07:00 PM (Dinner)</option>
              </select>
            </div>

            {/* Field 4: Submit Button - Styled green like in screenshot */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
              >
                Start Order
              </button>
            </div>

          </form>

        </div>

        {/* Right Floating Food Image Cutout - Styled like design */}
        <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-24">
          <img
            src="https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=300&q=80"
            alt="Golden Dodo"
            className="w-20 h-20 object-cover rounded-full shadow-lg transform rotate-6 hover:rotate-0 transition-transform"
          />
        </div>

      </div>

    </div>
  );
};
