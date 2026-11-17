import React from 'react';
import { 
  Play, 
  Video, 
  CheckCircle2, 
  Utensils, 
  ShoppingBag, 
  MapPin, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const OrderingVideoSection = ({ settings = {} }) => {
  const whatsappNumber = settings.whatsappNumber || '07068371295';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const baseWaNumber = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone;

  const videoUrl = settings.tutorialVideoUrl?.trim() || '';

  // Helper to format YouTube URLs into embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=0`;
      }
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${id}?autoplay=0`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbeddableVideo = videoUrl.length > 0;
  const isDirectVideoFile = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg');

  const steps = [
    {
      step: '01',
      title: 'Choose Dining Experience',
      desc: 'Toggle between "Dine-In Lounge" (for piping-hot Amala, Semo, Pounded Yam & Soups) or "Go Bites Express" (for speedy Party Jollof, Fried Rice & Combos).',
      icon: Utensils,
      color: 'from-amber-500 to-amber-600',
    },
    {
      step: '02',
      title: 'Select Dishes & Customize',
      desc: 'Browse chef specialties, select protein choices (Catfish, Assorted Meat, Crispy Chicken), and click "Add to Plate".',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      step: '03',
      title: 'Enter Table or Delivery Address',
      desc: 'Open your cart tray. If seated in Adebayo, input your Table Number; if ordering delivery, enter your street address or landmark in Ado-Ekiti.',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: '04',
      title: 'One-Tap WhatsApp Dispatch',
      desc: 'Tap "Place Order on WhatsApp". Your order details are automatically composed and dispatched directly to our kitchen hotline for instant confirmation!',
      icon: MessageCircle,
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <section id="ordering-guide-video" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mustard/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-petrol-950/80 border border-mustard/40 text-mustard text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Interactive Ordering Walkthrough</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight">
            How to Use the Website & <br />
            <span className="text-mustard">Order on WhatsApp</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Watch our step-by-step video guide below to learn how easy it is to browse our authentic swallows or express combos and place an order directly with our kitchen staff.
          </p>
        </div>

        {/* Video Player or Placeholder Container */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-slate-950/90 rounded-3xl p-3 sm:p-5 border border-slate-800 shadow-2xl relative">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 relative flex items-center justify-center border border-slate-800/80 group">
              
              {isEmbeddableVideo ? (
                isDirectVideoFile ? (
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster="/images/romee-logo.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={embedUrl}
                    title="ROMEE Eatery Ordering Tutorial"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )
              ) : (
                /* Elegant Interactive Placeholder when video URL is being prepared */
                <div className="text-center p-6 sm:p-10 space-y-6 max-w-lg">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-mustard to-amber-400 text-petrol-950 flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                      <Sparkles className="w-3 h-3 text-mustard" />
                      <span>Official Ordering Walkthrough Video (Preview Ready)</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-white">
                      Tutorial Video Upload in Progress
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our official video tutorial will be embedded right here. You can paste your YouTube or MP4 video link anytime in the <strong>Admin Dashboard &rarr; Settings</strong> tab to activate instant playback!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-sage" /> Mobile & Desktop Optimized
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mustard" /> Instant WhatsApp Sync
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Video Footer Caption */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 px-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Kitchen Line: Adebayo Flagship, Ado-Ekiti</span>
              </div>
              <a 
                href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent('Hello ROMEE Eatery! I need guidance on how to place an order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mustard hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Need immediate help? Chat with Staff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Process Cards */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              The 4-Step ROMEE Ordering Experience
            </h3>
            <p className="text-xs text-slate-400">
              Whether you are dining in at Adebayo or ordering home delivery across Ado-Ekiti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 relative flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-mono font-black text-slate-700 group-hover:text-mustard/60 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-white group-hover:text-mustard transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center gap-1.5 text-[11px] text-mustard font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Quick & Hassle-free</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <a
            href={`https://wa.me/${baseWaNumber}?text=${encodeURIComponent('Hello ROMEE Eatery! I am ready to place an order from your website.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/50 hover:scale-105 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-mustard fill-current" />
            <span>Launch WhatsApp Order Line ({whatsappNumber})</span>
          </a>
        </div>

      </div>
    </section>
  );
};
