import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, Eye, ShieldCheck, Flame, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoModal } from './VideoModal';

export const HomeAmbienceSection = ({ ambienceMedia = [] }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter items flagged for home, or take top 4
  const featuredItems = ambienceMedia.filter(item => item.featuredOnHome);
  const displayItems = featuredItems.length > 0 ? featuredItems.slice(0, 4) : ambienceMedia.slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="text-left space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-900/50 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behind The Scenes & Live Ambience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            A Glimpse of <span className="text-mustard">ROMEE Eatery</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Take an authentic look inside our clean master kitchen, serene Dine-In swallow lounge, and rapid-dispatch Go Bites counter before you step through our doors.
          </p>
        </div>

        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-petrol-900 hover:bg-petrol-800 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all group shrink-0"
        >
          <span>Explore Full Gallery & Videos</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 4 Feature Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayItems.map((item) => {
          const isVideo = item.type === 'video';

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isVideo) setActiveVideo(item);
              }}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-card-soft hover:shadow-card-elevated transition-all duration-300 flex flex-col ${
                isVideo ? 'cursor-pointer' : ''
              }`}
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={isVideo ? (item.thumbnail || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/80 via-petrol-950/20 to-transparent" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-petrol-950/80 text-mustard border border-mustard/30 backdrop-blur-sm">
                    {item.category === 'kitchen' && '🔥 Kitchen & Prep'}
                    {item.category === 'dinein' && '🍽️ Seated Lounge'}
                    {item.category === 'gobites' && '⚡ Go Bites Counter'}
                    {item.category === 'ambience' && '🌿 Exterior & Vibe'}
                  </span>
                </div>

                {/* Video Play Overlay */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-mustard/90 text-petrol-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-mustard transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider">
                      Watch Video
                    </span>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-4 sm:p-5 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-petrol-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-petrol-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                    Verified Facility
                  </span>
                  {isVideo ? (
                    <span className="text-mustard font-bold flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" /> Live Reel
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View Detail
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlights Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 text-left">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Hygienic Live Kitchen</h4>
            <p className="text-slate-500 text-xs mt-0.5">Stainless steel countertops, sanitized preparation, and real-time steaming soup cauldrons.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Spacious Dine-In Seating</h4>
            <p className="text-slate-500 text-xs mt-0.5">Air-conditioned luxury seating for couples, corporate lunches, and family swallow feasts.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Swift Go-Bites Pickup</h4>
            <p className="text-slate-500 text-xs mt-0.5">Zero delays: Grab your hot combo packs in under 5 minutes or have them dispatched across Lagos.</p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoItem={activeVideo}
      />

    </section>
  );
};
