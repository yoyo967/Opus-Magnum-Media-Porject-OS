
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Toast } from './Toast';

// Icons
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const UserIcon = () => <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">ICH</div>;
const PersonaIcon = () => <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">KI</div>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h4.992m-4.993 0l3.181-3.183a8.25 8.25 0 00-11.667 0l3.181 3.183" /></svg>;

// Types
interface Scenario {
    id: string;
    title: string;
    description: string;
    aiRole: string;
    difficulty: 'Einfach' | 'Mittel' | 'Schwer';
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface Analysis {
    score: number;
    feedback: string;
    suggestion: string;
}

const SCENARIOS: Scenario[] = [
    { id: 'pitch', title: 'Der skeptische Investor', description: 'Sie pitchen eine neue Marketing-Strategie für 500k Budget. Der Investor ist datengetrieben und ungeduldig.', aiRole: 'Ein erfahrener, kritischer Venture Capitalist, der sofort ROI-Beweise will.', difficulty: 'Schwer' },
    { id: 'salary', title: 'Gehaltsverhandlung', description: 'Sie fordern 20% mehr Budget für Ihr Team. Der CFO muss sparen.', aiRole: 'Ein strenger CFO, der auf Kosteneffizienz fixiert ist, aber gute Argumente respektiert.', difficulty: 'Mittel' },
    { id: 'crisis', title: 'Kunden-Eskalation', description: 'Ein Großkunde ist unzufrieden mit der letzten Kampagne. Deeskalieren Sie die Situation.', aiRole: 'Ein wütender Marketingleiter eines Großkonzerns, der sich blamiert fühlt.', difficulty: 'Schwer' },
    { id: 'feedback', title: 'Kritisches Feedback', description: 'Sie müssen einem Mitarbeiter mitteilen, dass seine Performance nachgelassen hat.', aiRole: 'Ein defensiver Mitarbeiter, der denkt, er arbeite hart genug.', difficulty: 'Mittel' },
];

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 36;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;
    
    let color = 'text-red-500';
    if (score >= 50) color = 'text-yellow-500';
    if (score >= 80) color = 'text-green-500';

    return (
        <div className="relative flex items-center justify-center w-24 h-24">
             <svg className="transform -rotate-90 w-full h-full">
                <circle className="text-gray-800" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="50%" cy="50%" />
                <circle className={`${color} transition-all duration-1000 ease-out`} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="50%" cy="50%" />
             </svg>
             <div className="absolute flex flex-col items-center">
                 <span className="text-2xl font-bold text-white">{score}</span>
                 <span className="text-[10px] text-gray-400 uppercase">Persuasion</span>
             </div>
        </div>
    );
};

