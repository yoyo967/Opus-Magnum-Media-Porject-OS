import React from 'react';
import { AnimatorTool } from '../components/AnimatorTool';

interface AnimatorProps {
  navigateTo: (page: string) => void;
}

const Animator: React.FC<AnimatorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Animator</h1>
                <p className="mt-2 text-[#888888] max-w-2xl mx-auto">
                    Erwecken Sie Ihre Bilder zum Leben. Laden Sie ein Bild hoch, geben Sie einen Prompt ein und lassen Sie die Veo-Engine dynamische Videos erstellen.
                </p>
            </header>
            <main>
                <AnimatorTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Animator;