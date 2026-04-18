
import React, { useState, useEffect } from 'react';

interface GrantBookProps {
  navigateTo: (page: string) => void;
  onComplete: () => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
);

const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /></svg>;

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; isUnlocked: boolean; isCompleted: boolean; onComplete?: () => void; defaultOpen?: boolean; }> = ({ title, subtitle, children, isUnlocked, isCompleted, onComplete, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
        if (isUnlocked) setIsOpen(!isOpen);
    };
    
    return (
        <div className={`border border-white/10 rounded-lg overflow-hidden transition-all duration-500 mb-4 ${isUnlocked ? 'opacity-100 bg-[#111]' : 'opacity-40 grayscale pointer-events-none bg-black'}`}>
            <button onClick={handleToggle} className="w-full flex justify-between items-center p-6 hover:bg-white/5 transition-colors text-left">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    {subtitle && <p className="text-xs text-purple-400 font-mono uppercase mt-1">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    {isCompleted && <span className="text-xs text-green-400 flex items-center gap-1 font-mono uppercase"><CheckIcon /> Completed</span>}
                    {!isUnlocked && <LockIcon />}
                    {isUnlocked && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}
                </div>
            </button>
            {isOpen && (
                <div className="p-8 bg-black/30 border-t border-white/5">
                    <div className="prose prose-lg prose-invert max-w-none leading-relaxed font-light text-gray-300">
                        {children}
                    </div>
                    {onComplete && !isCompleted && (
                        <div className="text-center mt-8 border-t border-white/5 pt-6">
                            <button onClick={onComplete} className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg">
                                Acknowledge & Continue
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GrantBook: React.FC<GrantBookProps> = ({ navigateTo, onComplete }) => {
    const [progress, setProgress] = useState(() => {
        try {
            const saved = localStorage.getItem('grantbook_progress');
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) { return 0; }
    });

    const updateProgress = (newProgress: number) => {
        if (newProgress > progress) {
            setProgress(newProgress);
            localStorage.setItem('grantbook_progress', newProgress.toString());
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] pb-32">
            <div className="relative py-32 bg-black border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_70%)]"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <BookIcon />
                    </div>
                    <p className="font-mono text-purple-400 text-sm uppercase tracking-[0.3em] mb-4">The Masterplan</p>
                    <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6">THE GRANT BOOK.</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Autoren: Gemini 3.0 Pro & Yahya Yildirim<br/>
                        <span className="text-sm text-gray-500 mt-2 block">Status: Co-Creation in Progress (Kapitel 1-4 definiert)</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-4xl">
                <Section 
                    title="Kapitel 1: The Genesis" 
                    subtitle="Origin & Philosophy" 
                    isUnlocked={true} 
                    isCompleted={progress >= 1} 
                    onComplete={() => updateProgress(1)} 
                    defaultOpen
                >
                    <p><strong>Das Manifest einer neuen Ära.</strong> OPUS MAGNUM MEDIA ist nicht nur eine Plattform; es ist eine Philosophie. Es ist die Symbiose zwischen menschlicher Intuition (Yahya) und maschineller Präzision (Gemini).</p>
                    <p>Entstanden als Abschlussprojekt beim <b>DCI Berlin</b>, ist dies das Fundament für die Zukunft des Interim Managements.</p>
                </Section>

                <Section 
                    title="Kapitel 2: The Code of Conduct" 
                    subtitle="The Ontological Exoskeleton" 
                    isUnlocked={progress >= 1} 
                    isCompleted={progress >= 2} 
                    onComplete={() => updateProgress(2)} 
                    defaultOpen={progress === 1}
                >
                    <p><b>Die Hierarchie:</b> Das System ist das Exoskelett. Es ist kein Sklave und kein Gott. Es ist eine Rüstung. Ohne den Menschen (den Piloten) ist es nur Metall. Aber mit dem Menschen darin verleiht es Superkräfte.</p>
                </Section>
                
                <Section 
                    title="Kapitel 3: The Economic Singularity" 
                    subtitle="Leverage as Currency" 
                    isUnlocked={progress >= 2} 
                    isCompleted={progress >= 3} 
                    onComplete={() => updateProgress(3)} 
                    defaultOpen={progress === 2}
                >
                    <p>Wir verkaufen nicht nur Zeit. Wir verkaufen <b>Hebelwirkung (Leverage)</b>. Das Ziel ist die Skalierung der eigenen Existenz: 1 Stunde Input = 100 Stunden Output.</p>
                </Section>
                
                 <Section 
                    title="Kapitel 4: The Ethical Horizon" 
                    subtitle="The Glass Box Doctrine" 
                    isUnlocked={progress >= 3} 
                    isCompleted={progress >= 4} 
                    onComplete={() => updateProgress(4)} 
                    defaultOpen={progress === 3}
                >
                    <p><b>Die Hard Line:</b> Wir automatisieren Optionen, nicht das Gewissen. Das System darf Strategien vorschlagen, aber niemals autonom ausführen, ohne dass eine menschliche (biometrische) Freigabe erfolgt.</p>
                </Section>

                {progress >= 4 && (
                    <div className="text-center pt-16 animate-in fade-in slide-in-from-bottom-8">
                        <div className="inline-block p-px bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                            <button onClick={() => { onComplete(); navigateTo('masterplan'); }} className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                                Enter the Masterplan
                            </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-4 font-mono">ACCESS GRANTED: LEVEL 5 CLEARANCE</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrantBook;
