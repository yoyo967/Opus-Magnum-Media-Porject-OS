import React from 'react';
import { VisionarTool } from '../components/VisionarTool';

interface VisionarProps {
  navigateTo: (page: string) => void;
}

const Visionar: React.FC<VisionarProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Visionär</h1>
                <p className="mt-2 text-[#888888] max-w-2xl mx-auto">Verwandeln Sie Ihre Ideen in beeindruckende Bilder oder gewinnen Sie tiefe Einblicke aus bestehenden visuellen Inhalten. Ein Werkzeug für Kreation und Analyse.</p>
            </header>
            <main>
                <VisionarTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Visionar;