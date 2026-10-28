import React from 'react';
import { X, Play } from 'lucide-react';

export const VideoModal = ({ isOpen, onClose, videoItem }) => {
  if (!isOpen || !videoItem) return null;

  const isYouTube = videoItem.url?.includes('youtube.com') || videoItem.url?.includes('youtu.be');
  const getEmbedUrl = (url) => {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-petrol-950/90 backdrop-blur-md animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-petrol-900 border border-mustard/40 rounded-3xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-petrol-800 bg-petrol-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-mustard/20 flex items-center justify-center text-mustard">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm sm:text-base">
                {videoItem.title}
              </h3>
              <span className="text-[10px] text-mustard uppercase font-bold tracking-wider">
                {videoItem.category === 'kitchen' && 'Master Kitchen Action'}
                {videoItem.category === 'dinein' && 'Dine-In Lounge Atmosphere'}
                {videoItem.category === 'gobites' && 'Go-Bites Express Counter'}
                {videoItem.category === 'ambience' && 'Restaurant Ambience'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-petrol-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video flex items-center justify-center">
          {isYouTube ? (
            <iframe
              src={getEmbedUrl(videoItem.url)}
              title={videoItem.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoItem.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Caption */}
        {videoItem.caption && (
          <div className="p-4 bg-petrol-950 text-slate-300 text-xs sm:text-sm border-t border-petrol-800">
            <p>{videoItem.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
