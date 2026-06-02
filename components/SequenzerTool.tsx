import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, EmailSequence, SequenceStep } from '../contexts/AppContext';
import { Toast } from './Toast';

const SequenzerIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0h7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>);
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;

interface SequenzerToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const SequenzerTool: React.FC<SequenzerToolProps> = ({ navigateTo, isEmbedded }) => {
    const { sequences, addSequence, updateSequence } = useTasks();
    const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
    const [selectedStep, setSelectedStep] = useState<SequenceStep | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newSequenceData, setNewSequenceData] = useState({ name: '', goal: '', numEmails: '3' });
    const [psychTrigger, setPsychTrigger] = useState('None');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedSequence && sequences.length > 0) {
            setSelectedSequence(sequences[0]);
        }
    }, [sequences, selectedSequence]);
    
    useEffect(() => {
        if(selectedSequence && selectedSequence.steps.length > 0) {
            setSelectedStep(selectedSequence.steps[0]);
        } else {
            setSelectedStep(null);
        }
    }, [selectedSequence]);

    const handleGenerateSequence = async () => {
        setIsLoading(true);
        
        const sequenceSchema = {
            type: Type.OBJECT,
            properties: {
                steps: {
                    type: Type.ARRAY,
                    description: 'The array of steps in the email sequence.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['email', 'delay'] },
                            subject: { type: Type.STRING, description: 'The subject line for the email. Null for delay steps.' },
                            body: { type: Type.STRING, description: 'The HTML body content for the email. Null for delay steps.' },
                            delay_days: { type: Type.INTEGER, description: 'The number of days to wait. Null for email steps.' }
                        }
                    }
                }
            }
        };
        
        let psychInstruction = '';
        if (psychTrigger !== 'None') {
            psychInstruction = `
            IMPORTANT: You must strategically utilize the psychological principle of "${psychTrigger}" throughout this sequence.
            - If Scarcity: Emphasize limited time or quantity.
            - If Social Proof: Include testimonials or user numbers.
            - If Authority: Use expert tone and credentials.
            - If Reciprocity: Give value (tips, freebies) before asking.
            `;
        }

        const prompt = `Create a ${newSequenceData.numEmails}-step email drip campaign.
        - **Goal:** ${newSequenceData.goal}
        - **Sequence Name:** ${newSequenceData.name}
        
        ${psychInstruction}

        Alternate between emails and delays. Start with an email. Generate professional, engaging content. Respond ONLY with a JSON object adhering to the schema.`;
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to Gemini 3.0
                contents: prompt,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: sequenceSchema,
                    thinkingConfig: { thinkingBudget: 1024 } // Enable Thinking for strategic sequence planning
                }
            });
            const { steps: generatedSteps } = JSON.parse(response.text);
            const stepsWithIds = generatedSteps.map((step: any, index: number) => ({...step, id: Date.now() + index}));
            
            addSequence({ name: newSequenceData.name, goal: newSequenceData.goal, steps: stepsWithIds });
            setToastMessage(`Sequenz "${newSequenceData.name}" wurde erstellt.`);
            setIsCreating(false);
            setNewSequenceData({ name: '', goal: '', numEmails: '3' });
            setPsychTrigger('None');
        } catch (e) {
            console.error(e);
            setToastMessage("Fehler: Sequenz konnte nicht erstellt werden.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateStep = (updates: Partial<SequenceStep>) => {
        if (!selectedSequence || !selectedStep) return;
        const updatedSteps = selectedSequence.steps.map(step => 
            step.id === selectedStep.id ? { ...step, ...updates } : step
        );
        updateSequence(selectedSequence.id, { steps: updatedSteps });
        setSelectedStep(prev => prev ? { ...prev, ...updates } : null);
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`bg-[#1C1C1C] flex overflow-hidden ${isEmbedded ? 'h-full' : 'rounded-lg border border-[#333333] h-[75vh]'}`}>
                {/* Sequence List */}
                <aside className="w-1/3 border-r border-white/10 flex flex-col bg-[#111]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-white text-sm">Sequenzen</h3>
                        <button onClick={() => { setIsCreating(true); setSelectedSequence(null); }} className="p-1 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-md border border-white/10 w-8 h-8 flex items-center justify-center">+</button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {sequences.map(seq => (
                            <button key={seq.id} onClick={() => { setSelectedSequence(seq); setIsCreating(false); }} className={`w-full text-left p-4 border-b border-white/5 transition-colors ${selectedSequence?.id === seq.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                <p className="font-semibold text-white text-sm">{seq.name}</p>
                                <p className="text-xs text-gray-400 truncate mt-1">{seq.goal}</p>
                            </button>
                        ))}
                    </div>
                </aside>
                {/* Main View */}
                <main className="w-2/3 flex bg-[#1C1C1C]">
                    {isCreating ? (
                        <div className="p-8 w-full space-y-6 max-w-2xl mx-auto overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white">Neue Sequenz erstellen</h2>
                            
                            <div className="space-y-4">
                                <input type="text" placeholder="Name der Sequenz" value={newSequenceData.name} onChange={e => setNewSequenceData(p => ({...p, name: e.target.value}))} className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none text-sm"/>
                                
                                <textarea placeholder="Was ist das Ziel dieser Sequenz? (z.B. Neukunden begrüßen und zum Erstkauf bewegen)" value={newSequenceData.goal} onChange={e => setNewSequenceData(p => ({...p, goal: e.target.value}))} rows={4} className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none text-sm"/>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 block mb-2">Anzahl E-Mails</label>
                                        <input type="number" min="1" max="10" value={newSequenceData.numEmails} onChange={e => setNewSequenceData(p => ({...p, numEmails: e.target.value}))} className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none text-sm"/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <BrainIcon /> Psychologischer Hebel
                                        </label>
                                        <select 
                                            value={psychTrigger} 
                                            onChange={e => setPsychTrigger(e.target.value)} 
                                            className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none text-sm"
                                        >
                                            <option value="None">Keiner / Standard</option>
                                            <option value="Scarcity">Scarcity (Verknappung)</option>
                                            <option value="Social Proof">Social Proof (Beweis)</option>
                                            <option value="Authority">Authority (Autorität)</option>
                                            <option value="Reciprocity">Reciprocity (Geben & Nehmen)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button onClick={handleGenerateSequence} disabled={isLoading} className="w-full bg-white text-black py-3 rounded-full font-medium disabled:opacity-50 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                                    {isLoading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Generiere...</> : <><SequenzerIcon /> Mit KI generieren</>}
                                </button>
                                <p className="text-[10px] text-gray-500 text-center mt-2">Powered by Gemini 3.0 Pro Thinking Engine</p>
                            </div>
                        </div>
                    ) : selectedSequence ? (
                        <>
                            <div className="w-1/2 border-r border-white/10 flex flex-col bg-[#161616]">
                                <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white text-sm">{selectedSequence.name}</h3></div>
                                <div className="overflow-y-auto p-4 space-y-3">
                                    {selectedSequence.steps.map(step => (
                                        <button key={step.id} onClick={() => setSelectedStep(step)} className={`w-full flex items-center gap-3 text-left p-3 rounded-md border transition-all ${selectedStep?.id === step.id ? 'bg-purple-900/20 border-purple-500/50' : 'bg-[#0A0A0A] border-[#333] hover:border-gray-500'}`}>
                                            <div className="text-gray-400">{step.type === 'email' ? <MailIcon /> : <ClockIcon />}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white text-sm truncate">{step.type === 'email' ? step.subject : `Warte ${step.delayDays} Tag(e)`}</p>
                                                {step.type === 'email' && <p className="text-xs text-gray-500 truncate mt-1">{step.body?.replace(/<[^>]*>?/gm, '').substring(0, 40)}...</p>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div className="w-1/2 flex flex-col bg-[#1C1C1C]">
                                {selectedStep?.type === 'email' ? (
                                    <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Betreff</label>
                                            <input type="text" value={selectedStep.subject} onChange={e => handleUpdateStep({subject: e.target.value})} className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] font-medium focus:border-purple-500 outline-none text-sm"/>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Inhalt</label>
                                            <textarea value={selectedStep.body?.replace(/<[^>]*>?/gm, '')} onChange={e => handleUpdateStep({body: e.target.value})} className="w-full bg-[#0A0A0A] text-gray-300 px-4 py-4 rounded-md border border-[#333333] flex-1 resize-none focus:border-purple-500 outline-none leading-relaxed text-sm"/>
                                        </div>
                                    </div>
                                ) : selectedStep?.type === 'delay' ? (
                                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-gray-500">
                                        <ClockIcon />
                                        <p className="mt-4 mb-2">Verzögerung</p>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={selectedStep.delayDays} onChange={e => handleUpdateStep({delayDays: parseInt(e.target.value)})} className="w-16 bg-[#0A0A0A] text-white text-center px-2 py-1 rounded border border-[#333]"/>
                                            <span>Tage</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        Wählen Sie einen Schritt aus.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center text-gray-500">
                            <SequenzerIcon className="w-12 h-12 mb-4 opacity-20"/>
                            <p>Wählen Sie eine Sequenz aus oder erstellen Sie eine neue.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};
