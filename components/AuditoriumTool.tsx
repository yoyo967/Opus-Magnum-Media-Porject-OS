
import React, { useState, useMemo, useEffect } from 'react';
import { useTasks, Task, Feedback } from '../contexts/AppContext';
import { GoogleGenAI } from "@google/genai";
import { Toast } from './Toast';
import { AuroraIcon, SparkleIcon } from '../constants';

const AssetViewer: React.FC<{ asset: { type: string, url: string } }> = ({ asset }) => {
    if (!asset.url) return <div className="w-full h-full bg-black flex items-center justify-center text-gray-500">Kein Asset</div>;
    switch (asset.type) {
        case 'image': return <img src={asset.url} alt="Asset version" className="w-full h-full object-contain" />;
        case 'video': return <video src={asset.url} controls autoPlay loop muted className="w-full h-full object-contain" />;
        case 'audio': return <div className="p-4"><audio src={asset.url} controls className="w-full" /></div>;
        default: return <div className="p-4 text-gray-400">Unbekannter Asset-Typ</div>;
    }
};

const ReviewModal: React.FC<{ task: Task, onClose: () => void, onUpdateTask: (id: number, updates: Partial<Task>) => void, showToast: (msg: string) => void, isEmbedded?: boolean }> = ({ task, onClose, onUpdateTask, showToast, isEmbedded }) => {
    const { campaignBrief } = useTasks();
    const [feedbackInput, setFeedbackInput] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    
    const allVersions = useMemo(() => {
        const currentAsset = task.imageUrl ? { type: 'image', url: task.imageUrl, timestamp: new Date().toISOString() }
            : task.videoUrl ? { type: 'video', url: task.videoUrl, timestamp: new Date().toISOString() }
            : task.audioUrl ? { type: 'audio', url: task.audioUrl, timestamp: new Date().toISOString() }
            : null;
        
        return [...(task.versionHistory || []), ...(currentAsset ? [currentAsset] : [])].reverse();
    }, [task]);
    
    const [selectedVersion, setSelectedVersion] = useState(allVersions[0]);

    const handleAuroraCheck = async () => {
        setIsSubmittingFeedback(true);
        const prompt = `Act as AURORA, an AI Quality Assurance agent. Review the following creative asset based on the campaign brief. Provide concise, constructive feedback on its alignment with the brand, tone, and visual strategy.
        Campaign Brief: ${JSON.stringify(campaignBrief)}
        Task Title: "${task.title}"
        Task Description: "${task.description}"
        Provide your feedback in 1-3 bullet points.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = selectedVersion.type === 'image' ? { inlineData: { mimeType: 'image/jpeg', data: selectedVersion.url.split(',')[1] } } : null;
            // Updated to Gemini 3.0 for better review
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: imagePart ? { parts: [imagePart, { text: prompt }] } : prompt });
            
            const newFeedback: Feedback = { user: 'AURORA', comment: response.text, timestamp: new Date().toISOString() };
            onUpdateTask(task.id, { feedback: [...(task.feedback || []), newFeedback] });
        } catch (error) { console.error("AURORA Check failed", error); } finally { setIsSubmittingFeedback(false); }
    };
    
    const handleAddFeedback = () => {
        if (!feedbackInput.trim()) return;
        const newFeedback: Feedback = { user: 'Reviewer', comment: feedbackInput, timestamp: new Date().toISOString() };
        onUpdateTask(task.id, { feedback: [...(task.feedback || []), newFeedback] });
        setFeedbackInput('');
    };

    const handleRequestChanges = () => {
        if (!feedbackInput.trim()) {
            alert("Bitte geben Sie ein Feedback an, warum Änderungen erforderlich sind.");
            return;
        }
        handleAddFeedback();
        onUpdateTask(task.id, { status: 'inprogress' });
        showToast("Änderungen angefordert.");
        onClose();
    };

    const handleApprove = () => {
        onUpdateTask(task.id, { status: 'done', isApproved: true });
        showToast("Asset wurde freigegeben!");
        onClose();
    };

    return (
        <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm`} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} className="bg-[#1C1C1C]/80 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] m-4 flex flex-col page-fade-in">
                <header className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-medium text-white">Asset-Überprüfung</h3>
                        <p className="text-sm text-gray-400">{task.title}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </header>
                <div className="flex-1 p-4 grid md:grid-cols-3 gap-4 overflow-hidden">
                    {/* Viewer & Versions */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex-1 bg-black/50 rounded-md border border-white/10 flex items-center justify-center overflow-hidden">
                           <AssetViewer asset={selectedVersion} />
                        </div>
                        <div className="flex-shrink-0">
                            <h4 className="text-sm font-semibold text-white mb-2">Versionen</h4>
                            <div className="flex gap-2 p-2 bg-black/30 rounded-md overflow-x-auto">
                                {allVersions.map((v, i) => (
                                    <button key={i} onClick={() => setSelectedVersion(v)} className={`w-24 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedVersion.timestamp === v.timestamp ? 'border-blue-500' : 'border-transparent hover:border-gray-500'}`}>
                                        <AssetViewer asset={v} />
                                        <div className="absolute inset-0 bg-black/30 text-white text-[10px] p-1 flex items-end">Version {allVersions.length - i}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Info & Feedback */}
                    <div className="md:col-span-1 flex flex-col bg-[#0A0A0A] border border-white/10 rounded-md overflow-hidden">
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                            {(task.feedback || []).map((f, i) => (
                                <div key={i} className={`p-2 rounded-md ${f.user === 'AURORA' ? 'bg-purple-900/50' : 'bg-[#1C1C1C]'}`}>
                                    <p className="text-xs font-bold text-white flex items-center gap-1.5">{f.user === 'AURORA' && <AuroraIcon />} {f.user}</p>
                                    <p className="text-xs text-gray-300 mt-1 whitespace-pre-wrap">{f.comment}</p>
                                    <p className="text-[10px] text-gray-500 text-right mt-1">{new Date(f.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-[#333333] space-y-2 flex-shrink-0">
                            <textarea value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Feedback geben..." rows={3} className="w-full bg-[#1C1C1C] text-white px-3 py-1.5 rounded-md border border-[#333333] text-sm"/>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleAddFeedback} className="bg-white/10 text-white text-xs py-1.5 rounded-md hover:bg-white/20">Kommentar senden</button>
                                <button onClick={handleAuroraCheck} disabled={isSubmittingFeedback} className="bg-purple-600/50 text-white text-xs py-1.5 rounded-md hover:bg-purple-600/70 flex items-center justify-center gap-1"><SparkleIcon /> AURORA-Check</button>
                            </div>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-3 bg-black/20">
                            <button onClick={handleRequestChanges} className="bg-yellow-500/80 text-black font-bold py-2 rounded-md hover:bg-yellow-500 text-sm">Änderungen anfordern</button>
                            <button onClick={handleApprove} className="bg-green-500/80 text-black font-bold py-2 rounded-md hover:bg-green-500 text-sm">Freigeben</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AuditoriumToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const AuditoriumTool: React.FC<AuditoriumToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, updateTask } = useTasks();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const reviewTasks = useMemo(() => tasks.filter(t => t.status === 'review'), [tasks]);
    
    const showToast = (message: string) => {
        setToastMessage(message);
    };

    return (
        <div className={`relative ${isEmbedded ? 'h-full overflow-y-auto' : ''}`}>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            {selectedTask && <ReviewModal task={selectedTask} onClose={() => setSelectedTask(null)} onUpdateTask={updateTask} showToast={showToast} isEmbedded={isEmbedded} />}
            <div className={`${isEmbedded ? 'bg-transparent' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6'}`}>
                {reviewTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reviewTasks.map(task => (
                            <div key={task.id} className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333] space-y-3">
                                <div className="aspect-video bg-black rounded-sm overflow-hidden">
                                   <AssetViewer asset={{ type: task.imageUrl ? 'image' : task.videoUrl ? 'video' : 'audio', url: task.imageUrl || task.videoUrl || task.audioUrl || ''}} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white truncate">{task.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                                </div>
                                <button onClick={() => setSelectedTask(task)} className="w-full bg-white/10 text-white font-medium py-2 rounded-full text-sm hover:bg-white/20">Überprüfen</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">Keine Aufgaben zur Überprüfung.</p>
                        <p className="mt-2">Alle kreativen Assets wurden freigegeben oder sind noch in Arbeit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
