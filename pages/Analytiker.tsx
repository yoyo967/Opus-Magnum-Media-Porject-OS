import React from 'react';
import { AnalytikerTool } from '../components/AnalytikerTool';

interface AnalytikerProps {
  navigateTo: (page: string) => void;
}

const Analytiker: React.FC<AnalytikerProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Analytiker</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Performance Intelligence Engine ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Verwandeln Sie rohe Performance-Daten in strategische Intelligenz. Visualisieren Sie Trends, analysieren Sie Ihre veröffentlichten Inhalte und erhalten Sie KI-gestützte Empfehlungen zur Optimierung Ihrer zukünftigen Strategie.
                </p>
            </header>
            <main>
                <AnalytikerTool />
            </main>
        </div>
    );
};

export default Analytiker;