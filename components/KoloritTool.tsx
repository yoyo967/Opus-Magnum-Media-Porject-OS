import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_KNOWLEDGE } from '@/tenants';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';

const KoloritIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m7.704 4.252a15.998 15.998 0 00-3.388-1.622m-5.043-.025a15.998 15.998 0 01-1.622-3.385m-1.622 3.385a15.998 15.998 0 013.388 1.622m5.043.025a15.998 15.998 0 003.388 1.622m-1.622-3.385a15.998 15.998 0 00-3.388-1.622m-3.388 1.622a15.998 15.998 0 011.622 3.385" /></svg>);

interface StyleGuide {
    palette: { name: string; hex: string; role: 'primary' | 'secondary' | 'accent' }[];
    personality: string[];
    typography: { primaryFont: string; secondaryFont: string; };
    visualStyle: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-gray-700/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-700/50 rounded-lg"></div>
            <div className="h-32 bg-gray-700/50 rounded-lg"></div>
            <div className="h-32 bg-gray-700/50 rounded-lg"></div>
        </div>
    </div>
);

export const KoloritTool: React.FC = () => {
    const { setBrandGuidelines } = useTasks();
    const [description, setDescription] = useState('Eine innovative Tech-Marke, die komplexe KI-Lösungen für Kreativprofis zugänglich macht. Die Marke ist modern, minimalistisch, aber auch menschlich und inspirierend.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const styleGuideSchema = {
        type: Type.OBJECT,
        properties: {
            palette: {
                type: Type.ARRAY,
                description: 'A color palette of 5-6 colors.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        hex: { type: Type.STRING },
                        role: { type: Type.STRING, enum: ['primary', 'secondary', 'accent'] }
                    }
                }
            },
            personality: { type: Type.ARRAY, description: "5 adjectives describing the brand's personality.", items: { type: Type.STRING } },
            typography: {
                type: Type.OBJECT,
                properties: {
                    primaryFont: { type: Type.STRING, description: 'A suitable primary font (e.g., for headlines).' },
                    secondaryFont: { type: Type.STRING, description: 'A suitable secondary font (e.g., for body text).' }
                }
            },
            visualStyle: { type: Type.STRING, description: 'A brief description of the visual style for imagery and graphics.' }
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setStyleGuide(null);

        const prompt = `Generate a complete brand style guide based on the following description. Adhere strictly to the JSON schema.
        Brand Description: "${description}"`;

        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 2.5 Pro for more creative/aesthetic reasoning
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { systemInstruction: MIRROU_KNOWLEDGE, responseMimeType: "application/json", responseSchema: styleGuideSchema }
            });
            setStyleGuide(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("Style Guide konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setToastMessage(`Farbcode ${hex} kopiert!`);
    };
    
    const handleSaveGuidelines = () => {
        if (!styleGuide) return;
        setBrandGuidelines({
            voice: (styleGuide.personality || []).join(', '),
            visual: styleGuide.visualStyle,
            colors: (styleGuide.palette || []).map(c => c.hex)
        });
        setToastMessage("Markenrichtlinien wurden systemweit gespeichert!");
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Markenbeschreibung</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm" />
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                    <KoloritIcon /> {isLoading ? 'Generiere...' : 'Style Guide generieren'}
                </button>

                {isLoading && <SkeletonLoader />}
                {error && <p className="text-center text-red-400">{error}</p>}
                
                {styleGuide && (
                    <div className="space-y-6 page-fade-in">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Farbpalette</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                {(styleGuide.palette || []).map(color => (
                                    <div key={color.hex} className="group cursor-pointer" onClick={() => handleCopy(color.hex)}>
                                        <div className="w-full aspect-square rounded-md border border-white/10" style={{ backgroundColor: color.hex }}></div>
                                        <p className="text-xs font-semibold text-white mt-2 truncate">{color.name}</p>
                                        <p className="text-xs text-gray-400 uppercase">{color.hex}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                                <h4 className="font-semibold text-white mb-2">Markenpersönlichkeit</h4>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                    {(styleGuide.personality || []).map(p => <li key={p}>{p}</li>)}
                                </ul>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                                <h4 className="font-semibold text-white mb-2">Typografie</h4>
                                <p className="text-sm text-gray-400">Primär: <span className="text-white font-medium">{styleGuide.typography.primaryFont}</span></p>
                                <p className="text-sm text-gray-400">Sekundär: <span className="text-white font-medium">{styleGuide.typography.secondaryFont}</span></p>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                                <h4 className="font-semibold text-white mb-2">Bildsprache</h4>
                                <p className="text-sm text-gray-300">{styleGuide.visualStyle}</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button onClick={handleSaveGuidelines} className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-full transition-colors">Als Markenrichtlinien speichern</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
