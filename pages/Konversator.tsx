import React from 'react';
import { KonversatorTool } from '../components/KonversatorTool';

const Konversator: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16 flex flex-col items-center">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Konversator</h1>
                <p className="mt-2 text-[#888888] max-w-2xl mx-auto">Ihr persönlicher KI-Marketingberater. Holen Sie sich sofortige Einblicke, Brainstorming-Hilfe und strategische Ratschläge.</p>
            </header>
            <main className="w-full">
                <KonversatorTool />
            </main>
        </div>
    );
};

export default Konversator;
