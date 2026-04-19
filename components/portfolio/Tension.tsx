import React from 'react';
import { motion } from 'motion/react';
import { TENSION } from '../../data/portfolio-v2';

export const Tension: React.FC = () => (
    <section id="tension" className="mb-32 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#A855F7] mb-6">
                    {TENSION.kicker}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight leading-tight">
                    {TENSION.title}
                </h2>
                <div className="relative pl-6 md:pl-8 border-l-2 border-[#A855F7]/40">
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                        {TENSION.body}
                    </p>
                    <p className="text-base md:text-lg text-white font-medium leading-relaxed">
                        {TENSION.closing}
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);
