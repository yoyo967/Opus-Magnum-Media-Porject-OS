
import React from 'react';
import { BerichterstatterTool } from '../components/BerichterstatterTool';

interface BerichterstatterProps {
  navigateTo: (page: string) => void;
}

const Berichterstatter: React.FC<BerichterstatterProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Berichterstatter</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Automated Intelligence Reporting ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Generieren Sie umfassende, stakeholder-freundliche Berichte über den Projektfortschritt und die Kampagnenleistung mit einem Klick. Die KI analysiert Ihre Daten und fasst die wichtigsten Erkenntnisse für Sie zusammen.
                </p>
            </header>
            <main>
                <BerichterstatterTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Berichterstatter;
