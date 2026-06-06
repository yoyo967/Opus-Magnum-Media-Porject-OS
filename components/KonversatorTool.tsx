import { getGeminiClient } from '@/utils/geminiClient';
import { withMirrouKnowledge } from '@/tenants';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useTasks, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

interface WebSource {
    type: 'web';
    uri: string;
    title: string;
}

interface MapSource {
    type: 'map';
    uri: string;
    title: string;
}

type Source = WebSource | MapSource;

interface Message {
    sender: 'user' | 'ai';
    text: string;
    sources?: Source[];
    isThinking?: boolean;
    isFallback?: boolean;
}

interface KonversatorToolProps {
    isEmbedded?: boolean;
    navigateTo?: (page: string) => void;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
);

const AIIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex-shrink-0"></div>
);

const BrainIcon: React.FC<{ active?: boolean }> = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${active ? 'text-purple-400 fill-purple-400/20' : 'text-gray-400'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 00-2.456-2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" />
    </svg>
);

const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A11.959 11.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.959 11.959 0 017 12m0 0h10" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

const AddTaskIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ArchiveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" />
    </svg>
);

const ThinkingBubble: React.FC = () => (
    <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-900/20 border border-purple-500/30 rounded-full px-3 py-1.5 animate-pulse w-fit mb-2">
        <BrainIcon active />
        <span>Thinking process running... (Deep Reasoning)</span>
    </div>
);

