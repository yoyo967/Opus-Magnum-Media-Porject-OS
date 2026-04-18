
import React from 'react';
import { useTasks } from '../contexts/AppContext';

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start gap-3 text-gray-400 text-xs font-mono group-hover:text-gray-300 transition-colors">
        <div className="w-4 h-4 rounded-sm bg-green-900/20 border border-green-500/30 flex items-center justify-center mt-0.5 flex-shrink-0 text-green-500">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span>{text}</span>
    </li>
);

const PricingCard: React.FC<{ 
    tier: string; 
    price: string; 
    credits: number;
    subtitle: string;
    description: string; 
    features: string[]; 
    isPopular?: boolean; 
    cta: string;
    onBuy?: () => void;
}> = ({ tier, price, credits, subtitle, description, features, isPopular, cta, onBuy }) => (
    <div className={`group relative p-px rounded-sm transition-all duration-500 hover:-translate-y-2 ${isPopular ? 'bg-gradient-to-b from-purple-500 to-blue-500' : 'bg-white/10 hover:bg-white/20'}`}>
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black border border-purple-500 text-purple-400 text-[10px] font-bold px-4 py-1 rounded-sm uppercase tracking-widest z-10 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                Optimal Config
            </div>
        )}
        
        <div className="h-full bg-[#080808] rounded-sm p-8 flex flex-col relative overflow-hidden">
            {/* Tech Texture */}
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="mb-8 border-b border-dashed border-white/10 pb-8">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-bold text-white uppercase tracking-widest font-mono">{tier}</h3>
                    <span className="text-xs font-mono text-green-400 border border-green-500/30 px-2 py-0.5 rounded bg-green-900/10">+{credits} Credits</span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-white font-mono tracking-tighter">{price}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{description}</p>
            </div>
            
            <div className="flex-1 mb-8">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4 font-bold">Resource Allocation</p>
                <ul className="space-y-4">
                    {features.map((feature, i) => <CheckItem key={i} text={feature} />)}
                </ul>
            </div>

            <button onClick={onBuy} className={`w-full py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden group/btn ${isPopular ? 'bg-white text-black hover:bg-purple-500 hover:text-white' : 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-black'}`}>
                <span className="relative z-10">{cta}</span>
                {isPopular && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>}
            </button>
        </div>
    </div>
);

const Pricing: React.FC = () => {
  const { addCredits } = useTasks();

  return (
    <section id="pricing" className="py-32 bg-black relative border-t border-white/5">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">Neural Resource Allocation.</h2>
            <p className="text-lg text-gray-400 font-light">
                OPUS MAGNUM operates on a Credit System. You pay for computational power, not just access.<br/>
                <span className="text-purple-400 text-sm block mt-2">1 Text Gen = 1 Credit | Live Search = 5 Credits | Image Gen = 10 Credits</span>
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PricingCard 
                tier="Starter Node"
                price="Free"
                credits={500}
                subtitle="ENTRY_POINT"
                description="Initialize your digital presence. Monthly reset for solo operators."
                features={[
                    "500 Credits / Month",
                    "Access: Visionary (Standard)",
                    "Access: Strategist (Basic)",
                    "Local Storage"
                ]}
                cta="Reload Free Credits"
                onBuy={() => addCredits(500)}
            />
            <PricingCard 
                tier="Production Cluster"
                price="€49"
                credits={5000}
                subtitle="PRODUCTION_READY"
                description="Full orchestration power. For teams that need speed and quality."
                isPopular
                features={[
                    "5,000 Credits / Month",
                    "Access: Conductor (Auto-Mode)",
                    "Access: Masterpiece Unlimited",
                    "Model: Gemini 3.0 Pro",
                    "Priority Processing"
                ]}
                cta="Allocate Cluster"
                onBuy={() => addCredits(5000)}
            />
            <PricingCard 
                tier="Mainframe Access"
                price="€199"
                credits={25000}
                subtitle="ENTERPRISE_CORE"
                description="Dedicated infrastructure. Agentic AI, Security Compliance, and massive throughput."
                features={[
                    "25,000 Credits / Month",
                    "Access: AURORA Autonomous Agent",
                    "Custom Model Fine-Tuning",
                    "SSO & Audit Logs",
                    "Dedicated Support Node"
                ]}
                cta="Initialize Mainframe"
                onBuy={() => addCredits(25000)}
            />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
