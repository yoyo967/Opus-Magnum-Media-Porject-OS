
import React from 'react';

const AtomicWorkflow: React.FC = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden perspective-container">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-[0.2em]">The Mechanics of Power</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 tracking-tighter">
                Atomic Scaling.
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg font-light">
                The old model: A manager delegates to humans. <br/>
                <span className="text-white">The new model:</span> An architect directs intelligence.
            </p>
        </div>

        <div className="relative w-full h-[600px] flex items-center justify-center">
            
            {/* THE NUCLEUS (YOU/INTERIM MANAGER) */}
            <div className="relative z-20 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-400 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)] z-10 flex items-center justify-center">
                    <span className="font-bold text-black tracking-widest">YOU</span>
                </div>
                {/* Nucleus Energy Field */}
                <div className="absolute -inset-4 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>

            {/* ORBIT 1: STRATEGY (Close Range) */}
            <div className="absolute w-[300px] h-[300px] border border-purple-500/30 rounded-full animate-[spin_20s_linear_infinite] border-dashed">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0A0A0A] border border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <span className="text-[8px] text-purple-400 font-mono">LOGIC</span>
                </div>
            </div>

            {/* ORBIT 2: CREATION (Mid Range) */}
            <div className="absolute w-[500px] h-[500px] border border-blue-500/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg)' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-[#0A0A0A] border border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <span className="text-[8px] text-blue-400 font-mono">ART</span>
                </div>
            </div>

            {/* ORBIT 3: EXECUTION (Far Range) */}
            <div className="absolute w-[700px] h-[700px] border border-green-500/20 rounded-full animate-[spin_40s_linear_infinite]">
                 <div className="absolute top-1/2 right-0 translate-x-1/2 w-6 h-6 bg-[#0A0A0A] border border-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <span className="text-[6px] text-green-400 font-mono">OPS</span>
                </div>
            </div>

            {/* Connecting Lines (Neural Synapses) */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                    <defs>
                        <radialGradient id="synapse-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </radialGradient>
                    </defs>
                    {/* Static visualization of dynamic connections */}
                    <line x1="50%" y1="50%" x2="50%" y2="25%" stroke="url(#synapse-gradient)" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="url(#synapse-gradient)" strokeWidth="1" strokeOpacity="0.2" />
                    <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#synapse-gradient)" strokeWidth="1" strokeOpacity="0.2" />
                </svg>
            </div>

        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            <div className="text-center">
                <h4 className="text-white font-bold mb-2">1. The Nucleus (Who)</h4>
                <p className="text-xs text-gray-500">You define the vision. You hold the context. You are the only variable that cannot be automated: The Intent.</p>
            </div>
            <div className="text-center">
                <h4 className="text-white font-bold mb-2">2. The Electrons (What)</h4>
                <p className="text-xs text-gray-500">Autonomous agents execute specialized tasks. Strategy, design, analysis – simultaneously and at light speed.</p>
            </div>
            <div className="text-center">
                <h4 className="text-white font-bold mb-2">3. The Energy (Why)</h4>
                <p className="text-xs text-gray-500">The result is massive kinetic energy. Projects that took months now happen in hours.</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AtomicWorkflow;
