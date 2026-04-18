import React from 'react';
import { SequenzerTool } from '../components/SequenzerTool';

interface SequenzerProps {
  navigateTo: (page: string) => void;
}

const Sequenzer: React.FC<SequenzerProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Sequenzer</h1>
                <p className="mt-2 text-purple-300 font-mono">:: AI Email Campaign Architect ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Entwerfen und automatisieren Sie mehrstufige E-Mail-Kampagnen. Definieren Sie Ihr Ziel und lassen Sie die KI eine komplette Drip-Sequenz mit überzeugenden Texten für Sie erstellen.
                </p>
            </header>
            <main>
                <SequenzerTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Sequenzer;
