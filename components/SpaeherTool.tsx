
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

// --- ICONS ---
const SearchIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>);
const MagnifyingGlassPlusIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>);
const ArchiveIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>);
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A11.959 11.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.959 11.959 0 017 12m0 0h10" /></svg>;
const BrainCircuitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 00-2.456-2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;

interface IntelligenceBrief {
    summary: string;
    key_findings: string[];
    sentiment: 'Positive' | 'Neutral' | 'Negative';
}

interface Source {
    uri: string;
    title: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
    </div>
);

interface SpaeherToolProps {
    isEmbedded?: boolean;
}

export const SpaeherTool: React.FC<SpaeherToolProps> = ({ isEmbedded }) => {
    const { addDocument, toolInput, setToolInput, addSystemLog, checkCredits, deductCredits } = useTasks();
    const [query, setQuery] = useState('Aktuelle Marketing-Trends für Interim Manager 2025');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [briefing, setBriefing] = useState<IntelligenceBrief | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [usedFallback, setUsedFallback] = useState(false);

    // Handle Auto-Trigger from Conductor
    useEffect(() => {
        if (toolInput && toolInput.tool === 'spaeher' && toolInput.prompt) {
            setQuery(toolInput.prompt);
            handleRecon(toolInput.prompt);
            setToolInput(null);
        }
    }, [toolInput, setToolInput]);
    
    const performScan = async (activeQuery: string, useSearch: boolean): Promise<{text: string, sources?: any[]}> => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const prompt = `
        Act as a senior market intelligence analyst. Your name is "Späher" (Scout).
        
        ${useSearch ? 'Perform a real-time web search' : 'Using your internal knowledge base (simulating a web search), perform an analysis'} on the following topic:
        "${activeQuery}"
        
        Goal: Provide a structured intelligence briefing.
        
        Output Requirement:
        Provide a valid JSON object with the following structure:
        {
            "summary": "A concise executive summary of the findings.",
            "key_findings": ["Finding 1", "Finding 2", "Finding 3", "Finding 4", "Finding 5"],
            "sentiment": "Positive" | "Neutral" | "Negative"
        }
        
        Do not include markdown code blocks (like \`\`\`json). Just the raw JSON string.
        `;

        const config: any = {
             responseMimeType: "application/json"
        };
        
        // Only add tools if we are actually using search
        if (useSearch) {
            config.tools = [{googleSearch: {}}];
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Use fast model for recon
            contents: prompt,
            config: config
        });

        return {
            text: response.text,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        };
    };

    const handleRecon = async (overrideQuery?: string) => {
        const activeQuery = overrideQuery || query;
        
        // CREDIT CHECK
        const cost = COST_TABLE.WEB_SEARCH;
        if (!checkCredits(cost)) {
            setError(`Insufficient Resources. This scan requires ${cost} Credits.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setBriefing(null);
        setSources([]);
        setUsedFallback(false);
        
        if (overrideQuery) setQuery(overrideQuery); 
        
        addSystemLog(`Späher initiated: Scanning Live Web for "${activeQuery}"... (-${cost} Credits)`, 'Späher');
        deductCredits(cost, 'Späher Live Scan');

        try {
            // Versuch 1: Mit Live Search
            const result = await performScan(activeQuery, true);
            processResult(result);
        } catch (e) {
            console.warn("Google Search failed, falling back to internal knowledge.", e);
            addSystemLog(`Search Network unreachable/timeout. Switching to internal reasoning matrix...`, 'Späher', 'warning');
            
            // Versuch 2: Fallback (ohne Search Tool)
            try {
                setUsedFallback(true);
                const fallbackResult = await performScan(activeQuery, false);
                processResult(fallbackResult);
            } catch (fallbackError) {
                 console.error(fallbackError);
                 setError("Aufklärung fehlgeschlagen. Systeme antworten nicht.");
                 addSystemLog(`Späher Fatal Error: ${fallbackError}`, 'Späher', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const processResult = (result: {text: string, sources?: any[]}) => {
        try {
            const jsonText = result.text?.replace(/```json/g, '').replace(/```/g, '').trim();
            if(jsonText) {
                setBriefing(JSON.parse(jsonText));
            } else {
                throw new Error("Empty response");
            }
        } catch (parseError) {
            console.error("JSON Parse Error", parseError);
            // Graceful degradation if JSON fails
            setBriefing({
                summary: result.text || "Raw text response due to parsing error.",
                key_findings: ["Formatierung fehlgeschlagen, siehe Zusammenfassung."],
                sentiment: "Neutral"
            });
        }
        
        if (result.sources) {
            const webSources = result.sources
                .map((chunk: any) => chunk.web)
                .filter(Boolean)
                .map((web: any) => ({ uri: web.uri, title: web.title || web.uri }));
            setSources(webSources);
            addSystemLog(`Späher found ${webSources.length} live sources.`, 'Späher', 'success');
        }
    };
    
    const handleDeepDive = (finding: string) => {
        const deepDiveQuery = `Deep dive analysis: ${finding}. Context: ${query}`;
        handleRecon(deepDiveQuery);
    };

    const handleSaveBriefing = () => {
        if (!briefing) return;
        
        const content = `
# Intelligence Briefing: ${query}
*Sentiment: ${briefing.sentiment}*
*Date: ${new Date().toLocaleDateString()}*
*Source: ${usedFallback ? 'Internal Reasoning (Simulation)' : 'Live Web Reconnaissance'}*

## Executive Summary
${briefing.summary}

## Key Findings
${(briefing.key_findings || []).map(f => `- ${f}`).join('\n')}

## Verified Sources
${(sources || []).map(s => `- [${s.title}](${s.uri})`).join('\n')}
        `;
        
        addDocument(`Intel: ${query.substring(0, 30)}...`, content.trim(), 'strategy');
        setToastMessage("Briefing wurde in der Akademie archiviert.");
    };

    const SentimentBadge: React.FC<{sentiment: 'Positive' | 'Neutral' | 'Negative'}> = ({sentiment}) => {
        const colors = {
            Positive: 'bg-green-500/20 text-green-300 border-green-500/30',
            Neutral: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            Negative: 'bg-red-500/20 text-red-300 border-red-500/30',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-md border ${colors[sentiment]}`}>{sentiment}</span>
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`grid lg:grid-cols-3 gap-8 ${isEmbedded ? 'h-full overflow-hidden' : 'max-w-6xl mx-auto'}`}>
                <div className={`lg:col-span-1 space-y-4 ${isEmbedded ? 'overflow-y-auto pr-2' : ''}`}>
                    <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg mb-4">
                        <h4 className="text-xs font-bold text-blue-300 flex items-center gap-2 uppercase tracking-wider mb-1">
                            <GlobeIcon /> Live Uplink Active
                        </h4>
                        <p className="text-[10px] text-blue-200/70">
                            Der Späher durchsucht das Web in Echtzeit. Kosten: {COST_TABLE.WEB_SEARCH} Credits pro Scan.
                        </p>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white">Reconnaissance-Ziel</h3>
                    <textarea 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        rows={4}
                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm focus:border-blue-500 transition-colors outline-none"
                        placeholder="z.B. 'Aktuelle Trends im Interim Management' oder 'Campana & Schott aktuelle Projekte'..."
                    />
                    <button 
                        onClick={() => handleRecon()} 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-gray-200 transition-colors"
                    >
                        <SearchIcon className="w-5 h-5" /> {isLoading ? 'Scanne Web...' : `Aufklärung starten [${COST_TABLE.WEB_SEARCH} Credits]`}
                    </button>
                    <div className="text-[10px] text-gray-500 text-center">Powered by Google Search Grounding</div>
                </div>

                <div className={`lg:col-span-2 bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 ${isEmbedded ? 'overflow-y-auto' : ''}`}>
                    <h3 className="text-lg font-semibold text-white mb-4">Intelligence Briefing</h3>
                    {isLoading && <SkeletonLoader />}
                    {error && <p className="text-red-400">{error}</p>}
                    {briefing && (
                        <div className="space-y-6 page-fade-in">
                            {usedFallback && (
                                <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded flex items-center gap-2 text-xs text-yellow-200 animate-pulse">
                                    <BrainCircuitIcon />
                                    <span><strong>Offline Mode:</strong> Verbindung zum Such-Netzwerk instabil. Daten basieren auf interner Simulation.</span>
                                </div>
                            )}
                            
                            <div>
                                <h4 className="font-semibold text-gray-400 text-sm mb-2 flex justify-between items-center">
                                    <span>Executive Summary</span>
                                    <SentimentBadge sentiment={briefing.sentiment} />
                                </h4>
                                <p className="text-gray-300 leading-relaxed">{briefing.summary}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-400 text-sm mb-2">Schlüsselerkenntnisse</h4>
                                <ul className="space-y-2">
                                    {(briefing.key_findings || []).map((finding, i) => (
                                        <li key={i} className="flex items-start gap-2 group">
                                            <span className="text-blue-500 mt-1.5 text-xs">●</span>
                                            <span className="text-gray-300 text-sm flex-1">{finding}</span>
                                            {!usedFallback && (
                                                <button 
                                                    onClick={() => handleDeepDive(finding)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-1 text-xs"
                                                    title="Deep Dive Analyse starten"
                                                >
                                                    <MagnifyingGlassPlusIcon /> Deep Dive
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {sources.length > 0 && (
                                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                    <h4 className="font-semibold text-gray-400 text-xs uppercase tracking-widest mb-3">Verifizierte Quellen</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {(sources || []).map((source, i) => (
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" key={i} className="block bg-[#111] p-2 rounded border border-[#333] hover:border-blue-500/50 hover:bg-blue-900/10 transition-colors group">
                                                <p className="text-blue-400 text-xs font-medium truncate group-hover:text-blue-300">{source.title}</p>
                                                <p className="text-gray-600 text-[10px] truncate">{new URL(source.uri).hostname}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="border-t border-white/10 pt-4 flex justify-end">
                                <button onClick={handleSaveBriefing} className="flex items-center gap-2 text-xs bg-white/10 text-white px-3 py-2 rounded-md hover:bg-white/20 transition-colors">
                                    <ArchiveIcon />
                                    In Akademie speichern
                                </button>
                            </div>
                        </div>
                    )}
                    {!isLoading && !briefing && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                            <GlobeIcon />
                            <p className="mt-2 text-sm">Geben Sie ein Ziel ein, um den Live-Web-Scan zu starten.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
