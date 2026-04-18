import React from 'react';
import { AuditorTool } from '../components/AuditorTool';

const Auditor: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16 flex flex-col items-center">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Auditor</h1>
                <p className="mt-2 text-[#888888] max-w-2xl mx-auto">Ihr sprachgesteuerter Projektassistent. Führen Sie natürliche Gespräche und verwalten Sie Ihr Projekt-Board mit Sprachbefehlen wie "Erstelle eine Aufgabe" oder "Verschiebe Task X in Erledigt".</p>
            </header>
            <main className="w-full">
                <AuditorTool />
            </main>
        </div>
    );
};

export default Auditor;