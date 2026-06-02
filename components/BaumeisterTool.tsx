import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Toast } from './Toast';

// --- ICONS ---
const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CodeBracketIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
const DevicePhoneMobileIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const ComputerDesktopIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M15 3h4.5a2.25 2.25 0 012.25 2.25v4.5" /></svg>;
const XMarkIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const PaintBrushIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m7.704 4.252a15.998 15.998 0 00-3.388-1.622m-5.043-.025a15.998 15.998 0 01-1.622-3.385m-1.622 3.385a15.998 15.998 0 013.388 1.622m5.043.025a15.998 15.998 0 003.388 1.622m-1.622-3.385a15.998 15.998 0 00-3.388-1.622m-3.388 1.622a15.998 15.998 0 011.622 3.385" /></svg>;

// --- TYPES ---
type Theme = 'modern' | 'minimal' | 'brutalist';

interface PageSection {
    type: 'hero' | 'features' | 'testimonial' | 'cta';
    title?: string;
    subtitle?: string;
    content?: string;
    cta_text?: string;
    items?: { title: string; description: string; }[];
    testimonial?: { quote: string; author: string; role: string; };
}

interface PageStructure {
    sections: PageSection[];
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-gray-700/50 rounded-lg"></div>
        <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
        </div>
        <div className="h-32 bg-gray-700/50 rounded-lg"></div>
    </div>
);

// --- THEME STYLES ---
const getThemeStyles = (theme: Theme) => {
    switch (theme) {
        case 'minimal':
            return {
                container: 'bg-black text-white font-serif',
                button: 'border border-white bg-transparent hover:bg-white hover:text-black rounded-none px-8 py-3 transition-all text-sm tracking-widest uppercase',
                card: 'border border-gray-800 p-6',
                iconBg: 'text-white mb-4',
                accentText: 'text-gray-400',
                heroGradient: 'bg-black',
                sectionPadding: 'py-24'
            };
        case 'brutalist':
            return {
                container: 'bg-[#111] text-green-400 font-mono',
                button: 'bg-green-400 text-black border-2 border-green-400 hover:bg-transparent hover:text-green-400 px-8 py-3 font-bold uppercase shadow-[4px_4px_0px_rgba(74,222,128,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all',
                card: 'border-2 border-gray-700 bg-gray-900 p-6 shadow-[4px_4px_0px_#333]',
                iconBg: 'text-green-400 mb-4 border-2 border-green-400 w-12 h-12 flex items-center justify-center',
                accentText: 'text-green-600',
                heroGradient: 'bg-[#111] border-b-4 border-green-900',
                sectionPadding: 'py-20'
            };
        case 'modern':
        default:
            return {
                container: 'bg-gray-900 text-white font-sans',
                button: 'bg-white text-black px-8 py-3 rounded-full font-medium text-base hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg shadow-white/10',
                card: 'bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm',
                iconBg: 'w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4',
                accentText: 'text-purple-400',
                heroGradient: 'bg-gradient-to-b from-gray-800/50 to-transparent',
                sectionPadding: 'py-20'
            };
    }
};

// --- RENDERER COMPONENTS ---
const HeroSection: React.FC<{ section: PageSection; theme: Theme }> = ({ section, theme }) => {
    const styles = getThemeStyles(theme);
    return (
        <div className={`text-center px-6 ${styles.sectionPadding} ${styles.heroGradient}`}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{section.title}</h1>
            <p className={`max-w-2xl mx-auto text-lg mb-8 ${theme === 'brutalist' ? 'text-green-400/80' : 'text-gray-300'}`}>{section.subtitle}</p>
            {section.cta_text && <button className={styles.button}>{section.cta_text}</button>}
        </div>
    );
};

