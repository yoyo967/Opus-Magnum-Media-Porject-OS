import { getGeminiClient, mapGeminiError } from '@/utils/geminiClient';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';

export const PersonaTool: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { personas, addPersona } = useTasks();
    const [description, setDescription] = useState('Ein technikaffiner Marketingmanager Mitte 30 in Berlin, der nach skalierbaren Automatisierungslösungen für sein Team sucht.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPersona, setGeneratedPersona] = useState<any | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const personaSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            age: { type: Type.INTEGER },
            role: { type: Type.STRING },
            goals: { type: Type.ARRAY, items: { type: Type.STRING } },
            pain_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
            bio: { type: Type.STRING },
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPersona(null);
        setGeneratedImage(null);

        try {
            const ai = getGeminiClient();

            // Generate Persona Details
            const detailsPrompt = `Erstelle eine detaillierte Buyer Persona basierend auf dieser Beschreibung: "${description}". Fülle alle Felder des JSON-Schemas aus.`;
            // Upgraded to Gemini 3.0 for deeper empathy and detail
            const detailsResponse = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: detailsPrompt,
                config: { responseMimeType: 'application/json', responseSchema: personaSchema }
            });
            const personaDetails = JSON.parse(detailsResponse.text);
            setGeneratedPersona(personaDetails);
            
            // Generate Persona Image
            const imagePrompt = `Ein professionelles, realistisches Porträtfoto für eine Marketing-Persona: ${personaDetails.role}, ca. ${personaDetails.age} Jahre alt. Heller, moderner Bürohintergrund.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1, aspectRatio: '1:1' }
            });
            setGeneratedImage(`data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`);

        } catch (e) {
            console.error("Fehler bei der Persona-Generierung:", e);
            setError(mapGeminiError(e));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSavePersona = () => {
        if (!generatedPersona || !generatedImage) return;
        addPersona({
            name: generatedPersona.name,
            imageUrl: generatedImage,
            description: generatedPersona.role,
            details: generatedPersona,
        });
        setToastMessage(`Persona "${generatedPersona.name}" wurde gespeichert.`);
        setGeneratedPersona(null);
        setGeneratedImage(null);
    };

    const PersonaCard: React.FC<{ persona: any, imageUrl: string, onSave?: () => void }> = ({ persona, imageUrl, onSave }) => (
        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] space-y-4">
            <div className="flex items-center gap-4">
                <img src={imageUrl} alt={persona.name} className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
                <div>
                    <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                    <p className="text-sm text-gray-400">{persona.role}, {persona.age}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 italic">"{persona.bio}"</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div><h4 className="font-semibold text-gray-400 mb-1">Ziele</h4><ul className="list-disc list-inside text-gray-300">{(persona.goals || []).map((g: string, i: number) => <li key={i}>{g}</li>)}</ul></div>
                <div><h4 className="font-semibold text-gray-400 mb-1">Schmerzpunkte</h4><ul className="list-disc list-inside text-gray-300">{(persona.pain_points || []).map((p: string, i: number) => <li key={i}>{p}</li>)}</ul></div>
                <div><h4 className="font-semibold text-gray-400 mb-1">Motivationen</h4><ul className="list-disc list-inside text-gray-300">{(persona.motivations || []).map((m: string, i: number) => <li key={i}>{m}</li>)}</ul></div>
            </div>
            {onSave && (
                <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button onClick={onSave} className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-opacity-90">Persona speichern</button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-medium text-white mb-2">Persona Generator</h3>
                <p className="text-sm text-gray-400 mb-4">Beschreiben Sie Ihre Zielgruppe und lassen Sie die KI eine detaillierte Persona erstellen.</p>
                <div className="space-y-4">
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                        {isLoading ? 'Generiere...' : 'Persona erstellen'}
                    </button>
                </div>
            </div>

            {(isLoading || generatedPersona || error) && (
                <div className="mt-6 max-w-4xl mx-auto">
                    {isLoading && <p className="text-center text-gray-400 animate-pulse">KI erschafft eine neue Persönlichkeit...</p>}
                    {error && <p className="text-center text-red-400">{error}</p>}
                    {generatedPersona && generatedImage && <PersonaCard persona={generatedPersona} imageUrl={generatedImage} onSave={handleSavePersona} />}
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Ihre Persona-Bibliothek</h2>
                {personas.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {personas.map(p => (
                            <div key={p.id} className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-4 flex gap-4">
                                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                                <div>
                                    <h3 className="font-semibold text-white">{p.name}</h3>
                                    <p className="text-sm text-gray-400">{p.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Ihre Bibliothek ist leer. Erstellen Sie Ihre erste Persona!</p>
                )}
            </div>
        </>
    );
};
