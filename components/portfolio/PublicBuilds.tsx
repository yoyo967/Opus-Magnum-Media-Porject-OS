import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import {
    PUBLIC_BUILDS,
    PUBLIC_BUILDS_SOURCE,
    PUBLIC_BUILDS_NOTE,
    getBuildCase,
} from '../../data/portfolio-v2';
import { EvidenceRibbon } from './EvidenceLayer';

const CASE_SLUG_BY_BUILD: Record<string, string> = {
    'AGENTICUM G5 — Modular Neural Orchestration OS': 'agenticum-g5',
    'AGENTICUM G5 Genius': 'agenticum-g5-genius',
};

export const PublicBuilds: React.FC = () => (
    <section id="public-builds" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§4 · Public Builds</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Evidence Layer</h3>
                </div>
                <a
                    href={PUBLIC_BUILDS_SOURCE}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-[#A855F7] transition-colors"
                >
                    Quelle · Devpost
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </a>
            </div>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                Öffentlich zugängliche Build-Artefakte als Beleg-Layer für §3 E (System Investment). Alle Einträge mit Quelle, Stack, Live-Link und verifizierten Metriken.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {PUBLIC_BUILDS.map((build, i) => {
                    const caseStudy = getBuildCase(CASE_SLUG_BY_BUILD[build.name] ?? '');
                    const metrics = caseStudy?.metrics ?? [];
                    return (
                        <motion.a
                            key={build.url}
                            href={build.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group block bg-[#0D0D0D] border border-white/10 rounded-lg p-6 hover:border-[#A855F7]/40 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-[#A855F7] transition-colors">
                                    {build.name}
                                </h4>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#A855F7] flex-shrink-0 mt-1 transition-colors" />
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed mb-5">
                                {build.tagline}
                            </p>

                            {metrics.length > 0 && (
                                <div className="mb-5">
                                    <EvidenceRibbon metrics={metrics} accent="#A855F7" />
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1.5">
                                {build.stack.map((item) => (
                                    <span
                                        key={item}
                                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-500">
                                    {build.platform}
                                </span>
                                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#A855F7]/70 group-hover:text-[#A855F7]">
                                    Live ansehen →
                                </span>
                            </div>
                        </motion.a>
                    );
                })}
            </div>

            <p className="mt-8 text-xs text-gray-500 leading-relaxed max-w-3xl">
                {PUBLIC_BUILDS_NOTE}
            </p>
        </div>
    </section>
);
