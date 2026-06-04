import { getGeminiClient } from '@/utils/geminiClient';
import { buildMirrouContext } from '@/tenants';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';

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

export const MarkenwaechterTool: React.FC = () => {
    const { brandGuidelines, setBrandGuidelines } = useTasks();
    const [activeTab, setActiveTab] = useState('settings');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Settings State
    const [voice, setVoice] = useState('');
    const [visual, setVisual] = useState('');
    const [colors, setColors] = useState('');

    useEffect(() => {
        if (brandGuidelines) {
            setVoice(brandGuidelines.voice);
            setVisual(brandGuidelines.visual);
            setColors(brandGuidelines.colors.join(', '));
        }
    }, [brandGuidelines]);

    const handleSaveSettings = () => {
        const colorArray = colors.split(',').map(c => c.trim()).filter(Boolean);
        setBrandGuidelines({ voice, visual, colors: colorArray });
        setToastMessage("Markenrichtlinien gespeichert!");
    };

    // Checker State
    const [checkText, setCheckText] = useState('');
    const [checkImage, setCheckImage] = useState<{ file: File, preview: string } | null>(null);
    const [checkResult, setCheckResult] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Rewriter State
    const [textToRewrite, setTextToRewrite] = useState('');
    const [rewrittenText, setRewrittenText] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewriteTone, setRewriteTone] = useState('Standard');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setCheckImage({ file, preview: URL.createObjectURL(file) });
            setCheckResult(null);
        }
    };

    const handleCheck = async () => {
        if (!brandGuidelines) {
            setCheckResult("Fehler: Bitte speichern Sie zuerst Ihre Markenrichtlinien.");
            return;
        }

        setIsChecking(true);
        setCheckResult(null);
        let prompt = `Act as a brand compliance expert. Analyze the provided asset against the brand guidelines. Provide a score from 0-100 on compliance and a brief, bulleted list of feedback points (what's good, what could be improved).

        **Brand Guidelines:**
        - Voice/Tone: ${brandGuidelines.voice}
        - Visual Style: ${brandGuidelines.visual}
        - Key Colors: ${brandGuidelines.colors.join(', ')}
        
        **Asset to Analyze:**
        `;

        try {
            const ai = getGeminiClient();
            let response;
            if (activeTab === 'textCheck' && checkText) {
                prompt += `\nText: "${checkText}"`;
                // Upgraded to Gemini 3.0 for stricter compliance checking
                response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt, config: { systemInstruction: buildMirrouContext('markenwaechter') } });
            } else if (activeTab === 'imageCheck' && checkImage) {
                prompt += "\nImage is attached.";
                const base64Data = await blobToBase64(checkImage.file);
                const imagePart = { inlineData: { mimeType: checkImage.file.type, data: base64Data } };
                const textPart = { text: prompt };
                // Upgraded to Gemini 3.0 for multimodal checking
                response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: { parts: [imagePart, textPart] }, config: { systemInstruction: buildMirrouContext('markenwaechter') } });
            } else {
                setCheckResult("Kein Inhalt zum Überprüfen vorhanden.");
                setIsChecking(false);
                return;
            }
            setCheckResult(response.text);

        } catch (error) {
            console.error("Compliance check failed:", error);
            setCheckResult("Die Überprüfung ist fehlgeschlagen.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleRewrite = async () => {
        if (!brandGuidelines) {
            setToastMessage("Fehler: Keine Markenrichtlinien definiert.");
            return;
        }
        if (!textToRewrite.trim()) return;

        setIsRewriting(true);
        setRewrittenText('');

        const prompt = `You are a professional copywriter/editor. Rewrite the following text so that it perfectly matches the defined Brand Voice.
        
        **Brand Voice:** ${brandGuidelines.voice}
        **Target Tone for this rewrite:** ${rewriteTone}
        
        **Original Text:**
        "${textToRewrite}"
        
        **Instructions:**
        Keep the core meaning, but adjust vocabulary, sentence structure, and style to match the brand voice and the target tone. Output ONLY the rewritten text.`;

        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 3.0 for higher quality rewriting
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
            setRewrittenText(response.text);
        } catch (error) {
            console.error("Rewrite failed:", error);
            setToastMessage("Umschreiben fehlgeschlagen.");
        } finally {
            setIsRewriting(false);
        }
    };

    const TabButton: React.FC<{ tabId: string, children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
        >
            {children}
        </button>
    );

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-6xl mx-auto">
                <div className="flex gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
                    <TabButton tabId="settings">Richtlinien</TabButton>
                    <TabButton tabId="textCheck">Text-Prüfung</TabButton>
                    <TabButton tabId="imageCheck">Bild-Prüfung</TabButton>
                    <TabButton tabId="rewrite">Text-Optimierer</TabButton>
                </div>

                {activeTab === 'settings' && (
                    <div className="space-y-6 page-fade-in">
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Brand Voice & Tonalität</label>
                            <textarea value={voice} onChange={e => setVoice(e.target.value)} rows={4} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]" placeholder="Beschreiben Sie den Sprachstil Ihrer Marke (z.B. professionell, aber zugänglich; humorvoll und direkt; inspirierend und elegant)..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Visuelle Identität</label>
                            <textarea value={visual} onChange={e => setVisual(e.target.value)} rows={4} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]" placeholder="Beschreiben Sie den visuellen Stil (z.B. minimalistisch, high-contrast; warm und organisch mit natürlichen Texturen; futuristisch mit Neon-Akzenten)..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Markenfarben</label>
                            <input type="text" value={colors} onChange={e => setColors(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]" placeholder="z.B. #FFFFFF, #0A0A0A, #8A2BE2" />
                            <p className="text-xs text-gray-500 mt-1">Farbwerte mit Komma trennen.</p>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleSaveSettings} className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm">Speichern</button>
                        </div>
                    </div>
                )}
                
                {(activeTab === 'textCheck' || activeTab === 'imageCheck') && (
                     <div className="grid md:grid-cols-2 gap-6 page-fade-in">
                        <div className="space-y-4">
                            {activeTab === 'textCheck' ? (
                                <>
                                    <h3 className="text-lg font-medium text-white">Text zur Prüfung</h3>
                                    <textarea value={checkText} onChange={e => setCheckText(e.target.value)} rows={10} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]" placeholder="Fügen Sie hier Ihren Text ein..." />
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-medium text-white">Bild zur Prüfung</h3>
                                    <div className="w-full aspect-square bg-[#0A0A0A] rounded-md border-2 border-dashed border-[#333333] flex items-center justify-center relative overflow-hidden">
                                       <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isChecking}/>
                                        {checkImage ? <img src={checkImage.preview} alt="Vorschau" className="w-full h-full object-contain" /> : <p className="text-sm text-gray-500">Bild hierher ziehen oder klicken</p>}
                                    </div>
                                </>
                            )}
                            <button onClick={handleCheck} disabled={isChecking || (activeTab === 'textCheck' && !checkText) || (activeTab === 'imageCheck' && !checkImage)} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                                {isChecking ? 'Prüfung läuft...' : 'Markenkonformität prüfen'}
                            </button>
                        </div>
                         <div className="bg-[#0A0A0A] rounded-lg border border-[#333333] p-4">
                            <h3 className="text-lg font-medium text-white mb-2">Analyseergebnis (Gemini 3.0)</h3>
                            <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                                {isChecking && <p className="animate-pulse">Analysiere Asset...</p>}
                                {checkResult && <div dangerouslySetInnerHTML={{ __html: checkResult.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\* (.*)/g, '<li>$1</li>') }} />}
                            </div>
                        </div>
                     </div>
                )}

                {activeTab === 'rewrite' && (
                    <div className="grid md:grid-cols-2 gap-6 page-fade-in h-[600px]">
                        {/* Left: Input */}
                        <div className="flex flex-col space-y-4 h-full">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-white">Original Text</h3>
                                <select 
                                    value={rewriteTone} 
                                    onChange={e => setRewriteTone(e.target.value)} 
                                    className="bg-[#0A0A0A] text-white text-xs border border-[#333333] rounded px-2 py-1 focus:outline-none"
                                >
                                    <option value="Standard">Standard (Brand Voice)</option>
                                    <option value="More Professional">Professioneller</option>
                                    <option value="More Empathetic">Empathischer</option>
                                    <option value="Action-Oriented">Handlungsorientiert</option>
                                    <option value="Concise">Prägnanter</option>
                                </select>
                            </div>
                            <textarea 
                                value={textToRewrite} 
                                onChange={e => setTextToRewrite(e.target.value)} 
                                className="flex-1 w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-md border border-[#333333] focus:border-purple-500 outline-none resize-none" 
                                placeholder="Fügen Sie hier den rohen Text ein..." 
                            />
                            <button onClick={handleRewrite} disabled={isRewriting || !textToRewrite.trim()} className="w-full bg-purple-600 text-white py-3 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-purple-500 transition-colors flex items-center justify-center gap-2">
                                {isRewriting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>Text optimieren</span>}
                            </button>
                        </div>

                        {/* Right: Output */}
                        <div className="flex flex-col space-y-4 h-full">
                            <h3 className="text-lg font-medium text-white">Optimierter Text</h3>
                            <div className="flex-1 w-full bg-[#0A0A0A] rounded-md border border-[#333333] p-4 overflow-y-auto relative group">
                                {isRewriting ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-xs text-purple-400 animate-pulse">Appliziere Brand Voice...</p>
                                        </div>
                                    </div>
                                ) : rewrittenText ? (
                                    <textarea 
                                        value={rewrittenText} 
                                        onChange={e => setRewrittenText(e.target.value)}
                                        className="w-full h-full bg-transparent text-gray-300 outline-none resize-none border-none p-0 focus:ring-0"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-600 italic text-sm">
                                        Das Ergebnis erscheint hier...
                                    </div>
                                )}
                            </div>
                            {rewrittenText && (
                                <button onClick={() => {navigator.clipboard.writeText(rewrittenText); setToastMessage("Text kopiert!")}} className="w-full border border-white/10 text-white py-3 rounded-full text-sm hover:bg-white/10 transition-colors">
                                    Übernehmen & Kopieren
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
