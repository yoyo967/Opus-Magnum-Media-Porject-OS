import React from 'react';
import { PersonalisatorTool } from '../components/PersonalisatorTool';

interface PersonalisatorProps {
  navigateTo: (page: string) => void;
}

const Personalisator: React.FC<PersonalisatorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Personalisator</h1>
                <p className="mt-2 text-[#888888] max-w-3xl mx-auto">
                    Die Engine für Hyper-Personalisierung. Wählen Sie ein Asset und ein Zielsegment aus, und lassen Sie die KI den Inhalt dynamisch anpassen, um die Relevanz und Wirkung zu maximieren.
                </p>
            </header>
            <main>
                <PersonalisatorTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Personalisator;
