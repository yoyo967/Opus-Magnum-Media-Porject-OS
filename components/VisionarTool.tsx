
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useTasks, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

interface VisionarToolProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ImageIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
    </svg>
);
const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const AddToBoardIcon: React.FC<{isAttachMode?: boolean}> = ({ isAttachMode }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        {isAttachMode 
         ? <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1118.375 7.21l-4.242 4.243a1.125 1.125 0 01-1.59 0l-1.59-1.59a1.125 1.125 0 010-1.59l4.242-4.243" />
         : <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M15 3h4.5a2.25 2.25 0 012.25 2.25v4.5" />
        }
    </svg>
);
const MovieIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75h15a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5zm1.5-6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zM12 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75zM15 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75zM9 13.5h.75v.75h-.75v-.75zm.75-2.25h.75v.75h-.75v-.75z" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


export const VisionarTool: React.FC<VisionarToolProps> = ({ navigateTo, isEmbedded }) => {
    const { addTask, toolInput, setToolInput, tasks, updateTask, checkCredits, deductCredits, setHighlightedTaskIds } = useTasks();
    const [prompt, setPrompt] = useState('Ein futuristisches Dashboard, Neon-Farben, Cyberpunk-Stil, hochauflösend.');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'generate' | 'edit' | 'analyze'>('generate');
    const [editImage, setEditImage] = useState<{ file: File, preview: string } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [sourceTaskId, setSourceTaskId] = useState<number | null>(null);
    const [sourceTaskTitle, setSourceTaskTitle] = useState<string | null>(null);

    useEffect(() => {
        if (toolInput && toolInput.tool === 'visionar') {
            if (toolInput.prompt) setPrompt(toolInput.prompt);
            if (toolInput.imageUrl) {
                // If image provided, switch to analyze or edit mode
                setMode('analyze'); // Default to analyze for now, user can switch
                setEditImage({ file: new File([], 'task-image'), preview: toolInput.imageUrl }); // Mock file object
            }
            if (toolInput.sourceTaskId) {
                setSourceTaskId(toolInput.sourceTaskId);
                const task = tasks.find(t => t.id === toolInput.sourceTaskId);
                if (task) setSourceTaskTitle(task.title);
            }
            setToolInput(null); // Clear input
        }
    }, [toolInput, setToolInput, tasks]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        const cost = COST_TABLE.IMAGE_GEN;
        if (!checkCredits(cost)) {
            setError(`Nicht genügend Credits. Bildgenerierung kostet ${cost} Credits.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setImage(null);
        
        deductCredits(cost, 'Visionär Image Gen');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001', // Using latest Imagen model
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: '16:9', // Optimized for web
                },
            });
            const base64Image = response.generatedImages[0].image.imageBytes;
            setImage(`data:image/png;base64,${base64Image}`);
        } catch (e) {
            console.error("Bildgenerierung fehlgeschlagen:", e);
            setError("Bild konnte nicht generiert werden. Bitte versuchen Sie es erneut.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editImage || !prompt.trim()) return;
        
        const cost = COST_TABLE.IMAGE_GEN;
        if (!checkCredits(cost)) {
            setError(`Insufficient Credits. Editing requires ${cost} Credits.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setImage(null);
        
        deductCredits(cost, 'Visionär Image Edit');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            let base64Data;
            let mimeType;
            
            if (editImage.preview.startsWith('data:')) {
                base64Data = editImage.preview.split(',')[1];
                mimeType = editImage.preview.substring(editImage.preview.indexOf(':') + 1, editImage.preview.indexOf(';'));
            } else {
                base64Data = await blobToBase64(editImage.file);
                mimeType = editImage.file.type;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image', // Nano Banana for editing
                contents: {
                    parts: [
                        { inlineData: { mimeType, data: base64Data } },
                        { text: prompt },
                    ],
                },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            const part = response.candidates?.[0]?.content?.parts?.[0];
             if (part && part.inlineData) {
                setImage(`data:image/png;base64,${part.inlineData.data}`);
            } else {
                throw new Error("Keine Bilddaten erhalten");
            }

        } catch (e) {
            console.error("Bildbearbeitung fehlgeschlagen:", e);
            setError("Bearbeitung fehlgeschlagen.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!editImage) return;
        
        const cost = COST_TABLE.COMPLEX_TEXT; // Analyzing is cheaper than generating
        if (!checkCredits(cost)) {
             setError(`Insufficient Credits. Analysis requires ${cost} Credits.`);
             return;
        }

        setIsLoading(true);
        setAnalysisResult(null);
        deductCredits(cost, 'Visionär Image Analysis');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let base64Data;
            let mimeType;
             if (editImage.preview.startsWith('data:')) {
                base64Data = editImage.preview.split(',')[1];
                mimeType = editImage.preview.substring(editImage.preview.indexOf(':') + 1, editImage.preview.indexOf(';'));
            } else {
                base64Data = await blobToBase64(editImage.file);
                mimeType = editImage.file.type;
            }

            const prompt = "Analyze this image for a marketing campaign. Provide a description, 5 relevant tags, and a sentiment score (0-100). Respond in JSON.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview', // Upgraded to Gemini 3.0 for better vision analysis
                contents: {
                    parts: [
                        { inlineData: { mimeType, data: base64Data } },
                        { text: prompt },
                    ],
                },
                config: { responseMimeType: "application/json" }
            });
            setAnalysisResult(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("Analyse fehlgeschlagen.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTask = () => {
        if (!image) return;
        
        if (sourceTaskId) {
            // Update existing task logic
            updateTask(sourceTaskId, { imageUrl: image, status: 'review' }); // Move to review immediately
            setToastMessage(`Bild zu Aufgabe "${sourceTaskTitle || `#${sourceTaskId}`}" hinzugefügt und Status auf 'Review' gesetzt.`);
            setHighlightedTaskIds([sourceTaskId]);
            // Optionally navigate back
            setTimeout(() => navigateTo('meisterwerk'), 1500);
        } else {
            // Create new task logic
            const newTaskId = addTask("Neues Key Visual", `Generiert mit Prompt: ${prompt}`, image, false, undefined, 'visionar');
            setToastMessage("Bild als neue Aufgabe gespeichert!");
            setHighlightedTaskIds([newTaskId]);
            navigateTo('meisterwerk');
        }
    };
    
    const handleAnimate = () => {
        if (!image) return;
        // Create a task first to hold the image if it doesn't exist
        let taskId = sourceTaskId;
        if (!taskId) {
             taskId = addTask("Bild für Animation", `Basis für Video-Generierung. Prompt: ${prompt}`, image, false, undefined, 'animator');
        }
        
        setToolInput({
            tool: 'animator',
            sourceTaskId: taskId,
            imageUrl: image,
            prompt: "Cinematic movement, high quality."
        });
        navigateTo('animator');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImage({ file, preview: URL.createObjectURL(file) });
        }
    };
    
    const handleDownload = () => {
        if (image) {
            const link = document.createElement('a');
            link.href = image;
            link.download = `visionar_generated_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full flex flex-col' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-6xl mx-auto'}`}>
                {sourceTaskId && (
                    <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg mb-6 flex items-center justify-between animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <div>
                                <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Active Workflow</p>
                                <p className="text-sm text-white">Creating Asset for Task: <span className="font-bold">{sourceTaskTitle}</span></p>
                            </div>
                        </div>
                        <button onClick={() => { setSourceTaskId(null); setSourceTaskTitle(null); }} className="text-xs text-gray-400 hover:text-white">Cancel Link</button>
                    </div>
                )}

                <div className="flex justify-center mb-6 flex-shrink-0">
                    <div className="bg-[#0A0A0A] p-1 rounded-full border border-[#333] flex">
                        <button onClick={() => setMode('generate')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'generate' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Generieren</button>
                        <button onClick={() => setMode('edit')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Bearbeiten</button>
                        <button onClick={() => setMode('analyze')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'analyze' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>Analysieren</button>
                    </div>
                </div>

                <div className={`grid lg:grid-cols-3 gap-8 ${isEmbedded ? 'flex-1 overflow-hidden' : ''}`}>
                    {/* Input Area */}
                    <div className={`lg:col-span-1 space-y-6 ${isEmbedded ? 'overflow-y-auto pr-2' : ''}`}>
                        {(mode === 'edit' || mode === 'analyze') && (
                            <div className="w-full aspect-video bg-[#0A0A0A] rounded-lg border-2 border-dashed border-[#333333] flex items-center justify-center relative overflow-hidden hover:border-gray-500 transition-colors cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {editImage ? (
                                    <img src={editImage.preview} alt="Upload" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                                        <p className="text-xs text-gray-500">Bild hochladen</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode !== 'analyze' && (
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Prompt</label>
                                <textarea 
                                    value={prompt} 
                                    onChange={e => setPrompt(e.target.value)} 
                                    rows={4} 
                                    className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm"
                                    placeholder={mode === 'edit' ? "Was soll geändert werden? (z.B. 'Füge Sonnenbrille hinzu')" : "Beschreibe das Bild..."}
                                />
                            </div>
                        )}

                        <button 
                            onClick={mode === 'generate' ? handleGenerate : mode === 'edit' ? handleEdit : handleAnalyze} 
                            disabled={isLoading || (mode !== 'generate' && !editImage)} 
                            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Arbeite...</span>
                            ) : (
                                <>
                                    <ImageIcon /> 
                                    {mode === 'generate' ? `Generieren [${COST_TABLE.IMAGE_GEN} Cr]` : mode === 'edit' ? `Bearbeiten [${COST_TABLE.IMAGE_GEN} Cr]` : `Analysieren [${COST_TABLE.COMPLEX_TEXT} Cr]`}
                                </>
                            )}
                        </button>
                        
                        {analysisResult && (
                            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] text-sm space-y-2 animate-[fadeIn_0.5s_ease-out]">
                                <p className="text-gray-300">{analysisResult.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {analysisResult.tags?.map((tag: string) => <span key={tag} className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">#{tag}</span>)}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Sentiment Score: {analysisResult.sentiment_score}</p>
                            </div>
                        )}
                    </div>

                    {/* Preview Area */}
                    <div className={`lg:col-span-2 bg-[#0A0A0A] rounded-lg border border-[#333333] flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden ${isEmbedded ? 'h-full' : ''}`}>
                        {isLoading && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
                                <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-mono text-xs animate-pulse">RENDERING PIXELS...</p>
                             </div>
                        )}
                        
                        {error && <p className="text-red-400">{error}</p>}
                        
                        {image ? (
                            <div className="relative w-full h-full flex flex-col">
                                <img src={image} alt="Generated" className="flex-1 w-full h-full object-contain bg-black" />
                                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#111]">
                                    <button onClick={handleDownload} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded hover:bg-white/5 transition-colors">
                                        <DownloadIcon /> Download
                                    </button>
                                    <button onClick={handleAnimate} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 px-3 py-2 rounded border border-orange-500/30 hover:bg-orange-900/20 transition-colors">
                                        <MovieIcon /> Animieren
                                    </button>
                                    <button onClick={handleSaveTask} className={`text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-lg ${sourceTaskId ? 'bg-green-600 hover:bg-green-500 text-white hover:scale-105' : 'bg-white text-black hover:bg-gray-200'}`}>
                                        <AddToBoardIcon isAttachMode={!!sourceTaskId} />
                                        {sourceTaskId ? 'Speichern & Abschließen' : 'Als Task speichern'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            !isLoading && !error && (
                                <div className="text-center text-gray-600">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Ihr Meisterwerk wird hier erscheinen.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
