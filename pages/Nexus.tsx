import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks, Task, Document, Persona } from '../contexts/AppContext';
import { MASTERPLAN_HIERARCHY, MasterplanNode } from '../masterplanData';
import { NeuralBackground } from '../components/NeuralBackground';

interface NexusProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
}

type SearchResult = {
  type: 'Task' | 'Document' | 'Persona' | 'Masterplan';
  id: string | number;
  title: string;
  content: string;
  source: Task | Document | Persona | { id: string, title: string };
};

// --- ICONS ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const PersonaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MasterplanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m-2-1.5h-5.25m0 0l-1-1.5m1.5 1.5v-5.25m0 0l1.5-1.5m-1.5-1.5l-1.5-1.5m0 0l-1.5 1.5m3 0l-1.5 1.5m0 0l-1.5-1.5m0 0l1.5 1.5" /></svg>;
const MagnumAiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M12 7.5V5.25m0 2.25l-2.25-1.313m10.5 13.5L12 17.25l-2.25 1.313M21 14.25v2.25l-2.25-1.313M3 14.25l2.25 1.313M3 14.25v2.25m1.5-13.5l2.25-1.313M4.5 5.25v2.25m0 0l2.25 1.313M12 2.25l-2.25 1.313M12 2.25l2.25 1.313M19.5 5.25l-2.25 1.313M19.5 5.25v2.25" /></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;

const RESULT_ICONS = { Task: <TaskIcon />, Document: <DocIcon />, Persona: <PersonaIcon />, Masterplan: <MasterplanIcon /> };

