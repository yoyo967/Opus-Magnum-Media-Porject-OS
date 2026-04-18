import React from 'react';
import { KoloritTool } from '../components/KoloritTool';

const Kolorit: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Kolorit</h1>
                <p className="mt-2 text-purple-300 font-mono">:: AI Brand Stylist ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Definieren Sie die visuelle und tonale Identität Ihrer Marke. Geben Sie eine Beschreibung ein und lassen Sie die KI einen vollständigen Style Guide generieren – von der Farbpalette bis zur Bildsprache.
                </p>
            </header>
            <main>
                <KoloritTool />
            </main>
        </div>
    );
};

export default Kolorit;
