import React from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Network } from 'lucide-react';
import { EPOCHS, EPOCH_METRICS, POSITIONING, type Epoch } from '../../data/portfolio-v2';
import { EvidenceRibbon } from './EvidenceLayer';

const ICONS: Record<Epoch['icon'], React.ReactNode> = {
    activity: <Activity className="w-6 h-6" />,
    cpu: <Cpu className="w-6 h-6" />,
    network: <Network className="w-6 h-6" />,
};

const EPOCH_KEY_BY_ICON: Record<Epoch['icon'], 'I' | 'II' | 'III'> = {
    activity: 'I',
    cpu: 'II',
    network: 'III',
};

const EpochCard: React.FC<{ epoch: Epoch; delay: number }> = ({ epoch, delay }) => {
    const metrics = EPOCH_METRICS[EPOCH_KEY_BY_ICON[epoch.icon]].slice(0, 3);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="group relative"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A855F7]/30 to-blue-500/30 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0D0D0D] border border-white/5 rounded-lg p-8 h-full flex flex-col items-start hover:border-[#A855F7]/50 transition-colors duration-500">
                <div className="flex justify-between items-start w-full mb-6">
                    <div className="p-3 bg-[#A855F7]/10 rounded-lg text-[#A855F7]">{ICONS[epoch.icon]}</div>
                    <span className="font-mono text-xs text-gray-500">{epoch.number}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{epoch.title}</h3>
                <p className="text-[#A855F7] text-sm font-medium mb-2 italic tracking-tight">{epoch.subtitle}</p>
                <p className="font-mono text-[10px] tracking-widest text-gray-500 uppercase mb-4">{epoch.period}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-grow">{epoch.description}</p>

                <div className="w-full mb-5">
                    <EvidenceRibbon metrics={metrics} accent="#A855F7" />
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {epoch.tags.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export const Epochs: React.FC = () => (
    <section id="epochs" className="mb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§1 · Operator-Beweis</h2>
            <p className="text-gray-400 text-sm leading-relaxed italic">{POSITIONING.motto}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EPOCHS.map((epoch, i) => (
                <EpochCard key={epoch.number} epoch={epoch} delay={0.15 * i} />
            ))}
        </div>
    </section>
);
