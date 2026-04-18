import React, { useState, useEffect } from 'react';
import { Task } from '../contexts/AppContext';

interface PresentationViewProps {
    tasks: Task[];
    onClose: () => void;
}

type Slide = {
    type: 'title' | 'task' | 'end';
    content: string | Task;
    subContent?: string;
};

const Logo: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19.5" stroke="#FFFFFF" strokeOpacity="0.5" />
    <circle cx="20" cy="20" r="16" fill="#F5F5F5" />
  </svg>
);


export const PresentationView: React.FC<PresentationViewProps> = ({ tasks, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides: Slide[] = [
        { type: 'title', content: 'Projekt-Meilensteine', subContent: 'Project OS Innovation' },
        ...tasks.map(task => ({ type: 'task' as 'task', content: task })),
        { type: 'end', content: 'Projektfortschritt - Q4 2025', subContent: 'Wo Strategie auf Kunst trifft.' },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setCurrentSlide(s => (s < slides.length - 1 ? s + 1 : s));
            } else if (e.key === 'ArrowLeft') {
                setCurrentSlide(s => (s > 0 ? s - 1 : s));
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [slides.length, onClose]);

    const renderSlide = (slide: Slide) => {
        switch (slide.type) {
            case 'title':
                return (
                    <div className="text-center flex flex-col items-center justify-center gap-6">
                        <Logo />
                        <div>
                            <h1 className="text-4xl font-medium text-[#F5F5F5] block leading-none">OPUS MAGNUM MEDIA<sup>®</sup></h1>
                            <span className="text-sm text-[#888888] block leading-none mt-2">The Next Evolution in Enterprise Strategy and Creative Excellence</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-5xl font-bold text-white tracking-[-1px]">{slide.content as string}</p>
                            <p className="mt-2 text-lg text-gray-400">{slide.subContent}</p>
                        </div>
                    </div>
                );
            case 'end':
                 return (
                    <div className="text-center">
                        <h2 className="text-4xl font-medium text-white">{slide.content as string}</h2>
                        <div className="mt-8 h-px w-24 bg-gray-500 mx-auto"></div>
                        <p className="mt-8 text-lg text-gray-400">{slide.subContent}</p>
                    </div>
                );
            case 'task':
                const task = slide.content as Task;
                if (task.imageUrl) {
                    return (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                             <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                                <img src={task.imageUrl} alt={task.title} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h3 className="text-3xl font-bold text-white text-center">{task.title}</h3>
                                {task.description && <p className="mt-2 text-md text-gray-300 max-w-2xl text-center">{task.description}</p>}
                             </div>
                        </div>
                    );
                }
                return (
                     <div className="text-center max-w-4xl mx-auto">
                        <h3 className="text-5xl font-bold text-white">{task.title}</h3>
                        {task.description && <p className="mt-4 text-xl text-gray-300 leading-relaxed">{task.description}</p>}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full h-full flex items-center justify-center relative">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="absolute w-full h-full flex items-center justify-center transition-opacity duration-500 ease-in-out"
                        style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 10 : 0 }}
                    >
                        {renderSlide(slide)}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {slides.map((_, index) => (
                     <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-white scale-125' : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};