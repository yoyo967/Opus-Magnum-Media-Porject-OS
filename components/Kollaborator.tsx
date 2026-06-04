import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Part } from '@google/genai';
import { Task, useTasks, ChatMessage } from '../contexts/AppContext';
import { SparkleIcon } from '../constants';

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const ActionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

interface KollaboratorProps {
    task: Task;
    onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

export const Kollaborator: React.FC<KollaboratorProps> = ({ task, onUpdateTask }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(task.chatHistory || []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { campaignBrief } = useTasks();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const ai = useRef(getGeminiClient()).current;
    
    // Ref to hold the latest messages to avoid stale closures in the cleanup effect
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const createChecklistFunction: FunctionDeclaration = {
        name: 'create_checklist',
        description: 'Creates a checklist for the current task to break it down into smaller steps.',
        parameters: { type: Type.OBJECT, properties: { items: { type: Type.ARRAY, description: 'A list of strings representing the checklist items.', items: { type: Type.STRING } } }, required: ['items'] },
    };

    const updateDescriptionFunction: FunctionDeclaration = {
        name: 'update_description',
        description: 'Updates the main description of the current task. Use this when asked to rewrite or improve the text.',
        parameters: { type: Type.OBJECT, properties: { new_description: { type: Type.STRING, description: 'The new, updated text for the task description.' } }, required: ['new_description'] },
    };
    
    const updateChecklistFunction: FunctionDeclaration = {
        name: 'update_checklist',
        description: 'Updates an existing checklist. Can add items, remove items, or toggle item status (done/open).',
        parameters: {
            type: Type.OBJECT,
            properties: {
                action: { type: Type.STRING, enum: ['add', 'remove', 'toggle'], description: 'The action to perform.' },
                items: { type: Type.ARRAY, description: "A list of checklist item texts to apply the action to.", items: { type: Type.STRING } },
            },
            required: ['action', 'items'],
        },
    };

    const tools = [{ functionDeclarations: [createChecklistFunction, updateDescriptionFunction, updateChecklistFunction] }, { googleSearch: {} }];

    useEffect(() => {
        setMessages((task.chatHistory || []).map((msg, index) => ({ ...msg, id: msg.id || Date.now() + index })));
    }, [task.chatHistory, task.id]);


    useEffect(() => {
        // This effect now runs only on mount and unmount.
        return () => {
            // On unmount (when the modal closes), save the latest chat history.
            // We use the ref to ensure we have the most up-to-date messages.
            if (messagesRef.current.length > 0) {
                 onUpdateTask(task.id, { chatHistory: messagesRef.current });
            }
        };
    }, [task.id, onUpdateTask]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    

    const handleSendMessage = async (promptText: string) => {
        if (!promptText.trim()) return;

        const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: promptText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const systemInstruction = `You are "Conversator", an AI assistant in a project management tool. You help complete tasks.
        Current Context:
        - Campaign Brief: ${JSON.stringify(campaignBrief)}
        - Task Title: "${task.title}"
        - Task Description: "${task.description}"
        ${task.imageUrl ? '- An image is attached to the task.' : ''}
        Be helpful, proactive, and concise. If a user asks you to perform an action (e.g., create/edit a checklist or update the description), explain in your text response what you will do, and return the corresponding FunctionCall so the user can confirm the action. You can also edit an existing checklist by adding, removing, or marking items as done. Do not perform the action yourself, only suggest it. Example: If asked to shorten the description, reply with "I have drafted a shorter version for you." and provide the "update_description" FunctionCall. If you receive a research request, use the Google Search function and present the results.`;
        
        try {
            const history = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const userParts: Part[] = [{ text: promptText }];
            if (task.imageUrl) {
                const mimeType = task.imageUrl.substring(task.imageUrl.indexOf(':') + 1, task.imageUrl.indexOf(';'));
                const imagePart: Part = { inlineData: { mimeType: mimeType || 'image/jpeg', data: task.imageUrl.split(',')[1] } };
                userParts.unshift(imagePart);
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Upgraded to Gemini 2.5 Pro
                contents: [...history, { role: 'user', parts: userParts }],
                config: { systemInstruction, tools },
            });

            const functionCalls = response.functionCalls;
            let responseText = response.text;

            if (!responseText && functionCalls && functionCalls.length > 0) {
                responseText = "I have a suggestion for you:";
            }

            if (responseText || (functionCalls && functionCalls.length > 0)) {
                const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
                let sourcesText = '';
                if (groundingMetadata?.groundingChunks) {
                    const sources = groundingMetadata.groundingChunks.map((chunk: any) => chunk.web ? `[${chunk.web.title || 'Source'}](${chunk.web.uri})` : null).filter(Boolean);
                    if (sources.length > 0) sourcesText = `\n\n**Sources:**\n* ${sources.join('\n* ')}`;
                }
                const aiMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: responseText + sourcesText, functionCalls: functionCalls || [] };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("Conversator AI Error:", error);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Sorry, I couldn't process the request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExecuteFunctionCall = (messageId: number, fc: any) => {
        let confirmationText = '';
        if (fc.name === 'create_checklist' && fc.args.items) {
            const items = fc.args.items as string[];
            const newChecklist = items.map((item: string, index: number) => ({ id: Date.now() + index, text: item, completed: false }));
            onUpdateTask(task.id, { checklist: [...(task.checklist || []), ...newChecklist] });
            confirmationText = `✅ Checklist with ${items.length} items created.`;
        } else if (fc.name === 'update_description' && fc.args.new_description) {
            const new_description = fc.args.new_description as string;
            onUpdateTask(task.id, { description: new_description });
            confirmationText = `✅ Task description updated.`;
        } else if (fc.name === 'update_checklist' && fc.args.action && fc.args.items) {
            const { action, items: itemTexts } = fc.args as { action: 'add' | 'remove' | 'toggle', items: string[] };
            const currentChecklist = task.checklist || [];
            let updatedChecklist = [...currentChecklist];
            let changedItemsCount = 0;

            if (action === 'add') {
                const newItems = itemTexts.map((text: string, index: number) => ({ id: Date.now() + index, text, completed: false }));
                updatedChecklist = [...updatedChecklist, ...newItems];
                changedItemsCount = newItems.length;
            } else if (action === 'remove') {
                updatedChecklist = currentChecklist.filter(item => {
                    if (itemTexts.includes(item.text)) {
                        changedItemsCount++;
                        return false;
                    }
                    return true;
                });
            } else if (action === 'toggle') {
                updatedChecklist = currentChecklist.map(item => {
                    if (itemTexts.includes(item.text)) {
                        changedItemsCount++;
                        return { ...item, completed: !item.completed };
                    }
                    return item;
                });
            }

            if (changedItemsCount > 0) {
                onUpdateTask(task.id, { checklist: updatedChecklist });
                confirmationText = `✅ Checklist updated: ${changedItemsCount} item(s) ${action === 'add' ? 'added' : action === 'remove' ? 'removed' : 'toggled'}.`;
            } else {
                 confirmationText = `🤔 I couldn't find matching items in the checklist to perform the action.`;
            }
        }


        if (confirmationText) {
            const confirmationMessage: ChatMessage = { id: Date.now(), sender: 'ai', text: confirmationText };
            setMessages(prev => [...prev.map(msg => msg.id === messageId ? { ...msg, functionCalls: [] } : msg), confirmationMessage]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const getFunctionCallButtonText = (fcName: string) => {
        switch (fcName) {
            case 'update_description': return 'Apply Description';
            case 'create_checklist': return 'Create Checklist';
            case 'update_checklist': return 'Update Checklist';
            default: return `Execute: ${fcName}`;
        }
    };

    return (
        <div className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-md overflow-hidden h-full">
            <h4 className="text-sm font-semibold text-white p-3 border-b border-[#333333] bg-black/20 flex items-center gap-2">
                <SparkleIcon />
                Conversator AI
            </h4>
            <div className="flex-1 p-3 space-y-4 overflow-y-auto" ref={messagesEndRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`prose prose-sm prose-invert max-w-md rounded-lg px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1C1C1C]'}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}>
                        </div>
                        {msg.functionCalls && msg.functionCalls.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2 max-w-md">
                                {msg.functionCalls.map((fc, fcIndex) => (
                                    <button 
                                        key={fcIndex}
                                        onClick={() => handleExecuteFunctionCall(msg.id, fc)}
                                        className="text-xs bg-purple-600/50 text-purple-200 px-3 py-1.5 rounded-full hover:bg-purple-600/80 transition-colors flex items-center gap-2"
                                    >
                                        <ActionIcon />
                                        {getFunctionCallButtonText(fc.name)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && ( <div className="flex items-start gap-2"><div className="bg-[#1C1C1C] rounded-lg px-3 py-2 text-sm animate-pulse">...</div></div> )}
                 {messages.length === 0 && !isLoading && (
                    <div className="text-center text-xs text-gray-500 p-8">
                        <p>This is your AI Conversator.</p>
                        <p className="mt-1">Ask questions, have drafts written, or break tasks down into steps.</p>
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-[#333333] space-y-2">
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleSendMessage("Break this task down into sub-steps and create a checklist.")} disabled={isLoading} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md hover:bg-white/20 transition-colors flex items-center gap-1 disabled:opacity-50">
                        Create Checklist
                    </button>
                    <button onClick={() => handleSendMessage("Rewrite the task description to make it more concise and action-oriented.")} disabled={isLoading} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md hover:bg-white/20 transition-colors disabled:opacity-50">
                        Improve Description
                    </button>
                     <button onClick={() => handleSendMessage(`Research current statistics on the topic of this task: "${task.title}"`)} disabled={isLoading} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md hover:bg-white/20 transition-colors disabled:opacity-50">
                        Research
                    </button>
                    {task.imageUrl && (
                         <button onClick={() => handleSendMessage("Analyze the attached image and suggest 3 concrete improvements to increase engagement.")} disabled={isLoading} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md hover:bg-white/20 transition-colors flex items-center gap-1 disabled:opacity-50">
                            Analyze Image
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Conversator..." className="flex-1 w-full bg-[#1C1C1C] text-white px-3 py-1.5 rounded-md border border-[#333333] focus:outline-none focus:ring-1 focus:ring-white/50 text-sm" disabled={isLoading}/>
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-white/10 text-white rounded-md hover:bg-white/20 disabled:opacity-50"><SendIcon /></button>
                </form>
            </div>
        </div>
    );
};
