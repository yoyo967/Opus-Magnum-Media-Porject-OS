
import React from 'react';

interface FinalCTAProps {
  navigateTo: (page: string) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ navigateTo }) => {
  return (
    <section className="relative py-48 bg-black overflow-hidden flex items-center justify-center min-h-[80vh]">
      {/* Warp Tunnel Effect */}
      <div className="warp-tunnel"></div>
      
      {/* Starfield */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black"></div>
         {/* Speed Lines Simulation using conic gradient for better tunnel effect */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg,rgba(255,255,255,0.1)_60deg,transparent_80deg)] animate-[spin_8s_linear_infinite]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] opacity-10 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(168,85,247,0.1)_20deg,transparent_40deg,rgba(168,85,247,0.1)_60deg,transparent_80deg)] animate-[spin_12s_linear_infinite_reverse]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block mb-8 px-6 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="text-xs font-mono text-white uppercase tracking-[0.3em] animate-pulse">System Ready for Upload</span>
        </div>
        
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter mb-12 mix-blend-screen leading-none">
          Orchestrate the<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">Singularity.</span>
        </h2>
        
        <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-xl font-light leading-relaxed">
            Connect your vision with the infrastructure of excellence.<br/> The AI agents are awaiting your command.
        </p>
        
        <div className="relative group inline-block">
            {/* Reactor Core Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <button
                onClick={() => navigateTo('einreichung')}
                className="relative bg-white text-black px-16 py-6 rounded-full font-bold text-lg md:text-xl uppercase tracking-[0.2em] transition-all hover:scale-105 flex items-center gap-4 shadow-2xl"
            >
                <span>Initialize Core</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </button>
        </div>
        
        <div className="mt-16 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            Secure Uplink Established // v3.0
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
