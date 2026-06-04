import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, StrategyBrief } from '../contexts/AppContext';

// --- ICONS ---
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456L21.75 18l-1.035-.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456L21.75 18l-1.035-.259a3.375 3.375 0 00-2.456-2.456z" /></svg>);
const PlusIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const OptimizeIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h4.992m-4.993 0l3.181-3.183a8.25 8.25 0 00-11.667 0l3.181 3.183" /></svg>);


// --- TYPES ---
interface Suggestion {
  type: 'NEW_TASK' | 'PERFORMANCE_ADAPTATION' | 'BOTTLENECK_WARNING';
  title: string;
  description: string;
  details: {
    taskTitle?: string;
    taskDescription?: string;
    relatedTaskId?: number;
  };
}
interface AnalysisResult {
  summary: string;
  progress: number;
  suggestions: Suggestion[];
}

interface DirigentToolProps {
  navigateTo: (page: string) => void;
  onAnalysisComplete?: () => void;
  isEmbedded?: boolean;
}

const SkeletonLoader: React.FC = () => ( <div className="space-y-4 animate-pulse pt-2"><div className="h-4 bg-gray-700/50 rounded w-3/4"></div><div className="h-4 bg-gray-700/50 rounded w-full"></div><div className="h-4 bg-gray-700/50 rounded w-5/6"></div><div className="h-10 bg-gray-700/50 rounded-md mt-4"></div></div> );
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-300">Projektfortschritt</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    </div>
);


