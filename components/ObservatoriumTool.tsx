
import React, { useState, useEffect, useRef } from 'react';
import { useTasks, Task, Document, SystemLogEntry } from '../contexts/AppContext';

// --- TOOLS & AGENTS IMPORTS ---
import { VisionarTool } from './VisionarTool';
import { StrategeTool } from './StrategeTool';
import { ConductorTool } from './ConductorTool';
import Meisterwerk from './Meisterwerk'; // Component
import { AnalytikerTool } from './AnalytikerTool';
import { SequenzerTool } from './SequenzerTool';
import { AuditorTool } from './AuditorTool';
import { SpaeherTool } from './SpaeherTool';
import { OrakelTool } from './OrakelTool';
import { DirigentTool } from './DirigentTool';
import { PersonalisatorTool } from './PersonalisatorTool';
import { KonversatorTool } from './KonversatorTool';
import { AuditoriumTool } from './AuditoriumTool';
import { MarkenwaechterTool } from './MarkenwaechterTool';
import { BerichterstatterTool } from './BerichterstatterTool';
import { EmailEditor } from './EmailEditor';
import { KalkulatorTool } from './KalkulatorTool';
import { ExperimentatorTool } from './ExperimentatorTool';
import { PrometheusTool } from './PrometheusTool';
import { ResonatorTool } from './ResonatorTool';
import { GespraechsleiterTool } from './GespraechsleiterTool';
import { KoloritTool } from './KoloritTool';
import { EnsembleTool } from './EnsembleTool';
import { DiplomatTool } from './DiplomatTool';
import { ChronistTool } from './ChronistTool';
import { TaktgeberTool } from './TaktgeberTool';
import { BaumeisterTool } from './BaumeisterTool';
import { PublisherTool } from './PublisherTool';
import { AnimatorTool } from './AnimatorTool';
import { AuroraAgent } from './AuroraAgent';
import { IntegrationsHub } from './IntegrationsHub';

// --- PAGE COMPONENTS AS TOOLS ---
import Masterplan from '../pages/Masterplan';
import Nexus from '../pages/Nexus';
import Akademie from '../pages/Akademie';
import InterimManager from '../pages/InterimManager';
import StatusBericht from '../pages/StatusBericht';
import SystemAudit from '../pages/SystemAudit';

// --- ICONS ---
const OsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const MinimizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>;
const MaximizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9 15m11.25-11.25h-4.5m4.5 0v4.5m0-4.5L15 9" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-yellow-500 drop-shadow-lg"><path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" /></svg>;
const FileTaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-400"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>;
const TerminalWindowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-500 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>;
const AppWindowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-400 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>;
const PowerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" /></svg>;
const WifiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>;
const NetworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-cyan-400 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;


// --- TYPES ---
type AppId = string;

interface WindowState {
    id: string;
    appId: AppId;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
    contentProps?: any;
}

interface ContextMenuState {
    x: number;
    y: number;
    type: 'desktop' | 'file';
    item?: Task | Document;
}

