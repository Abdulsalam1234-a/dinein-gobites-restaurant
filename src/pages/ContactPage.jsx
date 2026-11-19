import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  UtensilsCrossed, 
  Zap, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage = ({ settings = {} }) => {
  const whatsappNumber = settings.whatsappNumber || '07068371295';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppBase = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}`;

  const dineInName = settings.dineInName || 'Adebayo Flagship Outlet (Dine-In Swallow Lounge)';
  const dineInAddress = settings.dineInAddress || 'Adebayo Area, Along Iworoko Road, Ado-Ekiti, Ekiti State, Nigeria';
  const dineInHours = settings.dineInHours || 'Mon - Sun: 8:00 AM - 10:30 PM (Daily Fresh Soups & Swallows)';

  const goBitesName = settings.goBitesName || 'Ado-Ekiti Express Dispatch Depot';
  const goBitesAddress = settings.goBitesAddress || 'Opposite EKSU Junction / Adebayo Commercial Axis, Ado-Ekiti, Ekiti State';
  const goBitesHours = settings.goBitesHours || 'Mon - Sat: 7:30 AM - 9:30 PM (Sundays: 12 PM - 8 PM)';

  const supportEmail = settings.supportEmail || 'orders@romeeeatery.com.ng';
  const alternatePhone = settings.alternatePhone || '08012345678';

  // Contact Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;

    // Compile inquiry message for WhatsApp
    const text = `*New Customer Inquiry - ROMEE Eatery Web*\n` +
      `• *Name:* ${form.name}\n` +
      `• *Phone:* ${form.phone || 'N/A'}\n` +
      `• *Email:* ${form.email || 'N/A'}\n` +
      `• *Type:* ${form.inquiryType.toUpperCase()}\n` +
      `• *Message:* ${form.message}`;

    const targetUrl = `${directWhatsAppBase}?text=${encodeURIComponent(text)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 pb-24">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden text-center">
        <div className="absolute top-10 right-10 w-96 h-96 bg-petrol-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Concierge & Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Contact <span className="text-mustard">ROMEE Eatery</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about table reservations, bulk party catering, or live delivery status in Ado-Ekiti? We are always here to serve you.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`${directWhatsAppBase}?text=${encodeURIComponent("Hello ROMEE Eatery! I would like to make an inquiry.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Concierge ({whatsappNumber})</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-petrol-950 border border-mustard/40 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              <Phone className="w-4 h-4 text-mustard" />
              <span>Call Us: {whatsappNumber}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Outlets & Information (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dine-In Outlet Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-card-soft text-left space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-mustard/20 flex items-center justify-center text-mustard">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {dineInName}
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-mustard shrink-0 mt-0.5" />
                  <span>{dineInAddress}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{dineInHours}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{whatsappNumber} / {alternatePhone}</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Concept: Swallow Hub & Seated Lounge</span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(dineInAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mustard font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Go-Bites Express Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-card-soft text-left space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sage/20 flex items-center justify-center text-sage">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {goBitesName}
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                  <span>{goBitesAddress}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{goBitesHours}</span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-petrol-700 shrink-0 mt-0.5" />
                  <span>{supportEmail}</span>
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Concept: Express Takeaway & Combos</span>
                <Link
                  to="/delights"
                  className="text-sage font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Order Combos</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="p-5 rounded-3xl bg-petrol-900 text-white text-left space-y-2 shadow-card-soft">
              <div className="flex items-center gap-2 text-mustard font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Service Commitment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All food orders received via WhatsApp or Web are verified and dispatched under 3–5 minutes at our express counter.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card-soft text-left space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-serif font-bold text-2xl text-slate-900">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the details below. Submitting will instantly connect your inquiry to our manager on WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-emerald-900">Inquiry Dispatched!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Your message has been formatted and opened on WhatsApp with our executive staff. We will reply promptly!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-petrol-900 text-white font-bold text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Adeola Johnson"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-mustard"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-mustard"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="table_reservation">Table Reservation</option>
                      <option value="bulk_catering">Bulk Food / Event Catering</option>
                      <option value="delivery_status">Home / Office Delivery</option>
                      <option value="complaint_feedback">Feedback / Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Message / Order Request *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you need (e.g. I would like to reserve a family booth for 6 people this Saturday at 2 PM, or I need 20 packs of jollof for an event)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-mustard leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-petrol-900 hover:bg-petrol-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-mustard" />
                  <span>Send Message via WhatsApp Concierge</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  We reply immediately during business hours (8:00 AM – 10:30 PM daily).
                </p>

              </form>
            )}

          </div>

        </div>

        {/* 3. Embedded Interactive Google Map */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Find Us in Adebayo, Ado-Ekiti
              </h3>
              <p className="text-xs text-slate-500">
                Along Iworoko Road, minutes away from the commercial hub and EKSU junction
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(dineInAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open in Google Maps App</span>
            </a>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
            <iframe
              title="ROMEE Eatery Adebayo Location Map"
              src={settings.dineInEmbedMap || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.457193297597!2d5.228000!3d7.645000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1047fa8c3534b071%3A0x6b4ef8fa90757754!2sAdebayo%2C%20Ado%20Ekiti!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </section>

    </div>
  );
};
