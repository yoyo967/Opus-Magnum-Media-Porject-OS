import React from 'react';
import { StrategeTool } from '../components/StrategeTool';

interface StrategeProps {
  navigateTo: (page: string) => void;
  isEmbedded?: boolean;
  onStrategyFinalized?: () => void;
}


const Stratege: React.FC<StrategeProps> = ({ navigateTo, isEmbedded, onStrategyFinalized }) => {
     if (isEmbedded) {
        return <StrategeTool navigateTo={navigateTo} isEmbedded={isEmbedded} onStrategyFinalized={onStrategyFinalized} />;
    }
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Stratege</h1>
                <p className="mt-2 text-[#888888] max-w-3xl mx-auto">
                    Das KI-Gehirn Ihrer Marketing-Abteilung. Definieren Sie die Parameter und erhalten Sie eine vollständige, umsetzbare Kampagnen-Strategie in Sekunden.
                </p>
            </header>
            <main>
                <StrategeTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Stratege;
