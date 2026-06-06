import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_KNOWLEDGE } from '@/tenants';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, CampaignBrief, Document, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

// --- ICONS ---
const VisionarIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>);
const KonversatorIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m3.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457.168-.928.23-1.402 1.151.84 2.563 1.34 4.042 1.34 4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.927 1.18 2.21 2.055 3.577 2.583" /></svg>);
const SchedulerIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>);
const PublishToAkademieIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m3 3V9" /></svg>);
const StrategeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.594-.484-1.078-1.078-1.078s-1.078.484-1.078 1.078v.323c-.353.055-.695.126-1.026.215a3.374 3.374 0 00-3.023 3.023c.089.33.16.673.215 1.026h.323c.594 0 1.078.484 1.078 1.078s-.484 1.078-1.078-1.078h-.323c-.055.353-.126.695-.215 1.026a3.374 3.374 0 003.023 3.023c.33.089.673.16 1.026.215v.323c0 .594.484 1.078 1.078 1.078s1.078-.484 1.078-1.078v-.323c.353-.055.695.126 1.026.215a3.374 3.374 0 003.023-3.023c.089-.33.16-.673.215-1.026h-.323c-.594 0-1.078-.484-1.078-1.078s.484-1.078 1.078-1.078h.323c.055-.353.126-.695.215-1.026a3.374 3.374 0 00-3.023-3.023c-.33-.089-.673-.16-1.026-.215v-.323z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);
const AddToBoardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h4.5M15 3h4.5a2.25 2.25 0 012.25 2.25v4.5" />
    </svg>
);
const InfoIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}> <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /> </svg> );


const ResultCard: React.FC<{title: string, children: React.ReactNode, color?: string}> = ({ title, children, color }) => (
    <div className={`bg-[#0A0A0A] p-4 rounded-lg border ${color === 'red' ? 'border-red-900/50 bg-red-900/10' : color === 'blue' ? 'border-blue-900/50 bg-blue-900/10' : 'border-[#333333]'}`}>
        <h4 className={`font-semibold text-sm mb-2 ${color === 'red' ? 'text-red-300' : color === 'blue' ? 'text-blue-300' : 'text-white'}`}>{title}</h4>
        <div className="text-gray-400 text-sm space-y-2">{children}</div>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-1/2"></div>
        <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
            <div className="h-24 bg-gray-700/50 rounded-lg"></div>
        </div>
         <div className="h-40 bg-gray-700/50 rounded-lg"></div>
    </div>
);

// --- AUTOMATION PLANNER MODAL ---
interface TaskProposal {
  id: string;
  title: string;
  description: string;
  recommendedTool?: string;
  suggestion: { icon: React.ReactNode; text: string };
  selected: boolean;
}

interface AutomationPlannerModalProps {
  campaign: CampaignBrief;
  onClose: () => void;
  onConfirm: (tasks: { title: string; description: string; recommendedTool?: string }[]) => void;
  isEmbedded?: boolean;
}

