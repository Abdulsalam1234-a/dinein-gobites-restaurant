import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  UtensilsCrossed, 
  Zap, 
  MessageCircle, 
  Navigation,
  ExternalLink,
  Calendar, 
  Users,
  CheckCircle2,
  Send
} from 'lucide-react';

export const OutletsPage = ({ settings = {} }) => {
  const whatsappNumber = settings.whatsappNumber || '07068371295';
  const dineInName = settings.dineInName || 'Victoria Island / Lekki Flagship Hub';
  const dineInAddress = settings.dineInAddress || 'Plot 14B, Admiralty Way / Adeola Odeku Corridor, Victoria Island, Lagos';
  const dineInHours = settings.dineInHours || 'Monday - Sunday: 8:00 AM – 10:30 PM (Daily Fresh Soups)';
  const dineInMapsUrl = settings.dineInGoogleMapsUrl || 'https://maps.google.com/?q=Victoria+Island+Lagos';
  const dineInEmbedMap = settings.dineInEmbedMap || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7297920199144!2d3.4243555!3d6.4287383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53293888377%3A0xb3671ff8be28b9d3!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng';

  const goBitesName = settings.goBitesName || 'Mainland Express Dispatch Depot';
  const goBitesAddress = settings.goBitesAddress || '42 Allen Avenue (Opposite Oshopey Plaza), Ikeja, Lagos';
  const goBitesHours = settings.goBitesHours || 'Monday - Saturday: 7:30 AM – 9:00 PM (Sundays: 12 PM - 8 PM)';
  const goBitesMapsUrl = settings.goBitesGoogleMapsUrl || 'https://maps.google.com/?q=Allen+Avenue+Ikeja+Lagos';
  const goBitesEmbedMap = settings.goBitesEmbedMap || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3855529451994!2d3.3512214!3d6.6014498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9231f24d9c79%3A0xe96803ce58f12eb6!2sAllen%20Ave%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng';

  const [reserveOutlet, setReserveOutlet] = useState(dineInName);
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
      `🍽️ *TABLE RESERVATION INQUIRY - ${settings.restaurantName || 'ROMEE GO-BITE EATERY'}*`,
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
            <span>Google Business Verified Outlets</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Our Physical Outlets <br />
            <span className="text-mustard">& Seating Lounges</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Dine in serenity at our flagship Island lounge or order swift dispatch from our high-speed Mainland Go-Bites depot.
          </p>
        </div>
      </section>

      {/* 2. Outlets Cards Grid with Interactive Google Maps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Branch 1: Victoria Island / Lekki (Dine-In Lounge & Go Bites) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card-elevated space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mustard/20 text-petrol-900 border border-mustard/40 inline-block">
                    Flagship Dine-In Hub
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {dineInName}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-petrol-900 text-mustard flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Our main culinary sanctuary featuring a serene, air-conditioned seated <strong>Dine-In Lounge</strong> (serving Amala with Gbegiri & Ewedu, Semo, Pounded Yam, and fresh Fish Pepper Soup), plus an adjacent <strong>Go Bites Express</strong> takeaway counter.
              </p>

              {/* Outlet Specs */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                  <span>{dineInAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-mustard shrink-0" />
                  <span>{dineInHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-mustard shrink-0" />
                  <span>Hotline: <strong className="text-petrol-900 font-bold">{whatsappNumber}</strong></span>
                </div>
              </div>

              {/* Interactive Google Map Embed */}
              <div className="pt-2">
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <iframe
                    title="Dine-In Branch Google Map"
                    src={dineInEmbedMap}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Full Swallow Lounge</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ VIP Private Dining</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Go Bites Counter</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Free Valet Parking</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <a
                href={dineInMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <Navigation className="w-3.5 h-3.5 text-petrol-900" />
                <span>Open in Google Maps & Get Directions</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent(`Hello ${dineInName}! I would like to make an inquiry or reservation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4 text-mustard" />
                <span>Chat with Island Host on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Branch 2: Ikeja Allen (Go Bites Express Takeaway Only) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card-elevated space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sage/20 text-emerald-900 border border-sage/40 inline-block">
                    Express Dispatch Hub
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {goBitesName}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sage text-white flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Dedicated high-speed <strong>Go Bites Express</strong> facility engineered for rapid 3-minute takeaway pickups and doorstep delivery across Ikeja, Maryland, and the Mainland. <em>(Specializes in Party Jollof, Fried Rice, Ofada, and Combos)</em>.
              </p>

              {/* Outlet Specs */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{goBitesAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sage shrink-0" />
                  <span>{goBitesHours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sage shrink-0" />
                  <span>Dispatch Line: <strong className="text-petrol-900 font-bold">{whatsappNumber}</strong></span>
                </div>
              </div>

              {/* Interactive Google Map Embed */}
              <div className="pt-2">
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <iframe
                    title="Go-Bites Express Google Map"
                    src={goBitesEmbedMap}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Badges */}
              <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ 3-Min Walk-in Pickup</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Fast Courier Dispatch</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Microwave-safe Packaging</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">✓ Bulk Catering Pickup</span>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <a
                href={goBitesMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-800" />
                <span>Open in Google Maps & Get Directions</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent(`Hello ${goBitesName}! I want to order a fast Go Bites combo for pickup or delivery.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-sage hover:bg-sage-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 text-mustard" />
                <span>Order Express Takeaway on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Table Reservation Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
        <div className="bg-petrol-950 text-white rounded-3xl p-8 sm:p-12 border border-petrol-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard/20 text-mustard text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Priority Dining Reservation</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              Reserve a Table at <br />
              <span className="text-mustard">Our Dine-In Swallow Hub</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Planning a business lunch, family feast, or evening swallow experience? Reserve your table in advance and skip any waiting queue.
            </p>

            <form onSubmit={handleReservationWhatsApp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Select Outlet</label>
                <select
                  value={reserveOutlet}
                  onChange={(e) => setReserveOutlet(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mustard"
                >
                  <option value={dineInName}>{dineInName} (Dine-In Swallows)</option>
                  <option value={goBitesName}>{goBitesName} (Express Counter)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Party Size</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mustard"
                >
                  <option value="1 Guest">1 Guest (Solo Dining)</option>
                  <option value="2 Guests">2 Guests (Couple)</option>
                  <option value="4 Guests">4 Guests (Family / Friends)</option>
                  <option value="6 Guests">6 Guests (Group)</option>
                  <option value="8+ Guests (VIP Room)">8+ Guests (VIP Private Dining)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Preferred Date</label>
                <select
                  value={reserveDate}
                  onChange={(e) => setReserveDate(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mustard"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Weekend (Saturday)">This Weekend (Saturday)</option>
                  <option value="This Weekend (Sunday)">This Weekend (Sunday)</option>
                  <option value="Next Week">Next Week</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Arrival Time</label>
                <select
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-mustard"
                >
                  <option value="12:00 PM">12:00 PM (Early Lunch)</option>
                  <option value="1:30 PM">1:30 PM (Peak Lunch)</option>
                  <option value="3:00 PM">3:00 PM (Afternoon Swallow)</option>
                  <option value="5:30 PM">5:30 PM (Evening Dinner)</option>
                  <option value="7:30 PM">7:30 PM (Dinner & Drinks)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-300 font-semibold">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Babatunde Adeleke"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-300 font-semibold">Special Request or Dietary Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Need VIP booth, high chair for infant, spicy pepper soup ready upon arrival"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full bg-petrol-900 border border-petrol-700 rounded-xl py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-mustard"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Reservation Request to WhatsApp Host</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};
