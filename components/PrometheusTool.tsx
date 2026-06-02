import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_TOOL_PROMPTS } from '@/tenants';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from '../contexts/AppContext';

const PrometheusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.184m-1.5.184a6.01 6.01 0 01-1.5-.184m3.75 7.023a5.977 5.977 0 01-1.242 2.118a5.977 5.977 0 01-5.016 0a5.977 5.977 0 01-1.242-2.118M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BriefingIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
);

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 15); // Speed of typing
        return () => clearInterval(interval);
    }, [text]);

    return <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: displayedText.replace(/\n/g, '<br />').replace(/## (.*?)<br \/>/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\* (.*?)<br \/>/g, '<li>$1</li>') }} />;
};


export const PrometheusTool: React.FC<{ navigateTo: (page: string) => void; }> = ({ navigateTo }) => {
    const { tasks, documents, personas, campaignBrief, scheduledPosts, brandGuidelines, systemLogs, userProfile } = useTasks();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getSystemContext = () => {
        const recentLogs = systemLogs.slice(0, 20).map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.agent}: ${l.message}`).join('\n');
        
        return `
            **User Context:** ${userProfile ? `${userProfile.name} (${userProfile.role}) - Mission: ${userProfile.mission}` : 'User'}
            **Active Campaign:** ${campaignBrief ? campaignBrief.campaignTitle : 'None'}
            **Recent System Activity (Logs):**
            ${recentLogs}
            
            **System State:**
            - Active Tasks: ${tasks.filter(t => t.status === 'inprogress').length}
            - Tasks in Review: ${tasks.filter(t => t.status === 'review').length}
            - Knowledge Base Docs: ${documents.length}
            - Personas: ${personas.length}
            - Scheduled Posts: ${scheduledPosts.length}
        `;
    };

    const handleQuery = async (userQuery: string) => {
        if (!userQuery.trim()) return;
        
        setIsLoading(true);
        setResult(null);
        setError(null);

        const prompt = `
            You are Prometheus, the global system intelligence AI for the OPUS MAGNUM MEDIA Project OS. You have access to the entire system's state in real-time. Your purpose is to provide holistic insights, identify cross-functional connections, maintain system coherence, and answer high-level strategic questions.

            Here is the current system state snapshot:
            ${getSystemContext()}

            **Detailed Knowledge Base Snippets (Top 5 most recent):**
            ${documents.slice(0, 5).map(d => `- [${d.category}] ${d.title}: ${d.content.substring(0, 100)}...`).join('\n')}

            Based on this complete system context, answer the following user query:
            "${userQuery}"

            Provide a concise, insightful, and strategic response in well-formatted Markdown. Connect the dots between the user's recent activity and their strategic goals.
        `;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to Gemini 3.0
                contents: prompt,
                config: {
                    systemInstruction: MIRROU_TOOL_PROMPTS.prometheus,
                    thinkingConfig: { thinkingBudget: 2048 } // Enable Thinking Mode for deeper reasoning
                }
            });
            setResult(response.text);
        } catch (e) {
            console.error("Prometheus AI Error:", e);
            setError("Die Anfrage an Prometheus ist fehlgeschlagen.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDailyBriefing = () => {
        const prompt = "Generate a 'Daily Briefing'. Summarize the recent system activity, highlight any blockers (Tasks in Review), remind me of the active campaign goal, and suggest one strategic focus for today based on the unfinished tasks.";
        handleQuery(prompt);
    };

    const quickActions = [
        "Fasse den aktuellen Projektzustand zusammen.",
        "Identifiziere die größte Inkonsistenz zwischen Masterplan und aktuellen Aufgaben.",
        "Was ist die dringendste strategische Priorität laut Logs?",
    ];

    return (
        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto space-y-6 relative overflow-hidden">
             {/* Subtle glowing accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded bg-purple-900/20">GEMINI 3.0 ENABLED</span>
                        <span className="text-xs font-mono text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded bg-blue-900/20">THINKING MODE ON</span>
                    </div>
                    <button 
                        onClick={handleDailyBriefing}
                        className="text-xs flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors border border-white/10"
                    >
                        <BriefingIcon className="w-3 h-3" /> Daily Briefing
                    </button>
                </div>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm relative z-10"
                    placeholder="Stellen Sie eine systemweite Frage an Prometheus..."
                />
                 <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                    {quickActions.map(q => (
                        <button key={q} onClick={() => setQuery(q)} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-md hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors">
                            {q}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => handleQuery(query)}
                    disabled={isLoading || !query.trim()}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 relative z-10 shadow-lg"
                >
                    <PrometheusIcon />
                    {isLoading ? 'Prometheus denkt nach...' : 'Anfrage an Prometheus'}
                </button>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg border border-[#333333] p-6 min-h-[200px] relative z-10">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    Antwort von Prometheus
                    {isLoading && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>}
                </h3>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500 space-y-4">
                        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="animate-pulse font-mono text-xs">ANALYZING VECTOR SPACE...</p>
                        <p className="text-[10px] text-purple-400/60 animate-pulse">Gemini 3.0 Thinking Process Active</p>
                    </div>
                )}
                
                {error && <p className="text-red-400 text-center">{error}</p>}
                
                {result && <Typewriter text={result} />}
                
                {!isLoading && !result && !error && (
                     <div className="text-center text-gray-600 py-8 text-sm">
                        Warte auf Eingabe. Prometheus ist bereit.
                    </div>
                )}
            </div>
        </div>
    );
};
