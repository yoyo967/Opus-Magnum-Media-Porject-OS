
import React from 'react';

const GlobalGrid: React.FC = () => {
  return (
    <section className="py-24 bg-[#020202] relative border-t border-white/5">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        <div>
            <div className="inline-block px-3 py-1 border border-blue-500/30 rounded-full bg-blue-900/10 mb-6">
                <span className="text-xs font-mono text-blue-400">GLOBAL_INFRASTRUCTURE_V3</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Location-Independent <br/>Omnipresence.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                The office is dead. The network is alive. <br/>
                OPUS MAGNUM runs on the Google Cloud infrastructure. Your commands are replicated globally, your assets reside in a decentralized Neural Grid.
            </p>
            
            <ul className="space-y-4 font-mono text-sm text-gray-500">
                <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#4ade80]"></div>
                    <span>Latency-Free Execution (Edge Computing)</span>
                </li>
                <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#4ade80]"></div>
                    <span>24/7 Agentic Uptime (No Sleep Breaks)</span>
                </li>
                <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#4ade80]"></div>
                    <span>Infinite Scalability (Serverless)</span>
                </li>
            </ul>
        </div>

        <div className="relative h-[400px] bg-[#050505] rounded-2xl border border-white/10 overflow-hidden perspective-container">
             {/* Abstract World Map Grid */}
             <div className="absolute inset-0 opacity-30" style={{ 
                 backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                 backgroundSize: '50px 50px',
                 transform: 'rotateX(45deg) scale(1.5)'
             }}></div>

             {/* Data Nodes */}
             {[...Array(10)].map((_, i) => (
                 <div key={i} className="absolute w-1 h-10 bg-gradient-to-t from-blue-500 to-transparent opacity-70" style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 80 + 10}%`,
                     animation: `pulse ${2 + Math.random()}s infinite`
                 }}></div>
             ))}
             
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050505] to-transparent"></div>

             <div className="absolute center inset-0 flex items-center justify-center">
                 <div className="text-center">
                     <div className="text-4xl font-bold text-white mb-2">12ms</div>
                     <div className="text-xs font-mono text-gray-500 uppercase">Global Avg. Response Time</div>
                 </div>
             </div>
        </div>

      </div>
    </section>
  );
};

export default GlobalGrid;
