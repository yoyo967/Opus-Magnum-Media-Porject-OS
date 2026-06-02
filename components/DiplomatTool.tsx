
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';

const DiplomatIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m-2-1.5h-5.25m0 0l-1-1.5m1.5 1.5v-5.25m0 0l1.5-1.5m-1.5-1.5l-1.5-1.5m0 0l-1.5 1.5m3 0l-1.5 1.5m0 0l-1.5-1.5m0 0l1.5-1.5m-1.5 1.5h5.25m0 0l1.5 1.5" /></svg>);
const SaveIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>);

interface DiplomatToolProps {
    isEmbedded?: boolean;
}

export const DiplomatTool: React.FC<DiplomatToolProps> = ({ isEmbedded }) => {
    const { contacts, addInteraction } = useTasks();
    const [context, setContext] = useState('Antwort auf eine Recruiter-Anfrage...');
    const [originalMessage, setOriginalMessage] = useState('Hey Yahya, kennst du schon Campana & Schott? ...');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [draft, setDraft] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<number | ''>('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setDraft(null);

        const prompt = `Act as a strategic communications expert named "Diplomat". Draft a professional response.
        Goal: ${context}
        Original: "${originalMessage}"
        Craft a response that is polite, professional, and strategic. Use Gemini 3.0 reasoning.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { thinkingConfig: { thinkingBudget: 2048 } }
            });
            setDraft(response.text);
        } catch (e) {
            console.error(e);
            setError("Antwortentwurf konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => { if (draft) { navigator.clipboard.writeText(draft); setToastMessage("Entwurf kopiert!"); } };
    const handleSaveToCRM = () => { if (!draft || !selectedContactId) return; addInteraction(Number(selectedContactId), { type: 'email', content: draft, subject: 'Entwurf via Diplomat' }); setToastMessage("Im Chronist gespeichert!"); };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full flex flex-col space-y-4' : 'grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto'}`}>
                <div className={`bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 space-y-4 ${isEmbedded ? 'flex-shrink-0' : ''}`}>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">1. Ihr Kommunikationsziel</label>
                        <textarea value={context} onChange={e => setContext(e.target.value)} rows={isEmbedded ? 2 : 4} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm resize-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">2. Ursprüngliche Nachricht</label>
                        <textarea value={originalMessage} onChange={e => setOriginalMessage(e.target.value)} rows={isEmbedded ? 3 : 6} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm resize-none" />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                        <DiplomatIcon /> {isLoading ? 'Denkprozess...' : 'Antwort entwerfen'}
                    </button>
                </div>
                
                <div className={`bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 flex flex-col ${isEmbedded ? 'flex-1 overflow-hidden' : ''}`}>
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-white">Entwurf</h3>
                        <span className="text-[10px] text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">Gemini 3.0</span>
                    </div>
                    <div className={`bg-[#0A0A0A] rounded-lg border border-[#333333] p-4 flex-grow prose prose-sm prose-invert max-w-none text-gray-300 whitespace-pre-wrap relative ${isEmbedded ? 'overflow-y-auto' : 'min-h-[300px]'}`}>
                        {isLoading && ( <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/80 z-10"><div className="text-center text-gray-500 animate-pulse"><p>Diplomat analysiert...</p></div></div> )}
                        {error && <p className="text-red-400">{error}</p>}
                        {draft}
                    </div>
                    {draft && (
                        <div className="mt-4 pt-4 border-t border-[#333333] space-y-3 flex-shrink-0">
                            <div className="flex gap-2">
                                <select value={selectedContactId} onChange={e => setSelectedContactId(Number(e.target.value))} className="flex-1 bg-[#0A0A0A] text-white text-xs px-3 py-2 rounded-md border border-[#333333] focus:outline-none">
                                    <option value="">Kontakt wählen...</option>
                                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button onClick={handleSaveToCRM} disabled={!selectedContactId} className="flex items-center gap-2 bg-blue-900/30 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-900/50 disabled:opacity-50 transition-colors">
                                    <SaveIcon /> CRM
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleCopy} className="bg-white/10 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-white/20 transition-colors">Kopieren</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
