
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';
import { Toast } from './Toast';

const EnsembleIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.5-2.952v2.25a3 3 0 01-3 3m3-3v-2.25a3 3 0 00-3-3m-3.75 4.5V7.5A3.75 3.75 0 0112 3.75M6.75 18a9.06 9.06 0 01-3.086-.922c-.411-.165-.614-.596-.525-1.041.09-.445.523-.741.972-.647a46.452 46.452 0 013.44.629m10.56 0a46.452 46.452 0 003.44-.629c.449-.094.882.202.972.647.09.445-.114.876-.525 1.041a9.06 9.06 0 01-3.086.922m-7.5 0h7.5" /></svg>);
const RoleIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const RecruitIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>);


interface TeamStructure {
    collaboration_model: string;
    roles: {
        role_name: string;
        responsibilities: string[];
        required_skills: string[];
        kpi: string;
    }[];
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-gray-700/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-700/50 rounded-lg"></div>
            <div className="h-48 bg-gray-700/50 rounded-lg"></div>
        </div>
    </div>
);

export const EnsembleTool: React.FC = () => {
    const { addContact } = useTasks();
    const [objective, setObjective] = useState('Markteinführung für eine neue KI-gestütztes mobile App, die persönliche Finanzen automatisiert. Ziel ist es, in den ersten 6 Monaten 50.000 aktive Nutzer zu gewinnen.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [team, setTeam] = useState<TeamStructure | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const teamSchema = {
        type: Type.OBJECT,
        properties: {
            collaboration_model: { type: Type.STRING, description: 'Ein kurzer Überblick über das empfohlene Zusammenarbeitsmodell (z.B. Agile Sprints).' },
            roles: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        role_name: { type: Type.STRING },
                        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        required_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        kpi: { type: Type.STRING, description: 'Der wichtigste Leistungsindikator für diese Rolle.' }
                    }
                }
            }
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setTeam(null);

        const prompt = `Basierend auf dem folgenden Projektziel, erstelle eine optimale Teamstruktur. Definiere die notwendigen Rollen, ihre Hauptverantwortlichkeiten, die erforderlichen Fähigkeiten und einen primären KPI für jede Rolle. Schlage auch ein passendes Kollaborationsmodell vor.
        
        Projektziel: "${objective}"

        Antworte ausschließlich im JSON-Format gemäß dem Schema.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for sophisticated organizational planning
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: teamSchema }
            });
            setTeam(JSON.parse(response.text));
        } catch (e) {
            console.error(e);
            setError("Teamstruktur konnte nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRecruit = (role: TeamStructure['roles'][0]) => {
        const agentName = role.role_name.split(' ')[0] + "_AI"; // Simple name gen
        addContact({
            name: `${role.role_name} (AI Agent)`,
            company: 'Project OS Ensemble',
            role: role.role_name,
            email: `${role.role_name.toLowerCase().replace(/ /g, '.')}@ensemble.ai`,
        });
        setToastMessage(`${role.role_name} wurde rekrutiert und zum Chronist hinzugefügt.`);
    };
    
    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-5xl mx-auto space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Projektziel</label>
                    <textarea value={objective} onChange={e => setObjective(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm" />
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                    <EnsembleIcon /> {isLoading ? 'Generiere...' : 'Teamstruktur vorschlagen'}
                </button>
                <div className="text-[10px] text-gray-500 text-center">Powered by Gemini 3.0 Pro</div>

                {isLoading && <SkeletonLoader />}
                {error && <p className="text-center text-red-400">{error}</p>}
                
                {team && (
                    <div className="space-y-6 page-fade-in">
                        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
                            <h3 className="font-semibold text-white mb-2">Kollaborationsmodell</h3>
                            <p className="text-sm text-gray-300">{team.collaboration_model}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Benötigte Rollen ({team.roles.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {team.roles.map((role, idx) => (
                                    <div key={idx} className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <RoleIcon />
                                            <h4 className="font-bold text-white text-md">{role.role_name}</h4>
                                        </div>
                                        <div className="space-y-3 text-xs flex-1">
                                            <div>
                                                <h5 className="font-semibold text-gray-400 mb-1">Verantwortlichkeiten</h5>
                                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                    {role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-400 mb-1">Benötigte Skills</h5>
                                                <p className="text-gray-300">{role.required_skills.join(', ')}</p>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-400 mb-1">Primärer KPI</h5>
                                                <p className="text-gray-300">{role.kpi}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRecruit(role)}
                                            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-500/30 py-2 rounded-md text-xs font-medium transition-colors"
                                        >
                                            <RecruitIcon /> Rekrutieren
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
