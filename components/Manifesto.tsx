
import React from 'react';

const Manifesto: React.FC = () => {
  return (
    <section id="manifesto" className="py-32 bg-[#030303] relative overflow-hidden border-b border-white/5">
       {/* Ambient Background */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
       
       <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono text-purple-300 uppercase tracking-widest">Strategic Horizon 2030</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.9] mb-16">
                The Shift to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-white animate-gradient-x">Agentic Commerce</span>.
            </h2>

            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                <div className="glass-panel p-8 rounded-2xl border-l-4 border-purple-500">
                    <h3 className="text-2xl font-bold text-white mb-4">From B2B to B2B2A</h3>
                    <p className="text-gray-400 leading-relaxed text-lg font-light">
                        The marketing landscape is transforming fundamentally. We are moving from "Marketing to Humans" to <strong>"Marketing to Machines" (B2B2A)</strong>. 
                        By 2030, purchasing decisions will increasingly be made by autonomous AI agents.
                    </p>
                    <p className="text-gray-400 leading-relaxed mt-4 text-lg font-light">
                        Your brand must no longer just convince humans, but be algorithmically readable, structured, and optimized for AI agents (GEO).
                    </p>
                </div>
                
                <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-4">The Barbell Effect</h3>
                    <p className="text-gray-400 leading-relaxed text-lg font-light mb-8">
                        In a flood of AI-generated average content, the value of "good" content drops to zero. At the same time, the value of <strong>verified, human excellence</strong> explodes.
                    </p>
                    
                    <div className="relative h-12 bg-gray-900 rounded-full overflow-hidden flex items-center px-1 border border-white/10">
                        <div className="absolute inset-0 flex">
                            <div className="w-1/2 bg-gradient-to-r from-red-900/40 to-transparent"></div>
                            <div className="w-1/2 bg-gradient-to-l from-green-900/40 to-transparent"></div>
                        </div>
                        <div className="w-full flex justify-between text-xs font-mono uppercase tracking-widest relative z-10 px-4">
                            <span className="text-red-400">Automated Mass</span>
                            <span className="text-green-400">Strategic Empathy</span>
                        </div>
                        {/* Slider Marker */}
                        <div className="absolute left-1/2 top-1 bottom-1 w-1 bg-white shadow-[0_0_10px_white] rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="mt-32 border-t border-white/10 pt-16 flex flex-col items-center">
                <blockquote className="text-3xl md:text-5xl font-serif text-gray-200 text-center italic leading-tight">
                    "You don't manage marketing anymore. <br/>You orchestrate intelligence."
                </blockquote>
                <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-mono uppercase tracking-widest">
                    <span className="h-px w-12 bg-gray-700"></span>
                    <span>OPUS MAGNUM Manifesto</span>
                    <span className="h-px w-12 bg-gray-700"></span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