export const GespraechsleiterTool: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastAnalysis, setLastAnalysis] = useState<Analysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startScenario = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setMessages([{ sender: 'ai', text: `(Schlüpft in Rolle) "Also gut, ich habe wenig Zeit. Worum geht es genau und warum sollte mich das interessieren?"` }]);
        setLastAnalysis(null);
        setInput('');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedScenario) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);
        setError(null);

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                reply: { type: Type.STRING, description: "Die direkte Antwort der Persona auf die Aussage des Nutzers. Bleiben Sie strikt in der Rolle." },
                score: { type: Type.INTEGER, description: "Eine Bewertung von 0-100, wie überzeugend und rhetorisch geschickt die letzte Aussage des Nutzers war." },
                feedback: { type: Type.STRING, description: "Kurzes, direktes Feedback an den Nutzer (als Coach, nicht als Persona): Was war gut? Was war schlecht?" },
                suggestion: { type: Type.STRING, description: "Ein konkreter Tipp für die nächste Antwort." }
            }
        };

        const prompt = `
            Simulation: "${selectedScenario.title}"
            Deine Rolle: ${selectedScenario.aiRole}
            Situation: ${selectedScenario.description}
            
            Der Nutzer sagt: "${userMsg}"
            
            Aufgabe:
            1. Antworte als die Persona. Sei realistisch, emotional konsistent und fordernd.
            2. Analysiere als Coach die Rhetorik, Empathie und Argumentation des Nutzers.
            
            Antworte NUR im JSON-Format gemäß Schema.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for better roleplay and psychological nuance
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: responseSchema }
            });

            const result = JSON.parse(response.text);
            setMessages(prev => [...prev, { sender: 'ai', text: result.reply }]);
            setLastAnalysis({ score: result.score, feedback: result.feedback, suggestion: result.suggestion });

        } catch (e) {
            console.error(e);
            setError("Verbindungsfehler zum Simulator.");
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setSelectedScenario(null);
        setMessages([]);
        setLastAnalysis(null);
    };

    if (!selectedScenario) {
        return (
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-8 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Wählen Sie Ihre Simulation</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {SCENARIOS.map(s => (
                        <button key={s.id} onClick={() => startScenario(s)} className="bg-[#0A0A0A] p-6 rounded-lg border border-[#333333] text-left hover:border-purple-500/50 transition-all group hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{s.title}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${s.difficulty === 'Schwer' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}`}>{s.difficulty}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">{s.description}</p>
                            <p className="text-xs text-gray-500 italic">Gegenspieler: {s.aiRole}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] h-[80vh] flex overflow-hidden max-w-6xl mx-auto">
            {/* Left: Chat Area */}
            <div className="flex-1 flex flex-col border-r border-white/10">
                <div className="p-4 border-b border-white/10 bg-[#111] flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-white">{selectedScenario.title}</h3>
                        <p className="text-xs text-gray-400">{selectedScenario.aiRole}</p>
                    </div>
                    <button onClick={reset} className="text-gray-500 hover:text-white text-xs flex items-center gap-1"><RefreshIcon /> Beenden</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0f0f0f]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.sender === 'ai' ? <PersonaIcon /> : <UserIcon />}
                            <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-purple-900/30 text-purple-100 border border-purple-500/30 rounded-tr-none' : 'bg-[#222] text-gray-300 border border-white/5 rounded-tl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <PersonaIcon />
                            <div className="bg-[#222] px-4 py-3 rounded-xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#111] border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            placeholder="Ihre Antwort..." 
                            className="w-full bg-[#1C1C1C] text-white pl-4 pr-12 py-3 rounded-full border border-[#333] focus:border-purple-500 focus:outline-none text-sm"
                            disabled={isLoading}
                            autoFocus
                        />
                        <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-500 disabled:opacity-50 transition-colors">
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Coach Panel */}
            <div className="w-80 bg-[#161616] flex flex-col">
                <div className="p-4 border-b border-white/10 bg-[#111]">
                    <h3 className="font-bold text-white text-sm uppercase tracking-widest text-center">Live Coaching</h3>
                </div>
                
                {lastAnalysis ? (
                    <div className="flex-1 p-6 flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                        <div className="mb-8">
                            <ScoreGauge score={lastAnalysis.score} />
                        </div>
                        
                        <div className="w-full space-y-6">
                            <div className="bg-blue-900/10 border-l-2 border-blue-500 p-3 rounded-r-md">
                                <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Feedback</h4>
                                <p className="text-sm text-gray-300 italic">"{lastAnalysis.feedback}"</p>
                            </div>
                            
                            <div className="bg-green-900/10 border-l-2 border-green-500 p-3 rounded-r-md">
                                <h4 className="text-xs font-bold text-green-400 uppercase mb-1">Tipp</h4>
                                <p className="text-sm text-gray-300">{lastAnalysis.suggestion}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">?</span>
                        </div>
                        <p className="text-sm">Warten auf Ihre erste Antwort...</p>
                        <p className="text-xs mt-2 max-w-[200px]">Der Coach analysiert Ihre Rhetorik in Echtzeit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
