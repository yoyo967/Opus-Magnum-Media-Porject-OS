
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, Task, Experiment } from '../contexts/AppContext';
import { Toast } from './Toast';

const AbTestIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>);
const TrophyIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 00-9 9h27a9 9 0 00-9-9zM16.5 3.75L12 7.5l-4.5-3.75m9 0V21" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8 mx-auto text-gray-500"}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>);

const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(blob); });

interface ExperimentatorToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const ExperimentatorTool: React.FC<ExperimentatorToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, addTask, updateTask, toolInput, setToolInput, experiments, addExperiment, updateExperiment } = useTasks();

    const [variantA, setVariantA] = useState<Task | null>(null);
    const [variantB, setVariantB] = useState<{ title: string; description: string; imageUrl: string | null; }>({ title: '', description: '', imageUrl: null });
    const [goalMetric, setGoalMetric] = useState<'clicks' | 'conversions' | 'engagementRate'>('clicks');
    
    const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (toolInput && toolInput.tool === 'experimentator' && toolInput.sourceTaskId) {
            const sourceTask = tasks.find(t => t.id === toolInput.sourceTaskId);
            if (sourceTask) {
                if (sourceTask.experimentId) {
                    const existingExp = experiments.find(e => e.id === sourceTask.experimentId);
                    if(existingExp) setActiveExperiment(existingExp);
                } else {
                    setVariantA(sourceTask);
                    setVariantB({ title: `${sourceTask.title} (Variante B)`, description: sourceTask.description, imageUrl: null });
                }
            }
            setToolInput(null);
        }
    }, [toolInput, setToolInput, tasks, experiments]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const base64 = await blobToBase64(file);
            setVariantB(prev => ({ ...prev, imageUrl: base64 as string }));
        }
    };

    const handleStartExperiment = () => {
        if (!variantA || !variantB.imageUrl) { setError("Variante B benötigt ein Bild, um das Experiment zu starten."); return; }
        setIsLoading(true);
        const variantBTaskId = addTask(variantB.title, variantB.description, variantB.imageUrl, true);
        const newExperiment = addExperiment({ name: `Test: ${variantA.title}`, variantA_taskId: variantA.id, variantB_taskId: variantBTaskId, goalMetric, status: 'running' });
        setActiveExperiment(newExperiment);
        setIsLoading(false);
        setToastMessage("Experiment gestartet!");
    };

    const handleConcludeExperiment = async () => {
        if (!activeExperiment) return;
        setIsLoading(true);
        setError(null);
        
        const taskA = tasks.find(t => t.id === activeExperiment.variantA_taskId);
        const taskB = tasks.find(t => t.id === activeExperiment.variantB_taskId);
        if (!taskA || !taskB) { setError("Aufgaben nicht gefunden."); setIsLoading(false); return; }

        const resultsSchema = { type: Type.OBJECT, properties: { winner: { type: Type.STRING, enum: ['A', 'B', 'Inconclusive'] }, summary: { type: Type.STRING }, variantA_metric: { type: Type.NUMBER }, variantB_metric: { type: Type.NUMBER }, confidence: { type: Type.INTEGER, minimum: 0, maximum: 100 }}};
        const prompt = `Simulate A/B test results based on visual and textual analysis. Goal: Maximize ${goalMetric}. Variant A: Title "${taskA.title}". Variant B: Title "${taskB.title}". Analyze performance drivers. Respond in JSON.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-pro',
                contents: prompt, 
                config: { responseMimeType: 'application/json', responseSchema: resultsSchema, thinkingConfig: { thinkingBudget: 1024 } } 
            });
            const results = JSON.parse(response.text);
            updateExperiment(activeExperiment.id, { status: 'completed', results });
            setActiveExperiment(prev => prev ? { ...prev, status: 'completed', results } : null);
        } catch (e) { console.error(e); setError("Ergebnisanalyse fehlgeschlagen."); }
        finally { setIsLoading(false); }
    };
    
    const handlePromoteWinner = () => {
        if (!activeExperiment?.results?.winner || activeExperiment.results.winner === 'Inconclusive') return;
        const winnerTask = activeExperiment.results.winner === 'A' ? tasks.find(t => t.id === activeExperiment.variantA_taskId) : tasks.find(t => t.id === activeExperiment.variantB_taskId);
        if (winnerTask) {
            updateTask(activeExperiment.variantA_taskId, { title: winnerTask.title.replace(' (Variante B)', ''), description: winnerTask.description, imageUrl: winnerTask.imageUrl });
            setToastMessage(`Gewinner "${winnerTask.title}" wurde übernommen!`);
            navigateTo('meisterwerk');
        }
    };
    
    if (activeExperiment) {
        const taskA = tasks.find(t => t.id === activeExperiment.variantA_taskId);
        const taskB = tasks.find(t => t.id === activeExperiment.variantB_taskId);

        return (
            <div className={`${isEmbedded ? 'h-full overflow-y-auto' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-5xl mx-auto'}`}>
                <h2 className="text-xl font-bold text-white mb-4">{activeExperiment.name}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {taskA && <VariantCard task={taskA} label="Variante A" isWinner={activeExperiment.results?.winner === 'A'} metric={activeExperiment.results?.variantA_metric} goalMetric={activeExperiment.goalMetric} />}
                    {taskB && <VariantCard task={taskB} label="Variante B" isWinner={activeExperiment.results?.winner === 'B'} metric={activeExperiment.results?.variantB_metric} goalMetric={activeExperiment.goalMetric} />}
                </div>
                {activeExperiment.status === 'running' && (
                    <div className="text-center mt-6">
                        <p className="text-yellow-400">Experiment läuft... (Ziel: {activeExperiment.goalMetric})</p>
                        <button onClick={handleConcludeExperiment} disabled={isLoading} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-medium text-sm">{isLoading ? "Analysiere mit Gemini 3.0..." : "Experiment abschließen"}</button>
                    </div>
                )}
                {activeExperiment.status === 'completed' && activeExperiment.results && (
                     <div className="mt-6 bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                        <h3 className="text-lg font-semibold text-white mb-2">Ergebnisse</h3>
                        <p className="text-sm text-gray-300">{activeExperiment.results.summary}</p>
                        <p className="text-sm mt-2">Konfidenz: <span className="font-bold text-white">{activeExperiment.results.confidence}%</span></p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handlePromoteWinner} disabled={activeExperiment.results.winner === 'Inconclusive'} className="bg-green-600 text-white px-5 py-2 rounded-full font-medium text-sm disabled:opacity-50">Gewinner übernehmen</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full overflow-y-auto' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-5xl mx-auto'}`}>
                {!variantA ? <p className="text-center text-gray-400 py-10">Starten Sie einen A/B-Test aus dem Meisterwerk.</p> : (
                    <>
                        <h2 className="text-xl font-bold text-white mb-4">Neues Experiment</h2>
                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            {variantA && <VariantCard task={variantA} label="Variante A" />}
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Variante B</h3>
                                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] space-y-3">
                                    <input type="text" value={variantB.title} onChange={e => setVariantB(prev => ({...prev, title: e.target.value}))} className="w-full bg-[#1C1C1C] text-white px-3 py-2 rounded-md border border-[#333333]" />
                                    <div className="w-full aspect-video bg-[#111] rounded-md border-2 border-dashed border-[#333333] flex items-center justify-center relative overflow-hidden">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {variantB.imageUrl ? <img src={variantB.imageUrl} alt="Variante B" className="w-full h-full object-cover" /> : <div className="text-center"><UploadIcon /><p className="text-xs text-gray-500 mt-1">Bild hochladen</p></div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-white/10 pt-6">
                            <h3 className="text-lg font-medium text-white mb-2">Einstellungen</h3>
                            <div>
                                <label className="text-sm text-gray-400">Zielmetrik</label>
                                <select value={goalMetric} onChange={e => setGoalMetric(e.target.value as any)} className="w-full mt-1 bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]">
                                    <option value="clicks">Klicks</option>
                                    <option value="conversions">Conversions</option>
                                    <option value="engagementRate">Engagement-Rate</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleStartExperiment} disabled={isLoading || !variantB.imageUrl} className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm disabled:opacity-50">{isLoading ? "Starte..." : "Experiment starten"}</button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-4 text-right">{error}</p>}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const VariantCard: React.FC<{task: Task, label: string, isWinner?: boolean, metric?: number, goalMetric?: string}> = ({task, label, isWinner, metric, goalMetric}) => (
    <div>
        <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">{label} {isWinner && <span className="text-xs bg-green-500 text-black font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><TrophyIcon className="w-3 h-3"/> GEWINNER</span>}</h3>
        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] space-y-3">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
                {task.imageUrl && <img src={task.imageUrl} alt={task.title} className="w-full h-full object-cover" />}
            </div>
            <h4 className="font-semibold text-white">{task.title}</h4>
            {metric !== undefined && goalMetric && (
                <p className="text-lg font-bold text-blue-400">{metric.toLocaleString()} <span className="text-sm font-normal text-gray-400 capitalize">{goalMetric}</span></p>
            )}
        </div>
    </div>
);
