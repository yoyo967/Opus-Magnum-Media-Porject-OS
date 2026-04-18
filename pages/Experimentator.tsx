
import React from 'react';
import { ExperimentatorTool } from '../components/ExperimentatorTool';

interface ExperimentatorProps {
  navigateTo: (page: string) => void;
}

const Experimentator: React.FC<ExperimentatorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Experimentator</h1>
                <p className="mt-2 text-purple-300 font-mono">:: A/B Testing & Optimization Lab ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Testen Sie kreative Hypothesen. Erstellen Sie Varianten Ihrer Assets, führen Sie A/B-Tests durch und lassen Sie die KI die Ergebnisse analysieren, um datengestützte Entscheidungen zu treffen.
                </p>
            </header>
            <main>
                <ExperimentatorTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Experimentator;
