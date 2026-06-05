import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_KNOWLEDGE } from '@/tenants';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks } from '../contexts/AppContext';

// --- TYPES ---
interface SocialPost {
    platform: 'LinkedIn' | 'Instagram';
    text: string;
    hashtags: string[];
    image_prompt?: string;
    image_url?: string;
}

// --- ICONS ---
const LinkedInIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266.058 1.644.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059 1.281.073 1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162-2.759-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.44 1.441-1.44-.645-1.44-1.441-1.44z"></path></svg>;
const SchedulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;
const TrendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75" /></svg>;
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;


export const ResonatorTool: React.FC<{ navigateTo: (page: string) => void; }> = ({ navigateTo }) => {
    const { setToolInput, brandGuidelines } = useTasks();
    const [coreMessage, setCoreMessage] = useState('Unser neues Feature "Stratege" ist jetzt live! Es nutzt KI, um in Sekunden komplette Marketingpläne zu erstellen.');
    const [trendContext, setTrendContext] = useState('');
    const [hookType, setHookType] = useState('None');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPosts, setGeneratedPosts] = useState<SocialPost[]>([]);
    const [useBrandVoice, setUseBrandVoice] = useState(true);

    const socialPostSchema = {
        type: Type.OBJECT,
        properties: {
            posts: {
                type: Type.ARRAY,
                description: 'Eine Liste von Social-Media-Posts für verschiedene Plattformen.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        platform: { type: Type.STRING, enum: ['LinkedIn', 'Instagram'] },
                        text: { type: Type.STRING, description: 'Der für die Plattform optimierte Text.' },
                        hashtags: { type: Type.ARRAY, description: 'Eine Liste relevanter Hashtags.', items: { type: Type.STRING } },
                        image_prompt: { type: Type.STRING, description: 'Nur für Instagram: Ein detaillierter Prompt zur Erstellung eines passenden Bildes.' },
                    }
                }
            }
        }
    };

    const handleGeneratePosts = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPosts([]);

        let hookInstruction = '';
        switch (hookType) {
            case 'Contrarian': hookInstruction = 'Start with a controversial or counter-intuitive statement to grab attention immediately.'; break;
            case 'Story': hookInstruction = 'Start with "I remember when..." or a micro-story that relates to the problem.'; break;
            case 'Data': hookInstruction = 'Start with a shocking statistic or hard data point.'; break;
            case 'Question': hookInstruction = 'Start with a provocative question that the user feels compelled to answer.'; break;
            default: hookInstruction = 'Start with a strong, professional hook.';
        }

        let trendInstruction = '';
        if (trendContext.trim()) {
            trendInstruction = `Connect the core message to the current trend/topic: "${trendContext}". Use this trend as a bridge to make the content more relevant and timely (Trend Jacking).`;
        }
        
        let brandInstruction = '';
        if (useBrandVoice && brandGuidelines) {
            brandInstruction = `IMPORTANT: Adopt the following Brand Voice strictly: "${brandGuidelines.voice}". The tone must reflect this personality.`;
        }

        const prompt = `Act as a world-class social media copywriter. Create two social media posts based on the core message, one for LinkedIn and one for Instagram.
        
        Core Message: "${coreMessage}"
        ${trendInstruction}
        ${brandInstruction}
        
        Framework for the Hook (Opening): ${hookInstruction}

        For LinkedIn: Professional but engaging tone, B2B focus, format for readability (line breaks). Use Gemini 2.5 Pro reasoning to ensure high virality potential.
        For Instagram: Visual-first, use emojis, casual tone. Generate a creative, detailed prompt for an accompanying image (do not create the image itself, just the prompt description). 
        
        Respond ONLY with a JSON object that adheres to the provided schema.`;

        try {
            const ai = getGeminiClient();
            // Step 1: Generate text content and image prompt
            // Upgraded to Gemini 2.5 Pro for superior creative writing and hook generation
            const textResponse = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: socialPostSchema, systemInstruction: MIRROU_KNOWLEDGE }
            });
            
            let { posts }: { posts: SocialPost[] } = JSON.parse(textResponse.text);

            // Step 2: Generate image for Instagram post if prompt exists
            const instagramPost = posts.find(p => p.platform === 'Instagram');
            if (instagramPost && instagramPost.image_prompt) {
                let imagePrompt = instagramPost.image_prompt;
                if(useBrandVoice && brandGuidelines) {
                    imagePrompt += ` . Visual Style: ${brandGuidelines.visual}. Colors: ${brandGuidelines.colors.join(', ')}.`;
                }
                
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: imagePrompt,
                    config: { numberOfImages: 1, aspectRatio: '1:1' }
                });
                instagramPost.image_url = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
            }

            setGeneratedPosts(posts);

        } catch (e) {
            console.error("Social post generation failed:", e);
            setError("Inhalte konnten nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSchedule = (post: SocialPost) => {
        const sourceTaskId = Date.now(); // Create a transient ID
        setToolInput({
            tool: 'publisher',
            sourceTaskId,
            // We create a temporary task-like object for the publisher
            prompt: post.text,
            imageUrl: post.image_url,
        });
        navigateTo('publisher');
    };

    const PostPreview: React.FC<{ post: SocialPost }> = ({ post }) => {
        const Icon = post.platform === 'LinkedIn' ? LinkedInIcon : InstagramIcon;
        return (
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <Icon />
                        <h4 className="font-semibold text-white">{post.platform}</h4>
                    </div>
                </div>
                {post.image_url && (
                    <div className="aspect-square bg-black rounded-md overflow-hidden mb-3">
                        <img src={post.image_url} alt="Generated for post" className="w-full h-full object-cover" />
                    </div>
                )}
                <p className="text-sm text-gray-300 whitespace-pre-wrap flex-grow">{post.text}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                    {(post.hashtags || []).map(tag => <span key={tag} className="text-xs text-blue-400">{tag}</span>)}
                </div>
                <button onClick={() => handleSchedule(post)} className="w-full mt-4 bg-white/10 text-white text-xs py-1.5 rounded-full hover:bg-white/20 flex items-center justify-center">
                    <SchedulerIcon /> Planen
                </button>
            </div>
        );
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 space-y-6 h-fit">
                <h3 className="text-lg font-semibold text-white">Content Engine</h3>
                
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Kernbotschaft</label>
                    <textarea value={coreMessage} onChange={e => setCoreMessage(e.target.value)} rows={4} className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm focus:border-purple-500 outline-none"/>
                </div>

                {brandGuidelines && (
                    <div 
                        onClick={() => setUseBrandVoice(!useBrandVoice)}
                        className={`flex items-center gap-2 text-xs p-2 rounded border cursor-pointer transition-colors ${useBrandVoice ? 'text-purple-300 bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30' : 'text-gray-400 bg-transparent border-gray-700 hover:border-gray-500'}`}
                    >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${useBrandVoice ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                            {useBrandVoice && <ShieldCheckIcon />}
                        </div>
                        <div>
                            <p className="font-semibold">Brand Voice Injection</p>
                            <p className="opacity-70 truncate max-w-[250px]">Tone: {brandGuidelines.voice}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <TrendIcon /> Trend Jacking (Optional)
                    </label>
                    <input 
                        type="text" 
                        value={trendContext} 
                        onChange={e => setTrendContext(e.target.value)} 
                        placeholder="z.B. 'Apple Vision Pro Launch', 'Weihnachtsgeschäft'" 
                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm focus:border-purple-500 outline-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Verbindet Ihre Nachricht mit einem aktuellen Thema.</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <BoltIcon /> Viral Hook Framework
                    </label>
                    <select 
                        value={hookType} 
                        onChange={e => setHookType(e.target.value)} 
                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] text-sm focus:border-purple-500 outline-none"
                    >
                        <option value="None">Standard</option>
                        <option value="Contrarian">The Contrarian (Gegen den Strom)</option>
                        <option value="Story">Micro-Storytelling</option>
                        <option value="Data">Data Shock (Zahlen zuerst)</option>
                        <option value="Question">Provocative Question</option>
                    </select>
                </div>

                <button onClick={handleGeneratePosts} disabled={isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50 transition-transform hover:scale-105">
                    {isLoading ? 'Resonanz wird berechnet...' : 'Social Posts erstellen'}
                </button>
                <div className="text-[10px] text-gray-500 text-center">Powered by Gemini 2.5 Pro</div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {isLoading && Array(2).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] animate-pulse h-96">
                        <div className="h-6 w-1/3 bg-gray-700/50 rounded mb-3"></div>
                        <div className="aspect-square bg-gray-700/50 rounded mb-3"></div>
                        <div className="h-4 w-full bg-gray-700/50 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-700/50 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-700/50 rounded"></div>
                    </div>
                ))}
                {!isLoading && generatedPosts.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 py-20 border border-dashed border-[#333] rounded-lg">
                        <p>Definieren Sie Ihre Botschaft links, um zu starten.</p>
                    </div>
                )}
                {generatedPosts.map(post => <PostPreview key={post.platform} post={post} />)}
            </div>
        </div>
    );
};
