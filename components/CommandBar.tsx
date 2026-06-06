import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { withMirrouKnowledge } from '../tenants';

// --- ICONS ---
const MagnumAiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;
const UserIcon = () => <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0"></div>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const Spinner = () => <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>;


// --- TYPES ---
type Message = {
    sender: 'user' | 'ai';
    text: string;
};

const PAGES = [ 'home', 'campaign', 'meisterwerk', 'visionar', 'stratege', 'konversator', 'auditor', 'animator', 'dirigent', 'secret', 'masterplan', 'einreichung', 'personalisator', 'orakel', 'mediathek', 'akademie', 'observatorium', 'conductor', 'publisher', 'persona', 'auditorium', 'analytiker', 'markenwaechter', 'berichterstatter', 'nexus', 'kalkulator', 'experimentator', 'prometheus', 'emailmarketing', 'interimmanager', 'gespraechsleiter', 'resonator', 'kolorit', 'ensemble', 'diplomat', 'chronist', 'sequenzer', 'taktgeber', 'spaeher', 'baumeister', 'leadinbox' ];

// Purpose map so the orchestrator routes a command to the RIGHT tool with a
// good prompt (not just the tool name). Keep in sync with the Header dropdowns.
const TOOL_CATALOG = `Tool-Katalog (für navigateTo / setToolInput):
- leadinbox: eingehende Website-Leads ansehen, qualifizieren, in einen Brief überführen
- baumeister: Creative Brief erstellen (Brief-Engine) + Landingpage-Strukturen
- stratege: vollständige Kampagnen-Strategien entwickeln
- prometheus: system-/strategieweite Wachstums- & Go-to-Market-Fragen
- spaeher: Markt-/Wettbewerbsanalyse in Echtzeit (D2C Beauty/Health DACH)
- persona: KI-Buyer-Personas erstellen
- konversator: Marketing-Beratung/Brainstorming im Chat
- visionar: visuelle Assets aus Text generieren
- animator: statische Bilder animieren (Video)
- resonator: plattformspezifische Social-Media-Posts
- personalisator: Inhalte für Zielgruppen/Personas anpassen
- kolorit: komplettes Brand-Style-Guide entwerfen
- sequenzer: mehrstufige E-Mail-Drip-Kampagnen
- diplomat: strategische E-Mail-Antworten formulieren
- markenwaechter: Markenrichtlinien definieren/prüfen (Brand-Check)
- auditor: Assets auf EU-AI-Act/HCVO/DSGVO-Compliance prüfen
- analytiker: Performance-Daten visualisieren/analysieren
- experimentator: A/B-Tests für Assets erstellen/auswerten
- berichterstatter: automatisierte Projekt-/Performance-Berichte
- kalkulator: Budgets/Kosten kalkulieren
- dirigent: Projektstatus analysieren + Empfehlungen
- nexus: das gesamte Wissen des Project OS durchsuchen
- systemaudit: ehrlicher Live-Systemzustand des OS`;

export const CommandBar: React.FC<{ isOpen: boolean; onClose: () => void; navigateTo: (page: string) => void; }> = ({ isOpen, onClose, navigateTo }) => {
    const { addTask, setToolInput } = useTasks();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setMessages([]); // Reset conversation on open
        } else {
            setInput('');
            setIsLoading(false);
        }
    }, [isOpen]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const navigateToFn = { name: 'navigateTo', description: 'Navigates to a specific page in the Project OS.', parameters: { type: Type.OBJECT, properties: { page: { type: Type.STRING, description: `The page to navigate to. Available pages: ${PAGES.join(', ')}` } }, required: ['page'] } };
        const createTaskFn = { name: 'createTask', description: 'Creates a new task in the Masterpiece.', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: 'The title of the new task.' }, description: { type: Type.STRING, description: 'An optional description for the task.' } }, required: ['title'] } };
        const setToolInputFn = { name: 'setToolInput', description: 'Prepares an AI tool for a specific task and navigates there.', parameters: { type: Type.OBJECT, properties: { tool: { type: Type.STRING, description: 'The tool to start (e.g., "visionar").' }, prompt: { type: Type.STRING, description: 'The prompt or instruction for the tool.' } }, required: ['tool', 'prompt'] } };
        const tools = [{ functionDeclarations: [navigateToFn, createTaskFn, setToolInputFn] }];

        const systemInstruction = withMirrouKnowledge(`Du bist MAGNUM AI, die zentrale Orchestrierungs-Intelligenz des Project OS, das Mirrou Creative Studio führt. Du führst Befehle aus: navigiere (navigateTo), erstelle Tasks (createTask) oder bereite ein Tool mit einem konkreten Auftrag vor und navigiere dorthin (setToolInput).

Wähle das passende Tool anhand des Katalogs unten. Will der Nutzer ein Asset/Output (Brief, Persona, Visual, Posts, Strategie, Analyse …), nutze setToolInput statt nur zu navigieren — und formuliere dafür einen präzisen, mirrou-konformen Prompt (nutze ICP/Voice/Compliance aus dem Wissen oben). Für eine Aktion MUSST du einen Function-Call nutzen. Antworte knapp auf Deutsch und bestätige die Aktion.

${TOOL_CATALOG}`);

        const history = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 2.5 Pro for superior command understanding
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [...history, { role: 'user', parts: [{ text: currentInput }] }],
                config: { systemInstruction, tools }
            });

            const text = response.text;
            const functionCalls = response.functionCalls;
            let aiResponseText = text;
            let actionTaken = false;

            if (functionCalls) {
                for (const fc of functionCalls) {
                    actionTaken = true;
                    switch (fc.name) {
                        case 'navigateTo':
                            navigateTo(fc.args.page as string);
                            break;
                        case 'createTask':
                            addTask(fc.args.title as string, (fc.args.description as string) || `Created by MAGNUM AI.`);
                            break;
                        case 'setToolInput':
                            setToolInput({ tool: fc.args.tool as string, prompt: fc.args.prompt as string, sourceTaskId: -1 });
                            navigateTo(fc.args.tool as string);
                            break;
                    }
                }
            }
            
            if (!aiResponseText && actionTaken) {
                aiResponseText = "Command executing...";
            } else if (!aiResponseText && !actionTaken) {
                aiResponseText = "I'm not sure how to help with that. Try 'go to...', 'create task...', or 'generate an image of...'."
            }

            setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);

            if (actionTaken) {
                setTimeout(() => onClose(), 1200);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't process that command." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[#1C1C1C]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl mx-4 page-fade-in flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-1 p-4 space-y-4 max-h-[50vh] overflow-y-auto" ref={messagesEndRef}>
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            <MagnumAiIcon />
                            <h3 className="mt-2 font-semibold text-white">MAGNUM AI v3.0</h3>
                            <p className="text-sm">How can I help you?</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <MagnumAiIcon />}
                            <div className={`max-w-md rounded-lg px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-white/90 text-black' : 'bg-[#0A0A0A]'}`}>
                                {msg.text}
                            </div>
                            {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <MagnumAiIcon />
                            <div className="max-w-md rounded-lg px-3 py-2 text-sm bg-[#0A0A0A] flex items-center gap-2">
                                <Spinner/> <span>thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 border-t border-white/10">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask MAGNUM AI... (e.g., 'create task: Finalize Pitch Deck')"
                        className="w-full bg-[#0A0A0A] text-white placeholder-gray-500 focus:outline-none text-sm px-3 py-2 rounded-md border border-[#333333]"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-white/10 text-white rounded-md hover:bg-white/20 disabled:opacity-50">
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};
