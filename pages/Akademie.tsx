
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTasks, Document } from '../contexts/AppContext';
import { GoogleGenAI } from '@google/genai';

interface AkademieProps {
    isEmbedded?: boolean;
}

const CATEGORIES: { id: Document['category'], name: string }[] = [
    { id: 'tactic', name: 'Taktik & Playbooks' },
    { id: 'operation', name: 'Operation & SOPs' },
    { id: 'knowledge', name: 'Wissen & Tutorials' },
    { id: 'strategy', name: 'Strategie & Vision' },
];

const TOOLS = ['Dirigent', 'Stratege', 'Meisterwerk', 'Visionär', 'Animator', 'Konversator', 'Auditor', 'Personalisator', 'Orakel', 'Mediathek', 'Akademie', 'Observatorium'];

// Icons
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.184m-1.5.184a6.01 6.01 0 01-1.5-.184m3.75 7.023a5.977 5.977 0 01-1.242 2.118a5.977 5.977 0 01-5.016 0a5.977 5.977 0 01-1.242-2.118M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const QuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const Akademie: React.FC<AkademieProps> = ({ isEmbedded }) => {
    const { documents, tasks } = useTasks();
    const [selectedCategory, setSelectedCategory] = useState<Document['category']>('tactic');
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    
    // Chat State
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
    const [isChatting, setIsChatting] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Quiz State
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    const filteredDocs = useMemo(() => {
        const sorted = documents.filter(d => d.category === selectedCategory).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (!selectedDoc && sorted.length > 0) {
            setSelectedDoc(sorted[0]);
        }
        return sorted;
    }, [documents, selectedCategory]);
    
    useEffect(() => {
        if(filteredDocs.length > 0 && !filteredDocs.some(d => d.id === selectedDoc?.id)) {
            setSelectedDoc(filteredDocs[0]);
        } else if (filteredDocs.length === 0) {
            setSelectedDoc(null);
        }
    }, [filteredDocs, selectedDoc]);

    // Reset quiz and chat when doc changes
    useEffect(() => {
        setIsQuizActive(false);
        setQuizData([]);
        setQuizFinished(false);
        setChatHistory([]);
        setSuggestedQuestions([]);
        
        const generateQuestions = async () => {
            if (!selectedDoc && !generatedContent) return;
            
            const content = generatedContent || selectedDoc?.content || '';
            const prompt = `Analyze the following text and generate 3 insightful questions a user might ask to learn more about it.
            Text: "${content.substring(0, 5000)}..."
            Return ONLY the 3 questions as a JSON array of strings.`;

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                // Updated to Gemini 3.0 for better questions
                const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
                const questions = JSON.parse(response.text.replace(/```json\n?|\n?```/g, ''));
                setSuggestedQuestions(questions);
            } catch (e) {
                console.error("Failed to generate questions", e);
                setSuggestedQuestions(["Fasse das Dokument zusammen.", "Was sind die wichtigsten Punkte?", "Erkläre die Fachbegriffe."]);
            }
        };
        generateQuestions();
    }, [selectedDoc, generatedContent]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isChatting]);

    const handleGenerate = async (type: 'sop' | 'tutorial', subject?: string) => {
        setIsGenerating(true);
        setGeneratedContent(null);
        setSelectedDoc(null);
        
        let prompt = '';
        if (type === 'sop') {
            prompt = `Act as a process optimization expert. Create a detailed Standard Operating Procedure (SOP) for our internal marketing approval workflow. Analyze the following project tasks, especially the status changes and feedback loops, and structure the SOP logically with clear steps, roles, and responsibilities.
            Tasks data: ${JSON.stringify(tasks, null, 2)}`;
        } else {
            prompt = `Act as a technical writer. Create a user-friendly tutorial on how to use the "${subject}" tool within our Project OS. Explain its purpose, key features, and provide a simple step-by-step example.`;
        }
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Updated to Gemini 3.0 for better documentation
            const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
            setGeneratedContent(response.text);
        } catch (error) {
            console.error("Content generation failed:", error);
            setGeneratedContent("Content could not be generated.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleChatSubmit = async (e?: React.FormEvent, queryOverride?: string) => {
        if (e) e.preventDefault();
        const query = queryOverride || chatQuery;
        if (!query.trim() || (!selectedDoc && !generatedContent)) return;

        const userMsg = query;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatQuery('');
        setIsChatting(true);
        
        setSuggestedQuestions(prev => prev.filter(q => q !== userMsg));

        const contextContent = generatedContent || selectedDoc?.content || '';

        const prompt = `You are an intelligent tutor assisting a user with a specific document.
        
        **Document Context:**
        "${contextContent.substring(0, 20000)}" ... (truncated if too long)

        **User Question:**
        "${userMsg}"

        Answer the question based ONLY on the document provided. Be concise, helpful, and encourage further learning. Use Markdown.
        `;

        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
             // Upgraded to Gemini 3.0 for better context handling in education
             const response = await ai.models.generateContentStream({ model: 'gemini-3-pro-preview', contents: prompt });
             
             let fullResponse = "";
             setChatHistory(prev => [...prev, { role: 'ai', text: '' }]);

             for await (const chunk of response) {
                 fullResponse += chunk.text;
                 setChatHistory(prev => {
                     const newHist = [...prev];
                     newHist[newHist.length - 1].text = fullResponse;
                     return newHist;
                 });
             }

        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "Entschuldigung, ich konnte die Antwort nicht generieren." }]);
        } finally {
            setIsChatting(false);
        }
    };

    const startQuiz = async () => {
        if (!selectedDoc && !generatedContent) return;
        setIsGeneratingQuiz(true);
        setIsQuizActive(true);
        setQuizFinished(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        
        const contextContent = generatedContent || selectedDoc?.content || '';
        
        const prompt = `Generate a quiz with 3 multiple-choice questions based on the text provided below.
        Each question should test comprehension of key concepts.
        
        Text: "${contextContent.substring(0, 10000)}..."
        
        Output JSON format:
        [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0, // 0-3
            "explanation": "Why this answer is correct."
          }
        ]`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Updated to Gemini 3.0 for smarter quizzes
            const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
            const quiz = JSON.parse(response.text.replace(/```json\n?|\n?```/g, ''));
            setQuizData(quiz);
        } catch (e) {
            console.error("Quiz generation failed", e);
            setIsQuizActive(false);
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === quizData[currentQuestionIndex].correctIndex) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setShowExplanation(false);
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };
    
    return (
        <div className={`${isEmbedded ? 'p-4' : 'container mx-auto px-6 py-16'} h-full flex flex-col`}>
            {!isEmbedded && (
                <header className="mb-12 text-center flex-shrink-0">
                    <h1 className="text-5xl font-bold text-[#F5F5F5]">Akademie</h1>
                    <p className="mt-2 text-[#888888] max-w-3xl mx-auto">Das kollektive Gedächtnis des Project OS. Hier werden Strategien zu Wissen, Prozesse zu Standards und Fragen zu Antworten.</p>
                </header>
            )}
            <main className={`grid lg:grid-cols-4 gap-8 ${isEmbedded ? 'h-full overflow-hidden' : 'min-h-[70vh]'}`}>
                <aside className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                    <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider px-2 mb-2">Wissens-Kategorien</h3>
                        <nav className="flex flex-col gap-1">
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left p-2 rounded-md text-sm transition-colors ${selectedCategory === cat.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>{cat.name}</button>
                            ))}
                        </nav>
                    </div>
                    <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider px-2 mb-2">Neural Interface</h3>
                         <div className="space-y-2">
                             <button onClick={() => handleGenerate('sop')} className="w-full text-center p-2 rounded-md text-sm bg-blue-900/50 hover:bg-blue-900/80 text-blue-200 transition-colors">SOP generieren</button>
                            <div className="relative group">
                                <button className="w-full text-center p-2 rounded-md text-sm bg-purple-900/50 hover:bg-purple-900/80 text-purple-200 transition-colors">Tutorial generieren</button>
                                <div className="absolute bottom-full mb-2 w-full p-2 bg-[#0A0A0A] border border-[#333333] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto flex flex-wrap gap-1 z-10">
                                    {TOOLS.map(tool => <button key={tool} onClick={() => handleGenerate('tutorial', tool)} className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-200 px-2 py-1 rounded-md">{tool}</button>)}
                                </div>
                            </div>
                         </div>
                    </div>
                </aside>

                <section className={`lg:col-span-3 flex gap-6 ${isEmbedded ? 'h-full overflow-hidden' : ''}`}>
                    {/* Document List & Viewer */}
                    <div className="flex-1 bg-[#1C1C1C] rounded-lg border border-[#333333] flex overflow-hidden">
                        <div className="w-1/3 border-r border-[#333333] overflow-y-auto bg-[#111]">
                            {filteredDocs.map(doc => (
                                 <button key={doc.id} onClick={() => { setSelectedDoc(doc); setGeneratedContent(null); }} className={`block w-full text-left p-4 border-b border-white/5 transition-colors ${selectedDoc?.id === doc.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                    <h4 className="font-semibold text-white text-sm truncate">{doc.title}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                </button>
                            ))}
                        </div>
                        <div className="w-2/3 p-8 overflow-y-auto">
                            {isGenerating && <p className="text-gray-400 animate-pulse">KI schreibt...</p>}
                            {(selectedDoc || generatedContent) && (
                                <div className="prose prose-sm prose-invert text-gray-300 max-w-none">
                                    {selectedDoc && <h1 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{selectedDoc.title}</h1>}
                                    <div dangerouslySetInnerHTML={{ __html: (generatedContent || selectedDoc?.content || '').replace(/\n/g, '<br />').replace(/# (.*?)\n/g, '<h1>$1</h1>').replace(/## (.*?)\n/g, '<h2>$1</h2>').replace(/\* \*(.*?)\* \*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Neural Tutor (Context Chat & Quiz) */}
                    {(selectedDoc || generatedContent) && (
                         <div className="w-80 bg-[#0f0f0f] rounded-lg border border-purple-500/20 flex flex-col shadow-xl">
                            <div className="p-4 border-b border-[#333333] bg-purple-900/10 flex justify-between items-center flex-shrink-0">
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><ChatIcon /> Neural Tutor</h3>
                                    <p className="text-[10px] text-purple-300 mt-1">Kontext-basierte Lernhilfe</p>
                                </div>
                                <button onClick={startQuiz} className="text-purple-300 hover:text-white transition-colors p-1" title="Wissen testen">
                                    <QuizIcon />
                                </button>
                            </div>
                            
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0f0f0f]">
                                {isQuizActive ? (
                                    // QUIZ MODE
                                    isGeneratingQuiz ? (
                                        <div className="text-center pt-10">
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-400">Erstelle Quizfragen...</p>
                                        </div>
                                    ) : quizFinished ? (
                                        <div className="text-center pt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <h4 className="text-lg font-bold text-white">Ergebnis</h4>
                                            <div className="text-4xl font-bold text-purple-400">{score} / {quizData.length}</div>
                                            <p className="text-xs text-gray-400">
                                                {score === quizData.length ? "Perfekt! Sie haben das Material gemeistert." : "Guter Versuch. Wiederholen Sie die Lektion für volle Punktzahl."}
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={startQuiz} className="bg-purple-600 text-white px-4 py-2 rounded text-xs hover:bg-purple-500">Quiz wiederholen</button>
                                                <button onClick={() => setIsQuizActive(false)} className="bg-white/10 text-white px-4 py-2 rounded text-xs hover:bg-white/20">Zurück zum Chat</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                                                <span>Frage {currentQuestionIndex + 1}/{quizData.length}</span>
                                                <span>Score: {score}</span>
                                            </div>
                                            <p className="text-sm text-white font-medium">{quizData[currentQuestionIndex].question}</p>
                                            <div className="space-y-2">
                                                {quizData[currentQuestionIndex].options.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => !showExplanation && handleAnswer(i)}
                                                        disabled={showExplanation}
                                                        className={`w-full text-left p-3 rounded text-xs border transition-all ${
                                                            showExplanation 
                                                                ? i === quizData[currentQuestionIndex].correctIndex 
                                                                    ? 'bg-green-500/20 border-green-500 text-green-100'
                                                                    : i === selectedOption 
                                                                        ? 'bg-red-500/20 border-red-500 text-red-100'
                                                                        : 'bg-[#111] border-[#333] text-gray-500'
                                                                : 'bg-[#111] border-[#333] text-gray-300 hover:bg-[#222] hover:border-gray-500'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                            {showExplanation && (
                                                <div className="mt-4 bg-blue-900/20 p-3 rounded border border-blue-500/20">
                                                    <p className="text-[10px] text-blue-300 mb-1 font-bold">ERKLÄRUNG</p>
                                                    <p className="text-xs text-gray-300">{quizData[currentQuestionIndex].explanation}</p>
                                                    <button onClick={nextQuestion} className="w-full mt-3 bg-white text-black py-2 rounded text-xs font-bold hover:bg-gray-200">
                                                        {currentQuestionIndex < quizData.length - 1 ? "Nächste Frage" : "Ergebnis ansehen"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    // CHAT MODE
                                    <>
                                        {chatHistory.length === 0 && (
                                            <div className="text-center pt-4">
                                                <p className="text-xs text-gray-500 italic mb-4">Ich habe das Dokument analysiert. Womit kann ich helfen?</p>
                                                <div className="flex flex-col gap-2">
                                                    {suggestedQuestions.map((q, i) => (
                                                        <button 
                                                            key={i} 
                                                            onClick={() => handleChatSubmit(undefined, q)}
                                                            className="text-[10px] bg-white/5 hover:bg-white/10 text-left p-2 rounded border border-white/5 text-gray-300 transition-colors flex gap-2"
                                                        >
                                                            <span className="text-purple-400 mt-0.5"><LightbulbIcon /></span>
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {chatHistory.map((msg, i) => (
                                            <div key={i} className={`text-xs p-3 rounded-lg leading-relaxed ${msg.role === 'user' ? 'bg-blue-900/20 text-blue-100 ml-4 border border-blue-500/20' : 'bg-gray-800/30 text-gray-300 mr-4 border border-white/5'}`}>
                                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                                            </div>
                                        ))}
                                        {isChatting && <div className="text-xs text-purple-400 animate-pulse pl-2">Tutor schreibt...</div>}
                                        <div ref={chatEndRef} />
                                    </>
                                )}
                            </div>

                            {!isQuizActive && (
                                <form onSubmit={(e) => handleChatSubmit(e)} className="p-3 border-t border-[#333333] bg-[#111] flex-shrink-0">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={chatQuery} 
                                            onChange={e => setChatQuery(e.target.value)} 
                                            placeholder="Frage stellen..." 
                                            className="w-full bg-[#222] text-white text-xs px-3 py-2 pr-8 rounded-md border border-[#333] focus:border-purple-500 outline-none transition-colors"
                                        />
                                        <button type="submit" disabled={!chatQuery.trim() || isChatting} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50">
                                            <SendIcon />
                                        </button>
                                    </div>
                                </form>
                            )}
                         </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Akademie;
