import React from 'react';
import { SpecClaim } from '../../data/portfolio-v2';

interface SpecBlockProps {
    spec: SpecClaim[];
    accent?: string;
    label?: string;
}

// SpecBlock — maschinenlesbarer JetBrains-Mono-Block für GEO (Generative Engine Optimization).
// Statt Storytelling: kanonische Key-Value-Paare, die Agenten direkt als Fakten lesen.
// Parallel menschlich lesbar durch die monospace-Darstellung im Terminal-Stil.
export const SpecBlock: React.FC<SpecBlockProps> = ({
    spec,
    accent = '#A855F7',
    label = '> SPEC /manifest',
}) => {
    if (!spec || spec.length === 0) return null;
    const maxKeyLen = spec.reduce((m, s) => Math.max(m, s.key.length), 0);

    return (
        <section className="mb-20 scroll-mt-24" aria-label="Spec Manifest">
            <div className="max-w-4xl mx-auto">
                <div
                    className="rounded-lg border overflow-hidden"
                    style={{ borderColor: `${accent}33`, background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(10px)' }}
                >
                    <div
                        className="px-5 py-3 border-b font-mono text-[10px] tracking-[0.3em] uppercase flex items-center justify-between"
                        style={{ borderColor: `${accent}22`, color: accent }}
                    >
                        <span>{label}</span>
                        <span className="text-gray-500">GEO · machine-readable</span>
                    </div>
                    <div className="p-5 font-mono text-[12px] leading-relaxed">
                        {spec.map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-col sm:flex-row sm:items-baseline gap-x-6 gap-y-0.5 py-0.5"
                            >
                                <span
                                    className="text-gray-500 whitespace-pre flex-shrink-0"
                                    style={{ minWidth: `${Math.max(maxKeyLen, 18)}ch` }}
                                >
                                    {s.key.padEnd(maxKeyLen, '.')}
                                </span>
                                <span className="text-white break-words">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecBlock;
