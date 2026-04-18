import React from 'react';
import { DirigentTool } from '../components/DirigentTool';

interface DirigentProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
  onAnalysisComplete?: () => void;
}

const Dirigent: React.FC<DirigentProps> = ({ navigateTo, isEmbedded, onAnalysisComplete }) => {
    if (isEmbedded) {
        return <DirigentTool navigateTo={navigateTo} onAnalysisComplete={onAnalysisComplete} />;
    }

    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Dirigent</h1>
                <p className="mt-2 text-[#888888] max-w-3xl mx-auto">
                    Die strategische Kommandozentrale Ihres Project OS. Erhalten Sie eine ganzheitliche Analyse Ihrer Kampagne, identifizieren Sie Chancen sowie Engpässe und lassen Sie sich proaktiv die nächsten Schritte vorschlagen.
                </p>
            </header>
            <main>
                <DirigentTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Dirigent;
