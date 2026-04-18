
import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../contexts/AppContext';

interface SystemMonitorProps {
    onClose: () => void;
}

const RealTimeGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let data: number[] = Array(150).fill(0.5); // Start mid-range
        let animationFrameId: number;
        let offset = 0;

        const draw = () => {
            if (!canvas || !ctx) return;
            
            // Simulate data stream
            const time = Date.now() * 0.002;
            const noise = (Math.sin(time) * 0.3) + (Math.cos(time * 2.5) * 0.1) + (Math.random() * 0.1);
            const target = 0.5 + (noise * 0.4); // Keep within 0.1 - 0.9
            
            // Smooth interpolation
            const last = data[data.length - 1];
            const next = last + (target - last) * 0.1;
            
            data.push(next);
            data.shift();

            // Rendering
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid effect
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Moving vertical grid lines
            offset = (offset + 0.5) % 40;
            for (let x = -offset; x < canvas.width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
            for (let y = 0; y < canvas.height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
            ctx.stroke();

            // The Graph Line
            ctx.strokeStyle = '#4ade80'; // green-400
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4ade80';
            ctx.beginPath();
            
            const step = canvas.width / (data.length - 1);
            
            // Start path
            ctx.moveTo(0, canvas.height - (data[0] * canvas.height));
            
            // Draw curves
            for (let i = 1; i < data.length - 1; i++) {
                const x_mid = (i * step + (i + 1) * step) / 2;
                const y_mid = (canvas.height - (data[i] * canvas.height) + canvas.height - (data[i + 1] * canvas.height)) / 2;
                const cp_x1 = (i * step + x_mid) / 2;
                const cp_y1 = (canvas.height - (data[i] * canvas.height));
                ctx.quadraticCurveTo(i * step, canvas.height - (data[i] * canvas.height), x_mid, y_mid);
            }
            ctx.stroke();
            
            // Gradient Fill
            ctx.shadowBlur = 0;
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            animationFrameId = requestAnimationFrame(draw);
        };

        // Handle resize for crisp rendering
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="relative w-full h-32 rounded bg-black border border-green-500/30 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute top-2 left-2 text-[10px] font-mono text-green-400 bg-black/50 px-1 rounded">NEURAL_LOAD</div>
        </div>
    );
};

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ onClose }) => {
    const { systemLogs } = useTasks();
    const [activeAgents, setActiveAgents] = useState<string[]>([]);
    const [storageUsage, setStorageUsage] = useState(0);

    const AGENTS = ['Stratege', 'Dirigent', 'Visionär', 'Conductor', 'Aurora', 'System', 'Nexus', 'Chronist'];

    useEffect(() => {
        const recentAgents = systemLogs.slice(0, 15).map(log => log.agent);
        const uniqueActive = Array.from(new Set(recentAgents));
        setActiveAgents(uniqueActive);
        
        let total = 0;
        for(let x in localStorage) {
            if(Object.prototype.hasOwnProperty.call(localStorage, x)) {
                total += ((localStorage[x].length + x.length) * 2);
            }
        }
        setStorageUsage(total / 1024);
    }, [systemLogs]);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div 
                onClick={e => e.stopPropagation()} 
                className="w-full max-w-4xl bg-[#050505] border border-green-500/30 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-green-500/20 bg-green-900/5">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <h3 className="font-mono text-green-500 font-bold tracking-widest text-xs">SYSTEM_DIAGNOSTICS // V3.0</h3>
                    </div>
                    <button onClick={onClose} className="text-green-500/50 hover:text-green-400 transition-colors font-mono text-xs">[CLOSE]</button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Visuals */}
                    <div className="space-y-6">
                        <RealTimeGraph />
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-green-900/10 border border-green-500/20 p-2 rounded">
                                <div className="text-[10px] text-green-500/60 uppercase">CPU Load</div>
                                <div className="text-xl font-mono text-green-400">{Math.floor(Math.random() * 15 + 10)}%</div>
                            </div>
                            <div className="bg-green-900/10 border border-green-500/20 p-2 rounded">
                                <div className="text-[10px] text-green-500/60 uppercase">Memory</div>
                                <div className="text-xl font-mono text-green-400">14GB</div>
                            </div>
                            <div className="bg-green-900/10 border border-green-500/20 p-2 rounded">
                                <div className="text-[10px] text-green-500/60 uppercase">Latency</div>
                                <div className="text-xl font-mono text-green-400">12ms</div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] text-green-500/60 uppercase tracking-widest mb-2 border-b border-green-500/20 pb-1">Active Matrix</p>
                            <div className="grid grid-cols-2 gap-2">
                                {AGENTS.map(agent => {
                                    const isActive = activeAgents.some(a => a.toLowerCase() === agent.toLowerCase());
                                    return (
                                        <div 
                                            key={agent} 
                                            className={`text-xs border px-3 py-2 rounded transition-all duration-500 flex justify-between items-center ${
                                                isActive 
                                                ? 'border-green-500/50 bg-green-500/10 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                                                : 'border-white/5 bg-white/5 text-gray-600 grayscale'
                                            }`}
                                        >
                                            <span className="font-mono">{agent.toUpperCase()}</span>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse shadow-[0_0_5px_#4ade80]' : 'bg-gray-800'}`}></span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Logs */}
                    <div className="flex flex-col h-full min-h-[300px]">
                         <p className="text-[10px] text-green-500/60 uppercase tracking-widest mb-2 border-b border-green-500/20 pb-1">Event Stream</p>
                         <div className="flex-1 bg-black border border-green-500/20 rounded p-2 overflow-hidden relative">
                            <div className="absolute inset-0 overflow-y-auto scrollbar-hide p-2 font-mono text-[10px] space-y-1">
                                {systemLogs.map(log => (
                                    <div key={log.id} className="flex gap-2 text-green-500/80 border-b border-green-500/5 pb-1 last:border-0 animate-[fadeIn_0.2s_ease-out]">
                                        <span className="opacity-50 w-14 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                        <span className={`font-bold shrink-0 w-16 ${log.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>{log.agent}</span>
                                        <span className="opacity-80 break-all">{log.message}</span>
                                    </div>
                                ))}
                                <div className="animate-pulse text-green-500/50 pt-2">_awaiting_signal</div>
                            </div>
                         </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-2 bg-green-900/5 border-t border-green-500/20 flex justify-between text-[9px] text-green-500/40 font-mono uppercase">
                    <span>Secure Uplink: ENCRYPTED (AES-256)</span>
                    <span>Local Storage: {storageUsage.toFixed(2)} KB</span>
                </div>
            </div>
        </div>
    );
};
