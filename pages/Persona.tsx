import React from 'react';
import { PersonaTool } from '../components/PersonaTool';

interface PersonaProps {
  navigateTo: (page: string) => void;
}

const Persona: React.FC<PersonaProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Persona</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Audience Intelligence Center ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Erstellen Sie lebensechte, KI-gestützte Buyer Personas aus einer einfachen Beschreibung. Verwalten Sie Ihre Zielgruppen und nutzen Sie sie, um Ihre Marketing-Inhalte im gesamten Project OS zu personalisieren.
                </p>
            </header>
            <main>
                <PersonaTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Persona;
