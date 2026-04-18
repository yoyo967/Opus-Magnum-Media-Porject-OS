
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { DirigentTool } from './DirigentTool';
import { StrategeTool } from './StrategeTool';
import { useTasks } from '../contexts/AppContext';

// --- ICONS ---
const ConductorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.004 1.11-1.226a2.25 2.25 0 012.593 1.226c.09.542.56 1.004 1.11 1.226a2.25 2.25 0 011.226 2.593c-.222.55-.684 1.02-1.226 1.11a2.25 2.25 0 01-2.593-1.226c-.09-.542-.56-1.004-1.11-1.226a2.25 2.25 0 01-1.226-2.593c.222-.55.684-1.02 1.226-1.11zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SparklesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>);

// --- TYPES ---
type ConductorState = 'input' | 'routing' | 'recommendation' | 'executing';
type RecommendedAgent = 'Dirigent' | 'Stratege' | 'AURORA' | 'Spaeher' | 'Visionar';

interface Recommendation {
    agent: RecommendedAgent;
    reasoning: string;
    next_step_question: string;
    extracted_parameter?: string;
    isComplexCampaign?: boolean; // New flag for workflow trigger
}

interface ConductorToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const ConductorTool: React.FC<ConductorToolProps> = ({ navigateTo, isEmbedded }) => {
    const { setStrategyBrief, setOptimizationContext, addSystemLog, setToolInput, setWorkflowStep } = useTasks();
    const [state, setState] = useState<ConductorState>('input');
    const [objective, setObjective] = useState('Ich bin Yahya Yildirim, Interim Manager und Student am DCI. Erstelle eine Kampagne, um mich als hybriden Experten (Strategie + Digital) auf LinkedIn zu positionieren.');
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setState('input');
        setRecommendation(null);
        setError(null);
    };

    const handleDelegate = async () => {
        if (!objective.trim()) return;
        setState('routing');
        setError(null);
        
        const agentRouterSchema = {
            type: Type.OBJECT,
            properties: {
                agent: { type: Type.STRING, enum: ['Dirigent', 'Stratege', 'AURORA', 'Spaeher', 'Visionar'] },
                reasoning: { type: Type.STRING, description: "A brief, one-sentence explanation for the user on why you chose this agent." },
                next_step_question: { type: Type.STRING, description: "A question to the user confirming the action." },
                extracted_parameter: { type: Type.STRING, description: "Extract the core topic, query, or goal." },
                isComplexCampaign: { type: Type.BOOLEAN, description: "True if the request is for a full multi-phase campaign (like personal branding, product launch)."}
            }
        };

        const prompt = `You are the "Conductor," a meta-agent responsible for orchestrating a suite of specialized AI marketing agents. Your job is to analyze a user's high-level objective and determine the best agent to accomplish it.

        Available Agents:
        - Stratege: Develops comprehensive marketing strategies. Use for "create strategy," "plan campaign," "personal branding", "positioning".
        - Dirigent: Analyzes current project status.
        - AURORA: Autonomous execution.
        - Spaeher: Market research.
        - Visionar: Image generation.

        User's Objective: "${objective}"

        Your task:
        1. Analyze the user's intent.
        2. Choose the single most appropriate agent.
        3. Extract the key parameter (topic/prompt).
        4. If the user wants to create a campaign for themselves or a product, flag 'isComplexCampaign' as true.
        5. Respond ONLY in a JSON object adhering to the schema.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for better intent routing
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: agentRouterSchema }
            });
            const rec = JSON.parse(response.text);
            setRecommendation(rec);
            setState('recommendation');
            addSystemLog(`Routing Request: Identified agent '${rec.agent}' for objective via Gemini 3.0.`, 'Conductor');
        } catch (e) {
            console.error("Conductor AI Error:", e);
            setError("Konnte die Anfrage nicht verarbeiten. Bitte versuchen Sie es erneut.");
            setState('input');
        }
    };

    const handleProceed = () => {
        if (!recommendation) return;
        
        addSystemLog(`Delegating task to ${recommendation.agent}...`, 'Conductor', 'info');

        // Trigger Workflow if complex
        if (recommendation.isComplexCampaign) {
            setWorkflowStep('strategy');
            addSystemLog("Initializing Guided Workflow: Strategy -> Planning -> Production -> Publishing", "System", "success");
        }

        switch (recommendation.agent) {
            case 'Dirigent':
                setOptimizationContext(objective);
                setState('executing');
                break;
            case 'Stratege':
                // Pass the full objective as context to the strategist
                setStrategyBrief({ product: `Campaign Goal: ${recommendation.extracted_parameter || objective}`, audience: 'Defined by Strategy', goal: 'Growth', usp: 'Hybrid Expertise' });
                setState('executing');
                break;
            case 'AURORA':
                navigateTo('secret');
                break;
            case 'Spaeher':
                setToolInput({ tool: 'spaeher', prompt: recommendation.extracted_parameter || objective, sourceTaskId: -1 });
                navigateTo('spaeher');
                break;
            case 'Visionar':
                setToolInput({ tool: 'visionar', prompt: recommendation.extracted_parameter || objective, sourceTaskId: -1 });
                navigateTo('visionar');
                break;
        }
    };

    if (state === 'executing' && recommendation) {
        return (
            <div className={`${isEmbedded ? 'h-full flex flex-col' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 mt-6'} page-fade-in`}>
                <h3 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Führe aus: {recommendation.agent}</h3>
                <div className="flex-1 overflow-y-auto">
                    {recommendation.agent === 'Dirigent' && <DirigentTool navigateTo={navigateTo} isEmbedded={isEmbedded} onAnalysisComplete={resetState} />}
                    {recommendation.agent === 'Stratege' && <StrategeTool navigateTo={navigateTo} isEmbedded={true} onStrategyFinalized={resetState} />}
                </div>
            </div>
        );
    }

    return (
        <div className={`${isEmbedded ? 'h-full flex flex-col p-2' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto'}`}>
            <div className="space-y-4 flex-1">
                <label htmlFor="objective-input" className="text-lg font-medium text-white block">Ihr strategisches Ziel</label>
                <textarea
                    id="objective-input"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    rows={isEmbedded ? 6 : 3}
                    className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm resize-none"
                    placeholder="z.B. 'Entwickle eine Launch-Kampagne' oder 'Recherchiere KI-Trends für 2026'..."
                    disabled={state !== 'input'}
                />
                <button
                    onClick={handleDelegate}
                    disabled={state !== 'input' || !objective.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-white/5"
                >
                    <ConductorIcon />
                    {state === 'routing' ? 'Analysiere Ziel (Gemini 3.0)...' : 'An Conductor delegieren'}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>

            {state === 'recommendation' && recommendation && (
                <div className="mt-6 pt-6 border-t border-white/10 page-fade-in">
                    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                        <div className="flex items-start gap-3">
                            <div className="text-purple-400 pt-1"><SparklesIcon /></div>
                            <div>
                                <h4 className="font-semibold text-white">Empfehlung des Conductors</h4>
                                <p className="text-sm text-gray-300 mt-1">{recommendation.reasoning}</p>
                                <p className="text-sm italic text-purple-300 mt-3">"{recommendation.next_step_question}"</p>
                                {recommendation.isComplexCampaign && (
                                    <div className="mt-2 text-xs bg-purple-900/20 border border-purple-500/30 p-2 rounded text-purple-200">
                                        🚀 Multi-Stage Workflow Detected. I will guide you through Strategy, Planning, and Execution.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={resetState} className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-full">Abbrechen</button>
                            <button onClick={handleProceed} className="text-sm bg-white text-black font-medium px-6 py-2 rounded-full hover:bg-opacity-90">Fortfahren</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
