import React from 'react';
import { ConductorTool } from '../components/ConductorTool';

interface ConductorProps {
  navigateTo: (page: string) => void;
}

const Conductor: React.FC<ConductorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Conductor</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Multi-Agent Orchestration Layer ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Geben Sie ein hochrangiges Ziel ein. Der Conductor analysiert Ihre Absicht, wählt den richtigen KI-Agenten aus und führt die Operation direkt hier aus. Dies ist Ihre zentrale Kommandozentrale.
                </p>
            </header>
            <main>
                <ConductorTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Conductor;