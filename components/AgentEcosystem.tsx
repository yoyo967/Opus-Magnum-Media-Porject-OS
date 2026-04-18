
import React, { useState } from 'react';

interface AgentEcosystemProps {
    navigateTo: (page: string) => void;
}

const AGENTS = [
    { name: 'Visionär', page: 'visionar', role: 'Visual Core', description: 'Bild-Generierung & Analyse', color: 'from-purple-500 to-indigo-500' },
    { name: 'Stratege', page: 'stratege', role: 'Logic Core', description: 'Strategie-Entwicklung', color: 'from-blue-500 to-cyan-500' },
    { name: 'Auditor', page: 'auditor', role: 'Voice Interface', description: 'Sprachsteuerung', color: 'from-green-500 to-emerald-500' },
    { name: 'Animator', page: 'animator', role: 'Motion Engine', description: 'Video-Synthese', color: 'from-orange-500 to-red-500' },
    { name: 'Dirigent', page: 'dirigent', role: 'Process Unit', description: 'Projekt-Analyse', color: 'from-pink-500 to-rose-500' },
    { name: 'Konversator', page: 'konversator', role: 'Neural Chat', description: 'Beratung & Text', color: 'from-yellow-500 to-amber-500' },
    { name: 'Orakel', page: 'orakel', role: 'Predictive Unit', description: 'Zukunfts-Prognosen', color: 'from-violet-500 to-fuchsia-500' },
    { name: 'Späher', page: 'spaeher', role: 'Recon Unit', description: 'Markt-Aufklärung', color: 'from-teal-500 to-green-500' },
];

const AgentEcosystem: React.FC<AgentEcosystemProps> = ({ navigateTo }) => {
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const handleNavigate = (page: string) => {
        if (navigateTo) {
            navigateTo(page);
        } else {
            const event = new CustomEvent('navigate', { detail: page });
            window.dispatchEvent(event);
        }
    };

    return (
        <section className="py-40 bg-[#050505] overflow-hidden relative perspective-container">
             {/* 3D Floor Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" style={{ transform: 'rotateX(60deg) translateY(-100px) scale(2)' }}></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-28">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Active Intelligence Grid</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                        The Orbital Ecosystem.
                    </h2>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Keine isolierten Tools. Ein synchronisiertes Netzwerk spezialisierter KI-Kerne, die um Ihre zentrale Mission kreisen.
                    </p>
                </div>

                {/* 3D ORBITAL SYSTEM */}
                <div className="relative w-full h-[800px] flex items-center justify-center -mt-20" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                    
                    {/* Core Nexus */}
                    <div className="absolute z-20 group cursor-pointer" onClick={() => handleNavigate('nexus')}>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                            {/* Spinning Rings around core */}
                            <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-8 border border-dashed border-white/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
                            
                            <div className="relative w-28 h-28 bg-black border border-white/20 rounded-full flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform z-10">
                                <span className="text-3xl mb-1">❖</span>
                                <span className="font-bold text-white tracking-widest text-xs">NEXUS</span>
                            </div>
                        </div>
                    </div>

                    {/* Orbital Rings & Agents */}
                    {AGENTS.map((agent, index) => {
                        const totalAgents = AGENTS.length;
                        const angleStep = 360 / totalAgents;
                        const angle = index * angleStep;
                        const radius = 350; // Orbit radius

                        return (
                            <div 
                                key={agent.name}
                                className="absolute top-1/2 left-1/2 w-[2px] h-[2px] transition-all duration-1000 ease-linear"
                                style={{
                                    transform: `rotate(${angle}deg)`,
                                    animation: isPaused ? 'none' : `orbit 60s linear infinite`,
                                    // We can simulate individual orbits by adding an offset to the rotation in CSS if needed, 
                                    // but simpler is to rotate the whole container or just position them statically 
                                    // and rotate the parent. Here we position them.
                                }}
                            >
                                <style>{`
                                    @keyframes orbit-${index} {
                                        from { transform: rotate(${angle}deg); }
                                        to { transform: rotate(${angle + 360}deg); }
                                    }
                                `}</style>
                                
                                {/* The Agent "Satellite" */}
                                <div 
                                    className="absolute top-0 left-0"
                                    style={{
                                        transform: `translateX(${radius}px) rotate(-${angle}deg)`, // Counter-rotate to keep text upright initially? 
                                        // Actually, in a spinning system, we want the items to stay upright relative to the screen.
                                        // This requires dynamic counter-rotation or a different CSS structure.
                                        // Simplified for this visual:
                                    }}
                                >
                                    {/* Wrapper for the rotating animation */}
                                    <div 
                                        className="relative group/agent cursor-pointer"
                                        onClick={() => handleNavigate(agent.page)}
                                        onMouseEnter={() => setHoveredAgent(agent.name)}
                                        onMouseLeave={() => setHoveredAgent(null)}
                                        style={{
                                            animation: isPaused ? 'none' : `counter-orbit 60s linear infinite`,
                                        }}
                                    >
                                         <style>{`
                                            @keyframes counter-orbit {
                                                from { transform: rotate(-${angle}deg); }
                                                to { transform: rotate(-${angle + 360}deg); }
                                            }
                                        `}</style>

                                        {/* Connection Line to Center (Holographic Beam) */}
                                        <div className={`absolute top-1/2 right-full w-[350px] h-px bg-gradient-to-r from-transparent via-white/10 to-white/30 -z-10 origin-right transform scale-x-0 transition-transform duration-500 ${hoveredAgent === agent.name ? 'scale-x-100' : 'group-hover/agent:scale-x-100'}`}></div>

                                        {/* Agent Node */}
                                        <div className={`w-20 h-20 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center transition-all duration-500 group-hover/agent:scale-110 group-hover/agent:border-white/40 group-hover/agent:shadow-[0_0_30px_rgba(255,255,255,0.2)] relative overflow-hidden z-20`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover/agent:opacity-20 transition-opacity duration-500`}></div>
                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${agent.color} shadow-[0_0_15px_currentColor]`}></div>
                                        </div>

                                        {/* Label - Floating above */}
                                        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-center w-48 pointer-events-none transition-all duration-300 ${hoveredAgent === agent.name ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 group-hover/agent:opacity-100 group-hover/agent:translate-y-0'}`}>
                                            <div className="text-base font-bold text-white tracking-wide">
                                                {agent.name}
                                            </div>
                                            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mt-1">
                                                {agent.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Decorative Orbit Rings */}
                    <div className="absolute rounded-full border border-white/5 w-[700px] h-[700px] animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute rounded-full border border-white/5 w-[500px] h-[500px] animate-[spin_40s_linear_infinite_reverse] opacity-50"></div>
                    <div className="absolute rounded-full border border-dashed border-white/5 w-[900px] h-[900px] animate-[spin_100s_linear_infinite] opacity-30"></div>
                    
                </div>
                
                {/* Mobile View (Fallback) */}
                <div className="md:hidden grid grid-cols-2 gap-4 mt-10">
                     {AGENTS.map(agent => (
                        <button key={agent.name} onClick={() => handleNavigate(agent.page)} className="bg-white/5 p-4 rounded-xl border border-white/10 text-left active:bg-white/10 backdrop-blur-md">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${agent.color} mb-2`}></div>
                            <p className="font-bold text-white text-sm">{agent.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{agent.role}</p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AgentEcosystem;
