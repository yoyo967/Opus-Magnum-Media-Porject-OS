import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';
import { buildMirrouContext } from '../tenants';
import OutputActions from './OutputActions';

// Serialisiert ein Brief-Objekt zu Markdown (für Copy/Download/PDF/Workspace/Task).
const briefToMarkdown = (b: any): string => {
  if (!b) return '';
  const out: string[] = [`# Creative Brief — ${b.brand_name || ''}`.trim()];
  if (b.campaign_goal) out.push('', '## Kampagnen-Ziel', b.campaign_goal);
  if (b.target_audience) out.push('', '## Zielgruppe', b.target_audience);
  if (b.ai_level) out.push('', '## AI-Einsatz-Level', `**${b.ai_level.level || ''}** — ${b.ai_level.rationale || ''}`);
  if (b.hooks?.length) {
    out.push('', '## Hook-Hypothesen');
    b.hooks.forEach((h: any, i: number) => {
      out.push('', `### Hook ${i + 1}${h.hook_type ? ` — ${h.hook_type}` : ''}`);
      if (h.visual_idea) out.push(`**Visual:** ${h.visual_idea}`);
      if (h.copy_text) out.push(`**Copy:** ${h.copy_text}`);
      if (h.rationale) out.push(`**Rationale:** ${h.rationale}`);
    });
  }
  if (b.stages?.length) {
    out.push('', '## Execution Stages');
    b.stages.forEach((s: any) => out.push(`- **${s.stage || ''}:** ${s.description || ''}`));
  }
  if (b.formats?.length) {
    out.push('', '## Format Specs');
    b.formats.forEach((f: any) => out.push(`- **${f.channel || ''}:** ${f.specs || ''}`));
  }
  if (b.compliance_check) {
    out.push('', '## Compliance (HCVO & EU AI Act)');
    if (b.compliance_check.hcvo_risk) out.push(`**HCVO-Risiko:** ${b.compliance_check.hcvo_risk}`);
    const badges = b.compliance_check.ai_act_required_badges;
    if (badges?.length) out.push(`**AI-Act-Badges:** ${badges.join(', ')}`);
  }
  return out.join('\n');
};

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
    const [activeMode, setActiveMode] = useState<'brief-engine' | 'page-builder'>('brief-engine');
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

    // Creative Brief Engine State
    const [briefBrand, setBriefBrand] = useState('LumiSkin Berlin');
    const [briefGoal, setBriefGoal] = useState('Launch eines biolumineszenten Serum-Visual-Systems im DACH-Raum für die Zielgruppe 25-40.');
    const [briefBudget, setBriefBudget] = useState('10-30k');
    const [briefAiLevel, setBriefAiLevel] = useState('AI-Assisted');
    const [briefData, setBriefData] = useState<any | null>(null);
    const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

    // L3 chain target: a Lead (or any source) can prefill the Creative Brief
    // via setToolInput({ tool: 'baumeister', prompt, fields:{brand} }).
    const { toolInput } = useTasks();
    useEffect(() => {
        if (toolInput?.tool === 'baumeister') {
            setActiveMode('brief-engine');
            if (toolInput.fields?.brand) setBriefBrand(toolInput.fields.brand);
            if (toolInput.prompt) setBriefGoal(toolInput.prompt);
        }
    }, [toolInput]);

    const briefSchema = {
        type: Type.OBJECT,
        properties: {
            brand_name: { type: Type.STRING },
            campaign_goal: { type: Type.STRING },
            target_audience: { type: Type.STRING },
            stages: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        stage: { type: Type.STRING },
                        description: { type: Type.STRING }
                    }
                }
            },
            hooks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        hook_type: { type: Type.STRING },
                        visual_idea: { type: Type.STRING },
                        copy_text: { type: Type.STRING },
                        rationale: { type: Type.STRING }
                    }
                }
            },
            formats: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        channel: { type: Type.STRING },
                        specs: { type: Type.STRING }
                    }
                }
            },
            ai_level: {
                type: Type.OBJECT,
                properties: {
                    level: { type: Type.STRING },
                    rationale: { type: Type.STRING }
                }
            },
            compliance_check: {
                type: Type.OBJECT,
                properties: {
                    hcvo_risk: { type: Type.STRING },
                    ai_act_required_badges: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    };

    const handleGenerateBrief = async () => {
        setIsGeneratingBrief(true);
        setError(null);
        setBriefData(null);

        const prompt = `Du bist die Creative Brief Engine von Mirrou.
        Erstelle ein detailliertes Creative Briefing auf Deutsch basierend auf:
        - Marke: ${briefBrand}
        - Kampagnen-Ziel: ${briefGoal}
        - Werbebudget: ${briefBudget}
        - KI-Einsatz-Ebene: ${briefAiLevel}

        System-Instruktion:
        ${buildMirrouContext('baumeister')}

        Befolge alle Design- und Strukturrichtlinien. Antworte ausschließlich mit dem JSON-Schema.`;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: briefSchema }
            });
            setBriefData(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("Creative Briefing konnte nicht generiert werden.");
        } finally {
            setIsGeneratingBrief(false);
        }
    };

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
        
        IMPORTANT: Write compelling, production-ready marketing copy for all fields using Gemini 2.5 Pro Intelligence. Do not use placeholders like "Lorem Ipsum".
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
        const prompt = `Act as a Senior Frontend Engineer. Convert the following Landing Page JSON structure into a single, production-ready React component using Tailwind CSS. Use Gemini 2.5 Pro coding capabilities for clean, efficient code.
        
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
                {/* Mode Selector */}
                <div className="flex justify-center">
                    <div className="bg-[#1C1C1C] p-1.5 rounded-full border border-[#333333] flex gap-1">
                        <button
                            onClick={() => setActiveMode('brief-engine')}
                            className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeMode === 'brief-engine' ? 'bg-[#C8A25A] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Creative Brief Engine
                        </button>
                        <button
                            onClick={() => setActiveMode('page-builder')}
                            className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeMode === 'page-builder' ? 'bg-[#C8A25A] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Landing Page Architect
                        </button>
                    </div>
                </div>

                {activeMode === 'brief-engine' ? (
                    /* Creative Brief Engine UI */
                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start font-sans text-white">
                        {/* Input Panel */}
                        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-1 border-b border-[#333333] pb-2">Briefing Inputs</h3>
                                <p className="text-xs text-gray-400">Geben Sie die Parameter für die Kampagne ein.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider">Markenname</label>
                                    <input 
                                        type="text"
                                        value={briefBrand} 
                                        onChange={e => setBriefBrand(e.target.value)} 
                                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider">Kampagnen-Ziel & Zielgruppe</label>
                                    <textarea 
                                        value={briefGoal} 
                                        onChange={e => setBriefGoal(e.target.value)} 
                                        rows={4}
                                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none resize-none" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider">Werbebudget</label>
                                        <select 
                                            value={briefBudget}
                                            onChange={e => setBriefBudget(e.target.value)}
                                            className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none"
                                        >
                                            <option value="10-30k">10k - 30k €</option>
                                            <option value="30-100k">30k - 100k €</option>
                                            <option value="100-250k">100k - 250k €</option>
                                            <option value="250k+">250k+ €</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-300 block mb-1.5 uppercase tracking-wider">KI-Ebene</label>
                                        <select 
                                            value={briefAiLevel}
                                            onChange={e => setBriefAiLevel(e.target.value)}
                                            className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded border border-[#333333] text-sm focus:border-[#C8A25A] focus:outline-none"
                                        >
                                            <option value="Pure AI">Pure AI</option>
                                            <option value="AI-Assisted">AI-Assisted</option>
                                            <option value="Human-Crafted">Human-Crafted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerateBrief} 
                                disabled={isGeneratingBrief} 
                                className="w-full bg-[#C8A25A] text-black py-2.5 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#D4B370] transition-colors disabled:opacity-50"
                            >
                                {isGeneratingBrief ? 'Generiere Brief...' : 'Briefing generieren'}
                            </button>
                            
                            {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
                        </div>

                        {/* Output Panel / Canvas */}
                        <div className="lg:col-span-2 bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 min-h-[500px]">
                            {isGeneratingBrief ? (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
                                    <div className="w-10 h-10 border-2 border-[#C8A25A] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">Generiere D2C Creative Brief mit Gemini...</p>
                                </div>
                            ) : briefData ? (
                                <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
                                    {/* Header & Meta */}
                                    <div className="border-b border-[#333333] pb-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] bg-[#C8A25A]/10 text-[#C8A25A] border border-[#C8A25A]/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">Mirrou Creative Brief</span>
                                                <h2 className="text-2xl font-bold text-white mt-2">{briefData.brand_name}</h2>
                                                <p className="text-xs text-gray-400 mt-1"><span className="text-gray-500">Zielgruppe:</span> {briefData.target_audience}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-500 block uppercase tracking-wider">AI Integration Level</span>
                                                <span className="text-sm font-semibold text-[#F2EFE9]">{briefData.ai_level?.level}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-[#0A0A0A] border border-[#222222] p-4 rounded text-sm text-gray-300">
                                            <span className="text-xs text-gray-500 block mb-1 uppercase tracking-wider font-semibold">Kampagnen-Ziel:</span>
                                            {briefData.campaign_goal}
                                        </div>
                                    </div>

                                    {/* Hook Hypotheses */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-4 border-l-2 border-[#C8A25A] pl-2 font-mono">1. Hook-Hypothesen</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {briefData.hooks?.map((hook: any, idx: number) => (
                                                <div key={idx} className="bg-[#0A0A0A] border border-[#333333] rounded p-4 space-y-3 hover:border-[#C8A25A]/40 transition-colors">
                                                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                                                        <span className="text-xs font-bold text-[#F2EFE9]">{hook.hook_type}</span>
                                                        <span className="text-[10px] text-gray-500">Hook #{idx+1}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Visual Idea</span>
                                                        <p className="text-xs text-gray-300 mt-0.5">{hook.visual_idea}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Copy Text</span>
                                                        <p className="text-xs text-[#F2EFE9] font-serif italic mt-0.5">"{hook.copy_text}"</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Rationale</span>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">{hook.rationale}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Execution Stages */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-4 border-l-2 border-[#C8A25A] pl-2 font-mono">2. Execution Stages</h4>
                                        <div className="relative pl-6 border-l border-[#333333] space-y-6">
                                            {briefData.stages?.map((stage: any, idx: number) => (
                                                <div key={idx} className="relative">
                                                    <span className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-[#0A0A0A] border border-[#C8A25A] flex items-center justify-center text-[9px] font-bold text-[#C8A25A]">
                                                        {idx + 1}
                                                    </span>
                                                    <h5 className="text-xs font-bold text-white">{stage.stage}</h5>
                                                    <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Formats & AI Level */}
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[#333333]">
                                        <div>
                                            <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-3 font-mono">3. Format Specs</h4>
                                            <div className="space-y-2">
                                                {briefData.formats?.map((format: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center bg-[#0A0A0A] border border-[#222222] px-3 py-2 rounded text-xs">
                                                        <span className="font-bold text-[#F2EFE9]">{format.channel}</span>
                                                        <span className="text-gray-400">{format.specs}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-[#C8A25A] uppercase tracking-widest mb-3 font-mono">4. AI Rationale & Level</h4>
                                            <div className="bg-[#0A0A0A] border border-[#222222] p-4 rounded text-xs space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Empfohlenes Level:</span>
                                                    <span className="font-bold text-white">{briefData.ai_level?.level}</span>
                                                </div>
                                                <p className="text-gray-400 leading-relaxed">{briefData.ai_level?.rationale}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compliance Check Card */}
                                    <div className="bg-yellow-950/20 border border-yellow-800/40 rounded p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider font-mono">HCVO & AI Act Pre-Check</h4>
                                        </div>
                                        <div className="text-xs space-y-2">
                                            <p className="text-gray-300"><span className="text-yellow-600 font-semibold">Erkannte HCVO-Risiken:</span> {briefData.compliance_check?.hcvo_risk}</p>
                                            <div className="flex flex-wrap gap-2 items-center mt-2">
                                                <span className="text-[10px] text-gray-500">Erforderliche Badges (EU AI Act):</span>
                                                {briefData.compliance_check?.ai_act_required_badges?.map((badge: string, idx: number) => (
                                                    <span key={idx} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-mono text-[9px] uppercase">{badge}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <OutputActions
                                        content={briefToMarkdown(briefData)}
                                        title={`Creative Brief – ${briefData.brand_name || briefBrand}`}
                                        category="strategy"
                                        chainTargets={[
                                            { tool: 'visionar', label: 'Visual (Visionär)', prompt: briefData.hooks?.[0]?.visual_idea || briefToMarkdown(briefData) },
                                            { tool: 'markenwaechter', label: 'Brand-Check', prompt: briefToMarkdown(briefData) },
                                            { tool: 'auditor', label: 'Compliance', prompt: briefToMarkdown(briefData) },
                                        ]}
                                    />
                                </div>
                            ) : (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-600 mb-3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                    <h4 className="text-sm font-semibold text-white">Kein Briefing geladen</h4>
                                    <p className="text-xs text-gray-500 mt-1 max-w-sm">Geben Sie links die Details ein und klicken Sie auf "Briefing generieren".</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Page Builder UI (Original) */
                    <>
                        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-4xl mx-auto space-y-4 font-sans text-white">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Seitenbeschreibung</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm" />
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50 font-sans">
                                {isLoading ? 'Entwirft...' : 'Landing Page entwerfen'}
                            </button>
                        </div>

                        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] shadow-2xl max-w-6xl mx-auto relative overflow-hidden font-sans text-white">
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
                                        <span className="text-[10px] text-gray-500 px-2 flex items-center gap-1 font-sans"><PaintBrushIcon /> Theme:</span>
                                        {(['modern', 'minimal', 'brutalist'] as Theme[]).map(t => (
                                            <button key={t} onClick={() => setTheme(t)} className={`px-2 py-1 text-xs rounded transition-colors capitalize font-sans ${theme === t ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    <button onClick={handleGenerateCode} disabled={!pageStructure} className="flex items-center gap-2 text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded hover:bg-purple-600/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-sans">
                                        <CodeBracketIcon />
                                        <span className="hidden sm:inline">Code Export</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Canvas */}
                            <div className="bg-[#0A0A0A] rounded-b-lg overflow-hidden min-h-[400px] flex justify-center p-4 md:p-8 bg-grid-pattern">
                                {isLoading && <div className="w-full max-w-4xl"><SkeletonLoader /></div>}
                                {error && <p className="text-center text-red-400 font-sans">{error}</p>}
                                
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
                                <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl z-50 flex flex-col p-6 animate-[fadeIn_0.2s_ease-out] font-sans">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-mono text-purple-400">SOURCE_CODE.tsx</h3>
                                        <div className="flex gap-4">
                                            <button onClick={handleCopyCode} className="text-xs text-white hover:text-purple-400 font-sans">Kopieren</button>
                                            <button onClick={() => setShowCode(false)} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-[#111] rounded-lg border border-white/10 p-4 overflow-auto font-mono text-xs text-gray-300 relative">
                                        {isGeneratingCode ? (
                                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500">Kompiliere {theme.toUpperCase()} React-Komponente mit Gemini...</p>
                                            </div>
                                        ) : (
                                            <pre>{generatedCode}</pre>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
