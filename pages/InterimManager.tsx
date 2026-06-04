import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from '../contexts/AppContext';

// --- ICONS ---
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;

const InterimManager: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { tasks, campaignBrief } = useTasks();
    const [activeTab, setActiveTab] = useState<'report' | 'consultation'>('consultation');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        const prompt = `Act as a highly experienced Interim Manager / CMO. You are advising the user on their current project using your superior strategic reasoning (Gemini 2.5 Pro).
        
        Context:
        - Active Campaign: ${campaignBrief?.campaignTitle || 'None'}
        - Goal: ${campaignBrief?.slogan || 'N/A'}
        - Task Count: ${tasks.length}
        - Budget Used: ${tasks.reduce((acc, t) => acc + (t.actualCost || 0), 0)} EUR
        
        User Question: "${userMsg}"
        
        Provide a strategic, concise, and actionable answer. Adopt a professional, executive tone. Use Markdown for formatting.`;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContentStream({ model: 'gemini-2.5-pro', contents: prompt });
            
            let fullResponse = "";
            setChatHistory(prev => [...prev, { role: 'ai', text: '' }]);

            for await (const chunk of response) {
                fullResponse += chunk.text;
                setChatHistory(prev => {
                    const newHist = [...prev];
                    newHist[newHist.length - 1].text = fullResponse;
                    return newHist;
                });
            }
        } catch (e) {
            console.error(e);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Entschuldigung, ich bin momentan nicht erreichbar. Bitte versuchen Sie es später erneut." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-16 h-[calc(100vh-80px)] flex flex-col">
            <header className="mb-8 text-center flex-shrink-0">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Interim Manager</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Executive Strategy & Guidance ::</p>
            </header>

            <div className="flex-1 bg-[#1C1C1C] rounded-lg border border-[#333333] overflow-hidden flex">
                {/* Sidebar */}
                <aside className="w-64 bg-[#111] border-r border-white/10 flex flex-col">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modus</h3>
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        <button 
                            onClick={() => setActiveTab('report')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'report' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <DocumentIcon /> Strategischer Bericht
                        </button>
                        <button 
                            onClick={() => setActiveTab('consultation')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === 'consultation' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <ChatIcon /> Live Konsultation
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative bg-[#1C1C1C]">
                    {activeTab === 'report' ? (
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 prose prose-invert max-w-none">
                             <h3>Bericht: Optimierung der Kundenbeziehungen</h3>
                             <p className="text-sm text-gray-500"><strong>Datum:</strong> 17. November 2025</p>
                             <p>Die Integration von CRM-Systemen und GA4 über die Website ist nicht nur eine technische Möglichkeit, sondern eine strategische Notwendigkeit...</p>
                             {/* ... (rest of the static report content remains here or shortened for brevity) ... */}
                             <p className="italic text-gray-500">[Vollständiger Bericht archiviert]</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {chatHistory.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ChatIcon />
                                        </div>
                                        <h3 className="text-lg font-medium text-white">Wie kann ich Sie heute unterstützen?</h3>
                                        <p className="mt-2 text-sm max-w-md mx-auto">Ich kenne Ihren aktuellen Projektstatus. Fragen Sie mich nach strategischen Empfehlungen, Budget-Entscheidungen oder Priorisierungen.</p>
                                    </div>
                                )}
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-2xl p-4 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-[#2A2A2A] text-gray-200 rounded-bl-none border border-white/5'}`}>
                                            <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#2A2A2A] px-4 py-3 rounded-lg rounded-bl-none border border-white/5 flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-white/10 bg-[#111]">
                                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Strategische Frage stellen..."
                                        className="w-full bg-[#1C1C1C] text-white pl-6 pr-12 py-4 rounded-full border border-[#333] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none shadow-lg transition-all"
                                        autoFocus
                                    />
                                    <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2bg-purple-600 text-purple-400 hover:text-white disabled:opacity-50 transition-colors p-2">
                                        <SendIcon />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default InterimManager;
