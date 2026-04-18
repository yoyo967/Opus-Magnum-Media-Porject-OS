import React from 'react';
import { SpaeherTool } from '../components/SpaeherTool';

const Spaeher: React.FC<{ navigateTo: (page: string) => void; }> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Späher</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Market Intelligence & Reconnaissance ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Ihr strategisches Auge auf den Markt. Führen Sie Echtzeit-Analysen zu Wettbewerbern, Markttrends oder Ihrer eigenen Markenwahrnehmung durch und erhalten Sie strukturierte KI-Briefings.
                </p>
            </header>
            <main>
                <SpaeherTool />
            </main>
        </div>
    );
};

export default Spaeher;