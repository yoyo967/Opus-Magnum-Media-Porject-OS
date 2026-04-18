
import React from 'react';

const ComparisonRow: React.FC<{ label: string; oldWay: string; newWay: string }> = ({ label, oldWay, newWay }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 py-6 border-b border-white/5 last:border-0 items-center gap-4 md:gap-0">
        <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">{label}</div>
        <div className="text-gray-400 text-sm md:border-r border-white/5 md:pr-8">{oldWay}</div>
        <div className="text-white font-medium text-base md:pl-8 flex items-center gap-2">
            <span className="text-purple-400">●</span> {newWay}
        </div>
    </div>
);

const ValueProposition: React.FC = () => {
  return (
    <section className="py-24 bg-[#080808] relative">
      <div className="container mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                    The era of <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Fragmented Competence</span> is over.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                    Companies face a dilemma: Excellent marketing requires strategy, creativity, analysis, and technical understanding. 
                    Until now, this meant: Expensive agencies, fragmented freelancer networks, or an overloaded in-house team.
                    <br/><br/>
                    The Project OS is the answer. A central nervous system that unites C-Level strategy with operational AI power.
                </p>
            </div>
            <div className="relative">
                 {/* Visual Metaphor: Chaos vs Order */}
                 <div className="bg-[#111] rounded-2xl border border-white/10 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                    <h3 className="text-white font-bold mb-6">The Efficiency Shift</h3>
                    
                    <div className="space-y-1">
                        <ComparisonRow 
                            label="Strategy" 
                            oldWay="Consultant (€2,000 / Day)" 
                            newWay="Strategist & Oracle (Instant)" 
                        />
                        <ComparisonRow 
                            label="Creation" 
                            oldWay="Agency Briefing & Wait Time" 
                            newWay="Visionary & Animator (Realtime)" 
                        />
                        <ComparisonRow 
                            label="Analysis" 
                            oldWay="Manual Excel Reports" 
                            newWay="Reporter (Automated)" 
                        />
                        <ComparisonRow 
                            label="Scaling" 
                            oldWay="Linear (More Staff)" 
                            newWay="Exponential (AI Agents)" 
                        />
                    </div>
                 </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
             <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="text-white font-bold mb-2">Speed to Market</h4>
                <p className="text-sm text-gray-400">From idea to campaign in minutes instead of weeks.</p>
             </div>
             <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <div className="text-3xl mb-2">💎</div>
                <h4 className="text-white font-bold mb-2">Enterprise Quality</h4>
                <p className="text-sm text-gray-400">Assets and strategies at corporate level for every budget.</p>
             </div>
             <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="text-white font-bold mb-2">Strategic Core</h4>
                <p className="text-sm text-gray-400">No blind execution. Every action follows your DNA.</p>
             </div>
        </div>

      </div>
    </section>
  );
};

export default ValueProposition;
