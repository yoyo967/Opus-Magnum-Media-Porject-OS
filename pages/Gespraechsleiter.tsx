
import React from 'react';
import { GespraechsleiterTool } from '../components/GespraechsleiterTool';

interface GespraechsleiterProps {
  navigateTo: (page: string) => void;
}

const Gespraechsleiter: React.FC<GespraechsleiterProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Gesprächsleiter</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Negotiation & Training Dojo ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Trainieren Sie kritische Gespräche in einer sicheren Umgebung. Simulieren Sie Verhandlungen, Pitches oder Konfliktgespräche mit einer KI-Persona und erhalten Sie Echtzeit-Coaching zur Verbesserung Ihrer Rhetorik.
                </p>
            </header>
            <main>
                <GespraechsleiterTool />
            </main>
        </div>
    );
};

export default Gespraechsleiter;
