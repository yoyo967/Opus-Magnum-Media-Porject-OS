import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from '@google/genai';
import { useTasks } from '../contexts/AppContext';
import { buildMirrouContext } from '../tenants';

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

    // Compliance Checker State
    const [activeMode, setActiveMode] = useState<'voice-assistant' | 'compliance-checker'>('compliance-checker');
    const [copy, setCopy] = useState('Unser revolutionäres Serum verjüngt Ihre Haut um 10 Jahre in nur 2 Wochen durch hochkonzentrierten Algen-Extrakt. 100% wissenschaftlich bewiesen, klinisch getestet und völlig risikofrei.');
    const [visualDescription, setVisualDescription] = useState('Eine junge Frau mit perfekter, makelloser Haut trägt das Serum auf. Im Hintergrund eine stilisierte DNA-Helix und Labor-Kolben, um die wissenschaftliche Wirkung zu visualisieren. Kein KI-Label sichtbar.');
    const [channels, setChannels] = useState('Meta Ads, TikTok, Instagram Store');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditReport, setAuditReport] = useState<any | null>(null);
    const [auditError, setAuditError] = useState<string | null>(null);

    const complianceSchema = {
        type: Type.OBJECT,
        properties: {
            recommendation: { type: Type.STRING, enum: ['YES', 'NO'] },
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            regulations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ['PASS', 'WARN', 'FAIL'] },
                        findings: { type: Type.STRING },
                        required_action: { type: Type.STRING }
                    }
                }
            },
            wording_corrections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING },
                        suggested: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            },
            labeling_required: { type: Type.STRING }
        }
    };

    const handleCheckCompliance = async () => {
        setIsAnalyzing(true);
        setAuditError(null);
        setAuditReport(null);

        const prompt = `Du bist der Compliance Auditor von Mirrou.
        Prüfe die folgenden Marketing-Assets auf Konformität:
        - Werbetext (Copy): ${copy}
        - Bildbeschreibung (Visual Description): ${visualDescription}
        - Kanäle: ${channels}

        System-Instruktion:
        ${buildMirrouContext('auditor')}

        Führe eine detaillierte Prüfung durch bezüglich:
        1. EU AI Act Art. 50 (Transparenz und Kennzeichnung von KI-Inhalten)
        2. HCVO (Health Claims Regulation - gesundheitsbezogene Angaben)
        3. DSGVO (Datenschutz bei Personalisierung / Tracking)
        4. C2PA-Kennzeichnungspflichten

        Gib eine klare Ja/Nein (YES/NO) Empfehlung ab, korrigiere verbotene Werbeaussagen im "wording_corrections"-Feld und bestimme das erforderliche Labeling laut Mirrous Labeling-Matrix.
        Antworte ausschließlich mit dem JSON-Schema.`;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: complianceSchema }
            });
            setAuditReport(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setAuditError("Compliance Audit konnte nicht durchgeführt werden.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
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

            const ai = getGeminiClient();

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
        <div className="space-y-8 font-sans text-white w-full">
            {/* Mode Selector */}
            <div className="flex justify-center">
                <div className="bg-[#1C1C1C] p-1.5 rounded-full border border-[#333333] flex gap-1">
                    <button
                        onClick={() => setActiveMode('compliance-checker')}
                        className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeMode === 'compliance-checker' ? 'bg-[#C8A25A] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Compliance Checker
                    </button>
                    <button
                        onClick={() => setActiveMode('voice-assistant')}
                        className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeMode === 'voice-assistant' ? 'bg-[#C8A25A] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Live Voice Assistant
                    </button>
                </div>
            </div>

            {activeMode === 'compliance-checker' ? (
                /* Compliance Checker UI */
                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start font-sans text-white">
                    {/* Inputs */}
                    <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-white mb-1 border-b border-[#333333] pb-2 font-mono">Asset Inputs</h3>
                            <p className="text-xs text-gray-400">Geben Sie Text und Bildbeschreibungen zur Prüfung ein.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider font-mono">Marketing-Text (Copy)</label>
                                <textarea 
                                    value={copy} 
                                    onChange={e => setCopy(e.target.value)} 
                                    rows={4}
                                    className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none resize-none font-sans" 
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider font-mono">Bildbeschreibung (Visual)</label>
                                <textarea 
                                    value={visualDescription} 
                                    onChange={e => setVisualDescription(e.target.value)} 
                                    rows={4}
                                    className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none resize-none font-sans" 
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider font-mono">Kanäle (kommasepariert)</label>
                                <input 
                                    type="text"
                                    value={channels} 
                                    onChange={e => setChannels(e.target.value)} 
                                    className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none font-sans" 
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckCompliance} 
                            disabled={isAnalyzing} 
                            className="w-full bg-[#C8A25A] text-black py-2.5 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#D4B370] transition-colors disabled:opacity-50 font-sans"
                        >
                            {isAnalyzing ? 'Prüfe Compliance...' : 'Compliance prüfen'}
                        </button>
                        
                        {auditError && <p className="text-xs text-red-400 mt-2 text-center font-sans">{auditError}</p>}
                    </div>

                    {/* Report Output */}
                    <div className="lg:col-span-2 bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 min-h-[500px]">
                        {isAnalyzing ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-2 border-[#C8A25A] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Führe regulatorische Prüfung durch...</p>
                            </div>
                        ) : auditReport ? (
                            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                                {/* Summary and Verdict */}
                                <div className="border-b border-[#333333] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <span className="text-[10px] bg-[#C8A25A]/10 text-[#C8A25A] border border-[#C8A25A]/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">Compliance Audit</span>
                                        <h2 className="text-xl font-bold text-white mt-2 font-sans">Audit-Bericht</h2>
                                        <p className="text-xs text-gray-400 mt-1 font-sans">{auditReport.summary}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-mono">Freigabe-Empfehlung</span>
                                        <span className={`text-xl font-bold px-4 py-1.5 rounded-md mt-1 font-sans ${auditReport.recommendation === 'YES' ? 'bg-green-950/40 text-green-400 border border-green-500/20' : 'bg-red-950/40 text-red-400 border border-red-500/20'}`}>
                                            {auditReport.recommendation === 'YES' ? 'YES (Freigabe)' : 'NO (Stopp)'}
                                        </span>
                                    </div>
                                </div>

                                {/* Regulation Status Grid */}
                                <div>
                                    <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-3 font-mono">Prüfmatrix</h4>
                                    <div className="space-y-3">
                                        {auditReport.regulations?.map((reg: any, idx: number) => (
                                            <div key={idx} className="bg-[#0A0A0A] border border-[#222222] p-4 rounded flex justify-between items-start gap-4 font-sans">
                                                <div className="space-y-1">
                                                    <h5 className="text-xs font-bold text-white font-sans">{reg.name}</h5>
                                                    <p className="text-xs text-gray-400 font-sans">{reg.findings}</p>
                                                    {reg.required_action && (
                                                        <p className="text-[11px] text-yellow-500 mt-1 font-sans"><span className="font-semibold">Erforderliche Aktion:</span> {reg.required_action}</p>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                                                    reg.status === 'PASS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    reg.status === 'WARN' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                    {reg.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Labeling and Wording Corrections */}
                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[#333333]">
                                    {/* Wording Corrections */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-3 font-mono">Wortlaut-Korrekturen</h4>
                                        <div className="space-y-3">
                                            {auditReport.wording_corrections && auditReport.wording_corrections.length > 0 ? (
                                                auditReport.wording_corrections.map((corr: any, idx: number) => (
                                                    <div key={idx} className="bg-[#0A0A0A] border border-[#222222] p-3 rounded text-xs space-y-2 font-sans">
                                                        <div className="line-through text-red-400/80 font-serif italic">"{corr.original}"</div>
                                                        <div className="text-green-400 font-serif italic">"{corr.suggested}"</div>
                                                        <div className="text-[10px] text-gray-500 pt-1 border-t border-[#222222]/40 font-sans">{corr.reason}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-[#0A0A0A]/40 border border-[#222222] p-3 rounded text-xs text-gray-500 text-center font-sans">Keine Textkorrekturen nötig.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Act Labeling */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-3 font-mono">Labeling-Pflicht</h4>
                                        <div className="bg-[#0A0A0A] border border-[#222222] p-4 rounded text-xs space-y-3 font-sans">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Erforderliches Label:</span>
                                                <span className="font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{auditReport.labeling_required}</span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed font-sans">
                                                Basierend auf der Bildbeschreibung und dem KI-Einsatzgrad muss das Asset mit dem oben genannten Badge versehen werden, um den Transparenzpflichten des EU AI Acts und C2PA zu entsprechen.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-600 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h4 className="text-sm font-semibold text-white">Keine Prüfung geladen</h4>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm font-sans">Geben Sie links die Details ein und klicken Sie auf "Compliance prüfen".</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Live Voice Assistant (Original Layout) */
                <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] flex flex-col h-full min-h-[400px] max-h-[70vh] w-full max-w-2xl mx-auto p-6 font-sans">
                    <div ref={transcriptContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                        {transcripts.length === 0 && (
                            <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                                <h3 className="text-lg font-medium text-white font-mono">Welcome to Auditor 2.0</h3>
                                <p className="text-sm font-sans">Start the session and say e.g.:<br/><em>"What is the project status?"</em> or <em>"Approve the task: Logo Draft".</em></p>
                            </div>
                        )}
                        {transcripts.map((t) => ( <div key={t.id} className={`flex ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-md rounded-lg px-3 py-2 text-sm ${t.speaker === 'user' ? 'bg-white/90 text-black font-sans' : 'bg-[#0A0A0A] text-white font-sans'} ${!t.isFinal ? 'opacity-70' : ''}`}>{t.text}</p></div> ))}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 pt-4 border-t border-[#333333]">
                        <button onClick={isSessionActive ? stopSession : startSession} className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isSessionActive ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-green-600 hover:bg-green-700'}`}>{isSessionActive ? <MicOffIcon /> : <MicOnIcon />}</button>
                        <p className="text-sm text-gray-400 h-5 font-sans">{statusMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
