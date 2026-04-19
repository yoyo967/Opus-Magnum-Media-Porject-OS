import React from 'react';
import { motion } from 'motion/react';
import { METHOD_STARTIMPULS, POSITIONING_PRINCIPLES } from '../../data/portfolio-v2';

export const Methodology: React.FC = () => (
    <section id="method" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§1c · Methode</h2>
                <h3 className="text-3xl font-bold text-white mb-6">{METHOD_STARTIMPULS.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{METHOD_STARTIMPULS.body}</p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg italic text-gray-300">
                    „{METHOD_STARTIMPULS.quote}"
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§2 · Positionierungs-Prinzip</h2>
                <h3 className="text-3xl font-bold text-white mb-6">Anwerbung statt Bewerbung</h3>
                <div className="space-y-4">
                    {POSITIONING_PRINCIPLES.map((item) => (
                        <div key={item.title} className="flex gap-4">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#A855F7] flex-shrink-0"></div>
                            <div>
                                <h4 className="text-white font-medium">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);
