import React from 'react';
import { PublisherTool } from '../components/PublisherTool';

interface PublisherProps {
  navigateTo: (page: string) => void;
}

const Publisher: React.FC<PublisherProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Publisher</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Multi-Channel Content Scheduler ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Orchestrieren Sie Ihre Veröffentlichungen. Planen Sie freigegebene Inhalte per Drag-and-Drop in Ihrem Kalender und steuern Sie, wann und wo Ihre Botschaft erscheint.
                </p>
            </header>
            <main>
                <PublisherTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Publisher;
