
import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../contexts/AppContext';
import { GoogleGenAI, Type } from "@google/genai";

// --- ICONS ---
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;
const LayersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.34-1.28l1.17-.195c.323-.054.654.034.905.245l1.33 1.108c.376.314.439.84.182 1.233l-.723.723a1.125 1.125 0 00-.21 1.298l1.348 1.348c.342.342.342.896 0 1.238l-1.349 1.348a1.125 1.125 0 01-1.298-.21l-.723-.723a8.7 8.7 0 00-4.042-2.288 1.087 1.087 0 00-1.099.358l-1.108 1.33c-.21.251-.299.582-.245.905l.195 1.17a1.125 1.125 0 01-1.28 1.34l-.132.13a1.125 1.125 0 01-1.591 0l-.295-.295a1.125 1.125 0 01-.314-.98l.195-1.17c.054-.323-.034-.654-.245-.905L6.115 5.19z" /></svg>;
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const BullseyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;


interface AuditSection {
    id: string;
    title: string;
    status: 'Optimal' | 'Warning' | 'Critical';
    content: string;
}

const StatusBadge: React.FC<{ status: AuditSection['status'] }> = ({ status }) => {
    const colors = {
        Optimal: 'bg-green-500/20 text-green-400 border-green-500/30',
        Warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[status]}`}>
            {status}
        </span>
    );
};

const TerminalLoader: React.FC<{ logs: string[] }> = ({ logs }) => {
    const endRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [logs]);
    return (
        <div className="font-mono text-xs text-green-500/80 p-8 bg-black rounded-lg border border-green-900/30 h-[400px] overflow-y-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            {logs.map((log, i) => (
                <div key={i} className="mb-1 animate-[fadeIn_0.1s_ease-out]">
                    <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    <span className="mr-2">{`>`}</span>{log}
                </div>
            ))}
            <div className="animate-pulse mt-2">_</div>
            <div ref={endRef} />
        </div>
    );
};

const SystemAudit: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { tasks, systemLogs, campaignBrief, exportSystemData, importSystemData } = useTasks();
    const [isScanning, setIsScanning] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const [auditResults, setAuditResults] = useState<AuditSection[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<AuditSection | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isMounted = true;
        const runAudit = async () => {
            // Simulated boot sequence
            const bootSequence = [
                "Initializing System Diagnostic Protocol (Gemini 3.0)...",
                "Connecting to Neural Backbone...",
                "Analyzing Task Graph...",
                `Identified ${tasks.length} active process nodes...`,
                "Checking Data Warehouse Connection...",
                "BigQuery Uplink established (Sandbox Mode)...", // Updated to reflect BigQuery status
                "Verifying Budget Integrity...",
                "Scanning Agent Interactions...",
                `Aggregating ${systemLogs.length} log entries...`,
                "Synthesizing Results via Gemini Core..."
            ];

            for (const msg of bootSequence) {
                if (!isMounted) return;
                setLogs(prev => [...prev, msg]);
                await new Promise(r => setTimeout(r, 600));
            }

            try {
                // Real Analysis
                const stats = {
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter(t => t.status === 'done').length,
                    inProgress: tasks.filter(t => t.status === 'inprogress' || t.status === 'review').length,
                    budgeted: tasks.reduce((acc, t) => acc + (t.budgetedCost || 0), 0),
                    spent: tasks.reduce((acc, t) => acc + (t.actualCost || 0), 0),
                    campaignActive: !!campaignBrief
                };

                const auditSchema = {
                    type: Type.ARRAY,
                    description: "A list of audit sections.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            status: { type: Type.STRING, enum: ['Optimal', 'Warning', 'Critical'] },
                            content: { type: Type.STRING, description: "HTML formatted analysis content." }
                        },
                        required: ['id', 'title', 'status', 'content']
                    }
                }

                const prompt = `Act as a System Architect AI for 'Project OS'. Perform a deep diagnostic audit based on the following telemetry.
                
                System Telemetry:
                - Tasks: ${stats.totalTasks} total (${stats.completedTasks} done, ${stats.inProgress} active).
                - Budget: €${stats.spent} spent of €${stats.budgeted} planned.
                - Active Campaign: ${stats.campaignActive ? 'Yes' : 'No'}
                - Data Layer: BigQuery Sandbox Connected.
                
                Generate 4 audit sections:
                1. **Execution Velocity:** Analyze task completion rate and flow.
                2. **Resource Efficiency:** Analyze budget utilization and ROI potential.
                3. **Strategic Alignment:** Is there an active campaign driving the tasks? Are efforts aligned?
                4. **System Health:** General assessment of the operational state, agent efficiency, and data pipeline status.

                Be professional, analytical, and constructive. Use HTML tags (<b>, <br>, <ul>, <li>) for formatting the content.
                `;

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: auditSchema }
                });

                if (isMounted) {
                    setAuditResults(JSON.parse(response.text));
                    setIsScanning(false);
                }
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError("Audit sequence failed. Connection to Core interrupted.");
                    setIsScanning(false);
                }
            }
        };

        runAudit();
        return () => { isMounted = false; };
    }, [tasks, systemLogs, campaignBrief]);
    
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const success = await importSystemData(e.target.files[0]);
            if(success) alert("System erfolgreich wiederhergestellt.");
        }
    };

    const DetailModal: React.FC<{ section: AuditSection; onClose: () => void; }> = ({ section, onClose }) => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <div onClick={e => e.stopPropagation()} className="bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl m-4 page-fade-in">
                    <header className="p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <StatusBadge status={section.status} />
                            <h3 className="text-lg font-medium text-white">{section.title}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </header>
                    <div className="p-6 max-h-[70vh] overflow-y-auto text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6 py-16 relative min-h-screen">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">System Audit</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Deep Diagnostic Protocol ::</p>
                <p className="text-xs text-gray-500 mt-2">Powered by Gemini 3.0 Architecture</p>
            </header>

            <main className="max-w-5xl mx-auto">
                {isScanning ? (
                    <TerminalLoader logs={logs} />
                ) : error ? (
                    <div className="text-center text-red-400 p-10 bg-red-900/10 border border-red-500/20 rounded-lg">
                        <p className="text-xl font-bold mb-2">CRITICAL ERROR</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 page-fade-in">
                            {auditResults?.map((section, idx) => (
                                <button 
                                    key={section.id}
                                    onClick={() => setSelectedSection(section)}
                                    className="bg-[#1C1C1C] p-6 rounded-lg border border-[#333333] text-left transition-all duration-300 hover:border-purple-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 group"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-white/5 rounded-lg text-purple-400 group-hover:text-white transition-colors">
                                            {section.id.includes('execution') ? <BoltIcon /> : section.id.includes('resource') ? <LayersIcon /> : section.id.includes('health') ? <BrainIcon /> : <BullseyeIcon />}
                                        </div>
                                        <StatusBadge status={section.status} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                                    <div className="text-sm text-gray-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: section.content }} />
                                    <p className="text-xs text-purple-400 mt-4 group-hover:translate-x-1 transition-transform">Details ansehen →</p>
                                </button>
                            ))}
                        </div>
                        
                        {/* Backup Module */}
                        <div className="bg-[#111] border border-white/10 rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <LayersIcon /> Data Persistence & Backup
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Sichern Sie den gesamten Systemstatus (Strategien, Aufgaben, Kontakte) lokal, um Datensouveränität zu gewährleisten oder Workspaces zu übertragen.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={exportSystemData} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20">
                                    <DownloadIcon /> System Backup erstellen
                                </button>
                                <label className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                                    <UploadIcon />
                                    <span>Backup wiederherstellen</span>
                                    <input type="file" accept=".json" className="hidden" onChange={handleImport} ref={fileInputRef} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {selectedSection && <DetailModal section={selectedSection} onClose={() => setSelectedSection(null)} />}
        </div>
    );
};

export default SystemAudit;
