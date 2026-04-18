
import React from 'react';
import { PrometheusTool } from '../components/PrometheusTool';

interface PrometheusProps {
  navigateTo: (page: string) => void;
}

const Prometheus: React.FC<PrometheusProps> = ({ navigateTo }) => {
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Prometheus</h1>
                <p className="mt-2 text-purple-300 font-mono">:: Global System Intelligence ::</p>
                <p className="mt-4 text-[#888888] max-w-3xl mx-auto">
                    Sprechen Sie direkt mit dem Gehirn des Project OS. Prometheus hat Zugriff auf alle Daten, Strategien und Agenten im System und kann komplexe, übergreifende Fragen beantworten, um Ihnen holistische Einblicke zu geben.
                </p>
            </header>
            <main>
                <PrometheusTool navigateTo={navigateTo} />
            </main>
        </div>
    );
};

export default Prometheus;