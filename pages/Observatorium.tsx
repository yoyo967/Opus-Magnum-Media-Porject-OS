
import React from 'react';
import { ObservatoriumTool } from '../components/ObservatoriumTool';
import { useTasks } from '../contexts/AppContext';
import { NeuralBackground } from '../components/NeuralBackground';

interface ObservatoriumProps {
  navigateTo: (page: string) => void;
}

const Observatorium: React.FC<ObservatoriumProps> = ({ navigateTo }) => {
    const { userProfile } = useTasks();

    return (
        <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
            <NeuralBackground opacity={0.1} />
            
            <div className="container mx-auto px-6 py-16 relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-[#F5F5F5]">Mission Control</h1>
                    <p className="mt-2 text-purple-300 font-mono">:: Project OS Cockpit ::</p>
                    
                    {userProfile ? (
                        <div className="mt-6 max-w-3xl mx-auto p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg animate-[fadeIn_0.8s_ease-out] backdrop-blur-sm">
                            <p className="text-white font-medium mb-1">Willkommen zurück, {userProfile.role} {userProfile.name}.</p>
                            <p className="text-gray-400 text-sm">Aktive Direktive: <span className="text-purple-300 italic">"{userProfile.mission}"</span></p>
                        </div>
                    ) : (
                        <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                            Ihre strategische Kommandozentrale. Erhalten Sie einen ganzheitlichen Überblick über alle Marketing-Operationen, erkennen Sie Engpässe und erhalten Sie KI-gesteuerte Empfehlungen von AURORA.
                        </p>
                    )}
                </header>
                <main>
                    <ObservatoriumTool navigateTo={navigateTo} />
                </main>
            </div>
        </div>
    );
};

export default Observatorium;
