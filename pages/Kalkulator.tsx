
import React from 'react';
import { KalkulatorTool } from '../components/KalkulatorTool';
import { ROIPredictionWidget } from '../components/ROIPredictionWidget';

interface KalkulatorProps {
  navigateTo: (page: string) => void;
}

const Kalkulator: React.FC<KalkulatorProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Kalkulator</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Campaign Budget & Financial Cockpit ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Verwalten Sie die Finanzen Ihrer Kampagne. Weisen Sie Budgets zu, verfolgen Sie die tatsächlichen Kosten und erhalten Sie eine klare Übersicht über Ihre Ausgaben, um den ROI zu maximieren.
                </p>
            </header>
            <main className="space-y-12">
                <KalkulatorTool navigateTo={navigateTo} />
                <ROIPredictionWidget />
            </main>
        </div>
    );
};

export default Kalkulator;