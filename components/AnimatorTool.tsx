import { getGeminiClient, getGeminiApiKey, mapGeminiError } from '@/utils/geminiClient';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

// --- HELPER FUNCTIONS & TYPES ---
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

type AspectRatio = "16:9" | "9:16" | "1:1";
type Status = 'idle' | 'generating' | 'polling' | 'success' | 'error';
const STATUS_MESSAGES: { [key in Status]: string } = {
    idle: '',
    generating: 'Video generation initializing...',
    polling: 'Video is being created, this may take a few minutes. Please be patient...',
    success: 'Video successfully generated!',
    error: 'An error occurred.',
};

interface AnimatorToolProps {
  navigateTo: (page: string) => void;
}

// --- ICONS ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;

// --- MAIN COMPONENT ---
export const AnimatorTool: React.FC<AnimatorToolProps> = ({ navigateTo }) => {
    const { toolInput, setToolInput, updateTask, checkCredits, deductCredits } = useTasks();
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [image, setImage] = useState<{ file?: File, preview: string } | null>(null);
    const [prompt, setPrompt] = useState('A gentle camera pan to the right, object comes to life.');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [status, setStatus] = useState<Status>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sourceTaskId, setSourceTaskId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            if ((window as any).aistudio) {
                // @google/genai-api-guideline: video-api-key-check: Use `window.aistudio.hasSelectedApiKey` to check if an API key is selected.
                const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkKey();
    }, []);

    useEffect(() => {
        if (toolInput && toolInput.tool === 'animator' && toolInput.imageUrl) {
            setImage({ preview: toolInput.imageUrl });
            setPrompt(toolInput.prompt || 'Bring this image to life.');
            setSourceTaskId(toolInput.sourceTaskId);
            setToolInput(null); // Consume the input
        }
    }, [toolInput, setToolInput]);

    const handleSelectKey = async () => {
        if ((window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
            setApiKeySelected(true); // Assume success to avoid race conditions
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage({ file, preview: URL.createObjectURL(file) });
            setSourceTaskId(null); // Reset task ID if a new file is uploaded
        }
    };

    const handleGenerateVideo = async () => {
        const imageFile = image?.file;
        const imageUrl = image?.preview;

        if (!imageUrl || !prompt || (!imageFile && !imageUrl.startsWith('data:'))) {
            setError("Please upload an image or ensure an image is loaded from a task, and enter a prompt.");
            return;
        }
        
        const cost = COST_TABLE.VIDEO_GEN;
        if (!checkCredits(cost)) {
            setError(`Insufficient Credits. Video generation requires ${cost} Credits.`);
            return;
        }

        setStatus('generating');
        setStatusMessage(STATUS_MESSAGES.generating);
        setError(null);
        setVideoUrl(null);
        deductCredits(cost, 'Animator Video Gen (Veo)');

        try {
            const ai = getGeminiClient();
            let imageB64: string;
            let mimeType: string;

            if (imageFile) {
                imageB64 = await blobToBase64(imageFile);
                mimeType = imageFile.type;
            } else {
                imageB64 = imageUrl.split(',')[1];
                mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
            }

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: { imageBytes: imageB64, mimeType: mimeType },
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
            });

            setStatus('polling');
            setStatusMessage(STATUS_MESSAGES.polling);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
                // @google/genai-api-guideline: video-polling: Loop until operation.done is true
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                throw new Error(operation.error.message);
            }

            const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (videoUri) {
                // @google/genai-api-guideline: video-download-link: Append API key
                const fetchUrl = `${videoUri}&key=${getGeminiApiKey()}`;
                const videoRes = await fetch(fetchUrl);
                const videoBlob = await videoRes.blob();
                const localVideoUrl = URL.createObjectURL(videoBlob);
                
                setVideoUrl(localVideoUrl);
                setStatus('success');
            } else {
                throw new Error("No video URI returned.");
            }

        } catch (e: any) {
            console.error("Video generation error:", e);
            setStatus('error');
            setError(mapGeminiError(e));
        }
    };

    const handleSaveTask = () => {
        if (sourceTaskId && videoUrl) {
            updateTask(sourceTaskId, { videoUrl });
            setToastMessage("Video saved to task!");
            navigateTo('meisterwerk');
        } else if (videoUrl) {
            // Should handle creating new task logic if needed, omitted for brevity here as per prompt context focus
             setToastMessage("Video generated! (Save to Task logic could go here)");
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-8 text-center max-w-lg mx-auto mt-10">
                <div className="flex justify-center mb-4 text-gray-400"><KeyIcon /></div>
                <h3 className="text-xl font-bold text-white mb-2">API Key Required</h3>
                <p className="text-gray-400 text-sm mb-4">
                    To use Veo video generation, you must select your own API key.
                    Billing information: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ai.google.dev/gemini-api/docs/billing</a>
                </p>
                <button onClick={handleSelectKey} className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-opacity-90 transition-colors">
                    Select API Key
                </button>
            </div>
        );
    }

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                         <div className="bg-[#0A0A0A] rounded-lg border-2 border-dashed border-[#333333] h-40 flex items-center justify-center relative overflow-hidden hover:border-gray-500 transition-colors cursor-pointer">
                             <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={status === 'generating' || status === 'polling'}/>
                             {image ? (
                                 <img src={image.preview} alt="Source" className="w-full h-full object-contain" />
                             ) : (
                                 <div className="text-center">
                                     <UploadIcon />
                                     <p className="text-xs text-gray-500 mt-2">Upload Source Image</p>
                                 </div>
                             )}
                         </div>

                         <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Animation Prompt</label>
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)} 
                                rows={4} 
                                className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm"
                                placeholder="Describe the motion..."
                                disabled={status === 'generating' || status === 'polling'}
                            />
                        </div>
                        
                        <div>
                             <label className="text-sm font-medium text-gray-300 block mb-2">Aspect Ratio</label>
                             <div className="flex gap-2">
                                 {(['16:9', '9:16', '1:1'] as AspectRatio[]).map(ratio => (
                                     <button 
                                        key={ratio} 
                                        onClick={() => setAspectRatio(ratio)} 
                                        disabled={status === 'generating' || status === 'polling'}
                                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-[#0A0A0A] text-gray-400 border-[#333] hover:border-gray-500'}`}
                                     >
                                         {ratio}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        <button 
                            onClick={handleGenerateVideo} 
                            disabled={status === 'generating' || status === 'polling' || !image} 
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-full font-medium text-sm disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                        >
                             {status === 'generating' || status === 'polling' ? 'Processing...' : `Generate Video [${COST_TABLE.VIDEO_GEN} Cr]`}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-2 bg-[#0A0A0A] rounded-lg border border-[#333333] flex items-center justify-center min-h-[400px] overflow-hidden relative">
                        {status === 'idle' && !videoUrl && (
                            <div className="text-center text-gray-600">
                                <p>Ready to animate.</p>
                            </div>
                        )}
                        {(status === 'generating' || status === 'polling') && (
                            <div className="text-center text-orange-400 flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-medium">{statusMessage}</p>
                                <p className="text-xs text-gray-600 mt-2">This uses Veo-3.1 logic.</p>
                            </div>
                        )}
                        {error && (
                             <div className="text-center text-red-400 p-4">
                                <p className="font-bold mb-2">Error</p>
                                <p className="text-sm">{error}</p>
                             </div>
                        )}
                        {videoUrl && (
                            <div className="w-full h-full flex flex-col">
                                <video src={videoUrl} controls autoPlay loop className="flex-1 w-full h-full object-contain bg-black" />
                                {sourceTaskId && (
                                    <div className="absolute bottom-4 right-4">
                                        <button onClick={handleSaveTask} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                                            Save to Task
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
