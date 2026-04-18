import React from 'react';
import { AuditoriumTool } from '../components/AuditoriumTool';

interface AuditoriumProps {
  navigateTo: (page: string) => void;
}

const Auditorium: React.FC<AuditoriumProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Auditorium</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Creative Review & Approval Center ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Der zentrale Ort für Review und Freigabe aller kreativen Assets. Vergleichen Sie Versionen, geben Sie präzises Feedback und treffen Sie finale Entscheidungen zur Qualitätssicherung.
                </p>
            </header>
            <main>
                <AuditoriumTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Auditorium;