const FeaturesSection: React.FC<{ section: PageSection; theme: Theme }> = ({ section, theme }) => {
    const styles = getThemeStyles(theme);
    return (
        <div className={`px-6 ${styles.sectionPadding}`}>
            {section.title && <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {(section.items || []).map((item, i) => (
                    <div key={i} className={`text-center ${styles.card}`}>
                        <div className={styles.iconBg}>{theme === 'brutalist' ? <div className="w-6 h-6 bg-green-400"></div> : <CheckIcon />}</div>
                        <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                        <p className={`text-sm ${theme === 'brutalist' ? 'text-green-400/70' : 'text-gray-400'}`}>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TestimonialSection: React.FC<{ section: PageSection; theme: Theme }> = ({ section, theme }) => {
    const styles = getThemeStyles(theme);
    return (
        <div className={`px-6 ${styles.sectionPadding} ${theme === 'modern' ? 'bg-white/5' : theme === 'brutalist' ? 'border-y-2 border-green-900' : ''}`}>
            <div className={`max-w-3xl mx-auto text-center ${theme === 'minimal' ? 'border-l-4 border-white pl-8 py-4' : ''}`}>
                {theme !== 'minimal' && <div className="mx-auto mb-6 opacity-50"><UserIcon /></div>}
                <p className="text-xl md:text-2xl italic mb-6 leading-relaxed">"{section.testimonial?.quote}"</p>
                <div>
                    <p className="font-bold">{section.testimonial?.author}</p>
                    <p className={`text-sm ${styles.accentText}`}>{section.testimonial?.role}</p>
                </div>
            </div>
        </div>
    );
};

const CtaSection: React.FC<{ section: PageSection; theme: Theme }> = ({ section, theme }) => {
    const styles = getThemeStyles(theme);
    return (
        <div className={`text-center px-6 ${styles.sectionPadding}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
            <p className={`mt-4 max-w-xl mx-auto mb-8 ${theme === 'brutalist' ? 'text-green-400/80' : 'text-gray-400'}`}>{section.content}</p>
            {section.cta_text && <button className={styles.button}>{section.cta_text}</button>}
        </div>
    );
};


export const BaumeisterTool: React.FC = () => {
    const [description, setDescription] = useState('Eine Landing Page für ein neues KI-gestütztes Headless CMS namens "Quantum". Zielgruppe sind Entwickler und Content Manager. USP: extreme Geschwindigkeit und nahtlose Integration in Framer & n8n.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageStructure, setPageStructure] = useState<PageStructure | null>(null);
    
    // View & Code Export State
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [theme, setTheme] = useState<Theme>('modern');
    const [showCode, setShowCode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const pageSchema = {
        type: Type.OBJECT,
        properties: {
            sections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['hero', 'features', 'testimonial', 'cta'] },
                        title: { type: Type.STRING },
                        subtitle: { type: Type.STRING },
                        content: { type: Type.STRING },
                        cta_text: { type: Type.STRING },
                        items: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } },
                        testimonial: { type: Type.OBJECT, properties: { quote: { type: Type.STRING }, author: { type: Type.STRING }, role: { type: Type.STRING } } }
                    }
                }
            }
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setPageStructure(null);

        const prompt = `Act as an expert web designer and copywriter. Create a structure for a modern, high-converting landing page based on the following description.
        Description: "${description}"
        
        IMPORTANT: Write compelling, production-ready marketing copy for all fields using Gemini 3.0 Intelligence. Do not use placeholders like "Lorem Ipsum".
        - Hero Title: Catchy and value-driven.
        - Hero Subtitle: Explanatory and persuasive.
        - Features: 3 key benefits with clear descriptions.
        - Testimonial: A realistic, glowing review.
        - CTA: Strong action verb.

        Generate a sequence of sections: start with a 'hero', followed by 'features', then a 'testimonial', and end with a 'cta'.
        Respond ONLY with a JSON object that adheres to the schema.`;
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to 3.0
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: pageSchema }
            });
            setPageStructure(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("Seitenstruktur konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCode = async () => {
        if (!pageStructure) return;
        setShowCode(true);
        // Always regenerate to match current theme
        
        setIsGeneratingCode(true);
        const prompt = `Act as a Senior Frontend Engineer. Convert the following Landing Page JSON structure into a single, production-ready React component using Tailwind CSS. Use Gemini 3.0 coding capabilities for clean, efficient code.
        
        Structure:
        ${JSON.stringify(pageStructure)}
        
        Theme Style: ${theme.toUpperCase()}
        - If MODERN: Use gradients, rounded-lg, sans-serif, dark gray backgrounds.
        - If MINIMAL: Use black and white, serif fonts, sharp borders, no shadows.
        - If BRUTALIST: Use neon green (#4ade80) and black, mono fonts, heavy borders, hard shadows.
        
        Requirements:
        - The output should be the full code block starting with 'import React from "react";'.
        - Do not include markdown backticks.
        `;
        
        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to 3.0
                contents: prompt,
            });
            setGeneratedCode(response.text.replace(/```jsx|```tsx|```/g, ''));
        } catch (e) {
            setGeneratedCode("// Fehler bei der Code-Generierung. Bitte versuchen Sie es erneut.");
        } finally {
            setIsGeneratingCode(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(generatedCode);
        setToastMessage("Code in die Zwischenablage kopiert!");
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="space-y-8">
                <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Seitenbeschreibung</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm" />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                        {isLoading ? 'Entwirft...' : 'Landing Page entwerfen'}
                    </button>
                </div>

                <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] shadow-2xl max-w-6xl mx-auto relative overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-black/50 rounded-t-lg p-3 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5 mr-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span></div>
                            <div className="flex items-center bg-[#0A0A0A] rounded-md border border-white/10 p-1 gap-1">
                                <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded transition-colors ${viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`} title="Desktop Ansicht"><ComputerDesktopIcon /></button>
                                <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded transition-colors ${viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`} title="Mobile Ansicht"><DevicePhoneMobileIcon /></button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <div className="flex items-center bg-[#0A0A0A] rounded-md border border-white/10 p-1 gap-1">
                                <span className="text-[10px] text-gray-500 px-2 flex items-center gap-1"><PaintBrushIcon /> Theme:</span>
                                {(['modern', 'minimal', 'brutalist'] as Theme[]).map(t => (
                                    <button key={t} onClick={() => setTheme(t)} className={`px-2 py-1 text-xs rounded transition-colors capitalize ${theme === t ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <button onClick={handleGenerateCode} disabled={!pageStructure} className="flex items-center gap-2 text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded hover:bg-purple-600/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                <CodeBracketIcon />
                                <span className="hidden sm:inline">Code Export</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Canvas */}
                    <div className="bg-[#0A0A0A] rounded-b-lg overflow-hidden min-h-[400px] flex justify-center p-4 md:p-8 bg-grid-pattern">
                        {isLoading && <div className="w-full max-w-4xl"><SkeletonLoader /></div>}
                        {error && <p className="text-center text-red-400">{error}</p>}
                        
                        {!isLoading && !error && pageStructure && (
                            <div 
                                className={`shadow-2xl transition-all duration-500 ease-in-out origin-top overflow-hidden ${viewMode === 'mobile' ? 'w-[375px] rounded-3xl border-4 border-[#333]' : 'w-full rounded-lg border border-white/5'} ${getThemeStyles(theme).container}`}
                            >
                                <div className={`overflow-y-auto h-full max-h-[800px] scrollbar-hide ${viewMode === 'mobile' ? 'rounded-[20px]' : ''}`}>
                                    <div className="page-fade-in">
                                        {pageStructure.sections.map((section, i) => {
                                            switch (section.type) {
                                                case 'hero': return <HeroSection key={i} section={section} theme={theme} />;
                                                case 'features': return <FeaturesSection key={i} section={section} theme={theme} />;
                                                case 'testimonial': return <TestimonialSection key={i} section={section} theme={theme} />;
                                                case 'cta': return <CtaSection key={i} section={section} theme={theme} />;
                                                default: return null;
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code Overlay */}
                    {showCode && (
                        <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl z-50 flex flex-col p-6 animate-[fadeIn_0.2s_ease-out]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-mono text-purple-400">SOURCE_CODE.tsx</h3>
                                <div className="flex gap-4">
                                    <button onClick={handleCopyCode} className="text-xs text-white hover:text-purple-400">Kopieren</button>
                                    <button onClick={() => setShowCode(false)} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                                </div>
                            </div>
                            <div className="flex-1 bg-[#111] rounded-lg border border-white/10 p-4 overflow-auto font-mono text-xs text-gray-300 relative">
                                {isGeneratingCode ? (
                                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500">Kompiliere {theme.toUpperCase()} React-Komponente mit Gemini 3.0...</p>
                                    </div>
                                ) : (
                                    <pre>{generatedCode}</pre>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
