
import React from 'react';
import { BaumeisterTool } from '../components/BaumeisterTool';

interface BaumeisterProps {
  navigateTo: (page: string) => void;
}

const Baumeister: React.FC<BaumeisterProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Baumeister</h1>
                <p className="mt-2 text-purple-300 font-mono">:: AI Landing Page Architect ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Der Architekt Ihrer digitalen Präsenz. Beschreiben Sie Ihre Vision, und der Baumeister entwirft die Struktur einer modernen Landing Page und rendert eine sofortige visuelle Vorschau.
                </p>
            </header>
            <main>
                <BaumeisterTool />
            </main>
        </div>
    );
};

export default Baumeister;
