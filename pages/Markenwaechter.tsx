import React from 'react';
import { MarkenwaechterTool } from '../components/MarkenwaechterTool';

const Markenwaechter: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Markenwächter</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Brand Intelligence & Compliance ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Definieren Sie die DNA Ihrer Marke – von der Tonalität bis zur visuellen Identität. Nutzen Sie die KI, um die Konsistenz all Ihrer Inhalte zu überprüfen und sicherzustellen, dass jede Kreation Ihre Marke stärkt.
                </p>
            </header>
            <main>
                <MarkenwaechterTool />
            </main>
        </div>
    );
};

export default Markenwaechter;