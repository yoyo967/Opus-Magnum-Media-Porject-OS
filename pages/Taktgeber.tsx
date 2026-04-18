
import React from 'react';
import { TaktgeberTool } from '../components/TaktgeberTool';

interface TaktgeberProps {
  navigateTo: (page: string) => void;
}

const Taktgeber: React.FC<TaktgeberProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Taktgeber</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Strategic Scheduler ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Ihr strategischer Kalender für die Planung und Orchestrierung Ihrer professionellen Interaktionen. Verwalten Sie Termine und synchronisieren Sie diese automatisch mit Ihrem CRM.
                </p>
            </header>
            <main>
                <TaktgeberTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Taktgeber;
