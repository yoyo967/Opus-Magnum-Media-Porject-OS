
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { MASTERPLAN_HIERARCHY, MasterplanNode } from '../masterplanData';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, setDoc } from 'firebase/firestore';

// --- INTERFACES ---
export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    functionCalls?: any[];
}

export interface Feedback {
    user: string;
    comment: string;
    timestamp: string;
}

export interface Interaction {
    id: number;
    type: 'email' | 'meeting' | 'note';
    content: string;
    date: string;
    subject?: string;
}

export interface Contact {
    id: number;
    name: string;
    company: string;
    role: string;
    email: string;
    interactions: Interaction[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'review' | 'done';
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    publishedAt?: string;
    performanceData?: any;
    chatHistory?: ChatMessage[];
    feedback?: Feedback[];
    isApproved?: boolean;
    assetMetadata?: {
        tags: string[];
        description: string;
    };
    isSystemGenerated?: boolean;
    checklist?: { id: number; text: string; completed: boolean }[];
    recommendedTool?: string;
    versionHistory?: { type: 'image' | 'video' | 'audio', url: string, timestamp: string }[];
    budgetedCost?: number;
    actualCost?: number;
    experimentId?: number;
}

export interface Experiment {
    id: number;
    name: string;
    variantA_taskId: number;
    variantB_taskId: number;
    goalMetric: 'clicks' | 'conversions' | 'engagementRate';
    status: 'running' | 'completed';
    results?: {
        winner: 'A' | 'B' | 'Inconclusive';
        summary: string;
        variantA_metric: number;
        variantB_metric: number;
        confidence: number;
    };
}

export interface Document {
    id: string;
    title: string;
    category: 'strategy' | 'tactic' | 'operation' | 'knowledge';
    content: string;
    createdAt: string;
}

export interface Persona {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    details: {
        age: number;
        role: string;
        goals: string[];
        pain_points: string[];
        motivations: string[];
        bio: string;
    };
}

export interface StrategyBrief {
    product: string;
    audience: string;
    goal: string;
    usp: string;
}

export interface CampaignBrief {
    campaignTitle: string;
    slogan: string;
    keyVisuals: string[];
    socialMediaStrategy: {
        platforms: string[];
        contentPillars: string[];
        postExamples: string[];
    };
    emailMarketing: {
        subjectLines: string[];
        sequenceIdea: string;
    };
    kpis: string[];
}

export type ToolInput = {
    tool: string;
    prompt?: string;
    imageUrl?: string;
    sourceTaskId: number;
};

export interface ScheduledPost {
    id: number;
    taskId: number;
    taskTitle: string;
    imageUrl?: string;
    videoUrl?: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    channels: string[];
    channelContent?: {
        [channel: string]: string;
    };
}

export interface BrandGuidelines {
    voice: string;
    visual: string;
    colors: string[];
}

export interface SequenceStep {
  id: number;
  type: 'email' | 'delay';
  subject?: string;
  body?: string;
  delayDays?: number;
}

export interface EmailSequence {
  id: number;
  name: string;
  goal: string;
  steps: SequenceStep[];
}

export interface CalendarEvent {
    id: number;
    title: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    notes?: string;
    contactId?: number;
}

export interface UserProfile {
    name: string;
    role: string;
    organization: string;
    mission?: string;
}

export interface SystemLogEntry {
    id: number;
    timestamp: string;
    message: string;
    agent: string; // e.g., "Strategist", "System", "Director"
    type: 'info' | 'success' | 'warning' | 'error';
}

export type WorkflowStep = 'strategy' | 'planning' | 'production' | 'publishing' | 'idle';

// Pricing Constants - Token Economy
export const COST_TABLE = {
    SIMPLE_TEXT: 1,
    COMPLEX_TEXT: 3, // Thinking mode / Strategic Planning
    WEB_SEARCH: 5,
    IMAGE_GEN: 10,
    VIDEO_GEN: 25,
    AUDIO_GEN: 5,
};

interface TasksContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    authError: string | null;
    dismissAuthError: () => void;
    enableOfflineMode: () => void;
    isOfflineMode: boolean;
    tasks: Task[];
    addTask: (title: string, description: string, imageUrl?: string, isSystemGenerated?: boolean, audioUrl?: string, recommendedTool?: string) => number;
    addMultipleTasks: (tasks: { title: string; description: string; recommendedTool?: string }[]) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    updateTask: (taskId: number, updates: Partial<Task>) => void;
    publishAndAnalyzeTask: (taskId: number) => Promise<void>;
    strategyBrief: StrategyBrief | null;
    setStrategyBrief: React.Dispatch<React.SetStateAction<StrategyBrief | null>>;
    campaignBrief: CampaignBrief | null;
    setCampaignBrief: React.Dispatch<React.SetStateAction<CampaignBrief | null>>;
    toolInput: ToolInput | null;
    setToolInput: React.Dispatch<React.SetStateAction<ToolInput | null>>;
    optimizationContext: string | null;
    setOptimizationContext: React.Dispatch<React.SetStateAction<string | null>>;
    documents: Document[];
    addDocument: (title: string, content: string, category: Document['category']) => void;
    indexTaskAsset: (taskId: number) => Promise<void>;
    highlightedTaskIds: number[];
    setHighlightedTaskIds: React.Dispatch<React.SetStateAction<number[]>>;
    scheduledPosts: ScheduledPost[];
    schedulePost: (post: Omit<ScheduledPost, 'id'>) => void;
    personas: Persona[];
    addPersona: (persona: Omit<Persona, 'id'>) => void;
    brandGuidelines: BrandGuidelines | null;
    setBrandGuidelines: React.Dispatch<React.SetStateAction<BrandGuidelines | null>>;
    nexusQuery: string | null;
    setNexusQuery: React.Dispatch<React.SetStateAction<string | null>>;
    experiments: Experiment[];
    addExperiment: (experiment: Omit<Experiment, 'id'>) => Experiment;
    updateExperiment: (experimentId: number, updates: Partial<Experiment>) => void;
    contacts: Contact[];
    addContact: (contact: Omit<Contact, 'id' | 'interactions'>) => void;
    addInteraction: (contactId: number, interaction: Omit<Interaction, 'id' | 'date'>) => void;
    sequences: EmailSequence[];
    addSequence: (sequence: Omit<EmailSequence, 'id'>) => void;
    updateSequence: (sequenceId: number, updates: Partial<EmailSequence>) => void;
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    userProfile: UserProfile | null;
    updateUserProfile: (profile: UserProfile) => void;
    systemLogs: SystemLogEntry[];
    addSystemLog: (message: string, agent: string, type?: SystemLogEntry['type']) => void;
    exportSystemData: () => void;
    importSystemData: (file: File) => Promise<boolean>;
    
