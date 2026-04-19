import React from 'react';
import { motion } from 'motion/react';
import { ArcPhase } from '../../data/portfolio-v2';

interface NarrativeArcProps {
    phases: ArcPhase[];
    accent?: string;
}

// 8-Phasen Narrative Arc nach Sovereign 2030 Framework:
// HOOK · TENSION · INSIGHT · ARCHITECTURE · EVIDENCE · TRADEOFFS · ROADMAP · ASK
export const NarrativeArc: React.FC<NarrativeArcProps> = ({ phases, accent = '#A855F7' }) => (
    <section className="mb-24 md:mb-32">
        <div className="max-w-5xl mx-auto">
            <div
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
                style={{ color: accent }}
            >
                Narrative Arc · 8 Phasen
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12">
                Hook → Tension → Insight → Architecture → Evidence → Tradeoffs → Roadmap → Ask
            </h2>

            <ol className="relative border-l border-white/10 ml-2">
                {phases.map((phase, i) => (
                    <motion.li
                        key={phase.key}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="pl-8 pb-14 relative"
                    >
                        <span
                            className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#0A0A0A', border: `1.5px solid ${accent}` }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        </span>
                        <div
                            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-3"
                            style={{ color: accent }}
                        >
                            {phase.label}
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 leading-snug">
                            {phase.heading}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-base max-w-3xl">
                            {phase.body}
                        </p>
                        {phase.mono && (
                            <code
                                className="mt-4 inline-block text-[10px] tracking-[0.2em] uppercase text-gray-500"
                                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            >
                                {phase.mono}
                            </code>
                        )}
                    </motion.li>
                ))}
            </ol>
        </div>
    </section>
);

export default NarrativeArc;
