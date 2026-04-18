
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTasks, Task, ScheduledPost } from '../contexts/AppContext';
import { GoogleGenAI, Type } from "@google/genai";
import { Toast } from './Toast';

// --- ICONS ---
const LinkedInIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266.058 1.644.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059 1.281.073 1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.44 1.441-1.44-.645-1.44-1.441-1.44z"></path></svg>;
const BlogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

const CHANNEL_ICONS: { [key: string]: React.ReactNode } = {
    'LinkedIn': <LinkedInIcon />,
    'Instagram': <InstagramIcon />,
    'Blog': <BlogIcon />,
    'E-Mail Newsletter': <EmailIcon />,
};

const CHANNELS = ['LinkedIn', 'Instagram', 'Blog', 'E-Mail Newsletter'];

// --- MODALS ---
const ScheduleModal: React.FC<{
    task: Task;
    date: Date;
    onClose: () => void;
    onSchedule: (time: string, channels: string[], channelContent?: { [key: string]: string }) => void;
    isEmbedded?: boolean;
}> = ({ task, date, onClose, onSchedule, isEmbedded }) => {
    const [time, setTime] = useState('09:00');
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [optimizedContent, setOptimizedContent] = useState<{ [key: string]: string } | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleChannelToggle = (channel: string) => {
        setOptimizedContent(null);
        setSelectedChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
    };

    const handleOptimize = async () => {
        if (selectedChannels.length === 0) return;
        setIsOptimizing(true);
        setOptimizedContent(null);

        const prompt = `Act as a social media expert. Your task is to adapt the following content for different channels.
        
        Original Content: "${task.description}"
        
        Please rewrite this content for the following channels: ${selectedChannels.join(', ')}.
        
        Consider these channel-specific best practices:
        - LinkedIn: Professional tone, use hashtags, encourage discussion.
        - Instagram: More casual, visual-first, use emojis and relevant hashtags.
        - Blog: Longer form, structured with headings, more detailed.
        - E-Mail Newsletter: Engaging subject line, clear call-to-action, slightly more personal tone.
        
        Respond with a JSON object where the keys are the channel names and the values are the adapted text.
        Example: {"LinkedIn": "Adapted text for LinkedIn...", "Instagram": "Adapted text for Instagram..."}
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Updated to Gemini 3.0 for better channel adaptation
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            // A simple safety check in case the response is not valid JSON
            const parsed = JSON.parse(response.text.replace(/```json\n?|\n?```/g, ''));
            setOptimizedContent(parsed);
        } catch (e) {
            console.error("Content optimization failed:", e);
            // Fallback to original content
            const fallbackContent: { [key: string]: string } = {};
            selectedChannels.forEach(c => { fallbackContent[c] = `[FEHLER] ${task.description}`});
            setOptimizedContent(fallbackContent);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

    return (
        <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm`} onClick={handleBackdropClick}>
            <div ref={modalRef} className="bg-[#1C1C1C]/80 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col page-fade-in max-h-[90vh]">
                <header className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-medium text-white">Veröffentlichung planen</h3>
                    <p className="text-sm text-gray-400 mt-1">Für: <span className="font-semibold text-gray-200">{task.title}</span></p>
                    <p className="text-sm text-gray-400">Datum: <span className="font-semibold text-gray-200">{date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                </header>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">1. Uhrzeit & Kanäle</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"/>
                            <div className="grid grid-cols-2 gap-2">
                                {CHANNELS.map(channel => (
                                    <button key={channel} onClick={() => handleChannelToggle(channel)} className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-colors ${selectedChannels.includes(channel) ? 'bg-blue-900/50 border-blue-500 text-white' : 'bg-[#0A0A0A] border-[#333333] text-gray-300 hover:border-gray-500'}`}>
                                        {CHANNEL_ICONS[channel]}
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">2. Inhalts-Optimierung (Optional)</label>
                        <button onClick={handleOptimize} disabled={isOptimizing || selectedChannels.length === 0} className="w-full bg-white/10 text-white py-2 rounded-full text-sm hover:bg-white/20 disabled:opacity-50">
                            {isOptimizing ? 'Optimiere...' : 'Inhalte für Kanäle optimieren'}
                        </button>
                    </div>

                    { (isOptimizing || optimizedContent) && (
                        <div>
                             <h4 className="text-sm font-medium text-gray-300 mb-2">3. Vorschau</h4>
                             <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {isOptimizing && <p className="text-sm text-gray-400 animate-pulse">KI passt Inhalte an...</p>}
                                {optimizedContent && Object.entries(optimizedContent).map(([channel, content]) => (
                                    <div key={channel} className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333]">
                                        <p className="text-xs font-bold text-white flex items-center gap-2">{CHANNEL_ICONS[channel]} {channel}</p>
                                        <p className="text-xs text-gray-300 mt-1 whitespace-pre-wrap">{content}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-white/10 mt-auto flex justify-end gap-4">
                    <button onClick={onClose} className="border border-[#333333] text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-white/10">Abbrechen</button>
                    <button onClick={() => onSchedule(time, selectedChannels, optimizedContent || undefined)} disabled={selectedChannels.length === 0} className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm disabled:opacity-50">Planen</button>
                </footer>
            </div>
        </div>
    );
};

const QuickDraftModal: React.FC<{
    date: Date;
    onClose: () => void;
    onDraftCreated: (title: string, content: string, channels: string[]) => void;
    isEmbedded?: boolean;
}> = ({ date, onClose, onDraftCreated, isEmbedded }) => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState('');
    const [selectedChannels, setSelectedChannels] = useState<string[]>(['LinkedIn']);

    const handleMagicDraft = async () => {
        if (!topic) return;
        setIsGenerating(true);
        
        const prompt = `Act as a social media manager. Write a short, engaging post about "${topic}" for ${selectedChannels.join(' and ')}. 
        Date context: ${date.toDateString()}. 
        Keep it punchy, include hashtags. Output ONLY the post text.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for better social copy
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt
            });
            setDraft(response.text);
        } catch (e) {
            console.error(e);
            setDraft("Fehler bei der Generierung.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSchedule = () => {
        if(draft) {
            onDraftCreated(`Post: ${topic}`, draft, selectedChannels);
            onClose();
        }
    };

    return (
        <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm`} onClick={onClose}>
             <div onClick={e => e.stopPropagation()} className="bg-[#1C1C1C]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-md m-4 p-6 page-fade-in">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><SparklesIcon/> Quick Draft: {date.toLocaleDateString()}</h3>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={topic} 
                        onChange={e => setTopic(e.target.value)} 
                        placeholder="Thema eingeben (z.B. 'Team Meeting', 'Produkt Launch')" 
                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333]"
                    />
                    
                    <div className="flex gap-2">
                        {['LinkedIn', 'Instagram'].map(c => (
                            <button key={c} onClick={() => setSelectedChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`px-3 py-1 text-xs rounded-full border ${selectedChannels.includes(c) ? 'bg-purple-900/50 border-purple-500 text-white' : 'border-[#333] text-gray-500'}`}>{c}</button>
                        ))}
                    </div>

                    <button onClick={handleMagicDraft} disabled={isGenerating || !topic} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                        {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon/>}
                        {isGenerating ? 'Generiere...' : 'Magic Draft'}
                    </button>

                    {draft && (
                        <div className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333]">
                            <textarea value={draft} onChange={e => setDraft(e.target.value)} className="w-full bg-transparent text-gray-300 text-sm outline-none resize-none" rows={4} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-400 text-sm">Abbrechen</button>
                    <button onClick={handleSchedule} disabled={!draft} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50">Planen</button>
                </div>
             </div>
        </div>
    );
};


// --- MAIN TOOL ---
interface PublisherToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const PublisherTool: React.FC<PublisherToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, scheduledPosts, schedulePost, toolInput, setToolInput, addTask } = useTasks();
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [modalState, setModalState] = useState<{ task: Task, date: Date } | null>(null);
    const [quickDraftState, setQuickDraftState] = useState<{ date: Date } | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [highlightedId, setHighlightedId] = useState<number|null>(null);

    useEffect(() => {
        if (toolInput && toolInput.tool === 'publisher' && toolInput.sourceTaskId) {
            setHighlightedId(toolInput.sourceTaskId);
            const element = document.getElementById(`publish-task-${toolInput.sourceTaskId}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setToolInput(null);
            const timer = setTimeout(() => setHighlightedId(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [toolInput, setToolInput]);

    const publishableTasks = useMemo(() => {
        return tasks.filter(t => t.isApproved && t.status === 'done' && !t.publishedAt);
    }, [tasks]);

    const calendarDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        return days;
    }, []);

    const handleSchedule = (time: string, channels: string[], channelContent?: { [key: string]: string }) => {
        if (!modalState) return;
        const { task, date } = modalState;
        
        schedulePost({
            taskId: task.id,
            taskTitle: task.title,
            imageUrl: task.imageUrl,
            videoUrl: task.videoUrl,
            date: date.toISOString().split('T')[0],
            time,
            channels,
            channelContent
        });

        setModalState(null);
        setToastMessage(`"${task.title}" wurde für ${date.toLocaleDateString()} geplant.`);
    };

    const handleQuickDraft = (title: string, content: string, channels: string[]) => {
        if (!quickDraftState) return;
        
        // Create a task first implicitly
        const taskId = addTask(title, content, undefined, true); // Auto-approved
        
        schedulePost({
            taskId,
            taskTitle: title,
            date: quickDraftState.date.toISOString().split('T')[0],
            time: '09:00',
            channels,
            channelContent: channels.reduce((acc, ch) => ({...acc, [ch]: content}), {})
        });
        
        setQuickDraftState(null);
        setToastMessage("Quick Draft erstellt und geplant!");
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className="relative h-full">
                {modalState && <ScheduleModal task={modalState.task} date={modalState.date} onClose={() => setModalState(null)} onSchedule={handleSchedule} isEmbedded={isEmbedded} />}
                {quickDraftState && <QuickDraftModal date={quickDraftState.date} onClose={() => setQuickDraftState(null)} onDraftCreated={handleQuickDraft} isEmbedded={isEmbedded} />}
                
                <div className={`grid lg:grid-cols-3 gap-8 ${isEmbedded ? 'h-full overflow-hidden' : ''}`}>
                    {/* Queue */}
                    <aside className={`lg:col-span-1 bg-[#1C1C1C] rounded-lg border border-[#333333] p-4 flex flex-col ${isEmbedded ? 'overflow-y-auto' : 'h-[70vh]'}`}>
                        <h3 className="text-base font-semibold text-white mb-4 px-2">Veröffentlichungs-Warteschlange ({publishableTasks.length})</h3>
                        <div className="overflow-y-auto space-y-3 pr-1">
                            {publishableTasks.map(task => (
                                <div
                                    key={task.id}
                                    id={`publish-task-${task.id}`}
                                    draggable
                                    onDragStart={() => setDraggedTask(task)}
                                    className={`bg-[#0A0A0A] p-2 rounded-md border border-[#333333] cursor-grab active:cursor-grabbing flex items-center gap-3 transition-all ${highlightedId === task.id ? 'border-purple-500 ring-2 ring-purple-500/50' : ''}`}
                                >
                                    {(task.imageUrl || task.videoUrl) && (
                                        <div className="w-12 h-12 flex-shrink-0 bg-black rounded-sm overflow-hidden">
                                            {task.videoUrl ? <video src={task.videoUrl} muted loop playsInline className="w-full h-full object-cover"/> : <img src={task.imageUrl} alt={task.title} className="w-full h-full object-cover"/>}
                                        </div>
                                    )}
                                    <p className="text-sm font-medium text-white flex-1 truncate">{task.title}</p>
                                </div>
                            ))}
                             {publishableTasks.length === 0 && <p className="text-center text-xs text-gray-500 py-8">Keine freigegebenen Inhalte zur Veröffentlichung.</p>}
                        </div>
                    </aside>

                    {/* Calendar */}
                    <main className={`lg:col-span-2 bg-[#1C1C1C] rounded-lg border border-[#333333] p-4 ${isEmbedded ? 'overflow-y-auto' : ''}`}>
                         <h3 className="text-base font-semibold text-white mb-4 px-2">Content Kalender (14 Tage)</h3>
                         <div className="grid grid-cols-7 gap-px bg-[#333333] border border-[#333333] rounded-lg overflow-hidden">
                            {calendarDays.map((day, i) => {
                                const dayStr = day.toISOString().split('T')[0];
                                const postsForDay = scheduledPosts.filter(p => p.date === dayStr);
                                const isToday = day.toDateString() === new Date().toDateString();
                                
                                return (
                                    <div
                                        key={i}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => draggedTask && setModalState({ task: draggedTask, date: day })}
                                        onClick={() => setQuickDraftState({ date: day })}
                                        className={`bg-[#0A0A0A] min-h-[150px] p-2 space-y-2 group relative cursor-pointer transition-colors hover:bg-[#111] ${isToday ? 'bg-[#0f0f0f]' : ''}`}
                                    >
                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-500"><PlusIcon/></div>
                                        <p className={`text-xs font-semibold text-center ${isToday ? 'text-purple-400' : 'text-gray-400'}`}>{day.toLocaleDateString('de-DE', { weekday: 'short' })}</p>
                                        <p className={`text-lg font-bold text-center ${isToday ? 'text-white' : 'text-gray-300'}`}>{day.getDate()}</p>
                                        {postsForDay.map(post => (
                                            <div key={post.id} onClick={e => e.stopPropagation()} className="bg-[#1C1C1C] p-2 rounded-md border border-[#333333] hover:border-gray-500 transition-colors">
                                                <p className="text-xs font-bold text-gray-300">{post.time}</p>
                                                <p className="text-xs text-white truncate mt-1">{post.taskTitle}</p>
                                                <div className="flex gap-1.5 mt-2">
                                                    {post.channels.map(c => <div key={c} className="text-gray-400" title={c}>{CHANNEL_ICONS[c]}</div>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};
