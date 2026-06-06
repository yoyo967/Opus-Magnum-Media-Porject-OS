import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_KNOWLEDGE } from '@/tenants';

import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useTasks, Task, Persona } from '../contexts/AppContext';
import { Toast } from './Toast';

const VOICES = ['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir'];

const PersonalisatorIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232.046-2.453.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c.092 1.209.138 2.43.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7zM16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>);

interface PersonalisatorToolProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
}

export const PersonalisatorTool: React.FC<PersonalisatorToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, addTask, personas } = useTasks();
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // TTS State
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);


    const contentTasks = tasks.filter(task => (task.description || '').trim() !== '' && !task.imageUrl && !task.videoUrl);
    const selectedTask = tasks.find(t => t.id === selectedTaskId);
    const selectedPersona = personas.find(p => p.id === selectedPersonaId);

    const resetState = () => {
        setPersonalizedContent(null);
        setAudioUrl(null);
    };

    const handlePersonalize = async () => {
        if (!selectedTask || !selectedPersona) return;

        setIsLoading(true);
        setError(null);
        resetState();
        
        const personaStrategy = `Based on the persona '${selectedPersona.name}' (${selectedPersona.details.role}, age ${selectedPersona.details.age}), focus on their goals (${selectedPersona.details.goals.join(', ')}) and address their pain points (${selectedPersona.details.pain_points.join(', ')}). The tone should appeal to their motivations (${selectedPersona.details.motivations.join(', ')}).`;

        const prompt = `
            You are an expert marketing copywriter specializing in personalization.
            Your task is to rewrite the following marketing content to specifically target the selected audience persona.
            Highlight your changes by wrapping them in <mark> tags. Do not use markdown like \`\`\`. Respond only with the rewritten text.

            **Audience Persona to Target:**
            - Name: ${selectedPersona.name}
            - Personalization Strategy: ${personaStrategy}

            **Original Content:**
            - Title: ${selectedTask.title}
            - Body/Description: ${selectedTask.description}

            Now, rewrite the body/description based on the strategy. Capture the nuance and voice perfectly.
        `;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to Gemini 2.5 Pro
                contents: prompt,
                config: { systemInstruction: MIRROU_KNOWLEDGE },
            });
            setPersonalizedContent(response.text);
        } catch (e) {
            console.error("Fehler bei der Personalisierung:", e);
            setError("Inhalt konnte nicht personalisiert werden. Bitte versuchen Sie es erneut.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAudio = async () => {
        if (!personalizedContent) return;
        setIsGeneratingAudio(true);
        setError(null);
        setAudioUrl(null);
        
        try {
            const ai = getGeminiClient();
            const cleanText = personalizedContent.replace(/<\/?mark>/g, '');
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: cleanText }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
                },
              },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if(base64Audio) {
                setAudioUrl(`data:audio/mp3;base64,${base64Audio}`);
            } else {
                throw new Error("Keine Audiodaten in der Antwort gefunden.");
            }
        } catch (e) {
            console.error("Fehler bei der Audio-Generierung:", e);
            setError("Audio konnte nicht generiert werden.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const handleCreateTask = () => {
        if (!selectedTask || !selectedPersona || !personalizedContent) return;
        const newTitle = `[${selectedPersona.name}] ${selectedTask.title}`;
        // Clean the content from mark tags for the description
        const newDescription = personalizedContent.replace(/<\/?mark>/g, '');
        addTask(newTitle, newDescription, undefined, false, audioUrl || undefined, 'personalisator');
        setToastMessage(`Neue Aufgabe "${newTitle}" wurde zum Campaign Manager hinzugefügt!`);
        navigateTo('meisterwerk');
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'bg-transparent h-full flex flex-col' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-6xl mx-auto'}`}>
                <div className={`grid lg:grid-cols-3 gap-8 ${isEmbedded ? 'flex-1 overflow-hidden' : ''}`}>
                    {/* Controls */}
                    <div className={`lg:col-span-1 space-y-6 ${isEmbedded ? 'overflow-y-auto pr-2' : ''}`}>
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">1. Inhalt auswählen</label>
                            <select
                                value={selectedTaskId ?? ''}
                                onChange={e => { setSelectedTaskId(Number(e.target.value)); resetState(); }}
                                className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm"
                            >
                                <option value="" disabled>Aufgabe auswählen...</option>
                                {contentTasks.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">2. Ziel-Persona auswählen</label>
                            <div className="space-y-2">
                                {personas.length > 0 ? personas.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => { setSelectedPersonaId(persona.id); resetState(); }}
                                        className={`w-full text-left p-3 rounded-md border text-sm transition-all ${selectedPersonaId === persona.id ? 'bg-blue-900/50 border-blue-500' : 'bg-[#0A0A0A] border-[#333333] hover:border-gray-600'}`}
                                    >
                                        <p className="font-semibold text-white">{persona.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{persona.description}</p>
                                    </button>
                                )) : (
                                    <div className="text-center p-4 bg-[#0A0A0A] rounded-md border border-dashed border-[#333333]">
                                        <p className="text-sm text-gray-500">Keine Personas gefunden.</p>
                                        <button onClick={() => navigateTo('persona')} className="mt-2 text-xs text-blue-400 hover:underline">Persona-Werkzeug öffnen</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handlePersonalize}
                            disabled={!selectedTaskId || !selectedPersonaId || isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                        >
                            <PersonalisatorIcon className="w-5 h-5" />
                            {isLoading ? 'Personalisiere...' : 'Inhalt personalisieren'}
                        </button>
                    </div>

                    {/* Results */}
                    <div className={`lg:col-span-2 bg-[#0A0A0A] rounded-lg border border-[#333333] p-6 flex flex-col ${isEmbedded ? 'overflow-hidden' : ''}`}>
                        <h3 className="text-lg font-medium text-white mb-4 flex-shrink-0">Personalisierungs-Vorschau</h3>
                        <div className={`flex-1 ${isEmbedded ? 'overflow-y-auto' : ''}`}>
                            {!selectedTask ? (
                                <div className="flex items-center justify-center h-full text-gray-500 min-h-[200px]">
                                    <p>Bitte wählen Sie einen Inhalt und eine Persona aus.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6 h-full">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-300 text-sm">Original</h4>
                                        <div className="prose prose-sm prose-invert text-gray-400 bg-[#1C1C1C] p-4 rounded-md h-full min-h-[200px] border border-[#333333]">
                                            <p>{selectedTask.description}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-300 text-sm">Personalisiert für: <span className="text-blue-400">{selectedPersona?.name}</span></h4>
                                        <div className="prose prose-sm prose-invert text-gray-300 bg-[#1C1C1C] p-4 rounded-md h-full min-h-[200px] border border-[#333333]">
                                            {isLoading && <p className="animate-pulse">Gemini 2.5 Pro passt Inhalte an...</p>}
                                            {error && <p className="text-red-400">{error}</p>}
                                            {personalizedContent && <div dangerouslySetInnerHTML={{ __html: personalizedContent.replace(/\n/g, '<br/>') }} className="[&>mark]:bg-blue-500/30 [&>mark]:text-blue-200 [&>mark]:px-1 [&>mark]:rounded-sm"></div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {personalizedContent && (
                            <div className="mt-6 border-t border-[#333333] pt-4 space-y-4 flex-shrink-0">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Audio-Version generieren</h4>
                                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                                        <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} className="w-full sm:w-auto bg-[#1C1C1C] text-white px-3 py-2 rounded-md border border-[#333333] text-sm">
                                            {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        <button onClick={handleGenerateAudio} disabled={isGeneratingAudio} className="w-full sm:flex-1 bg-white/10 text-white py-2 px-4 rounded-full text-sm hover:bg-white/20 disabled:opacity-50">{isGeneratingAudio ? 'Generiere Audio...' : 'Sprache generieren'}</button>
                                    </div>
                                    {audioUrl && <audio controls src={audioUrl} className="w-full mt-4" />}
                                </div>
                                <button
                                    onClick={handleCreateTask}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-full transition-colors"
                                >
                                    Personalisierte Version als neue Aufgabe erstellen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
