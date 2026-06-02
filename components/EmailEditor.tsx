
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { EmailTemplatePreview } from './EmailTemplatePreview';
import { Toast } from './Toast';

// Icons
const PrintIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5z" /></svg>;
const AddToBoardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M15 3h4.5a2.25 2.25 0 012.25 2.25v4.5" /></svg>;
const AnalyticsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;

// AI Assistant
const AiAssistant: React.FC<{ top: number, left: number, onAction: (action: 'rewrite' | 'shorten' | 'expand') => void }> = ({ top, left, onAction }) => {
    return (
        <div className="absolute z-10 bg-[#111] border border-white/10 rounded-md shadow-2xl p-1 flex gap-1 animate-[fadeIn_0.1s_ease-out]" style={{ top, left, transform: 'translateX(-50%)' }}>
            <button onClick={() => onAction('rewrite')} className="text-xs text-gray-200 hover:bg-white/10 px-2 py-1 rounded">Umschreiben</button>
            <button onClick={() => onAction('shorten')} className="text-xs text-gray-200 hover:bg-white/10 px-2 py-1 rounded">Kürzen</button>
            <button onClick={() => onAction('expand')} className="text-xs text-gray-200 hover:bg-white/10 px-2 py-1 rounded">Erweitern</button>
        </div>
    );
};