    // Workflow State
    workflowStep: WorkflowStep;
    setWorkflowStep: React.Dispatch<React.SetStateAction<WorkflowStep>>;
    advanceWorkflow: () => void;
    
    // Economy
    credits: number;
    maxCredits: number;
    checkCredits: (amount: number) => boolean;
    deductCredits: (amount: number, reason: string) => void;
    addCredits: (amount: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const initialTasks: Task[] = [
    { id: 1, title: "Strategy Pitch to Management", description: "Present the report and obtain approval for the pilot phase.", status: 'inprogress', budgetedCost: 500, actualCost: 350 },
    { id: 2, title: "Submit Framer Education Application", description: "Register the company officially for the free Education program and Ambassador program.", status: 'todo', budgetedCost: 100, actualCost: 0 },
];

const initialContacts: Contact[] = [
    {
        id: 1,
        name: 'Daniel Theobald',
        company: 'Campana & Schott',
        role: 'Talent Acquisition Manager',
        email: 'daniel.theobald@cs.co',
        interactions: []
    }
];

function flattenMasterplanToDocs(nodes: MasterplanNode[]): Document[] {
    let docs: Document[] = [];
    for (const node of nodes) {
        if (node.content) {
            let category: Document['category'] = 'knowledge'; // default
            if (node.id.includes('strategy') || node.id.startsWith('p1_')) category = 'strategy';
            if (node.id.includes('tactic') || node.id.includes('integration')) category = 'tactic';
            if (node.id.includes('ops') || node.id.includes('rollout')) category = 'operation';

            docs.push({
                id: node.id,
                title: node.title,
                content: node.content,
                category: category,
                createdAt: new Date().toISOString(),
            });
        }
        if (node.children) {
            docs = docs.concat(flattenMasterplanToDocs(node.children));
        }
    }
    return docs;
}

const masterplanDocs = flattenMasterplanToDocs(MASTERPLAN_HIERARCHY);
const initialDocuments: Document[] = [
    ...masterplanDocs,
];


export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    // Local State (Fallback & Offline)
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [brandGuidelines, setBrandGuidelines] = useState<BrandGuidelines | null>(null);
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [sequences, setSequences] = useState<EmailSequence[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);

    const [strategyBrief, setStrategyBrief] = useState<StrategyBrief | null>(null);
    const [campaignBrief, setCampaignBrief] = useState<CampaignBrief | null>(null);
    const [toolInput, setToolInput] = useState<ToolInput | null>(null);
    const [optimizationContext, setOptimizationContext] = useState<string | null>(null);
    const [highlightedTaskIds, setHighlightedTaskIds] = useState<number[]>([]);
    const [nexusQuery, setNexusQuery] = useState<string | null>(null);
    
    // Workflow State
    const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('idle');

    // Economy State
    const [credits, setCredits] = useState(500);
    const maxCredits = 1000;

    // AUTHENTICATION LISTENERS
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                console.log("User signed in:", currentUser.email);
                addSystemLog(`User logged in: ${currentUser.email}`, "System", "success");
                setAuthError(null);
                setIsOfflineMode(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // DATA PERSISTENCE: LOAD
    useEffect(() => {
        if (!user || isOfflineMode) {
            const load = (key: string, setter: any, defaultVal?: any) => {
                try {
                    const item = window.localStorage.getItem(key);
                    if (item) setter(JSON.parse(item));
                    else if (defaultVal) setter(defaultVal);
                } catch (e) { console.error(`Failed to load ${key}`, e); }
            };

            load('opus_tasks', setTasks, initialTasks);
            load('opus_contacts', setContacts, initialContacts);
            load('opus_documents', setDocuments, initialDocuments);
            load('opus_personas', setPersonas, []);
            load('opus_scheduledPosts', setScheduledPosts, []);
            load('opus_brandGuidelines', setBrandGuidelines, null);
            load('opus_experiments', setExperiments, []);
            load('opus_sequences', setSequences, []);
            load('opus_events', setEvents, []);
            load('opus_userProfile', setUserProfile, null);
            load('opus_systemLogs', setSystemLogs, []);
            load('opus_campaignBrief', setCampaignBrief, null);
            load('opus_strategyBrief', setStrategyBrief, null);
            load('opus_credits', setCredits, 500);
        }
    }, [user, isOfflineMode]);

    // DATA PERSISTENCE: SAVE LOCAL
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_tasks', JSON.stringify(tasks)); }, [tasks, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_documents', JSON.stringify(documents)); }, [documents, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_personas', JSON.stringify(personas)); }, [personas, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_contacts', JSON.stringify(contacts)); }, [contacts, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_scheduledPosts', JSON.stringify(scheduledPosts)); }, [scheduledPosts, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_brandGuidelines', JSON.stringify(brandGuidelines)); }, [brandGuidelines, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_experiments', JSON.stringify(experiments)); }, [experiments, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_sequences', JSON.stringify(sequences)); }, [sequences, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_events', JSON.stringify(events)); }, [events, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_userProfile', JSON.stringify(userProfile)); }, [userProfile, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_systemLogs', JSON.stringify(systemLogs)); }, [systemLogs, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_campaignBrief', JSON.stringify(campaignBrief)); }, [campaignBrief, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_strategyBrief', JSON.stringify(strategyBrief)); }, [strategyBrief, user, isOfflineMode]);
    useEffect(() => { if(!user || isOfflineMode) window.localStorage.setItem('opus_credits', JSON.stringify(credits)); }, [credits, user, isOfflineMode]);


    const login = async () => {
        setAuthError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Login failed", error);
            setAuthError("Login failed");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setAuthError(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const dismissAuthError = () => setAuthError(null);

    const enableOfflineMode = () => {
        setIsOfflineMode(true);
        setAuthError(null);
        if (tasks.length === 0) setTasks(initialTasks);
    }

    const addSystemLog = (message: string, agent: string, type: SystemLogEntry['type'] = 'info') => {
        const newLog: SystemLogEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message,
            agent,
            type
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    const updateUserProfile = (profile: UserProfile) => {
        setUserProfile(profile);
        addSystemLog(`User Profile Updated: ${profile.name} assigned as ${profile.role}.`, 'System', 'success');
    };

    const addTask = (title: string, description: string, imageUrl?: string, isSystemGenerated = false, audioUrl?: string, recommendedTool?: string): number => {
        const newTaskId = Date.now();
        const newTask: Task = {
            id: newTaskId,
            title,
            description,
            status: 'todo',
            imageUrl,
            audioUrl,
            isApproved: !imageUrl && !audioUrl,
            isSystemGenerated,
            recommendedTool,
        };

        setTasks(prev => [newTask, ...prev]);
        addSystemLog(`Task created: "${title}"`, isSystemGenerated ? 'AURORA' : 'System');
        return newTaskId;
    };
    
    const addMultipleTasks = (tasksToAdd: { title: string; description: string; recommendedTool?: string }[]) => {
        const newTasks: Task[] = tasksToAdd.map((t, i) => ({
            id: Date.now() + i,
            title: t.title,
            description: t.description,
            status: 'todo',
            isApproved: false, // Reset approval, needs work first
            isSystemGenerated: true,
            recommendedTool: t.recommendedTool
        }));
        
        setTasks(prev => [...newTasks, ...prev]);
        addSystemLog(`${tasksToAdd.length} tasks generated via Strategic Automation.`, 'Stratege', 'success');
    };
    
    const updateTask = (taskId: number, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const newVersionHistory = [...(task.versionHistory || [])];
                    if (updates.imageUrl && task.imageUrl && updates.imageUrl !== task.imageUrl) {
                    newVersionHistory.push({ type: 'image', url: task.imageUrl, timestamp: new Date().toISOString() });
                }
                if (updates.status === 'done' && task.status !== 'done') {
                        addSystemLog(`Task completed: "${task.title}"`, 'System', 'success');
                }
                return { ...task, ...updates, versionHistory: newVersionHistory };
            }
            return task;
        }));
    };

    const addExperiment = (experimentData: Omit<Experiment, 'id'>): Experiment => {
        const newExperiment: Experiment = { id: Date.now(), ...experimentData };
        setExperiments(prev => [...prev, newExperiment]);
        updateTask(experimentData.variantA_taskId, { experimentId: newExperiment.id });
        updateTask(experimentData.variantB_taskId, { experimentId: newExperiment.id });
        addSystemLog(`Experiment started: ${newExperiment.name}`, 'Experimenter');
        return newExperiment;
    };

    const updateExperiment = (experimentId: number, updates: Partial<Experiment>) => {
        setExperiments(prev => prev.map(exp => exp.id === experimentId ? { ...exp, ...updates } : exp));
        if (updates.status === 'completed') addSystemLog(`Experiment concluded. Results available.`, 'Experimenter', 'success');
    };

    const addDocument = (title: string, content: string, category: Document['category']) => {
        const newDoc: Document = { id: `doc_${Date.now()}`, title, content, category, createdAt: new Date().toISOString() };
        setDocuments(prev => [newDoc, ...prev]);
        addSystemLog(`New Document archived: "${title}"`, 'Academy');
    };

    const addPersona = (persona: Omit<Persona, 'id'>) => {
        const newPersona: Persona = { id: Date.now(), ...persona };
        setPersonas(prev => [newPersona, ...prev]);
        addSystemLog(`Persona created: "${persona.name}"`, 'Persona');
    };

    const indexTaskAsset = async (taskId: number) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || (!task.imageUrl && !task.videoUrl)) return;
        addSystemLog(`Indexing asset for task: "${task.title}"...`, 'Library');
        const assetSchema = { type: Type.OBJECT, properties: { description: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } } } };
        const imagePart = task.imageUrl ? { inlineData: { mimeType: 'image/jpeg', data: task.imageUrl.split(',')[1] } } : null;
        const prompt = `Analyze the visual asset. Respond in English.`;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: imagePart ? { parts: [imagePart, { text: prompt }] } : prompt, config: { responseMimeType: "application/json", responseSchema: assetSchema } });
            const assetMetadata = JSON.parse(response.text);
            updateTask(taskId, { assetMetadata });
            addSystemLog(`Asset indexed successfully via Gemini 3.0.`, 'Library', 'success');
        } catch (error) { console.error("Error indexing asset:", error); addSystemLog(`Asset indexing failed.`, 'Library', 'error'); }
    };

    const publishAndAnalyzeTask = async (taskId: number) => {
        const taskToPublish = tasks.find(t => t.id === taskId);
        if (!taskToPublish || taskToPublish.publishedAt) return;
        const performanceSchema = { type: Type.OBJECT, properties: { impressions: { type: Type.INTEGER }, engagementRate: { type: Type.NUMBER }, clicks: { type: Type.INTEGER }, conversions: { type: Type.INTEGER } } };
        const prompt = `Simulate performance data for this published marketing asset.`;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { responseMimeType: "application/json", responseSchema: performanceSchema } });
            const performanceData = JSON.parse(response.text);
            updateTask(taskId, { publishedAt: new Date().toISOString(), performanceData });
            addSystemLog(`Content published: "${taskToPublish.title}"`, 'Publisher');
        } catch (error) { updateTask(taskId, { publishedAt: new Date().toISOString() }); }
    };

    const schedulePost = (post: Omit<ScheduledPost, 'id'>) => {
        const newPost: ScheduledPost = { id: Date.now(), ...post };
        setScheduledPosts(prev => [...prev, newPost].sort((a,b) => new Date(a.date+'T'+a.time).getTime() - new Date(b.date+'T'+b.time).getTime()));
        publishAndAnalyzeTask(post.taskId);
        addSystemLog(`Post scheduled for ${post.date} at ${post.time}.`, 'Publisher');
    };

    const addContact = (contact: Omit<Contact, 'id' | 'interactions'>) => {
        const newContact: Contact = { id: Date.now(), ...contact, interactions: [] };
        setContacts(prev => [newContact, ...prev]);
        addSystemLog(`New contact added: ${contact.name}`, 'Chronicler');
    };
    
    const addInteraction = (contactId: number, interaction: Omit<Interaction, 'id'|'date'>) => {
        const newInteraction: Interaction = { id: Date.now(), ...interaction, date: new Date().toISOString() };
        setContacts(prev => prev.map(c => c.id === contactId ? { ...c, interactions: [newInteraction, ...c.interactions] } : c));
        addSystemLog(`Interaction logged with contact ID ${contactId}`, 'Chronicler');
    };

    const addSequence = (sequenceData: Omit<EmailSequence, 'id'>) => {
        const newSequence: EmailSequence = { id: Date.now(), ...sequenceData };
        setSequences(prev => [newSequence, ...prev]);
        addSystemLog(`Email sequence created: "${sequenceData.name}"`, 'Sequencer');
    };

    const updateSequence = (sequenceId: number, updates: Partial<EmailSequence>) => {
        setSequences(prev => prev.map(seq => seq.id === sequenceId ? { ...seq, ...updates } : seq));
    };
    
    const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
        const newEvent: CalendarEvent = { id: Date.now(), ...eventData };
        setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()));
        addSystemLog(`Event scheduled: "${eventData.title}"`, 'Pacesetter');
    };

    const exportSystemData = () => {
        const data = { tasks, documents, personas, contacts, scheduledPosts, brandGuidelines, experiments, sequences, events, userProfile, systemLogs, campaignBrief, strategyBrief, version: "3.0", exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `OPUS_MAGNUM_BACKUP_${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        addSystemLog("System data exported successfully.", "System", "success");
    };

    const importSystemData = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (data.tasks) setTasks(data.tasks);
                    if (data.documents) setDocuments(data.documents);
                    if (data.personas) setPersonas(data.personas);
                    if (data.contacts) setContacts(data.contacts);
                    if (data.scheduledPosts) setScheduledPosts(data.scheduledPosts);
                    if (data.brandGuidelines) setBrandGuidelines(data.brandGuidelines);
                    if (data.experiments) setExperiments(data.experiments);
                    if (data.sequences) setSequences(data.sequences);
                    if (data.events) setEvents(data.events);
                    if (data.userProfile) setUserProfile(data.userProfile);
                    if (data.systemLogs) setSystemLogs(data.systemLogs);
                    if (data.campaignBrief) setCampaignBrief(data.campaignBrief);
                    if (data.strategyBrief) setStrategyBrief(data.strategyBrief);

                    addSystemLog("System successfully restored from backup (Local Mode).", "System", "success");
                    resolve(true);
                } catch (err) { console.error("Import failed", err); resolve(false); }
            };
            reader.readAsText(file);
        });
    };

    const advanceWorkflow = () => {
        switch(workflowStep) {
            case 'idle': setWorkflowStep('strategy'); break;
            case 'strategy': setWorkflowStep('planning'); break;
            case 'planning': setWorkflowStep('production'); break;
            case 'production': setWorkflowStep('publishing'); break;
            case 'publishing': setWorkflowStep('idle'); break;
        }
    };

    // --- Economy Logic ---
    const checkCredits = (amount: number): boolean => {
        return credits >= amount;
    };

    const deductCredits = (amount: number, reason: string) => {
        setCredits(prev => Math.max(0, prev - amount));
        addSystemLog(`Resources consumed: -${amount} Credits (${reason})`, 'System', 'info');
    };
    
    const addCredits = (amount: number) => {
        setCredits(prev => Math.min(maxCredits, prev + amount));
        addSystemLog(`Resources added: +${amount} Credits`, 'System', 'success');
    };

    return (
        <TasksContext.Provider value={{ 
            user, login, logout, authError, dismissAuthError, enableOfflineMode, isOfflineMode, 
            tasks, addTask, addMultipleTasks, setTasks, updateTask, publishAndAnalyzeTask, 
            strategyBrief, setStrategyBrief, campaignBrief, setCampaignBrief, toolInput, setToolInput, 
            optimizationContext, setOptimizationContext, documents, addDocument, indexTaskAsset, 
            highlightedTaskIds, setHighlightedTaskIds, scheduledPosts, schedulePost, personas, addPersona, 
            brandGuidelines, setBrandGuidelines, nexusQuery, setNexusQuery, experiments, addExperiment, updateExperiment, 
            contacts, addContact, addInteraction, sequences, addSequence, updateSequence, events, addEvent, 
            userProfile, updateUserProfile, systemLogs, addSystemLog, exportSystemData, importSystemData, 
            workflowStep, setWorkflowStep, advanceWorkflow,
            credits, maxCredits, checkCredits, deductCredits, addCredits 
        }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = (): TasksContextType => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};
