import React from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_TITLE, POSITIONING } from '../../data/portfolio-v2';
import { VersionBadge } from './VersionBadge';

export const Hero: React.FC = () => (
    <section id="hero" className="max-w-4xl mx-auto text-center mb-24">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 mb-6 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7] text-[10px] font-mono tracking-[0.3em] uppercase"
        >
            {PORTFOLIO_TITLE}
        </motion.div>
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
        >
            {POSITIONING.headline}
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto mb-8"
        >
            {POSITIONING.subheadline}: <br />
            {POSITIONING.axes.map((axis, i) => (
                <React.Fragment key={axis}>
                    <span className="text-white font-medium">{axis}</span>
                    {i < POSITIONING.axes.length - 1 && <span> · </span>}
                </React.Fragment>
            ))}
        </motion.p>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <VersionBadge />
        </motion.div>
    </section>
);
