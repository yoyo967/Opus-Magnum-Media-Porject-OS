import React from 'react';

/** Minimaler Lazy-Load-Fallback im Dark-Luxury-Stil (Onyx + Gold). */
const LoadingScreen: React.FC = () => (
  <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 rounded-full border-2 border-[#C8A25A]/30 border-t-[#C8A25A] animate-spin" />
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C8A25A]/70">Loading</span>
    </div>
  </div>
);

export default LoadingScreen;