const AutomationPlannerModal: React.FC<AutomationPlannerModalProps> = ({ campaign, onClose, onConfirm, isEmbedded }) => {
    const [taskProposals, setTaskProposals] = useState<TaskProposal[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const proposals: TaskProposal[] = [];
        (campaign.keyVisuals || []).forEach((visual, i) => {
            proposals.push({
                id: `visual-${i}`,
                title: `Key Visual ${i + 1}: ${visual.substring(0, 20)}...`,
                description: `Creation task for Key Visual. Concept: "${visual}". Use Visionary to generate high-fidelity drafts.`,
                recommendedTool: 'visionar',
                suggestion: { icon: <VisionarIcon />, text: "Generate in Visionary" },
                selected: true,
            });
        });
        (campaign.socialMediaStrategy?.postExamples || []).forEach((post, i) => {
            proposals.push({
                id: `social-${i}`,
                title: `Social Post ${i + 1}`,
                description: `Draft and schedule social media post based on: "${post.substring(0, 50)}..."`,
                recommendedTool: 'resonator',
                suggestion: { icon: <SchedulerIcon />, text: "Create in Resonator" },
                selected: true,
            });
        });
        (campaign.emailMarketing?.subjectLines || []).forEach((subject, i) => {
            proposals.push({
                id: `email-${i}`,
                title: `Email Draft: ${subject}`,
                description: `Draft email body for subject: "${subject}". Target audience alignment required.`,
                recommendedTool: 'emailmarketing',
                suggestion: { icon: <KonversatorIcon />, text: "Draft in Email Marketing" },
                selected: true,
            });
        });
        setTaskProposals(proposals);
    }, [campaign]);

    const handleToggle = (id: string) => {
        setTaskProposals(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    };

    const handleConfirm = () => {
        const selectedTasks = taskProposals
            .filter(p => p.selected)
            .map(({ title, description, recommendedTool }) => ({ title, description, recommendedTool }));
        onConfirm(selectedTasks);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm page-fade-in`} onClick={handleBackdropClick}>
            <div ref={modalRef} className="bg-[#1C1C1C]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-medium text-white">Automation Planner</h3>
                    <p className="text-sm text-gray-400">Review and confirm the actionable tasks generated from your strategy.</p>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {taskProposals.map(proposal => (
                        <div key={proposal.id} className="bg-[#0A0A0A]/50 p-3 rounded-md border border-transparent has-[:checked]:border-purple-500/50 has-[:checked]:bg-purple-900/10 transition-all">
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={proposal.selected} onChange={() => handleToggle(proposal.id)} className="mt-1.5 h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600" />
                                <div className="flex-1">
                                    <p className="font-semibold text-white text-sm">{proposal.title}</p>
                                    <p className="text-gray-400 text-xs mt-1">{proposal.description}</p>
                                </div>
                            </div>
                            <div className="mt-2 pl-7 flex items-center gap-2 text-purple-300/80 text-xs">
                                {proposal.suggestion.icon}
                                <span>{proposal.suggestion.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <footer className="p-4 border-t border-white/10 flex justify-end gap-4">
                    <button onClick={onClose} className="border border-[#333333] text-[#F5F5F5] px-4 py-2 rounded-full font-medium text-sm hover:bg-[#2a2a2a] transition-colors">Cancel</button>
                    <button onClick={handleConfirm} className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-opacity-90">Confirm & Create Tasks</button>
                </footer>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
interface StrategeToolProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
  onStrategyFinalized?: () => void;
}

export const StrategeTool: React.FC<StrategeToolProps> = ({ navigateTo, isEmbedded, onStrategyFinalized }) => {
    const { addMultipleTasks, strategyBrief, setStrategyBrief, setCampaignBrief, optimizationContext, setOptimizationContext, addDocument, setWorkflowStep, advanceWorkflow, checkCredits, deductCredits } = useTasks();
    const [product, setProduct] = useState('Ein KI-gestütztes Headless CMS für Entwickler');
    const [audience, setAudience] = useState('Webentwickler und Content Manager, die schnelle, flexible und zukunftssichere Websites suchen.');
    const [goal, setGoal] = useState('Markteinführung & Lead-Generierung');
    const [usp, setUsp] = useState('Das einzige CMS, das speziell für moderne Dev-Workflows entwickelt wurde, mit direkter Integration in Framer & n8n.');

    const [campaign, setCampaign] = useState<CampaignBrief | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showAutomationPlanner, setShowAutomationPlanner] = useState(false);
    
    // Wargaming State
    const [competitorName, setCompetitorName] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [wargameResult, setWargameResult] = useState<{counterMove: string, defenseTactics: string[]} | null>(null);


    useEffect(() => {
        if (strategyBrief) {
            setProduct(strategyBrief.product);
            setAudience(strategyBrief.audience);
            setGoal(strategyBrief.goal);
            setUsp(strategyBrief.usp);
            if (!optimizationContext) {
                setToastMessage("Strategie-Kontext vom Conductor geladen!");
            }
        }
    }, [strategyBrief, optimizationContext]);

    const campaignSchema = {
        type: Type.OBJECT,
        properties: {
            campaignTitle: { type: Type.STRING, description: "Ein eingängiger und kreativer Titel für die Marketingkampagne." },
            slogan: { type: Type.STRING, description: "Ein kurzer, einprägsamer Slogan oder Tagline." },
            keyVisuals: { type: Type.ARRAY, description: "3 unterschiedliche, bildhafte Ideen für Key Visuals, die als Prompts für die Bildgenerierung genutzt werden können.", items: { type: Type.STRING } },
            socialMediaStrategy: {
                type: Type.OBJECT,
                properties: {
                    platforms: { type: Type.ARRAY, description: "Empfohlene Social Media Plattformen.", items: { type: Type.STRING } },
                    contentPillars: { type: Type.ARRAY, description: "3-4 thematische Hauptsäulen für den Content.", items: { type: Type.STRING } },
                    postExamples: { type: Type.ARRAY, description: "Zwei beispielhafte Social Media Posts.", items: { type: Type.STRING } },
                }
            },
            emailMarketing: {
                type: Type.OBJECT,
                properties: {
                    subjectLines: { type: Type.ARRAY, description: "Drei ansprechende Betreffzeilen für E-Mails.", items: { type: Type.STRING } },
                    sequenceIdea: { type: Type.STRING, description: "Eine kurze Idee für eine 3-teilige E-Mail-Sequenz." },
                }
            },
            kpis: { type: Type.ARRAY, description: "3-5 Key Performance Indicators (KPIs) zur Erfolgsmessung.", items: { type: Type.STRING } },
        }
    };

    const handleGenerateCampaign = async () => {
        const cost = COST_TABLE.COMPLEX_TEXT;
        if (!checkCredits(cost)) {
            setError(`Nicht genügend Credits. Strategie-Generierung benötigt ${cost} Credits.`);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setCampaign(null);
        setWargameResult(null);
        
        deductCredits(cost, 'Stratege Campaign Gen');

        const optimizationPrompt = optimizationContext
            ? `\nWICHTIG: Dies ist eine Re-Evaluierung. Optimiere die Strategie basierend auf folgender Zusammenfassung der Analyse: "${optimizationContext}"`
            : '';

        const prompt = `
Handle als erfahrener Chief Marketing Officer (CMO). Deine Aufgabe ist es, einen umfassenden, strategischen Marketing-Kampagnenplan zu erstellen, basierend auf den folgenden Details.

- Produkt/Kontext: ${product}
- Zielgruppe: ${audience}
- Kampagnenziel: ${goal}
- Unique Selling Proposition (USP): ${usp}
${optimizationPrompt}

Wenn der Nutzer eine Einzelperson (Interim Manager/Student) zu sein scheint, adaptiere eine "Personal Branding" Strategie.
Wenn es ein Produkt ist, adaptiere eine "Go-to-Market" Strategie.

Strukturiere die Strategie in Phasen, falls komplex.
Bitte generiere einen vollständigen Kampagnenplan, der strikt dem JSON-Schema folgt.
        `;

        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 2.5 Pro for better strategic planning
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', 
                contents: prompt,
                config: {
                    systemInstruction: MIRROU_KNOWLEDGE,
                    responseMimeType: "application/json",
                    responseSchema: campaignSchema
                }
            });

            const campaignData = JSON.parse(response.text);
            setCampaign(campaignData);

        } catch (e) {
            console.error("Error generating campaign:", e);
            setError("Kampagne konnte nicht generiert werden. Bitte überprüfe deine Eingaben oder versuche es später erneut.");
        } finally {
            setIsLoading(false);
            setOptimizationContext(null);
        }
    };
    
    const handleFinalizeStrategy = () => {
        if (!campaign) return;
        setCampaignBrief(campaign);
        setShowAutomationPlanner(true);
    };

    const handleConfirmAutomationPlan = (tasksToAdd: { title: string; description: string; recommendedTool?: string }[]) => {
        addMultipleTasks(tasksToAdd);
        setToastMessage('Action Plan erstellt & Tasks zum Board hinzugefügt!');
        setShowAutomationPlanner(false);
        
        // Advance Workflow State
        advanceWorkflow();
        
        if (onStrategyFinalized) {
            onStrategyFinalized();
        } else {
            navigateTo('meisterwerk');
        }
    };
    
    const handlePublishToAkademie = () => {
        if (!campaign) return;

        const content = `
# Campaign Playbook: ${campaign.campaignTitle}
*Slogan: "${campaign.slogan}"*

## 1. Key Visual Konzepte
${(campaign.keyVisuals || []).map(v => `- ${v}`).join('\n')}

## 2. Social Media Strategie
- **Plattformen:** ${(campaign.socialMediaStrategy?.platforms || []).join(', ')}
- **Content Pillars:**
${(campaign.socialMediaStrategy?.contentPillars || []).map(p => `  - ${p}`).join('\n')}
- **Post Beispiele:**
${(campaign.socialMediaStrategy?.postExamples || []).map(p => `  - *"${p}"*`).join('\n')}

## 3. E-Mail Marketing
- **Betreffzeilen Vorschläge:**
${(campaign.emailMarketing?.subjectLines || []).map(s => `  - ${s}`).join('\n')}
- **Sequenz Idee:** ${campaign.emailMarketing?.sequenceIdea}

## 4. Erfolgsmessung (KPIs)
${(campaign.kpis || []).map(k => `- ${k}`).join('\n')}
`;
        addDocument(`Campaign Playbook: ${campaign.campaignTitle}`, content.trim(), 'tactic');
        setToastMessage('Campaign Playbook in der Akademie veröffentlicht!');
    };

    const handleSimulateWargame = async () => {
        if (!campaign || !competitorName.trim()) return;
        
        const cost = COST_TABLE.COMPLEX_TEXT;
        if (!checkCredits(cost)) {
             setError(`Nicht genügend Credits für Simulation. Benötigt: ${cost}.`);
             return;
        }
        
        setIsSimulating(true);
        deductCredits(cost, 'Stratege Wargame Simulation');
        
        const wargameSchema = {
            type: Type.OBJECT,
            properties: {
                counterMove: { type: Type.STRING, description: "Beschreibung der wahrscheinlichen aggressiven Gegenstrategie des Wettbewerbers." },
                defenseTactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 defensive Taktiken, um unsere Kampagne zu schützen." }
            }
        };
        
        const prompt = `Führe eine kompetitive Wargaming-Simulation durch.
        Unsere Strategie: ${JSON.stringify(campaign)}
        Wettbewerber: ${competitorName}
        
        Simuliere, wie ${competitorName} auf unseren Kampagnen-Launch reagieren würde. Was ist ihr "Killer Move"?
        Schlage dann 3 defensive Taktiken vor, um sie präventiv zu blockieren.
        Antworte in JSON.`;
        
        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 2.5 Pro for advanced simulation
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { systemInstruction: MIRROU_KNOWLEDGE, responseMimeType: "application/json", responseSchema: wargameSchema }
            });
            setWargameResult(JSON.parse(response.text));
        } catch(e) {
            console.error(e);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            {showAutomationPlanner && campaign && (
                <AutomationPlannerModal
                    campaign={campaign}
                    onClose={() => setShowAutomationPlanner(false)}
                    onConfirm={handleConfirmAutomationPlan}
                    isEmbedded={isEmbedded}
                />
            )}
            <div className={`grid lg:grid-cols-3 gap-8 ${isEmbedded ? 'w-full h-full overflow-hidden' : 'max-w-6xl mx-auto'}`}>
                <div className={`lg:col-span-1 space-y-6 ${isEmbedded ? 'overflow-y-auto pr-2' : ''}`}>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Produkt / Kontext</label>
                        <textarea value={product} onChange={e => setProduct(e.target.value)} rows={2} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm resize-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Zielgruppe</label>
                        <textarea value={audience} onChange={e => setAudience(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Kampagnenziel</label>
                        <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Unique Selling Proposition (USP)</label>
                        <textarea value={usp} onChange={e => setUsp(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm" />
                    </div>

                    {optimizationContext && (
                        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-xs text-blue-200">
                             <div className="flex items-start gap-2">
                                <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h5 className="font-bold mb-1">Optimierungs-Kontext aus Dirigent-Analyse:</h5>
                                    <p className="italic">"{optimizationContext}"</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGenerateCampaign}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-t-transparent border-[#0A0A0A] rounded-full animate-spin"></div>
                                <span>Entwickle Strategie...</span>
                            </>
                        ) : (
                            <>
                                <StrategeIcon />
                                {optimizationContext ? `Strategie optimieren [${COST_TABLE.COMPLEX_TEXT} Cr]` : `Strategie generieren [${COST_TABLE.COMPLEX_TEXT} Cr]`}
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-500">Powered by Gemini 2.5 Pro</p>
                </div>

                <div className={`lg:col-span-2 bg-[#1C1C1C] rounded-lg p-6 border border-[#333333] min-h-[600px] ${isEmbedded ? 'overflow-y-auto' : ''}`}>
                    <h3 className="text-lg font-medium text-white mb-4">Generierte Kampagnenstrategie</h3>
                    {isLoading && <SkeletonLoader />}
                    {error && <div className="text-center text-red-400 text-sm p-4"><p>{error}</p></div>}
                    
                    {campaign && (
                        <div className="space-y-6 page-fade-in">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{campaign.campaignTitle}</h2>
                                <p className="text-lg text-gray-300 italic mt-1">"{campaign.slogan}"</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(campaign.keyVisuals || []).map((visual, i) => (
                                    <ResultCard key={i} title={`Visual Idee #${i + 1}`}>
                                        <p>{visual}</p>
                                    </ResultCard>
                                ))}
                            </div>

                            <ResultCard title="Social Media Strategie">
                                <p><strong>Plattformen:</strong> {(campaign.socialMediaStrategy?.platforms || []).join(', ')}</p>
                                <p><strong>Content Pillars:</strong></p>
                                <ul className="list-disc list-inside pl-2">
                                    {(campaign.socialMediaStrategy?.contentPillars || []).map((pillar, i) => <li key={i}>{pillar}</li>)}
                                </ul>
                                <p className="mt-2"><strong>Post Beispiele:</strong></p>
                                {(campaign.socialMediaStrategy?.postExamples || []).map((post, i) => (
                                    <div key={i} className="p-2 bg-black/30 rounded mt-1 text-xs italic">"{post}"</div>
                                ))}
                            </ResultCard>

                            <div className="grid md:grid-cols-2 gap-4">
                                <ResultCard title="E-Mail Marketing">
                                    <p><strong>Betreffzeilen:</strong></p>
                                    <ul className="list-disc list-inside pl-2">
                                        {(campaign.emailMarketing?.subjectLines || []).map((line, i) => <li key={i}>{line}</li>)}
                                    </ul>
                                    <p className="mt-2"><strong>Sequenz Idee:</strong> {campaign.emailMarketing?.sequenceIdea}</p>
                                </ResultCard>
                                <ResultCard title="Erfolgsmessung (KPIs)">
                                    <ul className="list-disc list-inside">
                                        {(campaign.kpis || []).map((kpi, i) => <li key={i}>{kpi}</li>)}
                                    </ul>
                                </ResultCard>
                            </div>

                            {/* Wargaming Module */}
                            <div className="mt-8 border-t border-[#333333] pt-6">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-red-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg></span>
                                    Competitor Wargaming
                                </h4>
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Haupt-Wettbewerber eingeben..." 
                                        value={competitorName}
                                        onChange={e => setCompetitorName(e.target.value)}
                                        className="bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm flex-1"
                                    />
                                    <button 
                                        onClick={handleSimulateWargame} 
                                        disabled={isSimulating || !competitorName}
                                        className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-2 rounded-md text-xs font-bold hover:bg-red-900/50 disabled:opacity-50"
                                    >
                                        {isSimulating ? 'Simuliere...' : 'Angriff simulieren'}
                                    </button>
                                </div>

                                {wargameResult && (
                                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in">
                                        <ResultCard title="Gegner Reaktion (Red Team)" color="red">
                                            <p className="text-xs text-red-200">{wargameResult.counterMove}</p>
                                        </ResultCard>
                                        <ResultCard title="Abwehr-Taktik (Blue Team)" color="blue">
                                            <ul className="list-disc list-inside text-xs text-blue-200">
                                                {wargameResult.defenseTactics.map((t, i) => <li key={i}>{t}</li>)}
                                            </ul>
                                        </ResultCard>
                                    </div>
                                )}
                            </div>
                            
                            <div className="border-t border-[#333333] mt-6 pt-6 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleFinalizeStrategy}
                                    className="flex-1 w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-900/20"
                                >
                                    <AddToBoardIcon />
                                    Strategie übernehmen & Aufgabenplan erstellen
                                </button>
                                <button
                                    onClick={handlePublishToAkademie}
                                    className="flex-1 w-full flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/20 transition-colors"
                                >
                                    <PublishToAkademieIcon />
                                    In Akademie veröffentlichen
                                </button>
                            </div>

                        </div>
                    )}

                    {!isLoading && !error && !campaign && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                            <StrategeIcon className="w-12 h-12 mb-2"/>
                            <p>Ihre generierte Strategie wird hier erscheinen.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
