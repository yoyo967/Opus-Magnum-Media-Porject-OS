import React from 'react';
import { KEY_DECISIONS } from '../../data/portfolio-v2';

export const DecisionLog: React.FC = () => (
    <section id="decisions" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§13 · Entscheidungshistorie</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Tracked Decisions</h3>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                Strategische Festlegungen, die alle Portfolio-Artefakte bindend ausrichten. Vollständige Liste im Canonical §13.
            </p>

            <div className="border border-white/10 rounded-lg overflow-hidden bg-[#0D0D0D]">
                <div className="grid grid-cols-[60px_1fr_1.2fr_140px] bg-white/5 border-b border-white/10 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400">
                    <div className="px-6 py-3">#</div>
                    <div className="px-6 py-3">Entscheidung</div>
                    <div className="px-6 py-3">Ergebnis</div>
                    <div className="px-6 py-3">Datum</div>
                </div>
                {KEY_DECISIONS.map((row, i) => (
                    <div
                        key={row.id}
                        className={`grid grid-cols-[60px_1fr_1.2fr_140px] ${i < KEY_DECISIONS.length - 1 ? 'border-b border-white/5' : ''} text-sm`}
                    >
                        <div className="px-6 py-4 text-gray-500 font-mono">{row.id}</div>
                        <div className="px-6 py-4 text-white">{row.decision}</div>
                        <div className="px-6 py-4 text-gray-400">{row.result}</div>
                        <div className="px-6 py-4 text-gray-500 font-mono text-xs">{row.date}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
