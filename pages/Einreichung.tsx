
import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/AppContext';

interface EinreichungProps {
  navigateTo: (page: string) => void;
}

const NexusCore: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className="relative w-48 h-48 md:w-64 md:h-64 transition-all duration-1000">
        <style>{`
            @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes rotate-fast { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            @keyframes pulse-core { 0%, 100% { r: 8; opacity: 1; filter: drop-shadow(0 0 4px #fff); } 50% { r: 10; opacity: 0.7; filter: drop-shadow(0 0 8px #fff); } }
            @keyframes boot-pulse { 0% { filter: drop-shadow(0 0 0px #a855f7); opacity: 0.5; } 50% { filter: drop-shadow(0 0 20px #a855f7); opacity: 1; } 100% { filter: drop-shadow(0 0 0px #a855f7); opacity: 0.5; } }
        `}</style>
        <svg viewBox="0 0 100 100" className={`w-full h-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-60'}`} style={isActive ? { animation: 'boot-pulse 2s infinite' } : {}}>
            <g style={{ animation: 'rotate-slow 40s linear infinite' }}>
                <circle cx="50" cy="50" r="48" fill="none" stroke={isActive ? "rgba(168, 85, 247, 0.3)" : "rgba(255,255,255,0.1)"} strokeWidth="0.5" />
                <circle cx="50" cy="2" r="2" fill={isActive ? "#d8b4fe" : "rgba(255,255,255,0.7)"} />
            </g>
            <g style={{ animation: 'rotate-fast 25s linear infinite reverse' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke={isActive ? "rgba(168, 85, 247, 0.4)" : "rgba(255,255,255,0.15)"} strokeWidth="0.5" />
                 <circle cx="12" cy="50" r="1.5" fill={isActive ? "#d8b4fe" : "rgba(255,255,255,0.6)"} />
            </g>
             <g style={{ animation: 'rotate-slow 50s linear infinite' }}>
                <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke={isActive ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.05)"} strokeWidth="0.25" />
            </g>
            <g style={{ animation: 'rotate-fast 15s linear infinite' }}>
                <circle cx="50" cy="50" r="28" fill="none" stroke={isActive ? "rgba(168, 85, 247, 0.5)" : "rgba(255,255,255,0.2)"} strokeWidth="0.5" />
            </g>
            <circle cx="50" cy="50" r="12" fill="none" stroke={isActive ? "rgba(168, 85, 247, 0.6)" : "rgba(255,255,255,0.3)"}/>
            <circle cx="50" cy="50" r="8" fill={isActive ? "#a855f7" : "#F5F5F5"} style={{ animation: 'pulse-core 3s ease-in-out infinite' }} />
        </svg>
    </div>
);

const BootLog: React.FC<{ logs: string[] }> = ({ logs }) => {
    const endRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [logs]);
    return (
        <div className="font-mono text-xs text-left space-y-1 h-32 overflow-y-auto w-full max-w-md bg-black/40 p-4 rounded border border-green-900/30 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            {logs.map((log, i) => (
                <div key={i} className="text-green-500/80 animate-[fadeIn_0.1s_ease-out]">
                    <span className="opacity-50 mr-2">{`>`}</span>{log}
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

const Einreichung: React.FC<EinreichungProps> = ({ navigateTo }) => {
    const { updateUserProfile, addSystemLog } = useTasks();
    const [step, setStep] = useState<'intro' | 'identity' | 'mission' | 'booting'>('intro');
    
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [organization, setOrganization] = useState('');
    const [mission, setMission] = useState('');
    
    const [bootLogs, setBootLogs] = useState<string[]>([]);

    const runBootSequence = () => {
        setStep('booting');
        const sequence = [
            "Initializing Core Systems...",
            "Connecting to Neural Backbone...",
            "Authenticating User Identity...",
            `User Recognized: ${name} // ${role}`,
            "Loading Strategic Modules...",
            "Calibrating 'Dirigent' Analysis Engine...",
            "Activating 'Visionär' Creative Matrix...",
            "Syncing 'Stratege' with Mission Parameters...",
            `Mission Target Locked: "${mission.substring(0, 20)}..."`,
            "System Optimized.",
            "Welcome to Project OS."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                setBootLogs(prev => [...prev, sequence[i]]);
                i++;
            } else {
                clearInterval(interval);
                updateUserProfile({ name, role, organization, mission });
                addSystemLog('System Initialization Protocol completed successfully.', 'System', 'success');
                setTimeout(() => navigateTo('observatorium'), 1000);
            }
        }, 400);
    };

    const handleNext = () => {
        if (step === 'intro') setStep('identity');
        else if (step === 'identity' && name && role) setStep('mission');
        else if (step === 'mission' && mission) runBootSequence();
    };

    const handleSkip = () => {
        const demoProfile = { name: 'Commander', role: 'Lead Architect', organization: 'Global Ops', mission: 'Explore System Capabilities' };
        updateUserProfile(demoProfile);
        addSystemLog('Demo Mode activated.', 'System', 'warning');
        navigateTo('meisterwerk');
    };

    return (
        <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-xl animate-[fadeIn_0.5s_ease-out]">
                <NexusCore isActive={step === 'booting'} />
                
                <div className="mt-12 w-full">
                    {step === 'intro' && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
                                System Initialization
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                                Welcome to OPUS MAGNUM MEDIA. Before we grant access to the Project OS, we must synchronize the system with your strategic intent.
                            </p>
                            <div className="flex flex-col gap-4 items-center pt-4">
                                <button onClick={handleNext} className="bg-white text-black px-10 py-3 rounded-full font-medium text-base hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-white/10 w-full max-w-xs">
                                    Initialize System
                                </button>
                                <button onClick={handleSkip} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                                    Skip Initialization (Demo Mode)
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'identity' && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h2 className="text-2xl font-bold text-white">Identity Protocol</h2>
                            <p className="text-sm text-gray-500">Who is taking command of this session?</p>
                            <div className="space-y-4 max-w-xs mx-auto">
                                <input type="text" placeholder="Name / Callsign" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0A0A0A] text-white text-center px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none transition-colors" autoFocus />
                                <input type="text" placeholder="Role / Rank" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#0A0A0A] text-white text-center px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none transition-colors" />
                                <input type="text" placeholder="Organization (Optional)" value={organization} onChange={e => setOrganization(e.target.value)} className="w-full bg-[#0A0A0A] text-white text-center px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none transition-colors" />
                            </div>
                            <button onClick={handleNext} disabled={!name || !role} className="mt-4 bg-purple-600 text-white px-8 py-2 rounded-full font-medium hover:bg-purple-500 disabled:opacity-50 transition-all">
                                Confirm Identity
                            </button>
                        </div>
                    )}

                    {step === 'mission' && (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <h2 className="text-2xl font-bold text-white">Strategic Directive</h2>
                            <p className="text-sm text-gray-500">Define the primary objective for the AI Agents.</p>
                            <div className="max-w-sm mx-auto">
                                <textarea 
                                    placeholder="e.g., Launch a rebranding campaign for a fintech startup targeting Gen Z..." 
                                    value={mission} 
                                    onChange={e => setMission(e.target.value)} 
                                    rows={4}
                                    className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none transition-colors resize-none" 
                                    autoFocus
                                />
                            </div>
                            <button onClick={handleNext} disabled={!mission} className="mt-4 bg-green-600 text-white px-8 py-2 rounded-full font-medium hover:bg-green-500 disabled:opacity-50 transition-all">
                                Execute Boot Sequence
                            </button>
                        </div>
                    )}

                    {step === 'booting' && (
                        <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                            <h2 className="text-xl font-mono text-purple-400 mb-6 animate-pulse">SYSTEM BOOT IN PROGRESS...</h2>
                            <BootLog logs={bootLogs} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Einreichung;
