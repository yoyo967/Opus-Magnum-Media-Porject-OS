
import React from 'react';

const TimelineNode: React.FC<{ year: string; title: string; desc: string; active?: boolean; last?: boolean }> = ({ year, title, desc, active, last }) => (
    <div className="relative pl-12 pb-16 group">
        {/* Vertical Line */}
        {!last && <div className="absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-white/20 to-white/5 group-hover:from-purple-500 group-hover:to-purple-900/20 transition-colors duration-500"></div>}
        
        {/* Dot */}
        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${active ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/20 bg-black group-hover:border-white/50'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-purple-400' : 'bg-gray-600'}`}></div>
        </div>

        <div>
            <span className={`text-xs font-mono uppercase tracking-widest mb-1 block ${active ? 'text-purple-400' : 'text-gray-600'}`}>{year}</span>
            <h3 className={`text-xl font-bold mb-2 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`}>{title}</h3>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed font-light">{desc}</p>
        </div>
    </div>
);

const FutureTimeline: React.FC = () => {
  return (
    <section className="py-32 bg-black flex justify-center">
        <div className="max-w-4xl w-full px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white tracking-tight mb-4">The Evolution of Management.</h2>
                <p className="text-gray-400">When is the right time? <span className="text-white">Now.</span></p>
            </div>

            <div className="relative">
                <TimelineNode 
                    year="2015 - 2022" 
                    title="The Administrator" 
                    desc="Manual micromanagement. Excel sheets. Endless meetings. Humans are the bottleneck of production."
                />
                <TimelineNode 
                    year="2023 - 2024" 
                    title="The Pilot (Co-Pilot Era)" 
                    desc="First AI tools. Prompting is new. Humans steer the machine but must monitor every step."
                />
                <TimelineNode 
                    year="2025 - TODAY" 
                    title="The Architect (Project OS)" 
                    desc="Systemic integration. You build systems that steer themselves. Agents execute, you only orchestrate the 'Why'."
                    active
                />
                <TimelineNode 
                    year="2030+" 
                    title="The Singularity" 
                    desc="Fully autonomous corporate entities. One human leads 100 virtual employees. The Project OS is the interface for this."
                    last
                />
            </div>
        </div>
    </section>
  );
};

export default FutureTimeline;
