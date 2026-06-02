
import React, { useState, useMemo } from 'react';
import { useTasks, CalendarEvent, Contact } from '../contexts/AppContext';
import { GoogleGenAI } from "@google/genai";

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;

const AddEventModal: React.FC<{ date: Date; onClose: () => void; onSave: (event: Omit<CalendarEvent, 'id'>) => void; contacts: Contact[]; }> = ({ date, onClose, onSave, contacts }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [contactId, setContactId] = useState<number | undefined>(undefined);
    const [notes, setNotes] = useState('');
    const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);

    const handleSave = () => {
        if (title && startTime && endTime) {
            onSave({ title, date: date.toISOString().split('T')[0], startTime, endTime, contactId: contactId ? Number(contactId) : undefined, notes });
            onClose();
        }
    };

    const handleGenerateAgenda = async () => {
        if (!title) return;
        setIsGeneratingAgenda(true);
        const selectedContact = contacts.find(c => c.id === contactId);
        const contactContext = selectedContact ? `Meeting with ${selectedContact.name} (${selectedContact.role} at ${selectedContact.company}).` : '';
        const prompt = `Generate a concise 3-item meeting agenda for: "${title}". ${contactContext} Format: "- [Item 1]\n- [Item 2]\n- [Item 3]" Keep it professional and brief.`;
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
             const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
             setNotes(prev => (prev ? prev + "\n\nAgenda:\n" : "Agenda:\n") + response.text);
        } catch(e) { console.error(e); } finally { setIsGeneratingAgenda(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1C1C1C] p-6 rounded-lg shadow-2xl w-full max-w-md m-4 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="font-semibold text-white">Neuer Termin am {date.toLocaleDateString('de-DE')}</h3>
                <input type="text" placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"/>
                <div className="flex gap-4">
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"/>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"/>
                </div>
                <select value={contactId || ''} onChange={e => setContactId(Number(e.target.value) || undefined)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]">
                    <option value="">Kontakt verknüpfen (optional)</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} - {c.company}</option>)}
                </select>
                <div className="relative">
                    <textarea placeholder="Notizen..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"/>
                    <button onClick={handleGenerateAgenda} disabled={!title || isGeneratingAgenda} className="absolute bottom-2 right-2 text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30 hover:bg-purple-600/40 transition-colors flex items-center gap-1 disabled:opacity-50">
                        {isGeneratingAgenda ? <span className="animate-spin">...</span> : <SparklesIcon />} Auto-Agenda
                    </button>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="text-gray-300 px-4 py-2 text-sm">Abbrechen</button>
                    <button onClick={handleSave} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">Speichern</button>
                </div>
            </div>
        </div>
    );
};

interface TaktgeberToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const TaktgeberTool: React.FC<TaktgeberToolProps> = ({ navigateTo, isEmbedded }) => {
    const { events, addEvent, contacts } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalState, setModalState] = useState<{ isOpen: boolean; date: Date | null }>({ isOpen: false, date: null });

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        return Array.from({ length: 7 }).map((_, i) => { const date = new Date(startOfWeek); date.setDate(startOfWeek.getDate() + i); return date; });
    }, [currentDate]);

    const timeToPercent = (time: string) => { const [h, m] = time.split(':').map(Number); return ((h * 60 + m) / (24 * 60)) * 100; };
    const handlePrevWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
    const handleNextWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
    const openModal = (date: Date) => setModalState({ isOpen: true, date });

    return (
        <>
            {modalState.isOpen && modalState.date && <AddEventModal date={modalState.date} onClose={() => setModalState({ isOpen: false, date: null })} onSave={addEvent} contacts={contacts} />}
            <div className={`bg-[#1C1C1C] rounded-lg border border-[#333333] p-4 ${isEmbedded ? 'h-full flex flex-col' : ''}`}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{weekDays[0].toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevWeek} className="px-3 py-1 text-sm bg-white/10 rounded-md hover:bg-white/20">‹ Vorige</button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm bg-white/10 rounded-md hover:bg-white/20">Heute</button>
                        <button onClick={handleNextWeek} className="px-3 py-1 text-sm bg-white/10 rounded-md hover:bg-white/20">Nächste ›</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-t border-l border-white/10 flex-shrink-0">
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="text-center py-2 border-b border-white/10">
                            <p className="text-xs text-gray-400">{day.toLocaleDateString('de-DE', { weekday: 'short' })}</p>
                            <p className="text-lg font-semibold text-white">{day.getDate()}</p>
                        </div>
                    ))}
                </div>
                
                <div className={`grid grid-cols-7 border-l border-white/10 overflow-y-auto ${isEmbedded ? 'flex-1' : 'h-[60vh]'}`}>
                    {weekDays.map(day => {
                        const dayStr = day.toISOString().split('T')[0];
                        const eventsForDay = events.filter(e => e.date === dayStr);
                        return (
                            <div key={dayStr} className="relative min-h-[400px] h-full border-r border-b border-white/10 bg-[#111]" onDoubleClick={() => openModal(day)}>
                                {eventsForDay.map(event => {
                                    const top = timeToPercent(event.startTime);
                                    const height = timeToPercent(event.endTime) - top;
                                    const contact = contacts.find(c => c.id === event.contactId);
                                    return (
                                        <div key={event.id} className="absolute w-full p-1.5 bg-blue-900/70 border-l-2 border-blue-400 cursor-pointer overflow-hidden hover:z-10 hover:overflow-visible hover:h-auto group rounded-sm" style={{ top: `${top}%`, height: `${height}%`, minHeight: '20px' }} title={`${event.title} (${event.startTime}-${event.endTime})`}>
                                            <p className="text-xs font-bold text-white truncate group-hover:whitespace-normal">{event.title}</p>
                                            {contact && <p className="text-[10px] text-blue-200 truncate">{contact.name}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