const AddTaskModal: React.FC<{ onClose: () => void; onSave: (title: string, description: string) => void; initialDescription: string; isEmbedded?: boolean }> = ({ onClose, onSave, initialDescription, isEmbedded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(initialDescription);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSave = () => { if (title.trim()) onSave(title.trim(), description.trim()); };

    return (
         <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm`} onClick={onClose}>
            <div ref={modalRef} onClick={e => e.stopPropagation()} className="bg-[#1C1C1C]/80 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-md m-4 p-6 page-fade-in">
                <h3 className="text-lg font-medium text-white mb-4">Create new task from chat</h3>
                <div className="space-y-4">
                     <input type="text" value={title} autoFocus onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={6} className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="border border-[#333333] text-[#F5F5F5] px-4 py-2 rounded-full font-medium text-sm hover:bg-[#2a2a2a] transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-opacity-90">Create Task</button>
                </div>
            </div>
        </div>
    );
};

export const KonversatorTool: React.FC<KonversatorToolProps> = ({ isEmbedded }) => {
    const { campaignBrief, addTask, addDocument, checkCredits, deductCredits } = useTasks();
    const [messages, setMessages] = useState<Message[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchMode, setSearchMode] = useState<'standard' | 'web' | 'maps' | 'web_maps'>('standard');
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [taskModalContent, setTaskModalContent] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [thinkingMode, setThinkingMode] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (searchMode === 'maps' || searchMode === 'web_maps') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (geoError) => {
                        console.error("Geolocation error:", geoError);
                        setError("Could not retrieve location. Map search might not work as expected.");
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        }
    }, [searchMode]);

    // Calculate dynamic cost
    const getCurrentCost = () => {
        let cost = COST_TABLE.SIMPLE_TEXT;
        if (thinkingMode) cost += 2; // Surcharge for thinking
        if (searchMode !== 'standard') cost += 4; // Surcharge for live tools
        return cost;
    };

    const generateResponse = async (userMessageText: string, useTools: boolean): Promise<void> => {
        const ai = getGeminiClient();

        const contents = [
            ...history,
            { role: 'user', parts: [{ text: userMessageText }] }
        ];

        const campaignContext = campaignBrief ? `CONTEXT: You are advising on the marketing campaign titled "${campaignBrief.campaignTitle}" with the slogan "${campaignBrief.slogan}". Keep all advice relevant to this campaign.` : '';
        const systemInstruction = withMirrouKnowledge(`You are a world-class senior marketing consultant. Your name is Konversator. Provide expert advice, creative ideas, and strategic insights. Be concise, actionable, and encouraging. Use markdown for formatting. When using maps, provide place information and be helpful. ${campaignContext}`);

        const config: any = { 
            systemInstruction,
            maxOutputTokens: 2048 // Safety limit
        };
        
        if (useTools) {
            const tools = [];
            if (searchMode === 'web' || searchMode === 'web_maps') {
                tools.push({ googleSearch: {} });
            }
            if (searchMode === 'maps' || searchMode === 'web_maps') {
                tools.push({ googleMaps: {} });
            }
            if (tools.length > 0) {
                config.tools = tools;
            }

            if ((searchMode === 'maps' || searchMode === 'web_maps') && userLocation) {
                 config.toolConfig = {
                    retrievalConfig: {
                        latLng: {
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude
                        }
                    }
                };
            }
        }
        
        if (thinkingMode) {
            config.thinkingConfig = { thinkingBudget: 1024 }; // Reserve tokens for thinking 
        }

        const modelName = 'gemini-2.5-pro';

        const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: config,
        });

        let fullResponseText = '';
        let finalResponse: GenerateContentResponse | null = null;

        for await (const chunk of responseStream) {
            fullResponseText += chunk.text;
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMsg = updatedMessages[prev.length - 1];
                lastMsg.text = fullResponseText;
                // Once we have text, stop showing thinking state
                if (lastMsg.isThinking && fullResponseText.length > 0) {
                    lastMsg.isThinking = false;
                }
                return updatedMessages;
            });
            finalResponse = chunk;
        }

        const sources: Source[] = [];
        const groundingMetadata = finalResponse?.candidates?.[0]?.groundingMetadata;

        if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
                if (chunk.web) {
                    sources.push({ type: 'web', uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
                }
                 if (chunk.maps) {
                    sources.push({ type: 'map', uri: chunk.maps.uri, title: chunk.maps.title || 'Map Link' });
                }
            }
        }

        setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMsg = updatedMessages[prev.length - 1];
            lastMsg.sources = sources;
            lastMsg.isThinking = false;
            if (!useTools && searchMode !== 'standard') {
                 lastMsg.isFallback = true;
            }
            return updatedMessages;
        });

        setHistory([
            ...contents,
            { role: 'model', parts: [{ text: fullResponseText }] }
        ]);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const cost = getCurrentCost();
        if (!checkCredits(cost)) {
            setError(`Insufficient Credits. This interaction requires ${cost} Credits.`);
            return;
        }

        const userMessageText = input.trim();
        const userMessage: Message = { sender: 'user', text: userMessageText };
        
        deductCredits(cost, `Konversator Chat (${searchMode}, thinking=${thinkingMode})`);
        setMessages(prev => [...prev, userMessage, { sender: 'ai', text: '', isThinking: thinkingMode }]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Try with tools if requested
            await generateResponse(userMessageText, searchMode !== 'standard');
        } catch (e) {
            console.warn("Initial generation failed, retrying without tools.", e);
            // Fallback logic: If tool usage failed, retry without tools
            if (searchMode !== 'standard') {
                try {
                     await generateResponse(userMessageText, false);
                } catch (fallbackError) {
                     console.error("Fallback also failed", fallbackError);
                     setError("Message could not be sent. Please try again.");
                     setMessages(prev => prev.slice(0, -1));
                }
            } else {
                 console.error("Error sending message:", e);
                 setError("Message could not be sent. Please try again.");
                 setMessages(prev => prev.slice(0, -1)); 
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveTask = (title: string, description: string) => {
        addTask(title, description, undefined, false, undefined, 'konversator');
        setTaskModalContent(null);
        setToastMessage(`Task "${title}" created.`);
    };
    
    const handleArchiveToAkademie = async () => {
        if (messages.length < 2) return;
        
        setIsLoading(true);
        const prompt = `Summarize the following conversation into a structured knowledge base article (Markdown). 
        Extract the key topic for the title.
        Structure with clear headings.
        
        Conversation:
        ${messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
        
        Output Format:
        Title: [Extracted Title]
        
        [Markdown Content]
        `;
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
            const text = response.text;
            
            const titleMatch = text.match(/Title:\s*(.*)/);
            const title = titleMatch ? titleMatch[1].trim() : 'Conversator Archive';
            const content = text.replace(/Title:.*\n/, '').trim();
            
            addDocument(title, content, 'knowledge');
            setToastMessage("Knowledge successfully archived in the Academy.");
        } catch(e) {
            console.error(e);
            setError("Archiving failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full flex flex-col bg-transparent' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] flex flex-col h-full max-h-[70vh] w-full max-w-2xl mx-auto relative'}`}>
                {taskModalContent && <AddTaskModal onClose={() => setTaskModalContent(null)} onSave={handleSaveTask} initialDescription={taskModalContent} isEmbedded={isEmbedded}/>}

                <div className={`flex justify-between items-center p-3 border-b border-[#333333] ${isEmbedded ? 'bg-transparent' : 'bg-[#111] rounded-t-lg'}`}>
                     <div className="flex items-center gap-4">
                         {campaignBrief ? (
                            <div className="text-xs text-yellow-300 bg-yellow-900/30 px-2 py-1 rounded border border-yellow-500/20">
                                Context: <strong>{campaignBrief.campaignTitle}</strong>
                            </div>
                        ) : <div className="text-xs text-gray-500">General Consultation</div>}

                        <button 
                            onClick={() => setThinkingMode(!thinkingMode)} 
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${thinkingMode ? 'bg-purple-900/30 border-purple-500 text-purple-300 shadow-[0_0_10px_#a855f7]' : 'bg-[#1C1C1C] border-[#333] text-gray-400 hover:border-gray-400'}`}
                            title="Activates Gemini 2.5 Pro Reasoning for complex tasks (+2 Credits)"
                        >
                            <BrainIcon active={thinkingMode} />
                            Deep Think
                        </button>
                     </div>
                    
                    {messages.length > 1 && (
                        <button 
                            onClick={handleArchiveToAkademie} 
                            disabled={isLoading}
                            className="flex items-center gap-1 text-xs text-purple-300 hover:text-white transition-colors disabled:opacity-50"
                            title="Save chat as document in the Academy"
                        >
                            <ArchiveIcon className="w-3 h-3" />
                            Archive
                        </button>
                    )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center">
                            <h3 className="text-lg font-medium text-white">Welcome to Conversator</h3>
                            <p className="text-sm mt-2">Your AI Marketing Consultant with Live Web Access.</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <AIIcon />}
                            <div className={`relative group max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-white/90 text-black rounded-br-none' : 'bg-[#1e1e1e] text-white rounded-bl-none border border-white/5'}`}>
                            {msg.isThinking && <ThinkingBubble />}
                            <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}></div>
                            {isLoading && msg.sender === 'ai' && index === messages.length -1 && !msg.text && !msg.isThinking ? '...' : ''}
                            
                            {msg.isFallback && (
                                <div className="mt-2 flex items-center gap-2 text-[10px] text-yellow-400 bg-yellow-900/20 p-1.5 rounded border border-yellow-500/20">
                                    <WarningIcon />
                                    <span>Search unavailable. Using internal knowledge fallback.</span>
                                </div>
                            )}

                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/20">
                                    <h5 className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1"><GlobeIcon /> Verified Sources:</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((source, i) => (
                                            <a
                                                href={source.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={i}
                                                className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-200 px-2 py-1 rounded-md transition-colors truncate max-w-[200px] flex items-center gap-1"
                                                title={source.title}
                                            >
                                                {source.type === 'map' ? '📍' : '🔗'} {source.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                                {msg.sender === 'ai' && msg.text && !isLoading && (
                                    <button
                                        onClick={() => setTaskModalContent(msg.text)}
                                        className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                                        title="Create as Task"
                                    >
                                        <AddTaskIcon />
                                    </button>
                                )}
                            </div>
                            {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                </div>
                
                <div className={`border-t border-[#333333] p-4 ${isEmbedded ? 'bg-transparent' : 'bg-[#1C1C1C] rounded-b-lg'}`}>
                    <div className="flex items-center justify-center mb-3">
                        <label htmlFor="search-mode-select" className="text-[10px] font-medium text-gray-500 mr-2 uppercase tracking-wider">Data Source</label>
                        <select
                            id="search-mode-select"
                            value={searchMode}
                            onChange={(e) => setSearchMode(e.target.value as any)}
                            className="bg-[#0A0A0A] text-white text-xs rounded border border-[#333333] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/50"
                        >
                            <option value="standard">Internal Knowledge (Fast)</option>
                            <option value="web">Live Web Search (+4 Cr)</option>
                            <option value="maps">Maps Search (+4 Cr)</option>
                            <option value="web_maps">Web & Maps Combo (+4 Cr)</option>
                        </select>
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your AI consultant..."
                            className="flex-grow bg-[#0A0A0A] text-white px-4 py-2 rounded-full border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm transition-all focus:border-white/30"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-opacity-90 disabled:opacity-50 transition-transform hover:scale-105 active:scale-95">
                            Send [{getCurrentCost()} Cr]
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
