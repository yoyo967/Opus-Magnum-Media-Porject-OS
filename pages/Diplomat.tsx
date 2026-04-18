
import React from 'react';
import { DiplomatTool } from '../components/DiplomatTool';

const Diplomat: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Diplomat</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Strategic Communications AI ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Formulieren Sie professionelle und strategische Antworten auf wichtige Kommunikationsanlässe. Geben Sie den Kontext vor und lassen Sie die KI eine maßgeschneiderte Antwort für Sie entwerfen.
                </p>
            </header>
            <main>
                <DiplomatTool />
            </main>
        </div>
    );
};

export default Diplomat;