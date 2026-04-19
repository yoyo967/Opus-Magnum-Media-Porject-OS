import React from 'react';
import { motion } from 'motion/react';
import { PillarVisual, PillarVisualName } from '../brand/visuals/PillarVisuals';

interface PillarHeroProps {
    kicker: string;
    title: string;
    tagline: string;
    visualKey: PillarVisualName;
    accent?: string;
    statusLine?: string;
}

export const PillarHero: React.FC<PillarHeroProps> = ({
    kicker,
    title,
    tagline,
    visualKey,
    accent = '#A855F7',
    statusLine,
}) => (
    <section className="mb-20 md:mb-28">
        <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div
                        className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5"
                        style={{ color: accent }}
                    >
                        {kicker}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-6">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                        {tagline}
                    </p>
                    {statusLine && (
                        <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-md border"
                             style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0a` }}>
                            <span className="relative flex h-2 w-2" aria-hidden>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                                      style={{ backgroundColor: accent }} />
                                <span className="relative inline-flex rounded-full h-2 w-2"
                                      style={{ backgroundColor: accent }} />
                            </span>
                            <code
                                className="text-[10px] tracking-[0.25em] uppercase"
                                style={{ fontFamily: 'JetBrains Mono, monospace', color: accent }}
                            >
                                {statusLine}
                            </code>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="relative rounded-xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md"
                >
                    <PillarVisual name={visualKey} />
                </motion.div>
            </div>
        </div>
    </section>
);

export default PillarHero;
