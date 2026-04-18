import React from 'react';
import { EnsembleTool } from '../components/EnsembleTool';

const Ensemble: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Ensemble</h1>
                <p className="mt-2 text-purple-300 font-mono">:: AI Team Planner ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Stellen Sie das perfekte Team für Ihr Projekt zusammen. Beschreiben Sie Ihr Ziel, und lassen Sie die KI eine optimale Teamstruktur mit den benötigten Rollen, Verantwortlichkeiten und Skills vorschlagen.
                </p>
            </header>
            <main>
                <EnsembleTool />
            </main>
        </div>
    );
};

export default Ensemble;
