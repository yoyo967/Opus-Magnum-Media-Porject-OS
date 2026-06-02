import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect } from 'react';
import { useTasks, Contact } from '../contexts/AppContext';
import { GoogleGenAI, Type } from "@google/genai";
import { Toast } from './Toast';

const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;
const NoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;

const INTERACTION_ICONS = { email: <MailIcon />, meeting: <CalendarIcon />, note: <NoteIcon /> };

interface RelationshipIntel {
    score: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Warning';
    summary: string;
    nextAction: string;
}

interface ChronistToolProps {
    isEmbedded?: boolean;
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 30;
    const stroke = 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * (circumference / 2);
    
    const color = score > 75 ? '#4ade80' : score > 40 ? '#facc15' : '#f87171';

    return (
        <div className="relative flex items-center justify-center w-20 h-20">
             <svg height={radius * 2} width={radius * 2} className="transform -rotate-180">
                <circle stroke="#333" strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} r={normalizedRadius} cx={radius} cy={radius} fill="transparent" />
                <circle stroke={color} strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} style={{ strokeDashoffset: circumference - (score / 100) * (circumference / 2), transition: 'stroke-dashoffset 1s ease-out' }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} fill="transparent" />
             </svg>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                 <span className="text-lg font-bold text-white">{score}</span>
                 <span className="block text-[8px] text-gray-400 uppercase">Index</span>
             </div>
        </div>
    );
};

