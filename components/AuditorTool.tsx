
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { useTasks } from '../contexts/AppContext';

// --- HELPER FUNCTIONS ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- TYPES & ICONS ---
type Transcript = {
    id: number;
    speaker: 'user' | 'ai';
    text: string;
    isFinal: boolean;
};
const MicOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 5.25v-1.5a6 6 0 00-12 0v1.5m6-6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12.75a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const MicOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 5.25v-1.5a6 6 0 00-12 0v1.5m6-6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12.75a3 3 0 100-6 3 3 0 000 6z" /><path d="M3.28 3.22a.75.75 0 00-1.06 1.06l18.5 18.5a.75.75 0 101.06-1.06L3.28 3.22z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;

// --- COMPONENT ---
export const AuditorTool: React.FC = () => {
    const { tasks, addTask, updateTask } = useTasks();
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Start session to speak with AI.');
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    
    // Refs for Audio and API session management
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    useEffect(() => {
        const checkKey = async () => {
            if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
            await (window as any).aistudio.openSelectKey();
            setApiKeySelected(true); // Assume success to avoid race conditions
        }
    };

    const stopSession = useCallback(async () => {
        setStatusMessage('Ending session...');
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            } finally {
                sessionPromiseRef.current = null;
            }
        }

        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        streamRef.current?.getTracks().forEach(track => track.stop());

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close().catch(console.error);
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close().catch(console.error);
        }
        
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        streamRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        setIsSessionActive(false);
        if (!statusMessage.includes('API Key')) {
             setStatusMessage('Start session to speak with AI.');
        }
    }, [statusMessage]);

    const startSession = async () => {
        setIsSessionActive(true);
        setStatusMessage('Requesting microphone access...');
        setTranscripts([]);

        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStatusMessage('Establishing connection...');

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            // --- FUNCTION CALLING DEFINITIONS ---
            const createTaskFn: FunctionDeclaration = { name: 'createTask', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['title', 'description'] } };
            const moveTaskFn: FunctionDeclaration = { name: 'moveTask', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, status: { type: Type.STRING, enum: ['todo', 'inprogress', 'review', 'done'] } }, required: ['title', 'status'] } };
            const approveTaskFn: FunctionDeclaration = { name: 'approveTask', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING } }, required: ['title'] } };
            const getProjectStatusFn: FunctionDeclaration = { name: 'getProjectStatus', parameters: { type: Type.OBJECT, properties: {} } };
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatusMessage('Connected. You can speak now.');
                        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current!);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current.onaudioprocess = (e) => { const d = e.inputBuffer.getChannelData(0); sessionPromiseRef.current?.then((s) => s.sendRealtimeInput({ media: createBlob(d) })); };
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Transcription
                        if (message.serverContent?.inputTranscription) { const { text, isFinal = false } = message.serverContent.inputTranscription as any; setTranscripts(p => { const l = p[p.length - 1]; if (l?.speaker === 'user' && !l.isFinal) return [...p.slice(0, -1), { ...l, text, isFinal }]; return [...p, { id: Date.now(), speaker: 'user', text, isFinal }]; }); }
                        if (message.serverContent?.outputTranscription) { const { text, isFinal = false } = message.serverContent.outputTranscription as any; setTranscripts(p => { const l = p[p.length - 1]; if (l?.speaker === 'ai' && !l.isFinal) return [...p.slice(0, -1), { ...l, text, isFinal }]; return [...p, { id: Date.now(), speaker: 'ai', text, isFinal }]; }); }
                        
                        // Audio Playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) { setStatusMessage('AI speaking...'); const ctx = outputAudioContextRef.current; nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime); const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1); const source = ctx.createBufferSource(); source.buffer = audioBuffer; source.connect(ctx.destination); source.addEventListener('ended', () => { audioSourcesRef.current.delete(source); if (audioSourcesRef.current.size === 0) setStatusMessage('Connected. You can speak now.'); }); source.start(nextStartTimeRef.current); nextStartTimeRef.current += audioBuffer.duration; audioSourcesRef.current.add(source); }
                        
                        // Function Calling
                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                let result = "Unknown function";
                                switch (fc.name) {
                                    case 'createTask':
                                        addTask(fc.args.title as string, fc.args.description as string);
                                        result = `Task "${fc.args.title as string}" created.`;
                                        break;
                                    case 'moveTask':
                                        const taskToMove = tasks.find(t => t.title.toLowerCase() === (fc.args.title as string).toLowerCase());
                                        if (taskToMove) {
                                            updateTask(taskToMove.id, { status: fc.args.status as 'todo' | 'inprogress' | 'review' | 'done' });
                                            result = `Task "${fc.args.title as string}" moved to ${fc.args.status as string}.`;
                                        } else {
                                            result = `Task "${fc.args.title as string}" not found.`;
                                        }
                                        break;
                                    case 'approveTask':
                                        const taskToApprove = tasks.find(t => t.title.toLowerCase() === (fc.args.title as string).toLowerCase() && t.status === 'review');
                                        if (taskToApprove) {
                                            updateTask(taskToApprove.id, { status: 'done', isApproved: true });
                                            result = `Task "${fc.args.title as string}" has been approved.`;
                                        } else {
                                            result = `Task "${fc.args.title as string}" not found or not in review status.`;
                                        }
                                        break;
                                    case 'getProjectStatus':
                                        const todo = tasks.filter(t => t.status === 'todo').length;
                                        const inprogress = tasks.filter(t => t.status === 'inprogress').length;
                                        const review = tasks.filter(t => t.status === 'review').length;
                                        const done = tasks.filter(t => t.status === 'done').length;
                                        result = `Project status: ${todo} tasks to do, ${inprogress} in progress, ${review} in review, and ${done} done.`;
                                        break;
                                }
                                sessionPromiseRef.current?.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result } } }));
                            }
                        }

                        if (message.serverContent?.interrupted) { for (const s of audioSourcesRef.current.values()) s.stop(); audioSourcesRef.current.clear(); nextStartTimeRef.current = 0; }
                    },
                    onerror: (e: any) => { console.error('API Error:', e); const msg = String(e.message || 'An unknown error occurred.'); if (msg.toLowerCase().includes("not found")) { setStatusMessage('API key not found. Please select it again.'); setApiKeySelected(false); } else { setStatusMessage(`Error: ${msg}. Session ending.`); } stopSession(); },
                    onclose: () => { setStatusMessage('Connection closed.'); if (isSessionActive) stopSession(); },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are "Auditor 2.0", a voice-controlled command center for a marketing Project OS. You are a friendly, helpful project assistant. You can create tasks, move tasks between statuses (todo, inprogress, review, done), and report the project status. You can also approve tasks that are in review. Additionally, you can answer analytical questions about project performance ("Why did LinkedIn Ads underperform?") and provide real-time briefings ("Give me the morning report"). Be concise and confirm actions clearly.',
                    tools: [{ functionDeclarations: [createTaskFn, moveTaskFn, getProjectStatusFn, approveTaskFn] }],
                },
            });
        } catch (error) { console.error('Error starting session:', error); setStatusMessage('Error: Could not start microphone.'); setIsSessionActive(false); }
    };

    useEffect(() => { transcriptContainerRef.current?.scrollTo(0, transcriptContainerRef.current.scrollHeight); }, [transcripts]);
    useEffect(() => () => { if (isSessionActive) stopSession(); }, [isSessionActive, stopSession]);

    if (!apiKeySelected) { return (<div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-8 text-center max-w-lg mx-auto"><KeyIcon /><h3 className="text-xl font-bold text-white mt-4">API Key Required</h3><p className="text-gray-400 mt-2">For real-time conversation with Auditor, an API key is required.</p><p className="text-xs text-gray-500 mt-2">More information on billing: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">ai.google.dev/gemini-api/docs/billing</a>.</p><button onClick={handleSelectKey} className="mt-6 bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-opacity-90">Select API Key</button></div>); }

    return (
        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] flex flex-col h-full max-h-[70vh] w-full max-w-2xl mx-auto p-6">
            <div ref={transcriptContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                {transcripts.length === 0 && (
                    <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                        <h3 className="text-lg font-medium text-white">Welcome to Auditor 2.0</h3>
                        <p className="text-sm">Start the session and say e.g.:<br/><em>"What is the project status?"</em> or <em>"Approve the task: Logo Draft".</em></p>
                    </div>
                )}
                {transcripts.map((t) => ( <div key={t.id} className={`flex ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-md rounded-lg px-3 py-2 text-sm ${t.speaker === 'user' ? 'bg-white/90 text-black' : 'bg-[#0A0A0A] text-white'} ${!t.isFinal ? 'opacity-70' : ''}`}>{t.text}</p></div> ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 border-t border-[#333333]">
                <button onClick={isSessionActive ? stopSession : startSession} className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isSessionActive ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-green-600 hover:bg-green-700'}`}>{isSessionActive ? <MicOffIcon /> : <MicOnIcon />}</button>
                <p className="text-sm text-gray-400 h-5">{statusMessage}</p>
            </div>
        </div>
    );
};
