import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { DocumentReportIcon } from '../constants';
import { Toast } from './Toast';

const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;

interface BerichterstatterToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const BerichterstatterTool: React.FC<BerichterstatterToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, campaignBrief, scheduledPosts, addDocument } = useTasks();
    const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        const now = new Date();
        const filterDate = new Date();
        if (period === '7d') filterDate.setDate(now.getDate() - 7);
        else if (period === '30d') filterDate.setDate(now.getDate() - 30);

        const relevantTasks = period === 'all' ? tasks : tasks.filter(t => {
            const taskDate = t.publishedAt ? new Date(t.publishedAt) : new Date();
            return taskDate >= filterDate;
        });

        if (relevantTasks.length === 0) {
            setError("Keine relevanten Daten im ausgewählten Zeitraum.");
            setIsLoading(false);
            return;
        }

        const prompt = `Act as a CSO. Write a strategic status report for the last ${period}. 
        Data: ${JSON.stringify(relevantTasks.map(t => ({ id: t.id, title: t.title, status: t.status, performanceData: t.performanceData })))}
        Strategy: ${JSON.stringify(campaignBrief)}
        Structure: Executive Summary, Strategic Analysis, Operational Velocity, Risks & Opportunities, Next Steps.
        Use Gemini 3.0 reasoning.`;
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { thinkingConfig: { thinkingBudget: 2048 } }
            });
            setReport(response.text);
        } catch (e) {
            console.error(e);
            setError("Bericht konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => { if (report) { navigator.clipboard.writeText(report); setToastMessage("Kopiert!"); } };
    const handleArchive = () => { if (!report) return; addDocument(`Status Report: ${new Date().toLocaleDateString()}`, report, 'operation'); setToastMessage("Archiviert!"); };

    const PeriodButton: React.FC<{ value: '7d' | '30d' | 'all', label: string }> = ({ value, label }) => (
        <button onClick={() => setPeriod(value)} className={`px-3 py-1 text-xs rounded-full transition-colors ${period === value ? 'bg-white text-black font-semibold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>{label}</button>
    );

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full flex flex-col' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto'}`}>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 flex-shrink-0">
                    <div className="flex items-center gap-2 p-1 bg-black/30 rounded-full">
                        <PeriodButton value="7d" label="Letzte 7 Tage" />
                        <PeriodButton value="30d" label="Letzte 30 Tage" />
                        <PeriodButton value="all" label="Gesamt" />
                    </div>
                    <button onClick={handleGenerateReport} disabled={isLoading} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                        <DocumentReportIcon /> {isLoading ? 'Analysiere...' : 'Report generieren'}
                    </button>
                </div>

                <div className={`bg-[#0A0A0A] rounded-lg border border-[#333333] p-6 relative overflow-hidden ${isEmbedded ? 'flex-1 overflow-y-auto' : 'min-h-[400px]'}`}>
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/90 z-10">
                            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 animate-pulse font-medium">Gemini 3.0 analysiert Projektdaten...</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center pt-20">{error}</p>}
                    {report ? (
                         <div className="page-fade-in">
                            <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />').replace(/## (.*?)<br \/>/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            <div className="mt-6 flex justify-end gap-4 border-t border-white/10 pt-4">
                                <button onClick={handleCopyToClipboard} className="text-sm text-gray-300 hover:text-white">Kopieren</button>
                                <button onClick={handleArchive} className="text-sm bg-purple-900/30 border border-purple-500/30 text-purple-200 px-4 py-2 rounded-full hover:bg-purple-900/50 flex items-center gap-2">
                                    <ArchiveIcon /> Archivieren
                                </button>
                            </div>
                        </div>
                    ) : (
                        !isLoading && <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-20"><DocumentReportIcon /><p className="mt-2">Wählen Sie einen Zeitraum für den Bericht.</p></div>
                    )}
                </div>
            </div>
        </>
    );
};
