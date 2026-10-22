import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Check } from 'lucide-react';

export const PopularDishesSection = ({
  items,
  onAddToCart,
  currency = '₦',
}) => {
  // Filter popular dishes (items with badge or top picks)
  const popularDishes = items.filter(
    (item) => item.badge || item.category === 'rice' || item.category === 'combo' || item.category === 'swallow'
  ).slice(0, 9);

  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleDishes = [
    popularDishes[currentIndex % popularDishes.length],
    popularDishes[(currentIndex + 1) % popularDishes.length],
    popularDishes[(currentIndex + 2) % popularDishes.length],
  ].filter(Boolean);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? popularDishes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % popularDishes.length);
  };

  return (
    <section id="popular" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header with Left/Right Arrows - Exact Match */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Our <span className="text-sage">Popular</span> Dishes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hand-crafted favorites loved by our Dine-In guests and Go Bites commuters
          </p>
        </div>

        {/* Carousel Arrows - Exact Match */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shadow-sm"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-mustard hover:bg-mustard-hover text-petrol-950 flex items-center justify-center transition-colors shadow-sm"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Circular Food Dish Cards Grid - Exact Match to Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {visibleDishes.map((dish, index) => (
          <div
            key={`${dish.id}-${index}`}
            className="bg-white rounded-3xl p-6 pt-0 border border-slate-100 shadow-card-soft hover:shadow-card-elevated hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between items-center text-center relative group"
          >
            {/* Circular Plate emerging from top of card */}
            <div className="-mt-14 mb-4 relative">
              <div className="w-36 h-36 rounded-full overflow-hidden p-1 bg-white shadow-xl border-2 border-slate-100 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {dish.badge && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-mustard text-petrol-950 shadow-sm whitespace-nowrap">
                  {dish.badge}
                </span>
              )}
            </div>

            {/* Dish Info */}
            <div className="w-full my-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-petrol transition-colors line-clamp-1 mb-1">
                {dish.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed px-2">
                {dish.description}
              </p>
            </div>

            {/* Price & Add to Cart Button - Styled like design */}
            <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-base font-bold text-sage">
                {currency}{dish.price.toLocaleString()}
              </span>

              <button
                onClick={() => onAddToCart(dish)}
                className="px-4 py-1.5 rounded-lg bg-mustard hover:bg-mustard-hover text-petrol-950 font-bold text-xs shadow-sm transition-all hover:scale-105"
              >
                Add to cart
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
