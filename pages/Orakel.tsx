import React from 'react';
import { OrakelTool } from '../components/OrakelTool';

interface OrakelProps {
  navigateTo: (page: string) => void;
}

const Orakel: React.FC<OrakelProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Orakel</h1>
                <p className="mt-2 text-[#888888] max-w-3xl mx-auto">
                    Das prädiktive Analyse-Hub des Project OS. Treffen Sie datengestützte Entscheidungen, indem Sie KI-Modelle zur Vorhersage von Kundenverhalten nutzen und aus Einsichten direkt umsetzbare Maßnahmen ableiten.
                </p>
            </header>
            <main>
                <OrakelTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Orakel;