// --- APP REGISTRY ---
const APP_REGISTRY: { [key: string]: { title: string; icon: any; component: any; category: string; defaultWidth?: number; defaultHeight?: number } } = {
    // Core & Strategy
    'mission': { title: 'Prime Directive', icon: TargetIcon, component: null, category: 'Core' },
    'explorer': { title: 'Asset Explorer', icon: FolderIcon, component: null, category: 'Core' },
    'terminal': { title: 'Terminal', icon: TerminalWindowIcon, component: null, category: 'Core' },
    'monitor': { title: 'System Monitor', icon: TerminalWindowIcon, component: null, category: 'Core' },
    'masterplan': { title: 'Masterplan', icon: AppWindowIcon, component: Masterplan, category: 'Core', defaultWidth: 1000, defaultHeight: 700 },
    'meisterwerk': { title: 'Meisterwerk', icon: AppWindowIcon, component: Meisterwerk, category: 'Core', defaultWidth: 1100, defaultHeight: 800 },
    'integrations': { title: 'Data Pipes', icon: NetworkIcon, component: IntegrationsHub, category: 'System', defaultWidth: 800, defaultHeight: 600 }, // NEW APP

    // Strategy & Analysis
    'dirigent': { title: 'Dirigent', icon: AppWindowIcon, component: DirigentTool, category: 'Strategy' },
    'stratege': { title: 'Stratege', icon: AppWindowIcon, component: StrategeTool, category: 'Strategy', defaultWidth: 1000 },
    'persona': { title: 'Persona', icon: AppWindowIcon, component: PersonalisatorTool, category: 'Strategy' },
    'analytiker': { title: 'Analytiker', icon: AppWindowIcon, component: AnalytikerTool, category: 'Strategy', defaultWidth: 1000 },
    'orakel': { title: 'Orakel', icon: AppWindowIcon, component: OrakelTool, category: 'Strategy', defaultWidth: 900 },
    'ensemble': { title: 'Ensemble', icon: AppWindowIcon, component: EnsembleTool, category: 'Strategy' },
    'spaeher': { title: 'Späher', icon: AppWindowIcon, component: SpaeherTool, category: 'Strategy', defaultWidth: 900 },
    'experimentator': { title: 'Experimentator', icon: AppWindowIcon, component: ExperimentatorTool, category: 'Strategy', defaultWidth: 900 },
    'berichterstatter': { title: 'Berichterstatter', icon: AppWindowIcon, component: BerichterstatterTool, category: 'Strategy' },
    'kalkulator': { title: 'Kalkulator', icon: AppWindowIcon, component: KalkulatorTool, category: 'Strategy' },

    // Creation
    'visionar': { title: 'Visionär', icon: AppWindowIcon, component: VisionarTool, category: 'Creation', defaultWidth: 900 },
    'animator': { title: 'Animator', icon: AppWindowIcon, component: AnimatorTool, category: 'Creation' },
    'konversator': { title: 'Konversator', icon: AppWindowIcon, component: KonversatorTool, category: 'Creation', defaultWidth: 600, defaultHeight: 800 },
    'personalisator': { title: 'Personalisator', icon: AppWindowIcon, component: PersonalisatorTool, category: 'Creation', defaultWidth: 1000 },
    'resonator': { title: 'Resonator', icon: AppWindowIcon, component: ResonatorTool, category: 'Creation', defaultWidth: 1000 },
    'kolorit': { title: 'Kolorit', icon: AppWindowIcon, component: KoloritTool, category: 'Creation' },
    'baumeister': { title: 'Baumeister', icon: AppWindowIcon, component: BaumeisterTool, category: 'Creation', defaultWidth: 1000 },
    'emailmarketing': { title: 'E-Mail Marketing', icon: AppWindowIcon, component: EmailEditor, category: 'Creation', defaultWidth: 1000 },

    // Automation
    'conductor': { title: 'Conductor', icon: AppWindowIcon, component: ConductorTool, category: 'Automation' },
    'sequenzer': { title: 'Sequenzer', icon: AppWindowIcon, component: SequenzerTool, category: 'Automation', defaultWidth: 900 },
    'taktgeber': { title: 'Taktgeber', icon: AppWindowIcon, component: TaktgeberTool, category: 'Automation' },
    'publisher': { title: 'Publisher', icon: AppWindowIcon, component: PublisherTool, category: 'Automation', defaultWidth: 1000 },
    'aurora': { title: 'AURORA', icon: AppWindowIcon, component: AuroraAgent, category: 'Automation', defaultWidth: 800 },

    // Communication
    'diplomat': { title: 'Diplomat', icon: AppWindowIcon, component: DiplomatTool, category: 'Communication', defaultWidth: 900 },
    'chronist': { title: 'Chronist', icon: AppWindowIcon, component: ChronistTool, category: 'Communication', defaultWidth: 900 },
    'gespraechsleiter': { title: 'Gesprächsleiter', icon: AppWindowIcon, component: GespraechsleiterTool, category: 'Communication', defaultWidth: 900 },
    'auditorium': { title: 'Auditorium', icon: AppWindowIcon, component: AuditoriumTool, category: 'Communication', defaultWidth: 1000 },
    'auditor': { title: 'Auditor', icon: AppWindowIcon, component: AuditorTool, category: 'Communication' },

    // System & Knowledge
    'nexus': { title: 'Nexus', icon: AppWindowIcon, component: Nexus, category: 'System', defaultWidth: 900 },
    'prometheus': { title: 'Prometheus', icon: AppWindowIcon, component: PrometheusTool, category: 'System' },
    'systemaudit': { title: 'System Audit', icon: AppWindowIcon, component: SystemAudit, category: 'System', defaultWidth: 900 },
    'akademie': { title: 'Akademie', icon: AppWindowIcon, component: Akademie, category: 'System', defaultWidth: 1100 },
    'markenwaechter': { title: 'Markenwächter', icon: AppWindowIcon, component: MarkenwaechterTool, category: 'System', defaultWidth: 900 },
    'interimmanager': { title: 'Interim Manager', icon: AppWindowIcon, component: InterimManager, category: 'System', defaultWidth: 900 },
    'statusbericht': { title: 'Status Bericht', icon: AppWindowIcon, component: StatusBericht, category: 'System', defaultWidth: 900 },
};