export const DirigentTool: React.FC<DirigentToolProps> = ({ navigateTo, onAnalysisComplete, isEmbedded }) => {
    const { tasks, campaignBrief, addTask, setStrategyBrief, setOptimizationContext, addSystemLog } = useTasks();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const initialProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const handleAnalyzeProject = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setError(null);
        
        const analysisSchema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "Eine prägnante, professionelle Zusammenfassung des Projektstatus (ca. 2-3 Sätze)." },
                progress: { type: Type.INTEGER, description: "Der geschätzte prozentuale Projektfortschritt als ganze Zahl (0-100)." },
                suggestions: {
                    type: Type.ARRAY,
                    description: "Eine Liste von 2-4 konkreten, strategischen und umsetzbaren Vorschlägen.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['NEW_TASK', 'PERFORMANCE_ADAPTATION', 'BOTTLENECK_WARNING'] },
                            title: { type: Type.STRING, description: "Ein kurzer, aussagekräftiger Titel für den Vorschlag." },
                            description: { type: Type.STRING, description: "Eine klare Begründung für den Vorschlag (1-2 Sätze)." },
                            details: {
                                type: Type.OBJECT,
                                properties: {
                                    taskTitle: { type: Type.STRING, description: "Der Titel für eine neu zu erstellende Aufgabe (nur bei NEW_TASK)." },
                                    taskDescription: { type: Type.STRING, description: "Die Beschreibung für eine neu zu erstellende Aufgabe (nur bei NEW_TASK)." },
                                    relatedTaskId: { type: Type.INTEGER, description: "Die ID einer Aufgabe, auf die sich der Vorschlag bezieht (optional)." }
                                }
                            }
                        }
                    }
                }
            }
        };

        const prompt = `Als KI-Projektleiter "Dirigent", analysiere den folgenden Projektstatus ganzheitlich. Berücksichtige die übergeordnete Kampagnenstrategie, alle Aufgaben (To-Do, In Arbeit, In Prüfung, Fertig) und die Performance der bereits veröffentlichten Assets.
        
        Projekt-Daten:
        - Kampagnenstrategie: ${JSON.stringify(campaignBrief, null, 2)}
        - Aufgabenliste mit Status & Performance: ${JSON.stringify(tasks, null, 2)}
        
        Deine Aufgabe:
        1. Gib eine prägnante Zusammenfassung der aktuellen Situation. Achte besonders auf Aufgaben, die im Status "In Prüfung" blockiert sind.
        2. Schätze den Gesamtfortschritt des Projekts in Prozent.
        3. Erstelle 2-4 strategisch sinnvolle, konkrete nächste Schritte. Formuliere diese als klare Vorschläge.
        
        Antworte exakt im JSON-Format gemäß dem vorgegebenen Schema.`;

        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 2.5 Pro for superior reasoning capabilities
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt, config: { responseMimeType: "application/json", responseSchema: analysisSchema } });
            const result = JSON.parse(response.text);
            setAnalysisResult(result);
            if(result.summary) {
                setOptimizationContext(result.summary);
            }
            addSystemLog('Project Analysis completed successfully (Gemini 2.5 Pro).', 'Dirigent', 'success');
            onAnalysisComplete?.();
        } catch (e) { 
            console.error("Fehler bei der Dirigent-Analyse:", e); 
            setError("Analyse fehlgeschlagen. Bitte versuchen Sie es erneut."); 
            addSystemLog('Analysis failed.', 'Dirigent', 'error');
        } 
        finally { setIsAnalyzing(false); }
    };

    const handleExecuteSuggestion = (suggestion: Suggestion) => {
        if (suggestion.type === 'NEW_TASK' && suggestion.details.taskTitle) {
            addTask(suggestion.details.taskTitle, suggestion.details.taskDescription || 'Generiert durch Dirigent-Analyse');
            // Remove suggestion from list after execution
            setAnalysisResult(prev => prev ? { ...prev, suggestions: prev.suggestions.filter(s => s !== suggestion) } : null);
            addSystemLog(`Recommendation executed: Created task "${suggestion.details.taskTitle}"`, 'Dirigent');
        }
    };

    const handleOptimizeStrategy = () => {
        if (!campaignBrief || !analysisResult) return;
        const briefForStratege: StrategyBrief = {
            product: campaignBrief.campaignTitle,
            audience: 'Implicit from brief', // This info isn't in CampaignBrief, Stratege will need to adapt
            goal: 'Implicit from brief',
            usp: campaignBrief.slogan,
        };
        setStrategyBrief(briefForStratege);
        setOptimizationContext(analysisResult.summary);
        addSystemLog('Initiating Strategy Optimization sequence...', 'Dirigent', 'info');
        navigateTo('stratege');
    };
    
    return (
        <div className={`${isEmbedded ? 'bg-transparent' : 'bg-[#1C1C1C] rounded-lg p-6 border border-[#333333] max-w-4xl mx-auto'}`}>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-[#F5F5F5]">Projekt-Cockpit</h2>
                    {campaignBrief ? (
                         <p className="text-[#888888] mt-1 text-sm max-w-xl">Strategie für: <strong className="text-gray-300">{campaignBrief.campaignTitle}</strong></p>
                    ) : (
                         <p className="text-[#888888] mt-1 text-sm max-w-xl">Keine aktive Kampagne. Analysiert allgemeine Aufgaben.</p>
                    )}
                    <span className="text-[10px] text-purple-500/70 mt-2 block font-mono">Powered by Gemini 2.5 Pro</span>
                </div>
                <button onClick={handleAnalyzeProject} disabled={isAnalyzing} className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#0A0A0A] px-5 py-2.5 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                    {isAnalyzing ? 'Wird analysiert...' : "Projekt analysieren"}
                </button>
            </div>
            
            <div className="mt-6 border-t border-[#333333] pt-6">
                <ProgressBar progress={analysisResult?.progress ?? initialProgress} />
            </div>

            {(isAnalyzing || analysisResult || error) && (
                <div className="mt-6">
                   <h3 className="text-lg font-semibold text-white mb-4">Analyse & Empfehlungen</h3>
                    {isAnalyzing && <SkeletonLoader />}
                    {error && <div className="text-center text-red-400 text-sm p-4 bg-red-500/10 rounded-md"><p>{error}</p></div>}
                    {analysisResult && (
                        <div className="space-y-6 page-fade-in">
                            <div className="prose prose-sm prose-invert text-gray-300 bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                                <p>{analysisResult.summary}</p>
                            </div>
                            <div className="space-y-3">
                                {(analysisResult.suggestions || []).map((rec, index) => (
                                    <div key={index} className="flex items-start justify-between gap-4 p-3 bg-[#0A0A0A] border border-[#333333] rounded-md">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-white">{rec.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">{rec.description}</p>
                                        </div>
                                        {rec.type === 'NEW_TASK' && (
                                            <button onClick={() => handleExecuteSuggestion(rec)} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors flex-shrink-0 flex items-center gap-1.5">
                                                <PlusIcon />
                                                Aufgabe erstellen
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                             {campaignBrief && (
                                <div className="border-t border-[#333333] mt-6 pt-6">
                                    <button
                                        onClick={handleOptimizeStrategy}
                                        className="w-full flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/20 transition-all duration-300"
                                    >
                                        <OptimizeIcon />
                                        Strategie-Entwurf optimieren
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
             {!isAnalyzing && !analysisResult && !error && (
                <div className="mt-12 text-center text-gray-500">
                    <SparklesIcon className="w-10 h-10 mx-auto mb-2 text-gray-600" />
                    <p>Klicken Sie auf "Projekt analysieren", um eine KI-gestützte Auswertung zu erhalten.</p>
                </div>
             )}
        </div>
    );
};