export const ChronistTool: React.FC<ChronistToolProps> = ({ isEmbedded }) => {
    const { contacts, addContact, addInteraction } = useTasks();
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', company: '', role: '', email: '' });
    const [activeTab, setActiveTab] = useState<'email' | 'meeting' | 'note'>('note');
    const [interactionContent, setInteractionContent] = useState({ subject: '', body: '', date: '', time: '' });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const [intel, setIntel] = useState<RelationshipIntel | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (!selectedContactId && contacts.length > 0) {
            setSelectedContactId(contacts[0].id);
        }
        setIntel(null);
    }, [contacts, selectedContactId]);

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    const handleAddContact = () => {
        if(newContact.name && newContact.email) {
            addContact(newContact);
            setNewContact({ name: '', company: '', role: '', email: '' });
            setIsAddingContact(false);
            setToastMessage("Kontakt wurde hinzugefügt.");
        }
    };
    
    const handleAddInteraction = () => {
        if (!selectedContactId) return;
        let content = '';
        let subject: string | undefined = undefined;

        switch(activeTab) {
            case 'note': content = interactionContent.body; break;
            case 'email': content = interactionContent.body; subject = interactionContent.subject; break;
            case 'meeting': content = `Meeting: ${interactionContent.subject} am ${interactionContent.date} um ${interactionContent.time}`; break;
        }

        if(content.trim()) {
            addInteraction(selectedContactId, { type: activeTab, content, subject });
            setInteractionContent({ subject: '', body: '', date: '', time: '' });
            setToastMessage("Interaktion wurde protokolliert.");
            setIntel(null);
        }
    };

    const handleAnalyzeRelationship = async () => {
        if (!selectedContact || selectedContact.interactions.length === 0) {
            setToastMessage("Keine Interaktionen für eine Analyse vorhanden.");
            return;
        }
        
        setIsAnalyzing(true);
        setIntel(null);

        const intelSchema = {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "Relationship score from 0 (lost) to 100 (champion)." },
                sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative', 'Warning'] },
                summary: { type: Type.STRING, description: "Brief summary of the relationship status." },
                nextAction: { type: Type.STRING, description: "Strategic recommendation for the next step (e.g. 'Schedule a coffee chat', 'Send a whitepaper')." }
            }
        };

        const prompt = `Analyze the relationship with ${selectedContact.name} (${selectedContact.role} at ${selectedContact.company}) based on the following interaction history.
        Interactions: ${JSON.stringify(selectedContact.interactions)}
        Determine the relationship health, sentiment, and recommend the best next strategic move to deepen the connection.`;

        try {
            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: intelSchema }
            });
            setIntel(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
            setToastMessage("Analyse fehlgeschlagen.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`bg-[#1C1C1C] flex overflow-hidden ${isEmbedded ? 'h-full border-0' : 'rounded-lg border border-[#333333] h-[75vh]'}`}>
                {/* Contact List */}
                <aside className="w-1/3 border-r border-white/10 flex flex-col bg-[#111]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-white text-sm">Kontakte</h3>
                        <button onClick={() => setIsAddingContact(true)} className="p-1 text-gray-400 hover:text-white transition-colors"><UserPlusIcon /></button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {contacts.map(contact => (
                            <button key={contact.id} onClick={() => setSelectedContactId(contact.id)} className={`w-full text-left p-4 border-b border-white/5 transition-colors ${selectedContactId === contact.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                <p className="font-semibold text-white text-sm truncate">{contact.name}</p>
                                <p className="text-xs text-gray-400 truncate">{contact.company}</p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main View */}
                <main className="w-2/3 flex flex-col bg-[#1C1C1C]">
                    {selectedContact ? (
                        <>
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-[#1C1C1C] to-[#252525]">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedContact.name}</h2>
                                    <p className="text-sm text-gray-400">{selectedContact.role} @ {selectedContact.company}</p>
                                    <p className="text-sm text-blue-400 mt-1">{selectedContact.email}</p>
                                </div>
                                <button onClick={handleAnalyzeRelationship} disabled={isAnalyzing} className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-purple-500/30 disabled:opacity-50">
                                    <BrainIcon /> {isAnalyzing ? 'Analysiere...' : 'Intelligence Scan'}
                                </button>
                            </div>

                            {intel && (
                                <div className="mx-6 mt-4 p-0 bg-[#0f0f0f] border border-purple-500/30 rounded-lg animate-[fadeIn_0.3s_ease-out] overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                    <div className="flex">
                                        <div className="p-4 bg-purple-900/10 border-r border-purple-500/10 flex flex-col items-center justify-center min-w-[120px]">
                                            <ScoreGauge score={intel.score} />
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-2">
                                                 <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Relationship Status</span>
                                                 <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${intel.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>{intel.sentiment}</div>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-3 leading-snug">{intel.summary}</p>
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 flex items-start gap-2">
                                                <div><span className="block text-[10px] text-blue-300 uppercase font-bold">Strategic Recommendation</span><span className="text-xs text-blue-100">{intel.nextAction}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                {selectedContact.interactions.length === 0 && <p className="text-center text-gray-500 italic mt-10">Noch keine Interaktionen aufgezeichnet.</p>}
                                {selectedContact.interactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(interaction => (
                                    <div key={interaction.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#333] transition-colors border border-white/5">{INTERACTION_ICONS[interaction.type]}</div>
                                            <div className="w-px h-full bg-white/5 my-1 group-last:hidden"></div>
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <span className="text-xs font-mono text-gray-500">{new Date(interaction.date).toLocaleString('de-DE')}</span>
                                                <span className="text-[10px] text-gray-600 uppercase tracking-wider">{interaction.type}</span>
                                            </div>
                                            {interaction.subject && <p className="font-semibold text-white text-sm mb-1">{interaction.subject}</p>}
                                            <div className="text-sm text-gray-400 bg-[#222] p-3 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">{interaction.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-[#111]">
                                 <div className="flex gap-1 mb-3">
                                    <button onClick={() => setActiveTab('note')} className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === 'note' ? 'bg-white text-black' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}>Notiz</button>
                                    <button onClick={() => setActiveTab('email')} className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === 'email' ? 'bg-white text-black' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}>E-Mail</button>
                                    <button onClick={() => setActiveTab('meeting')} className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeTab === 'meeting' ? 'bg-white text-black' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}>Termin</button>
                                </div>
                                <div className="space-y-3">
                                    {(activeTab === 'email' || activeTab === 'meeting') && <input type="text" value={interactionContent.subject} onChange={e => setInteractionContent(p => ({...p, subject: e.target.value}))} placeholder={activeTab === 'email' ? 'Betreff...' : 'Titel des Meetings...'} className="w-full bg-[#1C1C1C] text-white px-4 py-2 rounded-md border border-[#333333] focus:border-white/30 outline-none text-sm"/>}
                                    {activeTab !== 'meeting' && <textarea value={interactionContent.body} onChange={e => setInteractionContent(p => ({...p, body: e.target.value}))} placeholder={activeTab === 'note' ? "Interaktion notieren..." : "E-Mail Inhalt kopieren..."} rows={3} className="w-full bg-[#1C1C1C] text-white px-4 py-2 rounded-md border border-[#333333] focus:border-white/30 outline-none text-sm resize-none"/>}
                                    {activeTab === 'meeting' && <div className="flex gap-3"><input type="date" value={interactionContent.date} onChange={e => setInteractionContent(p => ({...p, date: e.target.value}))} className="w-full bg-[#1C1C1C] text-white px-4 py-2 rounded-md border border-[#333333] text-sm outline-none"/><input type="time" value={interactionContent.time} onChange={e => setInteractionContent(p => ({...p, time: e.target.value}))} className="w-full bg-[#1C1C1C] text-white px-4 py-2 rounded-md border border-[#333333] text-sm outline-none"/></div>}
                                </div>
                                <div className="flex justify-end mt-3">
                                    <button onClick={handleAddInteraction} className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">Hinzufügen</button>
                                </div>
                            </div>
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                             <p>Wählen Sie einen Kontakt aus oder erstellen Sie einen neuen.</p>
                        </div>
                    )}
                </main>
                
                {isAddingContact && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsAddingContact(false)}>
                        <div className="bg-[#1C1C1C] p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/10 space-y-5" onClick={e => e.stopPropagation()}>
                            <h3 className="font-bold text-xl text-white">Neuer Kontakt</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Name" value={newContact.name} onChange={e => setNewContact(p=>({...p, name: e.target.value}))} className="w-full bg-[#111] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-blue-500 outline-none"/>
                                <input type="text" placeholder="Firma" value={newContact.company} onChange={e => setNewContact(p=>({...p, company: e.target.value}))} className="w-full bg-[#111] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-blue-500 outline-none"/>
                                <input type="text" placeholder="Rolle" value={newContact.role} onChange={e => setNewContact(p=>({...p, role: e.target.value}))} className="w-full bg-[#111] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-blue-500 outline-none"/>
                                <input type="email" placeholder="E-Mail" value={newContact.email} onChange={e => setNewContact(p=>({...p, email: e.target.value}))} className="w-full bg-[#111] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-blue-500 outline-none"/>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setIsAddingContact(false)} className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium">Abbrechen</button>
                                <button onClick={handleAddContact} className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200">Kontakt anlegen</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
