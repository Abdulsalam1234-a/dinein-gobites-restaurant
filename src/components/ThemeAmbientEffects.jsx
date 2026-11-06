import React, { useMemo } from 'react';

export const ThemeAmbientEffects = ({ themeId = 'classic' }) => {
  // Generate random particles for active theme
  const particles = useMemo(() => {
    if (themeId === 'christmas') {
      const symbols = ['❄', '❅', '❆', '✨', '⭐'];
      return Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 5.5 + Math.random() * 4) % 96}%`,
        animationDuration: `${7 + (i % 6) * 1.5}s`,
        animationDelay: `${(i * 0.4) % 5}s`,
        fontSize: `${12 + (i % 4) * 4}px`,
        opacity: 0.45 + (i % 3) * 0.15,
      }));
    }

    if (themeId === 'valentine') {
      const symbols = ['💖', '💕', '❤️', '🌹', '✨'];
      return Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 7 + Math.random() * 5) % 95}%`,
        animationDuration: `${8 + (i % 5) * 1.8}s`,
        animationDelay: `${(i * 0.6) % 6}s`,
        fontSize: `${14 + (i % 3) * 5}px`,
        opacity: 0.4 + (i % 3) * 0.15,
      }));
    }

    if (themeId === 'halloween') {
      const symbols = ['🦇', '🎃', '🕸️', '🍬', '✨'];
      return Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 8 + Math.random() * 4) % 94}%`,
        animationDuration: `${9 + (i % 4) * 2}s`,
        animationDelay: `${(i * 0.7) % 5}s`,
        fontSize: `${14 + (i % 4) * 4}px`,
        opacity: 0.5 + (i % 3) * 0.15,
      }));
    }

    if (themeId === 'salah') {
      const symbols = ['🌙', '⭐', '✨', '🏮'];
      return Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 8 + Math.random() * 5) % 94}%`,
        animationDuration: `${10 + (i % 4) * 2}s`,
        animationDelay: `${(i * 0.8) % 6}s`,
        fontSize: `${13 + (i % 3) * 4}px`,
        opacity: 0.45 + (i % 3) * 0.15,
      }));
    }

    if (themeId === 'naija') {
      const symbols = ['🇳🇬', '🎉', '✨', '🍲'];
      return Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 10 + Math.random() * 5) % 95}%`,
        animationDuration: `${9 + (i % 3) * 2}s`,
        animationDelay: `${(i * 0.9) % 5}s`,
        fontSize: `${14 + (i % 3) * 4}px`,
        opacity: 0.45 + (i % 2) * 0.2,
      }));
    }

    return [];
  }, [themeId]);

  if (particles.length === 0) return null;

  const isRising = themeId === 'valentine' || themeId === 'halloween';
  const particleClass = isRising ? 'theme-particle-heart' : 'theme-particle-snow';

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-30 select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={particleClass}
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            fontSize: p.fontSize,
            opacity: p.opacity,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
