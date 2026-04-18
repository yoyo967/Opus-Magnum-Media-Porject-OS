
import React, { useMemo, useState } from 'react';
import { useTasks } from '../contexts/AppContext';
import { GoogleGenAI } from "@google/genai";

const AtomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin-slow"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7zM16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h4.992m-4.993 0l3.181-3.183a8.25 8.25 0 00-11.667 0l3.181 3.183" /></svg>;

const StatusBericht: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { tasks, systemLogs, userProfile, campaignBrief, scheduledPosts } = useTasks();
    const [isGenerating, setIsGenerating] = useState(false);
    const [diagnosisReport, setDiagnosisReport] = useState<string | null>(null);

    const stats = useMemo(() => {
        const completed = tasks.filter(t => t.status === 'done').length;
        const totalBudget = tasks.reduce((acc, t) => acc + (t.budgetedCost || 0), 0);
        const actualCost = tasks.reduce((acc, t) => acc + (t.actualCost || 0), 0);
        const efficiency = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        return { completed, totalBudget, actualCost, efficiency };
    }, [tasks]);

    const activeAgentsCount = useMemo(() => {
        const recentLogs = systemLogs.slice(0, 50);
        const agents = new Set(recentLogs.map(l => l.agent));
        return agents.size;
    }, [systemLogs]);

    const handleRunDiagnosis = async () => {
        setIsGenerating(true);
        setDiagnosisReport(null);

        const systemSnapshot = {
            metrics: stats,
            activeAgents: activeAgentsCount,
            recentLogs: systemLogs.slice(0, 15).map(l => `${l.agent}: ${l.message}`),
            activeCampaign: campaignBrief ? campaignBrief.campaignTitle : "None",
            taskSample: tasks.slice(0, 5).map(t => `${t.title} (${t.status})`),
            scheduledContent: scheduledPosts.length
        };

        const prompt = `
            Act as the Chief System Architect of OPUS MAGNUM. Perform an "Atomic Diagnosis" of the current platform state based on the provided telemetry.
            
            **System Telemetry:**
            ${JSON.stringify(systemSnapshot, null, 2)}

            **Diagnosis Requirements:**
            Analyze the data deeply using Gemini 3.0 reasoning. Don't just summarize; diagnose the *health* and *velocity* of the system.
            
            Structure the report in 4 distinct "Atomic Layers" (use Markdown h2/h3):
            1.  **⚛️ Nucleus Health (Core Stability):** Assess the fundamental operational state based on logs and budget integrity.
            2.  **🪐 Agent Orbit (Activity):** Analyze if the ${activeAgentsCount} active agents are collaborating effectively or if there are silos.
            3.  **⚡ Execution Matter (Velocity):** Critique the task completion rate (${stats.efficiency}%) and scheduled output.
            4.  **🚀 Trajectory (Prediction):** Based on the current momentum, predict the outcome of the active campaign ("${systemSnapshot.activeCampaign}") or general readiness.

            Tone: Highly technical, futuristic, strategic, executive summary style. Use bolding for key metrics.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    thinkingConfig: { thinkingBudget: 2048 }
                }
            });
            setDiagnosisReport(response.text);
        } catch (error) {
            console.error("Diagnosis failed", error);
            setDiagnosisReport("## System Error\nConnection to Neural Core failed. Unable to perform diagnosis.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Status Bericht</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Atomic System Diagnosis ::</p>
                <p className="mt-4 text-[#888888] max-w-4xl mx-auto">
                    Eine Live-Diagnose der gesamten Plattform-Entwicklung. Starten Sie den Scan für eine atomare Analyse des Systemzustands.
                </p>
            </header>
            
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Live Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#333333] relative overflow-hidden group hover:border-green-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-green-500"><AtomIcon /></div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">System Coherence</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">Stable</p>
                        <p className="text-xs text-gray-400 mt-2">{systemLogs.length} Neural Events</p>
                    </div>
                    <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#333333] relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500"><ActivityIcon /></div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Task Velocity</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">{stats.efficiency}%</p>
                        <p className="text-xs text-gray-400 mt-2">{stats.completed} / {tasks.length} Nodes Processed</p>
                    </div>
                    <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#333333] relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-purple-500">€</div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Resource Burn</p>
                        <p className="text-2xl font-bold text-purple-400 mt-1">€{stats.actualCost.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-2">of €{stats.totalBudget.toLocaleString()} Budget</p>
                    </div>
                </div>

                <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-8 md:p-12 min-h-[400px] relative">
                     <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <div>
                                <p className="text-sm text-white font-medium">Diagnostic Core</p>
                                <p className="text-xs text-gray-500">{isGenerating ? 'Scanning System...' : 'Standby'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleRunDiagnosis} 
                            disabled={isGenerating}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <span className="animate-spin"><RefreshIcon /></span> : <AtomIcon />}
                            {isGenerating ? 'Analyzing...' : 'Start System Scan'}
                        </button>
                    </div>

                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                                <div className="absolute inset-3 rounded-full border-t-2 border-blue-500 animate-spin-reverse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-mono text-gray-500 animate-pulse">G3.0</span>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-purple-300 font-mono text-sm">Establishing Uplink to Neural Backbone...</p>
                                <p className="text-gray-500 text-xs">Aggregating {systemLogs.length} Telemetry Points</p>
                            </div>
                        </div>
                    ) : diagnosisReport ? (
                        <div className="prose prose-invert max-w-none prose-h2:text-purple-300 prose-h2:font-mono prose-h2:text-xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-blue-200 prose-h3:text-lg prose-strong:text-white animate-[fadeIn_0.5s_ease-out]">
                           <div dangerouslySetInnerHTML={{ __html: diagnosisReport.replace(/\n/g, '<br />') }} />
                           
                           <div className="mt-12 p-4 bg-green-900/10 border border-green-500/20 rounded text-xs text-green-400 font-mono text-center">
                                DIAGNOSIS COMPLETE // TIMESTAMP: {new Date().toISOString()}
                           </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                            <AtomIcon />
                            <p className="mt-4 max-w-md text-center">
                                Das System ist bereit für die Diagnose. Klicken Sie auf "Start System Scan", um eine KI-gestützte Tiefenanalyse des aktuellen Projektstatus zu generieren.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusBericht;
