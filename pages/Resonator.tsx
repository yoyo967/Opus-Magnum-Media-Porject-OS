import React from 'react';
import { ResonatorTool } from '../components/ResonatorTool';

interface ResonatorProps {
  navigateTo: (page: string) => void;
}

const Resonator: React.FC<ResonatorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Resonator</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Social Media Content Engine ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Ihre Kommandozentrale für Social Media. Generieren Sie aus einer Kernbotschaft plattformspezifische Posts, inklusive passender Bilder und Hashtags, und planen Sie sie direkt zur Veröffentlichung.
                </p>
            </header>
            <main>
                <ResonatorTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Resonator;
