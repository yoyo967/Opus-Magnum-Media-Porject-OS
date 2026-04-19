import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { ClusterEntry } from '../../data/portfolio-v2';

interface ClusterGridProps {
    clusters: ClusterEntry[];
    accent?: string;
    heading?: string;
    kicker?: string;
}

export const ClusterGrid: React.FC<ClusterGridProps> = ({
    clusters,
    accent = '#A855F7',
    heading = 'Cluster · in die Tiefe',
    kicker = 'Sub-Nodes',
}) => (
    <section className="mb-24 md:mb-32">
        <div className="max-w-5xl mx-auto">
            <div
                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
                style={{ color: accent }}
            >
                {kicker}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-10">
                {heading}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {clusters.map((cluster, i) => (
                    <motion.div
                        key={cluster.slug}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.45 }}
                    >
                        <Link
                            to={cluster.path}
                            className="group block h-full bg-[#0D0D0D] border border-white/10 rounded-lg p-6 hover:border-[#A855F7]/40 hover:-translate-y-0.5 transition-all duration-300"
                            style={{ willChange: 'transform' }}
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <span
                                    className="font-mono text-[9px] tracking-[0.3em] uppercase"
                                    style={{ color: accent }}
                                >
                                    {cluster.code}
                                </span>
                                <ArrowUpRight
                                    className="w-4 h-4 text-gray-500 group-hover:text-[#A855F7] transition-colors"
                                    aria-hidden
                                />
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight mb-3 group-hover:text-[#A855F7] transition-colors">
                                {cluster.label}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {cluster.summary}
                            </p>
                            {cluster.visualHint && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <span
                                        className="font-mono text-[9px] tracking-[0.25em] uppercase text-gray-500"
                                    >
                                        {cluster.visualHint}
                                    </span>
                                </div>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default ClusterGrid;
