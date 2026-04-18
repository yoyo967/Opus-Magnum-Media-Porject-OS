import React from 'react';
import { ChronistTool } from '../components/ChronistTool';

const Chronist: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Chronist</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Relationship & Communications Hub ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Ihr zentrales Nervensystem für professionelle Beziehungen. Verwalten Sie Kontakte, dokumentieren Sie jede Interaktion und planen Sie Ihre nächsten Schritte strategisch.
                </p>
            </header>
            <main>
                <ChronistTool />
            </main>
        </div>
    );
};

export default Chronist;