// --- SPECIAL APPS IMPLEMENTATIONS ---
const MissionApp: React.FC<{ mission: string, onUpdate: (m: string) => void }> = ({ mission, onUpdate }) => {
    const [val, setVal] = useState(mission);
    const [saved, setSaved] = useState(false);
    const handleSave = () => { onUpdate(val); setSaved(true); setTimeout(() => setSaved(false), 2000); };
    return (
        <div className="p-6 bg-[#111] h-full flex flex-col gap-4 text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Prime Directive</h2>
                    <p className="text-xs text-gray-500 font-mono mt-1">GLOBAL_STRATEGIC_ALIGNMENT_PROTOCOL</p>
                </div>
                <TargetIcon />
            </div>
            <p className="text-sm text-gray-400">Definieren Sie das übergeordnete strategische Ziel.</p>
            <textarea className="flex-1 bg-black/50 border border-white/10 p-4 rounded-lg text-lg focus:border-purple-500 outline-none resize-none font-mono text-green-400 shadow-inner" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Geben Sie hier die Mission ein..." />
            <div className="flex justify-end"><button onClick={handleSave} className={`px-6 py-2 rounded text-sm font-bold transition-all duration-300 ${saved ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>{saved ? 'Synchronisiert' : 'Direktive Aktualisieren'}</button></div>
        </div>
    );
};

const MonitorApp: React.FC<{ logs: SystemLogEntry[] }> = ({ logs }) => {
    const [bars, setBars] = useState<number[]>(Array(40).fill(10));
    useEffect(() => { const interval = setInterval(() => setBars(prev => [...prev.slice(1), Math.random() * 80 + 10]), 150); return () => clearInterval(interval); }, []);
    return (
        <div className="p-4 bg-black h-full text-green-500 font-mono text-xs overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-green-900/30 pb-2"><span className="uppercase tracking-widest">Neural Activity</span><span className="animate-pulse text-green-400">● LIVE</span></div>
            <div className="h-32 flex items-end gap-0.5 mb-4 border-b border-green-900/30 pb-4">{bars.map((h, i) => <div key={i} className="flex-1 bg-green-500/30 hover:bg-green-400 transition-colors" style={{ height: `${h}%` }} />)}</div>
            <div className="flex-1 overflow-y-auto font-mono space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black pr-1">{logs.map(l => <div key={l.id} className="opacity-80 hover:opacity-100 transition-opacity hover:bg-green-900/10 px-1 rounded flex gap-2"><span className="text-gray-600 w-16 flex-shrink-0">{new Date(l.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span> <span className={`font-bold w-20 flex-shrink-0 ${l.type === 'error' ? 'text-red-500' : l.type === 'warning' ? 'text-yellow-500' : 'text-green-400'}`}>{l.agent}</span> <span className="text-green-200 truncate">{l.message}</span></div>)}</div>
             <div className="mt-2 text-[10px] text-gray-600 border-t border-gray-800 pt-1 flex justify-between uppercase"><span>MEM: 14GB / 32GB</span><span>CPU: {Math.floor(Math.random() * 15 + 5)}%</span><span>NET: 1.2 GB/s</span></div>
        </div>
    );
};

const ExplorerApp: React.FC<{ tasks: Task[], documents: Document[], onOpenItem: (item: Task | Document) => void, onContextMenu: (e: React.MouseEvent, item: Task | Document) => void }> = ({ tasks, documents, onOpenItem, onContextMenu }) => {
    return (
        <div className="flex flex-col h-full bg-[#111] text-white">
            <div className="bg-[#222] p-2 border-b border-white/10 flex gap-2 text-xs text-gray-400"><span className="px-2 py-1 bg-black/30 rounded border border-white/5 cursor-pointer hover:text-white">/root/campaigns/active</span></div>
            <div className="flex-1 overflow-y-auto p-2">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-2">Name</th><th className="p-2">Status</th><th className="p-2">Type</th><th className="p-2">Date</th></tr></thead>
                    <tbody>
                        {tasks.map(t => ( <tr key={`t-${t.id}`} className="hover:bg-white/10 cursor-pointer transition-colors group" onContextMenu={(e) => onContextMenu(e, t)} onDoubleClick={() => onOpenItem(t)}><td className="p-2 flex items-center gap-2 text-blue-300"><FileTaskIcon /><span className="truncate max-w-[200px] group-hover:text-white">{t.title}</span></td><td className="p-2 text-gray-400">{t.status}</td><td className="p-2 text-gray-500">Task</td><td className="p-2 text-gray-600">{new Date().toLocaleDateString()}</td></tr> ))}
                        {documents.map(d => ( <tr key={`d-${d.id}`} className="hover:bg-white/10 cursor-pointer transition-colors group" onContextMenu={(e) => onContextMenu(e, d)} onDoubleClick={() => onOpenItem(d)}><td className="p-2 flex items-center gap-2 text-purple-300"><FolderIcon /><span className="truncate max-w-[200px] group-hover:text-white">{d.title}</span></td><td className="p-2 text-gray-400">Archived</td><td className="p-2 text-gray-500">{d.category}</td><td className="p-2 text-gray-600">{new Date(d.createdAt).toLocaleDateString()}</td></tr> ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-[#222] p-1 text-[10px] text-gray-500 border-t border-white/10 px-2">{tasks.length + documents.length} objects</div>
        </div>
    );
};

const TerminalApp: React.FC<{ logs: SystemLogEntry[], user: string, missionUpdate: (m: string) => void }> = ({ logs, user, missionUpdate }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [cmd, setCmd] = useState('');
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);
    return (
        <div className="h-full bg-black p-4 font-mono text-sm text-green-500 overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
             <div className="mb-4 text-gray-500">OPUS MAGNUM KERNEL v4.0.1-alpha<br/>Copyright (c) 2025 MAGNUM CORP.<br/>Initializing Mission Control... Done.<br/></div>
            <div className="flex-1">{logs.slice(0, 50).map((log, i) => (<div key={i} className="mb-1 break-all"><span className="opacity-50 text-xs mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span> <span className={log.type === 'error' ? 'text-red-500' : log.type === 'warning' ? 'text-yellow-500' : 'text-green-400'}>{log.agent}:</span> {log.message}</div>))}<div ref={bottomRef} /></div>
            <div className="mt-2 flex items-center gap-2 border-t border-gray-800 pt-2"><span className="text-purple-500 font-bold">{user}@OPUS:~$</span><input type="text" className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0" autoFocus value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') { const val = cmd.trim(); if (val.startsWith('mission ')) { missionUpdate(val.replace('mission ', '')); } setCmd(''); } }} /></div>
        </div>
    );
};

const ViewerApp: React.FC<{ item: Task | Document }> = ({ item }) => {
    const isTask = 'status' in item;
    return (
         <div className="h-full bg-[#181818] p-6 flex flex-col text-gray-300">
             <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4"><div><h2 className="text-2xl font-bold text-white">{item.title}</h2><span className="text-xs uppercase tracking-widest text-gray-500">{isTask ? 'Task Node' : 'Knowledge Record'}</span></div></div>
             <div className="flex-1 overflow-auto bg-black/30 p-6 rounded border border-white/5 shadow-inner">{isTask && (item as Task).imageUrl && <img src={(item as Task).imageUrl} className="max-h-80 object-contain mb-6 mx-auto rounded border border-white/10" alt="Asset"/>}<div className="prose prose-invert prose-sm max-w-none"><p className="whitespace-pre-wrap leading-relaxed">{(item as any).description || (item as any).content}</p></div></div>
         </div>
    );
};

// --- BOOT SCREEN ---
const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const bootLines = [
        "OPUS MAGNUM KERNEL v4.0.1 initializing...",
        "Verifying file system integrity...",
        "Mounting virtual drives...",
        "Loading neural modules (Gemini 3.0)...",
        "Starting UI Subsystem...",
        "Establishing secure uplink...",
        "User environment loaded.",
        "Welcome, Commander."
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < bootLines.length) {
                setLines(prev => [...prev, bootLines[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 800);
            }
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-[2000] bg-black text-green-500 font-mono text-sm p-10 flex flex-col justify-end pb-20 overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
             <div className="mb-auto mt-10 z-20">
                 <div className="text-4xl font-bold text-white mb-4 tracking-tighter">OPUS MAGNUM</div>
                 <div className="h-px w-32 bg-green-500 mb-10"></div>
             </div>
             <div className="z-20 space-y-1">
                {lines.map((l, i) => <div key={i} className="animate-[fadeIn_0.1s_ease-out]">{`> ${l}`}</div>)}
                <div className="animate-pulse mt-1">_</div>
             </div>
        </div>
    );
};

// --- NOTIFICATION CENTER ---
const NotificationCenter: React.FC<{ logs: SystemLogEntry[], onClose: () => void }> = ({ logs, onClose }) => {
    return (
        <div className="absolute bottom-14 right-4 w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-[1001] flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200 max-h-[400px]">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#222]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Benachrichtigungen</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white"><CloseIcon /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {logs.length === 0 && <div className="text-center text-gray-500 text-xs py-4">Keine Benachrichtigungen</div>}
                {logs.map(log => (
                    <div key={log.id} className={`p-2 rounded border-l-2 bg-white/5 ${log.type === 'error' ? 'border-red-500' : log.type === 'warning' ? 'border-yellow-500' : log.type === 'success' ? 'border-green-500' : 'border-blue-500'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-gray-300">{log.agent}</span>
                            <span className="text-[9px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-snug">{log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

export const ObservatoriumTool: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { tasks, documents, systemLogs, userProfile, updateUserProfile, setToolInput, isOfflineMode } = useTasks();
    
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [highestZ, setHighestZ] = useState(100);
    const [isDragging, setIsDragging] = useState<{id: string, startX: number, startY: number, initialX: number, initialY: number} | null>(null);
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        if (!booting) {
             openWindow('terminal', 'Mission Core');
        }
    }, [booting]);

    const handleWindowNavigation = (page: string) => {
        if (APP_REGISTRY[page]) {
            openWindow(page, APP_REGISTRY[page].title);
        } else {
            navigateTo(page); // Fallback
        }
    };

    const openWindow = (appId: AppId, title: string, contentProps: any = null) => {
        const existing = windows.find(w => w.appId === appId && appId !== 'viewer');
        if (existing) { focusWindow(existing.id); if (existing.isMinimized) toggleMinimize(existing.id); return; }

        const id = `${appId}-${Date.now()}`;
        const registryEntry = APP_REGISTRY[appId];
        const width = registryEntry?.defaultWidth || 800;
        const height = registryEntry?.defaultHeight || 600;

        const newWin: WindowState = {
            id, appId, title,
            x: 50 + (windows.length * 30),
            y: 50 + (windows.length * 30),
            width, height, zIndex: highestZ + 1,
            isMinimized: false, isMaximized: false,
            contentProps
        };
        
        setWindows(prev => [...prev, newWin]);
        setHighestZ(prev => prev + 1);
        setActiveWindowId(id);
        setStartMenuOpen(false);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
        if (activeWindowId === id) setActiveWindowId(null);
    };

    const focusWindow = (id: string) => {
        setActiveWindowId(id);
        setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: highestZ + 1 } : w));
        setHighestZ(prev => prev + 1);
    };

    const toggleMinimize = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
        if (activeWindowId === id) setActiveWindowId(null);
    };

    const toggleMaximize = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
        focusWindow(id);
    };

    const minimizeAll = () => {
        setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
        setActiveWindowId(null);
    };

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); focusWindow(id);
        const win = windows.find(w => w.id === id);
        if (win && !win.isMaximized) setIsDragging({ id, startX: e.clientX, startY: e.clientY, initialX: win.x, initialY: win.y });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - isDragging.startX;
                const deltaY = e.clientY - isDragging.startY;
                setWindows(prev => prev.map(w => w.id === isDragging.id ? { ...w, x: isDragging.initialX + deltaX, y: isDragging.initialY + deltaY } : w));
            }
        };
        const handleMouseUp = () => setIsDragging(null);
        if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
        return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }, [isDragging]);

    const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'file', item?: Task | Document) => {
        e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, type, item });
    };

    const renderWindowContent = (win: WindowState) => {
        const entry = APP_REGISTRY[win.appId];
        if (entry?.component) {
            const Component = entry.component;
            // Pass isEmbedded=true to adjust layout for windowed mode
            return (
                <div className="h-full overflow-hidden bg-[#1C1C1C] text-white">
                    <Component navigateTo={handleWindowNavigation} isEmbedded={true} onAnalysisComplete={() => {}} item={win.contentProps} />
                </div>
            );
        }
        
        // Special hardcoded apps
        switch (win.appId) {
            case 'mission': return <MissionApp mission={userProfile?.mission || ''} onUpdate={m => updateUserProfile({ ...userProfile, mission: m } as any)} />;
            case 'monitor': return <MonitorApp logs={systemLogs} />;
            case 'terminal': return <TerminalApp logs={systemLogs} user={userProfile?.name || 'User'} missionUpdate={m => updateUserProfile({ ...userProfile, mission: m } as any)} />;
            /* 
               @fix handleContextMenu should be wrapped to match the expected parameter signature 
               (e: React.MouseEvent, item: Task | Document) => void 
            */
            case 'explorer': return <ExplorerApp tasks={tasks} documents={documents} onOpenItem={(item) => openWindow('viewer', item.title, item)} onContextMenu={(e, item) => handleContextMenu(e, 'file', item)} />;
            case 'viewer': return <ViewerApp item={win.contentProps} />;
        }
        return <div className="p-4 text-gray-500">App content missing.</div>;
    };

    const renderStartMenuCategory = (category: string) => {
        const apps = Object.entries(APP_REGISTRY).filter(([_, meta]) => meta.category === category);
        if(apps.length === 0) return null;
        return (
            <div className="space-y-2 mb-4">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                    {apps.map(([id, meta]) => (
                        <button key={id} onClick={() => openWindow(id, meta.title)} className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded flex items-center gap-2 transition-colors group">
                            <div className="text-purple-400 group-hover:text-white transition-colors"><meta.icon /></div>
                            <span className="truncate">{meta.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const getAppIcon = (appId: AppId) => {
         if(['mission', 'explorer', 'terminal', 'monitor'].includes(appId)) return <TerminalWindowIcon />;
         const entry = APP_REGISTRY[appId];
         if(entry && entry.icon) {
             const Icon = entry.icon;
             return <Icon />;
         }
         return <AppWindowIcon />;
    };

    return (
        <div className="fixed inset-0 bg-[#050505] text-white overflow-hidden select-none pt-[80px]" onClick={() => { setStartMenuOpen(false); setNotificationsOpen(false); setContextMenu(null); }}>
            <style>{`.bg-grid-pattern { background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; } .crt::before { content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none; }`}</style>
            
            {booting && <BootScreen onComplete={() => setBooting(false)} />}

            <div className="absolute inset-0 z-0 bg-grid-pattern crt" onContextMenu={(e) => handleContextMenu(e, 'desktop')}>
                 <div className="absolute top-8 left-6 flex flex-col gap-6 z-0">
                     {[
                         {id: 'mission', title: 'Mission', icon: TargetIcon, color: 'text-red-500', border: 'group-hover:border-red-500/50'},
                         {id: 'explorer', title: 'Explorer', icon: FolderIcon, color: 'text-yellow-500', border: 'group-hover:border-yellow-500/50'},
                         {id: 'terminal', title: 'Terminal', icon: TerminalWindowIcon, color: 'text-green-500', border: 'group-hover:border-green-500/50'},
                         {id: 'meisterwerk', title: 'Meisterwerk', icon: AppWindowIcon, color: 'text-purple-500', border: 'group-hover:border-purple-500/50'},
                         {id: 'nexus', title: 'Nexus', icon: AppWindowIcon, color: 'text-blue-400', border: 'group-hover:border-blue-500/50'},
                     ].map(shortcut => (
                        <div key={shortcut.id} className="flex flex-col items-center gap-2 cursor-pointer group w-20" onDoubleClick={() => openWindow(shortcut.id, shortcut.title)}>
                            <div className={`w-14 h-14 bg-white/5 rounded-xl group-hover:bg-white/10 border border-transparent ${shortcut.border} transition-all ${shortcut.color} flex items-center justify-center shadow-lg`}>
                                <shortcut.icon />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 text-center bg-black/60 rounded px-2 py-0.5 group-hover:text-white shadow-md backdrop-blur-sm">{shortcut.title}</span>
                        </div>
                     ))}
                 </div>
            </div>

            {windows.map(win => (
                <div key={win.id} className={`absolute flex flex-col bg-[#161616]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden transition-opacity duration-200 ${win.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${activeWindowId === win.id ? 'border-white/30 ring-1 ring-white/5' : ''}`} style={{ left: win.isMaximized ? 0 : win.x, top: win.isMaximized ? 0 : win.y, width: win.isMaximized ? '100%' : win.width, height: win.isMaximized ? 'calc(100% - 48px)' : win.height, zIndex: win.zIndex }} onMouseDown={(e) => handleMouseDown(e, win.id)}>
                    <div className="h-9 bg-[#222] flex items-center justify-between px-3 border-b border-black select-none cursor-move" onDoubleClick={() => toggleMaximize(win.id)}>
                        <div className="flex items-center gap-2 text-gray-400">
                            {getAppIcon(win.appId)}
                            <span className="text-xs font-bold tracking-wide text-gray-300">{win.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }} className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"><MinimizeIcon /></button>
                            <button onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"><MaximizeIcon /></button>
                            <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="p-1 hover:bg-red-500/80 rounded text-gray-500 hover:text-white"><CloseIcon /></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative">{renderWindowContent(win)}</div>
                </div>
            ))}

            {startMenuOpen && (
                <div className="absolute bottom-14 left-4 w-[600px] bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl z-[1000] animate-in slide-in-from-bottom-4 fade-in duration-200 flex flex-col overflow-hidden max-h-[80vh]" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-blue-900/30 shrink-0">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg">OM</div>
                             <div><p className="text-sm font-bold text-white">{userProfile?.name || 'Commander'}</p><p className="text-[10px] text-gray-400 uppercase tracking-wide">{userProfile?.role || 'Admin'}</p></div>
                        </div>
                        <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-1 border border-red-500/20 rounded bg-red-500/10 transition-colors"><PowerIcon /> Shutdown</button>
                    </div>
                    <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {renderStartMenuCategory('Strategy')}
                        {renderStartMenuCategory('Creation')}
                        {renderStartMenuCategory('Automation')}
                        {renderStartMenuCategory('Communication')}
                        {renderStartMenuCategory('System')}
                    </div>
                </div>
            )}
            
            {notificationsOpen && (
                <NotificationCenter logs={systemLogs} onClose={() => setNotificationsOpen(false)} />
            )}

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0f0f0f]/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-4 z-[999] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                 <div className="flex items-center gap-2 h-full">
                    <button onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen); setNotificationsOpen(false); }} className={`h-10 w-10 rounded-md flex items-center justify-center transition-all hover:bg-white/10 ${startMenuOpen ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-blue-400'}`} title="Start"><OsIcon /></button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <div className="flex gap-1 overflow-x-auto max-w-[calc(100vw-400px)] scrollbar-hide">
                        {windows.map(win => ( 
                            <button key={win.id} onClick={() => win.isMinimized ? focusWindow(win.id) : toggleMinimize(win.id)} className={`h-10 px-3 min-w-[120px] max-w-[200px] rounded-md flex items-center gap-2 transition-all border-b-2 ${win.id === activeWindowId && !win.isMinimized ? 'bg-white/10 border-blue-500 text-white' : 'border-transparent hover:bg-white/5 text-gray-400'}`} title={win.title}>
                                <span className="flex-shrink-0">{getAppIcon(win.appId)}</span>
                                <span className="truncate text-xs font-medium">{win.title}</span>
                            </button> 
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-4 h-full">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 border-r border-white/10 pr-4 h-6">
                        <span className={`flex items-center gap-1 ${isOfflineMode ? 'text-yellow-500' : 'text-green-500'}`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${isOfflineMode ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
                             {isOfflineMode ? 'OFFLINE' : 'ONLINE'}
                        </span>
                        <span className="hidden md:flex items-center gap-1">
                             <WifiIcon /> 1.2 GB/s
                        </span>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); setNotificationsOpen(!notificationsOpen); setStartMenuOpen(false); }}
                        className={`h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors relative ${notificationsOpen ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                        title="Benachrichtigungen"
                    >
                        <BellIcon />
                        {systemLogs.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#111]"></span>}
                    </button>
                    
                    <button 
                         onClick={minimizeAll}
                         className="h-8 w-1 bg-white/20 rounded-full hover:bg-white/40 transition-colors ml-2" 
                         title="Desktop anzeigen"
                    />

                    <div className="text-right leading-tight cursor-default pl-2">
                        <div className="text-white font-bold text-xs">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-[9px] opacity-60">{currentTime.toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
