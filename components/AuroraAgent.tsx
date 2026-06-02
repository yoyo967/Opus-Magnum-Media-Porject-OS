
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, Task, CampaignBrief } from '../contexts/AppContext';

// Icons
const AuroraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456-2.456z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const Spinner = () => <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>;

type AgentStatus = 'idle' | 'thinking' | 'done' | 'error';
type LogEntry = {
    id: number;
    step: string;
    details: string;
    status: 'pending' | 'running' | 'complete' | 'error';
};

const STEPS = [
    { key: 'analysis', name: 'Analyse & Diagnose' },
    { key: 'strategy', name: 'Strategie & Konzeption' },
    { key: 'planning', name: 'Aktionsplan erstellen' },
    { key: 'execution', name: 'Campaign Manager populieren' },
];

export const AuroraAgent: React.FC<{ navigateTo: (page: string) => void; }> = ({ navigateTo }) => {
    const { tasks, campaignBrief, addMultipleTasks } = useTasks();
    const [objective, setObjective] = useState('Markteinführung für unser neues KI-gestütztes Headless CMS für DCI-Absolventen. Ziel: 100 Leads im ersten Monat generieren.');
    const [status, setStatus] = useState<AgentStatus>('idle');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const ai = useRef(new GoogleGenAI({ apiKey: process.env.API_KEY as string })).current;

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const updateLog = (key: string, updates: Partial<LogEntry>) => {
        setLogs(prev => prev.map(log => log.step === key ? { ...log, ...updates } : log));
    };

    const runAgent = async () => {
        setStatus('thinking');
        const initialLogs = STEPS.map((s, i) => ({ id: i, step: s.key, details: s.name, status: 'pending' as const }));
        setLogs(initialLogs);

        try {
            // Step 1: Analysis
            updateLog('analysis', { status: 'running', details: 'Analysiere aktuellen Projektstatus...' });
            const analysisPrompt = `Als KI-Projektleiter "Dirigent", analysiere den folgenden Projektstatus und das übergeordnete Ziel. Gib eine kurze, prägnante Zusammenfassung der Situation und 2-3 Kernbereiche, auf die sich die neue Strategie konzentrieren sollte.

            - Übergeordnetes Ziel: "${objective}"
            - Aktuelle Kampagnenstrategie: ${JSON.stringify(campaignBrief, null, 2)}
            - Aktuelle Aufgabenliste: ${JSON.stringify(tasks, null, 2)}
            
            Antworte nur mit der textlichen Zusammenfassung.`;
            
            // Upgraded to Gemini 3.0 for deep analysis
            const analysisResponse = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: analysisPrompt });
            const analysisSummary = analysisResponse.text;
            updateLog('analysis', { status: 'complete', details: `Analyse abgeschlossen (G3.0). Fokus: ${analysisSummary.substring(0, 100)}...` });

            // Step 2: Strategy
            updateLog('strategy', { status: 'running', details: 'Entwickle Kampagnen-Strategie...' });
            const campaignSchema = { type: Type.OBJECT, properties: { campaignTitle: { type: Type.STRING }, slogan: { type: Type.STRING }, keyVisuals: { type: Type.ARRAY, items: { type: Type.STRING } }, socialMediaStrategy: { type: Type.OBJECT, properties: { platforms: { type: Type.ARRAY, items: { type: Type.STRING } }, contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } }, postExamples: { type: Type.ARRAY, items: { type: Type.STRING } } } }, emailMarketing: { type: Type.OBJECT, properties: { subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } }, sequenceIdea: { type: Type.STRING } } }, kpis: { type: Type.ARRAY, items: { type: Type.STRING } } } };
            const strategyPrompt = `Act as an expert marketing strategist. Generate a comprehensive marketing campaign plan based on the following details.
            - High-Level Objective: ${objective}
            - Initial Analysis & Focus Areas: ${analysisSummary}
            Generate a complete campaign plan that strictly adheres to the provided JSON schema.`;
            
            // Strategy generation usually benefits from speed/cost balance, but for AURORA (the premium agent), we use 3.0
            const strategyResponse = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: strategyPrompt, config: { responseMimeType: "application/json", responseSchema: campaignSchema } });
            const generatedCampaign: CampaignBrief = JSON.parse(strategyResponse.text);
            updateLog('strategy', { status: 'complete', details: `Strategie für "${generatedCampaign.campaignTitle}" erstellt.` });

            // Step 3: Planning
            updateLog('planning', { status: 'running', details: 'Generiere umsetzbare Aufgaben...' });
            const tasksSchema = { type: Type.OBJECT, properties: { tasks: { type: Type.ARRAY, description: "A list of tasks to be created.", items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, recommendedTool: { type: Type.STRING, description: "The most appropriate tool for this task from the list: 'visionar', 'konversator', 'stratege', 'animator', 'personalisator', 'orakel'. Omit if no specific tool is a clear match." } } } } } };
            const planningPrompt = `Based on the following finalized campaign brief, break it down into a list of specific, actionable tasks for a project management board. Create tasks for key visuals, social media posts, and email marketing. For each task, recommend the best tool to start with if applicable.

            Available tools: 'visionar' (for creating images), 'konversator' (for writing/refining text), 'stratege' (for high-level strategy, less common for sub-tasks), 'animator' (to animate an existing image), 'personalisator' (to adapt content for segments), 'orakel' (for predictive analysis).

            Campaign Brief: ${JSON.stringify(generatedCampaign)}

            Respond ONLY with a JSON object that adheres to the schema.`;
            
            // Updated to Gemini 3.0 for smarter task breakdown
            const planningResponse = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: planningPrompt, config: { responseMimeType: "application/json", responseSchema: tasksSchema } });
            const { tasks: newTasks } = JSON.parse(planningResponse.text);
            updateLog('planning', { status: 'complete', details: `${newTasks.length} Aufgaben generiert.` });

            // Step 4: Execution
            updateLog('execution', { status: 'running', details: 'Übertrage Aufgaben zum Campaign Manager...' });
            addMultipleTasks(newTasks);
            updateLog('execution', { status: 'complete', details: 'Board erfolgreich aktualisiert.' });

            setStatus('done');

        } catch (error) {
            console.error("AURORA Agent Error:", error);
            setStatus('error');
            setLogs(prev => prev.map(log => log.status === 'running' ? { ...log, status: 'error', details: 'Agentenlauf fehlgeschlagen' } : log));
        }
    };

    const renderLogIcon = (status: LogEntry['status']) => {
        if (status === 'running') return <Spinner />;
        if (status === 'complete') return <CheckIcon />;
        if (status === 'error') return <span className="text-red-500 font-bold">!</span>;
        return <div className="w-4 h-4 rounded-full bg-gray-600 border border-gray-500"></div>;
    };

    return (
        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left: Controls */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">1. Definieren Sie Ihr Ziel</h3>
                    <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={4} className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" placeholder="z.B. Launch-Kampagne für Produkt X..." disabled={status === 'thinking'} />
                    <button onClick={runAgent} disabled={status === 'thinking' || !objective.trim()} className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                        <AuroraIcon />
                        {status === 'thinking' ? 'AURORA arbeitet...' : 'An AURORA delegieren'}
                    </button>
                    <div className="text-[10px] text-purple-400 text-center mt-2">Powered by Gemini 3.0 Pro Architecture</div>
                </div>

                {/* Right: Logs */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">2. Operationsprotokoll</h3>
                    <div className="bg-[#0A0A0A] rounded-md border border-[#333333] p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                        {logs.length === 0 && <p className="text-sm text-gray-500 text-center pt-8">Warte auf Anweisungen...</p>}
                        <ul className="space-y-3">
                            {logs.map(log => (
                                <li key={log.id} className={`flex items-start gap-3 text-sm transition-opacity ${log.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                                    <div className={`mt-1 flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full ${log.status === 'complete' ? 'bg-green-500/30 text-green-400' : 'text-gray-400'}`}>
                                        {renderLogIcon(log.status)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{STEPS.find(s => s.key === log.step)?.name}</p>
                                        <p className="text-xs text-gray-400">{log.details}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div ref={logsEndRef} />
                    </div>
                    {status === 'done' && (
                        <div className="bg-green-900/50 border border-green-500/50 text-green-200 rounded-md p-4 text-center page-fade-in">
                            <p className="font-semibold">Delegation erfolgreich!</p>
                            <p className="text-sm mt-1">AURORA hat die Kampagne vorbereitet. Sie können sie jetzt im Campaign Manager überprüfen.</p>
                            <button onClick={() => navigateTo('meisterwerk')} className="mt-3 bg-white text-black px-4 py-1.5 rounded-full font-medium text-xs hover:bg-opacity-90">Zum Campaign Manager</button>
                        </div>
                    )}
                    {status === 'error' && (
                         <div className="bg-red-900/50 border border-red-500/50 text-red-200 rounded-md p-4 text-center page-fade-in">
                            <p className="font-semibold">Ein Fehler ist aufgetreten.</p>
                            <p className="text-sm mt-1">Der Prozess konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
