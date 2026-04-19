import React from 'react';
import { motion } from 'motion/react';
import { RECRUITMENT_MATRIX } from '../../data/portfolio-v2';

export const RecruitmentMatrix: React.FC = () => (
    <section id="recruitment" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§3 · Anwerbungs-Matrix</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Reihenfolge A → B → C → D → E</h3>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                Die Reihenfolge signalisiert Präferenz, nicht Exklusivität. Jede Option ist ein möglicher Andockpunkt.
            </p>

            <div className="glass-panel p-8 md:p-10 rounded-2xl border-[#A855F7]/20">
                <div className="space-y-4">
                    {RECRUITMENT_MATRIX.map((item, i) => (
                        <motion.div
                            key={item.code}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 p-5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#A855F7]/30 transition-all"
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded bg-black border border-white/10 font-mono text-lg text-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-black transition-colors">
                                {item.code}
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-base">{item.title}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                            <p className="hidden md:block text-right text-[10px] font-mono uppercase tracking-wider text-gray-500 max-w-[220px]">
                                {item.terms}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