const Nexus: React.FC<NexusProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, documents, personas, nexusQuery, setNexusQuery } = useTasks();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [synthesizedResult, setSynthesizedResult] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [deepMode, setDeepMode] = useState(false);

    const flattenMasterplan = (nodes: MasterplanNode[]): SearchResult[] => {
        let results: SearchResult[] = [];
        for (const node of nodes) {
            if (node.content) {
                results.push({
                    type: 'Masterplan',
                    id: node.id,
                    title: node.title,
                    content: node.content,
                    source: { id: node.id, title: node.title }
                });
            }
            if (node.children) {
                results = results.concat(flattenMasterplan(node.children));
            }
        }
        return results;
    };

    const allSearchableData = useMemo(() => {
        const masterplanData = flattenMasterplan(MASTERPLAN_HIERARCHY);

        return [
            ...tasks.map(t => ({ type: 'Task' as const, id: t.id, title: t.title, content: t.description, source: t })),
            ...documents.map(d => ({ type: 'Document' as const, id: d.id, title: d.title, content: d.content, source: d })),
            ...personas.map(p => ({ type: 'Persona' as const, id: p.id, title: p.name, content: p.details.bio, source: p })),
            ...masterplanData
        ];
    }, [tasks, documents, personas]);

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const lowerQuery = searchQuery.toLowerCase();
        const results = allSearchableData.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.content.toLowerCase().includes(lowerQuery)
        );
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleSynthesize = async () => {
        if (searchResults.length === 0) return;
        setIsSynthesizing(true);
        setSynthesizedResult(null);

        const context = searchResults.map(r => `Type: ${r.type}\nTitle: ${r.title}\nContent: ${r.content.substring(0, 300)}...`).join('\n\n---\n\n');
        
        const modelName = deepMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const systemInstruction = deepMode 
            ? "You are MAGNUM AI, the central intelligence of a Project OS. Using your advanced reasoning capabilities, synthesize the search results into a comprehensive, strategic answer. Connect the dots between tasks, documents, and personas to provide deep insights."
            : "Act as MAGNUM AI, the central intelligence of a Project OS. Based on the following search results from within the system, synthesize a concise and helpful answer for the user's query.";

        const prompt = `User Query: "${query}"\n\nSearch Results:\n${context}\n\nSynthesized Answer:`;
        
        const config: any = {
             systemInstruction
        };
        
        if (deepMode) {
            config.thinkingConfig = { thinkingBudget: 2048 };
        }
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({ 
                model: modelName, 
                contents: prompt,
                config
            });
            setSynthesizedResult(response.text);
        } catch (error) {
            console.error("Nexus Synthesis Error:", error);
            setSynthesizedResult("Die Synthese ist fehlgeschlagen.");
        } finally {
            setIsSynthesizing(false);
        }
    };

    useEffect(() => {
        if (nexusQuery) {
            setQuery(nexusQuery);
            handleSearch(nexusQuery);
            setNexusQuery(null); // Consume the query
        }
    }, [nexusQuery, setNexusQuery]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => handleSearch(query), 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    return (
        <div className={`relative ${isEmbedded ? 'h-full' : 'min-h-[calc(100vh-80px)]'} overflow-hidden`}>
            {!isEmbedded && <NeuralBackground opacity={0.15} />}
            <div className={`${isEmbedded ? 'p-4' : 'container mx-auto px-6 py-16'} relative z-10 h-full flex flex-col`}>
                {!isEmbedded && (
                    <header className="mb-12 text-center">
                        <h1 className="text-5xl font-bold text-[#F5F5F5]">Nexus</h1>
                        <p className="mt-2 text-purple-300 font-mono">:: System Intelligence Hub ::</p>
                        <p className="mt-4 text-[#888888] max-w-3xl mx-auto">Durchsuchen Sie das gesamte Wissen des Project OS – von Aufgaben über Dokumente bis zum Masterplan. Lassen Sie die KI die Ergebnisse für Sie zusammenfassen.</p>
                    </header>
                )}
                <main className={`max-w-4xl mx-auto space-y-8 w-full ${isEmbedded ? 'flex-1 flex flex-col h-full' : ''}`}>
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><SearchIcon /></div>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Durchsuchen Sie alle Aufgaben, Dokumente, Personas und den Masterplan..."
                            className="w-full bg-[#1C1C1C]/80 backdrop-blur-xl text-white pl-11 pr-4 py-3 rounded-full border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-base shadow-xl"
                        />
                    </div>

                    <div className={`grid md:grid-cols-2 gap-8 ${isEmbedded ? 'flex-1 overflow-hidden' : ''}`}>
                        {/* Search Results */}
                        <div className={`space-y-4 ${isEmbedded ? 'flex flex-col h-full overflow-hidden' : ''}`}>
                            <h2 className="text-lg font-semibold text-white flex-shrink-0">Suchergebnisse ({searchResults.length})</h2>
                            <div className={`bg-[#1C1C1C]/80 backdrop-blur-xl rounded-lg border border-[#333333] p-4 space-y-3 shadow-lg ${isEmbedded ? 'flex-1 overflow-y-auto' : 'max-h-96 overflow-y-auto'}`}>
                                {isSearching && <p className="text-gray-400 animate-pulse">Suche in System-Datenbanken...</p>}
                                {!isSearching && searchResults.length === 0 && <p className="text-gray-500 text-center py-8">Keine Ergebnisse gefunden.</p>}
                                {searchResults.map(result => (
                                    <div key={`${result.type}-${result.id}`} className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333] hover:border-purple-500/30 transition-colors cursor-pointer">
                                        <p className="font-semibold text-white text-sm flex items-center gap-2">{RESULT_ICONS[result.type]} {result.title}</p>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{result.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Synthesis */}
                        <div className={`space-y-4 ${isEmbedded ? 'flex flex-col h-full overflow-hidden' : ''}`}>
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h2 className="text-lg font-semibold text-white">KI-Synthese</h2>
                                <button 
                                    onClick={() => setDeepMode(!deepMode)} 
                                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${deepMode ? 'bg-purple-900/30 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#1C1C1C] border-[#333] text-gray-500 hover:border-gray-400'}`}
                                    title="Aktiviert Gemini 2.5 Pro Reasoning für tiefere Zusammenhänge"
                                >
                                    <BrainIcon />
                                    Deep Synthesis
                                </button>
                            </div>
                            
                            <div className={`bg-[#1C1C1C]/80 backdrop-blur-xl rounded-lg border border-[#333333] p-4 shadow-lg flex flex-col relative overflow-hidden ${isEmbedded ? 'flex-1' : 'min-h-[200px]'}`}>
                                {deepMode && <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 blur-2xl rounded-full pointer-events-none"></div>}
                                
                                {isSynthesizing && (
                                    <div className="flex flex-col items-center justify-center h-full flex-1">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <p className="text-gray-400 text-sm">{deepMode ? 'MAGNUM AI verknüpft Systemdaten...' : 'MAGNUM AI analysiert Ergebnisse...'}</p>
                                        {deepMode && <p className="text-[10px] text-purple-400 animate-pulse mt-1">Thinking Budget Active</p>}
                                    </div>
                                )}
                                {synthesizedResult && <div className="prose prose-sm prose-invert max-w-none text-gray-300 animate-[fadeIn_0.5s_ease-out] overflow-y-auto flex-1" dangerouslySetInnerHTML={{ __html: synthesizedResult.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />}
                                {!isSynthesizing && !synthesizedResult && (
                                    <div className="flex flex-col items-center justify-center h-full flex-1 text-center">
                                        <p className="text-gray-500">Klicken Sie auf "Synthetisieren", um eine Zusammenfassung zu erhalten.</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSynthesize} disabled={isSynthesizing || searchResults.length === 0} className="w-full flex-shrink-0 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-50 shadow-lg shadow-purple-900/20">
                                <MagnumAiIcon />
                                {isSynthesizing ? 'Wird synthetisiert...' : deepMode ? 'Deep Synthesis starten' : 'Mit MAGNUM AI synthetisieren'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Nexus;
