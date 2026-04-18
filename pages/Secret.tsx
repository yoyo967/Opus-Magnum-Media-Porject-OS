import React from 'react';
import { AuroraAgent } from '../components/AuroraAgent';

interface SecretProps {
    navigateTo: (page: string) => void;
}

const Secret: React.FC<SecretProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5] tracking-tight">AURORA AI</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Autonomous Agentic Workflow ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Willkommen im Inneren Zirkel. Delegieren Sie komplexe Marketing-Ziele direkt an AURORA. Der autonome Agent analysiert, strategisiert und plant die gesamte Kampagne und bereitet sie im Campaign Manager für Ihre finale Freigabe vor.
                </p>
            </header>
            <main>
                <AuroraAgent navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Secret;