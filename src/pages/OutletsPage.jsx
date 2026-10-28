import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  UtensilsCrossed, 
  Zap, 
  MessageCircle, 
  Calendar, 
  Users,
  CheckCircle2,
  Send
} from 'lucide-react';

export const OutletsPage = ({ whatsappNumber = '07068371295' }) => {
  const [reserveOutlet, setReserveOutlet] = useState('Victoria Island Lounge (Dine-In & Go-Bites)');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [reserveDate, setReserveDate] = useState('Today');
  const [reserveTime, setReserveTime] = useState('1:00 PM (Lunch)');
  const [guestName, setGuestName] = useState('');
  const [specialNote, setSpecialNote] = useState('');

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const baseWaNumber = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;

  const handleReservationWhatsApp = (e) => {
    e.preventDefault();
    const msg = [
      `🍽️ *TABLE RESERVATION INQUIRY - ROMEE GO-BITE EATERY*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📍 *Outlet*: ${reserveOutlet}`,
      `👥 *Guests*: ${guestCount}`,
      `📅 *Date*: ${reserveDate}`,
      `⏰ *Time*: ${reserveTime}`,
      guestName ? `👤 *Name*: ${guestName}` : null,
      specialNote ? `📝 *Special Request*: ${specialNote}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm table availability for my party. Thank you!`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${baseWaNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 pb-24">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visit Us in Person</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Our Physical Outlets <br />
            <span className="text-mustard">& Seating Lounges</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Experience our hospitality at our flagship Island lounge or our high-speed Mainland dispatch depot.
          </p>
        </div>
      </section>

      {/* 2. Outlets Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Branch 1: Victoria Island / Lekki (Dine-In Lounge & Go Bites) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card-elevated space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mustard/20 text-petrol-900 border border-mustard/40 inline-block">
                    Flagship Branch
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    Victoria Island / Lekki Hub
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-petrol-900 text-mustard flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Our main culinary sanctuary featuring a serene, air-conditioned seated <strong>Dine-In Lounge</strong> (serving Amala, Semo, Pounded Yam, Eba, and Catfish), plus an adjacent <strong>Go Bites Express</strong> takeaway counter.
              </p>

              {/* Outlet Specs */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                  <span>Plot 14B, Admiralty Way / Adeola Odeku Corridor, Victoria Island, Lagos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-mustard shrink-0" />
                  <span>Monday - Sunday: 8:00 AM – 10:30 PM (Daily Fresh Soups)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-mustard shrink-0" />
                  <span>Direct Hotline: <strong className="text-petrol-900 font-bold">07068371295</strong></span>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Full Swallow Lounge</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ VIP Private Dining</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Go Bites Counter</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Free Valet Parking</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent("Hello ROMEE Victoria Island branch! I'd like to make an inquiry or reservation.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-mustard" />
                <span>Chat with Island Host on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Branch 2: Ikeja Allen (Go Bites Express Takeaway Only) */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card-elevated space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sage/20 text-emerald-900 border border-sage/40 inline-block">
                    Express Dispatch Hub
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    Allen Avenue, Ikeja Depot
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sage text-white flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Dedicated high-speed <strong>Go Bites Express</strong> facility engineered for 3-minute takeaway pickups and rapid doorstep delivery across Ikeja, Maryland, and the Mainland. <em>(No swallows served at this branch)</em>.
              </p>

              {/* Outlet Specs */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>Suite 8, Ground Floor, Commercial Plaza, Allen Avenue, Ikeja, Lagos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sage shrink-0" />
                  <span>Monday - Saturday: 8:30 AM – 9:00 PM (Closed Sundays)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sage shrink-0" />
                  <span>Mainland Hotline: <strong className="text-petrol-900 font-bold">07068371295</strong></span>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ 3-Min Combo Pickup</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Corporate Bulk Lunch</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Bike Courier Hub</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Thermal Insulated Packs</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent("Hello ROMEE Ikeja Allen branch! I want to order Go Bites combos for pickup/dispatch.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 text-mustard" />
                <span>Order Express Combos on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Table Reservation & Banquet Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
        <div className="bg-petrol-900 text-white rounded-3xl p-8 sm:p-12 border border-mustard/30 shadow-card-elevated">
          
          <div className="max-w-xl mb-8 space-y-2">
            <span className="text-mustard text-xs font-bold uppercase tracking-wider block">
              Dine-In Priority Seating
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Reserve A Table or Private Booth
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Planning a family swallow lunch, business dinner, or group feast? Send your reservation details directly to our reservations desk on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleReservationWhatsApp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Outlet</label>
              <select
                value={reserveOutlet}
                onChange={(e) => setReserveOutlet(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white focus:outline-none focus:border-mustard"
              >
                <option value="Victoria Island Lounge (Dine-In & Go-Bites)">Victoria Island Lounge (Dine-In & Go-Bites)</option>
                <option value="Ikeja Allen Depot (Takeaway Pickup Only)">Ikeja Allen Depot (Takeaway Pickup Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Party Size / Guests</label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white focus:outline-none focus:border-mustard"
              >
                <option value="1 Guest">1 Guest (Solo Dining)</option>
                <option value="2 Guests">2 Guests (Couple Table)</option>
                <option value="4 Guests">4 Guests (Family Dining)</option>
                <option value="6-8 Guests">6-8 Guests (VIP Booth)</option>
                <option value="10+ Guests">10+ Guests (Banquet Event)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date</label>
              <select
                value={reserveDate}
                onChange={(e) => setReserveDate(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white focus:outline-none focus:border-mustard"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Friday">This Friday</option>
                <option value="This Saturday">This Saturday</option>
                <option value="This Sunday">This Sunday</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Time</label>
              <select
                value={reserveTime}
                onChange={(e) => setReserveTime(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white focus:outline-none focus:border-mustard"
              >
                <option value="12:00 PM (Lunch Rush)">12:00 PM (Lunch Rush)</option>
                <option value="1:30 PM (Midday Dining)">1:30 PM (Midday Dining)</option>
                <option value="4:00 PM (Afternoon)">4:00 PM (Afternoon)</option>
                <option value="7:00 PM (Dinner Hour)">7:00 PM (Dinner Hour)</option>
                <option value="8:30 PM (Late Dining)">8:30 PM (Late Dining)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Mr. Babatunde"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Special Preferences (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near window, quiet booth, extra high chair..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="w-full bg-petrol-950 border border-petrol-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Reservation via WhatsApp (07068371295)</span>
              </button>
            </div>

          </form>

        </div>
      </section>

    </div>
  );
};