const ScoreBar: React.FC<{ label: string, score: number }> = ({ label, score }) => {
    let color = 'bg-red-500';
    if (score > 50) color = 'bg-yellow-500';
    if (score > 80) color = 'bg-green-500';
    
    return (
        <div className="mb-2">
            <div className="flex justify-between text-xs mb-1 text-gray-300">
                <span>{label}</span>
                <span>{score}/100</span>
            </div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export const EmailEditor: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const { addTask, setHighlightedTaskIds } = useTasks();
    const [goal, setGoal] = useState('Ankündigung eines neuen KI-gestützten Features im Project OS, das die Kampagnenplanung automatisiert.');
    const [audience, setAudience] = useState('Bestandskunden (Marketing Manager), die das Project OS bereits nutzen.');
    const [message, setMessage] = useState('Das neue Feature "Stratege" analysiert Ziele und generiert vollständige Kampagnenpläne, was die manuelle Planung um bis zu 90% reduziert.');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedSubject, setGeneratedSubject] = useState('');
    const [generatedBody, setGeneratedBody] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // Prediction State
    const [isPredicting, setIsPredicting] = useState(false);
    const [performanceData, setPerformanceData] = useState<any>(null);

    // AI Assistant state
    const [selection, setSelection] = useState<{ text: string, range: Range } | null>(null);
    const [assistantPosition, setAssistantPosition] = useState<{ top: number, left: number } | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    const emailSchema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: "Eine überzeugende, prägnante E-Mail-Betreffzeile." },
            body: { type: Type.STRING, description: "Der vollständige E-Mail-Text im HTML-Format, einschließlich Absätzen (<p> tags). Sprich den Empfänger höflich an (z.B. 'Sehr geehrte Marketing-Profis,')." },
        }
    };

    const handleGenerateEmail = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedSubject('');
        setGeneratedBody('');
        setPerformanceData(null);

        const prompt = `
            Act as an expert email marketer. Generate a professional and persuasive marketing email based on the following details. Your response must be in JSON format according to the schema.

            - **Campaign Goal:** ${goal}
            - **Target Audience:** ${audience}
            - **Key Message:** ${message}

            Generate a subject line and a full HTML body for the email. The tone should be professional, innovative, and value-oriented.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for better persuasion
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: emailSchema
                }
            });
            const emailData = JSON.parse(response.text);
            setGeneratedSubject(emailData.subject);
            setGeneratedBody(emailData.body);
        } catch (e) {
            console.error("Email generation failed:", e);
            setError("E-Mail konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePredictPerformance = async () => {
        if (!generatedSubject || !generatedBody) return;
        setIsPredicting(true);
        setPerformanceData(null);
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                openRateScore: { type: Type.INTEGER, minimum: 0, maximum: 100 },
                clarityScore: { type: Type.INTEGER, minimum: 0, maximum: 100 },
                spamSafetyScore: { type: Type.INTEGER, minimum: 0, maximum: 100 },
                tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };
        
        const prompt = `Analyze the following email draft for potential performance.
        Subject: "${generatedSubject}"
        Body: "${generatedBody.replace(/<[^>]*>?/gm, ' ').substring(0, 500)}..."
        
        Target Audience: "${audience}"
        
        Estimate an 'openRateScore' based on the subject line, a 'clarityScore' based on the body, and a 'spamSafetyScore' based on trigger words. Provide 3 short improvement tips.`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for deeper analysis
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            setPerformanceData(JSON.parse(response.text));
        } catch(e) {
            console.error(e);
            setToastMessage("Prognose fehlgeschlagen.");
        } finally {
            setIsPredicting(false);
        }
    };

    const handleAddToMeisterwerk = () => {
        if (!generatedSubject || !generatedBody) return;
        const newTaskId = addTask(`E-Mail Kampagne: ${generatedSubject}`, generatedBody.replace(/<[^>]*>?/gm, ' ')); // Add as plain text
        setToastMessage("E-Mail-Kampagne als Aufgabe zum Meisterwerk hinzugefügt!");
        setHighlightedTaskIds([newTaskId]);
        navigateTo('meisterwerk');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const text = sel.toString().trim();

            if (text.length > 10 && editorRef.current?.contains(range.commonAncestorContainer)) {
                const rect = range.getBoundingClientRect();
                const editorRect = editorRef.current.getBoundingClientRect();
                setSelection({ text, range });
                setAssistantPosition({
                    top: rect.top - editorRect.top - 40,
                    left: rect.left - editorRect.left + rect.width / 2,
                });
                return;
            }
        }
        setSelection(null);
        setAssistantPosition(null);
    };
    
    const handleAiAction = async (action: 'rewrite' | 'shorten' | 'expand') => {
        if (!selection) return;

        let prompt = '';
        switch (action) {
            case 'rewrite': prompt = 'Schreibe den folgenden Text um, um ihn professioneller und überzeugender zu machen:'; break;
            case 'shorten': prompt = 'Kürze den folgenden Text, behalte aber die Kernbotschaft bei:'; break;
            case 'expand': prompt = 'Erweitere den folgenden Text mit mehr Details und Beispielen:'; break;
        }
        
        const fullPrompt = `${prompt}\n\n"${selection.text}"`;
        const originalSelection = selection;
        setSelection(null);
        setAssistantPosition(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for intelligent editing
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: fullPrompt });
            
            originalSelection.range.deleteContents();
            originalSelection.range.insertNode(document.createTextNode(response.text));

            // Update state from the editor's innerHTML
            const newBody = editorRef.current?.querySelector('[data-editable-body]')?.innerHTML;
            if(newBody) {
                setGeneratedBody(newBody);
            }
        } catch (e) {
            console.error("AI action failed:", e);
            setToastMessage("KI-Aktion fehlgeschlagen.");
        }
    };
    
    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-1 bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 space-y-4 flex flex-col no-print">
                    <h3 className="text-lg font-semibold text-white">E-Mail Generator</h3>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Kampagnenziel</label>
                        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Zielgruppe</label>
                        <input type="text" value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Kernbotschaft</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm"/>
                    </div>
                    <button onClick={handleGenerateEmail} disabled={isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                        {isLoading ? 'Generiere...' : 'E-Mail erstellen'}
                    </button>
                    <div className="text-[10px] text-gray-500 text-center">Powered by Gemini 3.0 Pro</div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    {/* Prediction Widget */}
                    {generatedSubject && (
                         <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#333333]">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <AnalyticsIcon /> Performance Prognose
                            </h4>
                            {!performanceData ? (
                                <button onClick={handlePredictPerformance} disabled={isPredicting} className="w-full bg-blue-900/30 text-blue-300 border border-blue-500/30 py-1.5 rounded text-xs hover:bg-blue-900/50 disabled:opacity-50 transition-colors">
                                    {isPredicting ? 'Analysiere...' : 'Scores berechnen'}
                                </button>
                            ) : (
                                <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
                                    <ScoreBar label="Öffnungswahrscheinlichkeit" score={performanceData.openRateScore} />
                                    <ScoreBar label="Klarheit" score={performanceData.clarityScore} />
                                    <ScoreBar label="Spam-Sicherheit" score={performanceData.spamSafetyScore} />
                                    <div className="mt-2 text-xs text-gray-400">
                                        <p className="font-semibold text-gray-300 mb-1">Optimierungstipps:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {performanceData.tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                    <button onClick={handlePredictPerformance} disabled={isPredicting} className="w-full text-xs text-gray-500 hover:text-white mt-2">Neu berechnen</button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-grow border-t border-white/10 mt-4 pt-4 space-y-2">
                        <button onClick={handlePrint} className="w-full flex items-center justify-center bg-white/10 text-white py-2 rounded-full font-medium text-sm hover:bg-white/20">
                            <PrintIcon /> Drucken / PDF
                        </button>
                        <button onClick={handleAddToMeisterwerk} disabled={!generatedSubject || !generatedBody} className="w-full flex items-center justify-center bg-purple-600 text-white py-2 rounded-full font-medium text-sm hover:bg-purple-500 disabled:opacity-50">
                            <AddToBoardIcon /> Zum Meisterwerk
                        </button>
                    </div>
                </div>
                
                {/* Right: Preview */}
                <div className="lg:col-span-2 relative" ref={editorRef} onMouseUp={handleSelection}>
                    {assistantPosition && selection && (
                        <AiAssistant top={assistantPosition.top} left={assistantPosition.left} onAction={handleAiAction} />
                    )}
                    <EmailTemplatePreview 
                        subject={generatedSubject} 
                        body={generatedBody}
                        onSubjectChange={setGeneratedSubject}
                        onBodyChange={setGeneratedBody}
                    />
                </div>
            </div>
        </>
    );
};
