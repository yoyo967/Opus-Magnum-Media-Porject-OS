
import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/AppContext';
import { SystemMonitor } from './SystemMonitor';

interface SecondaryHeaderProps {
  currentPage: string;
  navigateTo: (page: string) => void;
  onToggleMonitor?: () => void;
}

const ChevronRight: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-gray-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const MonitorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const WorkflowGuide: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { workflowStep, campaignBrief } = useTasks();

    if (workflowStep === 'idle') return null;

    const steps = {
        'strategy': { label: 'Strategy Generation', target: 'stratege', next: 'Planning' },
        'planning': { label: 'Action Plan', target: 'meisterwerk', next: 'Production' },
        'production': { label: 'Asset Creation', target: 'visionar', next: 'Publishing' },
        'publishing': { label: 'Distribution', target: 'publisher', next: 'Complete' },
    };

    const current = steps[workflowStep as keyof typeof steps];

    return (
        <div className="flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 rounded-full px-3 py-1 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-[10px] text-purple-300">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="uppercase tracking-wide font-bold">Active Mission: {campaignBrief ? 'Digital-Ready' : 'New Campaign'}</span>
            </div>
            <div className="h-3 w-px bg-purple-500/30"></div>
            <button 
                onClick={() => navigateTo(current.target)}
                className="text-xs font-bold text-white hover:text-purple-200 transition-colors flex items-center gap-1"
            >
                Current Phase: {current.label} →
            </button>
        </div>
    );
};

const CreditDisplay: React.FC = () => {
    const { credits, maxCredits } = useTasks();
    const percentage = Math.min((credits / maxCredits) * 100, 100);
    
    let colorClass = 'bg-green-500';
    if (percentage < 40) colorClass = 'bg-yellow-500';
    if (percentage < 20) colorClass = 'bg-red-500';

    return (
        <div className="flex items-center gap-3 px-3 py-1 rounded bg-[#111] border border-white/10">
            <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">Resources</span>
                <span className={`text-xs font-bold font-mono ${credits < 100 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {credits} <span className="text-gray-600">/ {maxCredits}</span>
                </span>
            </div>
            <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({ currentPage, navigateTo }) => {
    const { systemLogs } = useTasks();
    const [showMonitor, setShowMonitor] = useState(false);
    const [lastLogTime, setLastLogTime] = useState<string>('');

    useEffect(() => {
        if (systemLogs.length > 0) {
            const lastLog = systemLogs[0];
            setLastLogTime(new Date(lastLog.timestamp).toLocaleTimeString());
        }
    }, [systemLogs]);

    const pageNames: {[key: string]: string} = {
        home: 'Home',
        campaign: 'The Conductor\'s Revolution',
        meisterwerk: 'Masterpiece',
        visionar: 'Visionary',
        stratege: 'Strategist',
        konversator: 'Conversator',
        auditor: 'Auditor',
        animator: 'Animator',
        dirigent: 'Director',
        secret: 'AURORA',
        masterplan: 'Masterplan',
        einreichung: 'System Initialization',
        personalisator: 'Personalizer',
        orakel: 'Oracle',
        mediathek: 'Library',
        akademie: 'Academy',
        observatorium: 'Mission Control',
        conductor: 'Orchestrator',
        publisher: 'Publisher',
        persona: 'Persona',
        auditorium: 'Auditorium',
        analytiker: 'Analyst',
        markenwaechter: 'Brand Guardian',
        berichterstatter: 'Reporter',
        nexus: 'Nexus',
        emailmarketing: 'E-Mail Marketing',
        kalkulator: 'Calculator',
        experimentator: 'Experimenter',
        prometheus: 'Prometheus',
        resonator: 'Resonator',
        gespraechsleiter: 'Negotiator',
        kolorit: 'Colorist',
        ensemble: 'Ensemble',
        diplomat: 'Diplomat',
        chronist: 'Chronicler',
        sequenzer: 'Sequencer',
        taktgeber: 'Pacesetter',
        spaeher: 'Scout',
        baumeister: 'Architect',
        interimmanager: 'Interim Manager',
        statusbericht: 'Status Report',
        systemaudit: 'System Audit',
        grantbook: 'Grant Book'
    };

    return (
        <>
            {showMonitor && <SystemMonitor onClose={() => setShowMonitor(false)} />}
            <div className="sticky top-[65px] z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 h-12 flex items-center justify-between px-6">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                     <div className="flex items-center gap-2">
                         <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">OPUS</button>
                         <ChevronRight />
                         <span className="text-white font-medium">{pageNames[currentPage] || currentPage}</span>
                     </div>
                     <WorkflowGuide navigateTo={navigateTo} />
                </div>

                <div className="flex items-center gap-6">
                    <CreditDisplay />
                    
                    <div className="h-4 w-px bg-white/10"></div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="hidden sm:inline">SYSTEM ACTIVE</span>
                        </div>
                        <button 
                            onClick={() => setShowMonitor(true)}
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-400 transition-colors border border-white/10 hover:border-green-500/30 rounded-full px-3 py-1 bg-white/5"
                        >
                            <MonitorIcon />
                            <span className="hidden sm:inline">Diagnostics</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
