import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Eye, 
  Video, 
  Image as ImageIcon, 
  ShieldCheck, 
  Flame, 
  UtensilsCrossed, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { VideoModal } from '../components/VideoModal';
import { Link } from 'react-router-dom';

export const GalleryPage = ({ ambienceMedia = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeImageModal, setActiveImageModal] = useState(null);

  // Filter media
  const filteredMedia = ambienceMedia.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    return matchesCategory && matchesType;
  });

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 pb-24">
      
      {/* 1. Curved Hero Header */}
      <section className="bg-petrol-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 hero-curved-bottom relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-petrol-950/70 border border-mustard/30 text-mustard text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Tour & Live Facilities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Kitchen, Seating <br />
            <span className="text-mustard">& Restaurant Ambience</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Take a transparent look inside our food preparation kitchens, tranquil Dine-In seating arrangements, and rapid Go-Bites takeaway counters.
          </p>
        </div>
      </section>

      {/* 2. Filter Controls */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card-elevated border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Spaces' },
              { id: 'kitchen', label: '🔥 Master Kitchen' },
              { id: 'dinein', label: '🍽️ Dine-In Seating' },
              { id: 'gobites', label: '⚡ Go-Bites Counter' },
              { id: 'ambience', label: '🌿 Exterior & Terrace' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-petrol-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Media Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 self-end md:self-auto text-xs">
            <button
              onClick={() => setMediaTypeFilter('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                mediaTypeFilter === 'all'
                  ? 'bg-petrol-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({ambienceMedia.length})
            </button>
            <button
              onClick={() => setMediaTypeFilter('video')}
              className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                mediaTypeFilter === 'video'
                  ? 'bg-mustard text-petrol-950'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos ({ambienceMedia.filter(m => m.type === 'video').length})</span>
            </button>
            <button
              onClick={() => setMediaTypeFilter('image')}
              className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                mediaTypeFilter === 'image'
                  ? 'bg-petrol-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({ambienceMedia.filter(m => m.type === 'image').length})</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. Media Gallery Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredMedia.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">No media found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              No photos or videos match your selected category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMediaTypeFilter('all');
              }}
              className="px-4 py-2 rounded-full bg-petrol-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredMedia.map((item) => {
              const isVideo = item.type === 'video';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card-soft hover:shadow-card-elevated transition-all duration-300 flex flex-col group"
                >
                  {/* Media Thumbnail Container */}
                  <div
                    onClick={() => {
                      if (isVideo) {
                        setActiveVideo(item);
                      } else {
                        setActiveImageModal(item);
                      }
                    }}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={isVideo ? (item.thumbnail || item.url) : item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-petrol-950/80 text-mustard border border-mustard/30 backdrop-blur-sm">
                        {item.category === 'kitchen' && '🔥 Master Kitchen'}
                        {item.category === 'dinein' && '🍽️ Seated Lounge'}
                        {item.category === 'gobites' && '⚡ Go-Bites Counter'}
                        {item.category === 'ambience' && '🌿 Exterior & Vibe'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      {isVideo ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mustard text-petrol-950 shadow-md flex items-center gap-1">
                          <Play className="w-3 h-3 fill-current" /> Video
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-full bg-black/60 text-white hover:bg-mustard hover:text-petrol-950 transition-colors">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Video Center Play Icon */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-mustard/90 text-petrol-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-mustard transition-transform duration-300">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Information Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-base mb-1.5 group-hover:text-petrol-900 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                        Inspected & Verified
                      </span>
                      
                      <button
                        onClick={() => {
                          if (isVideo) setActiveVideo(item);
                          else setActiveImageModal(item);
                        }}
                        className="text-petrol-900 font-bold hover:text-mustard flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>{isVideo ? 'Play Video' : 'View Photo'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Kitchen Standards & Hygiene Assurance Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
        <div className="bg-gradient-to-r from-petrol-900 via-petrol-950 to-petrol-900 text-white rounded-3xl p-8 sm:p-10 border border-mustard/30 shadow-card-elevated flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-mustard text-xs font-bold uppercase tracking-wider block">
              100% Culinary Transparency
            </span>
            <h3 className="text-2xl font-serif font-black text-white">
              Experience the Cleanest Kitchen in Lagos
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We take pride in our open-kitchen culture. Come see our stainless steel preparation stations, sanitized swallow kneaders, and sparkling dining floor in person.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/outlets"
              className="px-6 py-3 rounded-xl bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
            >
              Visit Our Outlets
            </Link>
            <Link
              to="/menu"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoItem={activeVideo}
      />

      {/* Photo Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 bg-petrol-950/90 backdrop-blur-md animate-in fade-in"
          />
          <div className="relative max-w-4xl w-full bg-petrol-900 border border-mustard/40 rounded-3xl overflow-hidden shadow-2xl z-10 p-2">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black">
              <img
                src={activeImageModal.url}
                alt={activeImageModal.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 sm:p-5 text-left bg-petrol-950 rounded-b-2xl mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-mustard">
                  {activeImageModal.title}
                </h3>
                <p className="text-slate-300 text-xs mt-0.5">{activeImageModal.caption}</p>
              </div>
              <button
                onClick={() => setActiveImageModal(null)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white shrink-0"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
