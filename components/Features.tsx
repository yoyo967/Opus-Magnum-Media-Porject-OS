
import React, { useRef, useState } from 'react';
import { SparkleIcon, BrainIcon, MovieIcon, MicIcon, VoiceChatIcon, ChartIcon } from '../constants';

const BentoCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    className?: string;
    bgImage?: string;
    delay?: number;
    link?: string;
}> = ({ title, description, icon, className, bgImage, delay = 0, link }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    
    const handleNavigate = () => {
        if (link) {
            const event = new CustomEvent('navigate', { detail: link });
            window.dispatchEvent(event);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div 
            ref={cardRef}
            onClick={handleNavigate}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative holographic-card rounded-2xl p-8 group transition-all duration-500 ease-out ${className} ${link ? 'cursor-pointer' : ''}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
                transformStyle: 'preserve-3d',
                animationDelay: `${delay}ms`
            }}
        >
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30 rounded-tl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30 rounded-br-lg"></div>

            {bgImage && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${bgImage}`}></div>
                </div>
            )}
            
            <div className="relative z-10 h-full flex flex-col" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6 border border-white/10 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500 backdrop-blur-md">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-sans tracking-tight group-hover:text-purple-200 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">{description}</p>
                
                <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 group-hover:text-green-400 transition-colors uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                        <span>ACTIVE_NODE</span>
                    </div>
                    <span className="text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 duration-300 text-xs uppercase tracking-wider font-bold flex items-center gap-1">
                        Launch Tool →
                    </span>
                </div>
            </div>
        </div>
    );
};

const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-[#030303] relative overflow-hidden perspective-container">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-purple-500"></div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">System Modules</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8">
            The Neural Engine.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-800">Infrastructure for the Mind.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[360px]">
            <BentoCard 
                className="md:col-span-2 lg:col-span-2"
                title="Reasoning Core"
                description="Der 'Think Mode' für komplexe Strategien. Gemini 2.5 Pro analysiert Zusammenhänge in Ihrem Unternehmen."
                icon={<BrainIcon />}
                bgImage="from-purple-900/40 to-blue-900/10"
                delay={0}
                link="stratege"
            />
            
            <BentoCard 
                className="md:col-span-1 lg:row-span-2"
                title="Holo-Deck Chat"
                description="Echtzeit-Beratung mit dem Konversator. Brainstorming ohne Latenz dank Gemini Flash-Lite."
                icon={<VoiceChatIcon />}
                bgImage="from-green-900/20 to-emerald-900/10"
                delay={100}
                link="konversator"
            />

            <BentoCard 
                title="Imagen 4 Studio"
                description="Fotorealistische Assets on demand. Keine Stockfotos mehr nötig."
                icon={<SparkleIcon />}
                delay={200}
                link="visionar"
            />

            <BentoCard 
                title="Veo Motion"
                description="Verwandeln Sie statische Konzepte in dynamische Video-Narrative."
                icon={<MovieIcon />}
                delay={300}
                link="animator"
            />

            <BentoCard 
                className="md:col-span-2 lg:col-span-2"
                title="Predictive Intel"
                description="Scannen Sie das Web in Echtzeit nach Konkurrenz-Signalen."
                icon={<ChartIcon />}
                bgImage="from-orange-900/20 to-red-900/10"
                delay={400}
                link="spaeher"
            />
             
             <BentoCard 
                title="Sonic Branding"
                description="KI-gesteuerte Sprachausgabe in Studioqualität für Ihre Marke."
                icon={<MicIcon />}
                delay={500}
                link="auditor"
            />
        </div>
      </div>
    </section>
  );
};

export default Features;
