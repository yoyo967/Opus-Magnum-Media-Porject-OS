
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { NeuralBackground } from './NeuralBackground';
import { useTasks } from '../contexts/AppContext';

// --- UI COMPONENTS ---

const ClientLogo: React.FC<{ name: string }> = ({ name }) => (
    <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500 group cursor-default grayscale hover:grayscale-0">
        <div className="w-1 h-4 bg-white/20 group-hover:bg-purple-500 transition-colors rounded-sm"></div>
        <span className="text-xs font-mono tracking-widest text-gray-500 group-hover:text-white uppercase transition-colors">{name}</span>
    </div>
);

const DataBeam: React.FC<{ isActive: boolean; onComplete: () => void }> = ({ isActive, onComplete }) => {
    if (!isActive) return null;
    
    return (
        <div 
            className="absolute top-1/2 left-1/2 w-[45vw] h-[2px] bg-gradient-to-l from-purple-500 via-white to-transparent pointer-events-none z-50 origin-right"
            style={{
                transform: 'translate(-100%, -50%)',
                animation: 'beam-travel 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            }}
            onAnimationEnd={onComplete}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(168,85,247,1)]"></div>
            <style>{`
                @keyframes beam-travel {
                    0% { width: 0; opacity: 0; transform: translate(10%, -50%); }
                    10% { opacity: 1; }
                    100% { width: 100%; opacity: 0; transform: translate(-100%, -50%); }
                }
            `}</style>
        </div>
    );
};

// --- NEURAL INTERFACE (Connected Tool) ---

const NeuralInterface: React.FC<{ pulse: boolean }> = ({ pulse }) => {
    const { systemLogs } = useTasks();
    const [localMetrics, setLocalMetrics] = useState({ reach: 12450, sentiment: 98.4, velocity: 12, stability: 100 });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // 1. React to Data Beam Pulse
    useEffect(() => {
        if (pulse) {
            setIsProcessing(true);
            setLocalMetrics(prev => ({
                reach: prev.reach + Math.floor(Math.random() * 2500),
                sentiment: Math.min(100, prev.sentiment + (Math.random() * 2 - 0.5)),
                velocity: 100, 
                stability: prev.stability
            }));
            const timer = setTimeout(() => setIsProcessing(false), 800);
            return () => clearTimeout(timer);
        }
    }, [pulse]);

    // 2. Background Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setLocalMetrics(prev => ({
                reach: prev.reach + Math.floor(Math.random() * 5),
                sentiment: prev.sentiment,
                velocity: Math.max(5, prev.velocity - 2), // Velocity decay
                stability: Math.min(100, prev.stability + 0.05)
            }));
        }, 100);
        return () => clearInterval(interval);
    }, []);
    
    // 3. Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [systemLogs, isProcessing]);

    // 4. Canvas Visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId = 0;
        let t = 0;

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<w; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,h); }
            for(let i=0; i<h; i+=20) { ctx.moveTo(0,i); ctx.lineTo(w,i); }
            ctx.stroke();

            // Waveform (Data Stream)
            ctx.beginPath();
            ctx.strokeStyle = isProcessing ? 'rgba(168, 85, 247, 0.8)' : 'rgba(34, 197, 94, 0.4)'; 
            ctx.lineWidth = 2;
            for (let x = 0; x < w; x++) {
                const frequency = isProcessing ? 0.2 : 0.05;
                const amplitude = isProcessing ? 20 : 10;
                const y = h/2 + Math.sin(x * frequency + t) * amplitude * (localMetrics.stability/100);
                x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
            }
            ctx.stroke();

            // FFT Bars (Velocity)
            const barWidth = 4;
            const gap = 2;
            const bars = Math.floor(w / (barWidth + gap));
            
            for (let i = 0; i < bars; i++) {
                const waveHeight = Math.sin(i * 0.2 + t * 4) * 0.5 + 0.5;
                const noise = Math.random() * 0.3;
                const amp = isProcessing ? 60 : (localMetrics.velocity * 0.8); 
                const barHeight = (waveHeight + noise) * amp + 2;
                
                const x = i * (barWidth + gap);
                const y = h - barHeight;
                
                ctx.fillStyle = isProcessing ? `rgba(255, 255, 255, ${0.5 + Math.random()*0.5})` : 'rgba(168, 85, 247, 0.3)';
                ctx.fillRect(x, y, barWidth, barHeight);
            }

            t += isProcessing ? 0.2 : 0.05;
            frameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frameId);
    }, [isProcessing, localMetrics.velocity, localMetrics.stability]);

    // Filter last 5 logs for the display
    const displayLogs = systemLogs.slice(0, 6).reverse();

    return (
        <div className={`w-[380px] holographic-card rounded-xl overflow-hidden flex flex-col font-mono text-[10px] animate-[slideInLeft_0.8s_ease-out] transition-all duration-300 border border-white/10 backdrop-blur-2xl ${isProcessing ? 'shadow-[0_0_40px_rgba(168,85,247,0.3)] border-purple-500/50 translate-x-2' : 'hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]'}`}>
            {/* Header */}
            <div className="h-8 bg-[#050505]/90 flex items-center justify-between px-3 select-none border-b border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isProcessing ? 'bg-purple-500 shadow-[0_0_10px_#a855f7] scale-150' : 'bg-green-500'}`}></div>
                    <span className="font-bold tracking-widest uppercase text-gray-300">Neural Core v3.0</span>
                </div>
                <div className="flex gap-1 text-[8px] text-gray-600 font-mono">
                    <span>{isProcessing ? 'RECEIVING_DATA' : 'MONITORING'}</span>
                </div>
            </div>
            
            {/* Visualizer */}
            <div className="h-32 relative bg-black/60 border-b border-white/5">
                <canvas ref={canvasRef} width={380} height={128} className="w-full h-full block" />
                <div className="absolute top-2 right-2 flex flex-col items-end pointer-events-none gap-1">
                    {isProcessing && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">UPLINK ACTIVE</span>}
                </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5 h-24 bg-[#080808]/80">
                <div className="p-3 flex flex-col justify-center">
                    <div className="text-gray-500 uppercase text-[9px] tracking-widest mb-1">Global Reach</div>
                    <div className="text-2xl text-white font-bold tracking-tight flex items-center gap-2">
                        {localMetrics.reach.toLocaleString()}
                        <span className="text-[10px] text-green-500">▲</span>
                    </div>
                </div>
                <div className="p-3 flex flex-col justify-center">
                    <div className="text-gray-500 uppercase text-[9px] tracking-widest mb-1">System Sentiment</div>
                    <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-blue-400">{localMetrics.sentiment.toFixed(1)}%</span>
                        <div className="h-1.5 w-16 bg-gray-800 rounded-full mb-1.5 overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${localMetrics.sentiment}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Terminal Log */}
            <div className="h-32 bg-black/90 p-3 overflow-hidden font-mono text-gray-500 relative border-t border-white/10 shadow-inner">
                <div className="absolute inset-0 overflow-y-auto scrollbar-none p-3 flex flex-col justify-end">
                     {displayLogs.length === 0 && <div className="text-gray-700 italic">System initialization complete. Waiting for input...</div>}
                     {displayLogs.map((log, i) => (
                        <div key={log.id || i} className="py-0.5 flex gap-2 text-[9px] animate-[fadeIn_0.2s_ease-out]">
                            <span className="text-green-800">{`>`}</span>
                            <span className={log.type === 'error' ? 'text-red-400' : log.agent === 'Social Media' ? 'text-purple-400' : 'text-gray-400'}>
                                <span className="uppercase opacity-70 mr-1">[{log.agent}]</span>
                                {log.message}
                            </span>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                    <div className="animate-pulse text-purple-500 mt-1 flex gap-2">
                        <span>_</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- INTERACTION BUTTON ---

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; type: string; onInteract: (type: string) => void }> = ({ icon, label, type, onInteract }) => {
    const [active, setActive] = useState(false);
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setActive(true);
        onInteract(type);
        setTimeout(() => setActive(false), 300);
    };

    return (
        <button 
            onClick={handleClick}
            className={`group relative flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-200 ${active ? 'bg-white/20 border-white text-white scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}
        >
            <div className="transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-300 text-purple-400 group-hover:text-white">{icon}</div>
            <div className="flex flex-col items-start">
                <span className="text-xs font-mono uppercase tracking-wider font-bold">{label}</span>
                <span className="text-[9px] text-gray-600 group-hover:text-gray-400 transition-colors">TRIGGER EVENT</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </button>
    );
};

// --- HERO SECTION ---

const Hero: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { addSystemLog } = useTasks();
    const [pulseInterface, setPulseInterface] = useState(false);
    const [beamActive, setBeamActive] = useState(false);

    const handleInteraction = useCallback((type: string) => {
        // 1. Trigger Visual Beam
        setBeamActive(true);
        
        // 2. Log Global System Event
        addSystemLog(`Signal detected: ${type.toUpperCase()}`, 'Social Media', 'success');
    }, [addSystemLog]);
    
    const handleBeamComplete = useCallback(() => {
        setBeamActive(false);
        setPulseInterface(true);
        setTimeout(() => setPulseInterface(false), 100); // Reset trigger
    }, []);

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-[#030303] perspective-container">
            
            <div className="retro-grid"></div>
            <div className="absolute inset-0 z-0 opacity-40">
                 <NeuralBackground opacity={0.3} />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_90%)] z-1 pointer-events-none"></div>
     
            {/* DATA BEAM LAYER */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <DataBeam isActive={beamActive} onComplete={handleBeamComplete} />
            </div>

            {/* LEFT SIDE COMMAND DECK - Visible from LG upwards */}
            <div className="absolute left-[5%] top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 transform scale-90 xl:scale-100 origin-left">
                 <NeuralInterface pulse={pulseInterface} />
            </div>
     
           <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
             
             <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-black/40 border border-white/10 mb-10 backdrop-blur-sm hover:border-green-500/30 transition-colors cursor-default font-mono text-[10px] tracking-wider text-gray-400 shadow-lg">
                 <div className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                     </span>
                     <span>SYSTEM: ONLINE</span>
                 </div>
                 <span className="text-gray-700">|</span>
                 <div className="opacity-70">
                      INITIALIZING NEURAL CORE... v3.0
                 </div>
             </div>
     
             <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-8 relative drop-shadow-2xl">
                 <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mix-blend-overlay">DIGITAL</span>
                 <span className="block relative">
                      INTERIM
                      <span className="absolute top-0 left-0 -ml-1 opacity-30 text-purple-500 mix-blend-screen animate-pulse" style={{clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px)'}}>INTERIM</span>
                 </span>
                 <span className="block text-3xl md:text-5xl lg:text-6xl font-light text-gray-400 mt-4 font-mono tracking-tight">C-LEVEL ARCHITECTURE</span>
             </h1>
             
             <p className="mt-8 max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed font-light tracking-wide glass-panel p-6 rounded-2xl border-t border-white/10 shadow-2xl">
               High-End Strategy, Creation, and Management. <br/>
               We democratize the <span className="text-white font-medium">Infrastructure of Excellence</span> for tomorrow's leaders.
             </p>
             
             <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 relative z-30">
               <button
                 onClick={() => navigateTo('einreichung')}
                 className="group relative px-10 py-5 bg-white text-black font-bold text-sm uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] rounded-sm"
               >
                  <div className="absolute inset-0 bg-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center gap-3">
                     INITIALIZE SYSTEM
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                 </span>
               </button>
               
               <button onClick={() => navigateTo('campaign')} className="text-gray-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-3 group bg-white/5 px-8 py-5 rounded-sm border border-white/5 hover:border-white/20 backdrop-blur-sm">
                  <span className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-sm animate-pulse"></span>
                     <span>Read Mission Briefing</span>
                 </span>
               </button>
             </div>
     
             {/* INTERACTION HUB */}
             <div className="flex flex-col items-center mt-16 relative z-30">
                 <div className="p-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
                     <div className="bg-[#050505]/80 backdrop-blur-xl rounded-2xl p-2 flex flex-wrap justify-center gap-4 border border-white/5 shadow-2xl">
                        <SocialButton onInteract={handleInteraction} type="User Uplink" label="INITIALIZE UPLINK" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>} />
                        <div className="hidden sm:block w-px bg-white/10 my-2"></div>
                        <SocialButton onInteract={handleInteraction} type="Broadcast" label="BROADCAST SIGNAL" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" /></svg>} />
                     </div>
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-600 font-mono tracking-wide opacity-60">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    Interact to feed live data into the Neural Core.
                 </div>
             </div>
     
             <div className="mt-32 pt-8 border-t border-white/5 flex flex-col items-center w-full max-w-4xl mx-auto">
                 <p className="text-[10px] text-gray-700 mb-8 uppercase tracking-[0.3em] font-mono">Architecting Growth For</p>
                 <div className="flex justify-between items-center w-full px-10 flex-wrap gap-8 grayscale opacity-40 hover:opacity-100 transition-all duration-700">
                     <ClientLogo name="Apex Corp" />
                     <ClientLogo name="Nebula Systems" />
                     <ClientLogo name="Vanguard AI" />
                     <ClientLogo name="Echo Valley" />
                     <ClientLogo name="Sirius Cybernetics" />
                 </div>
             </div>
           </div>
         </section>
    );
};

export default Hero;
