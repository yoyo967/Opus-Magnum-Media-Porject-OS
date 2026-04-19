import React, { useState } from 'react';
import { CHANGELOG } from '../../data/portfolio-v2';

export const Changelog: React.FC = () => {
    const [open, setOpen] = useState(false);
    return (
        <section id="changelog" className="mb-24 scroll-mt-24">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/10 rounded-lg hover:border-[#A855F7]/30 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A855F7]">Portfolio Changelog</span>
                        <span className="text-xs text-gray-500">{CHANGELOG.length} Einträge</span>
                    </div>
                    <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {open && (
                    <div className="mt-2 border border-white/10 rounded-lg overflow-hidden bg-[#0D0D0D]">
                        {CHANGELOG.map((entry, i) => (
                            <div
                                key={entry.version}
                                className={`grid grid-cols-[100px_120px_1fr] gap-6 p-5 ${i < CHANGELOG.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <span className="font-mono text-sm text-[#A855F7]">{entry.version}</span>
                                <span className="font-mono text-xs text-gray-500">{entry.date}</span>
                                <span className="text-sm text-gray-300 leading-relaxed">{entry.summary}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
