import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Hero } from '../../components/portfolio/Hero';
import { Tension } from '../../components/portfolio/Tension';
import { Epochs } from '../../components/portfolio/Epochs';
import { OperatorProof } from '../../components/portfolio/OperatorProof';
import { OperatorNetwork } from '../../components/portfolio/OperatorNetwork';
import { PublicBuilds } from '../../components/portfolio/PublicBuilds';
import { Methodology } from '../../components/portfolio/Methodology';
import { RecruitmentMatrix } from '../../components/portfolio/RecruitmentMatrix';
import { ComplianceCanon } from '../../components/portfolio/ComplianceCanon';
import { DecisionLog } from '../../components/portfolio/DecisionLog';
import { Changelog } from '../../components/portfolio/Changelog';
import { TableOfContents } from '../../components/portfolio/TableOfContents';
import { PillarHero } from '../../components/portfolio/PillarHero';
import { PORTFOLIO_PILLARS, PORTFOLIO_APEX } from '../../data/portfolio-v2';
import { useSEO } from '../../components/seo/useSEO';
import { OrganizationSchema, PersonSchema } from '../../components/seo/Schemas';

// APEX · /portfolio — Übersichts-Layer der Portfolio-Landingpage.
// Kondensiert alle Pillars auf einer Seite + navigiert in die Tiefe.
export const ApexOverview: React.FC = () => {
    useSEO({
        title: 'Yahya Yildirim — Digital Interim C-Level Architecture · Portfolio APEX',
        description: 'Operator-Architekt Yahya Yildirim (Berlin): Interim-Management, AI-native Architektur, Yildirim Operator Network. Sieben Pillars — Doktrin · Epochen · Netzwerk · Builds · Anwerbung · Compliance · Columna. EU AI Act Art. 50 Ready.',
        canonicalPath: '/portfolio',
        keywords: [
            'Yahya Yildirim',
            'Operator-Architekt',
            'Interim Management',
            'Chief AI Officer',
            'OPUS MAGNUM MEDIA',
            'Yildirim Operator Network',
            'AI-native',
            'Frontier Firma',
            'Columna',
            'Perfect Twin Architecture',
            'EU AI Act',
        ],
        ogType: 'profile',
    });

    return (
    <div className="container mx-auto px-6 py-12 md:py-16 relative">
        <OrganizationSchema />
        <PersonSchema />
        <PillarHero
            kicker={PORTFOLIO_APEX.kicker}
            title={PORTFOLIO_APEX.title}
            tagline="Ein Betriebssystem aus Doktrin, Operation, Extension, Netzwerk und Produkt — kondensiert auf einer Seite, in die Tiefe über sieben Pillars."
            visualKey="apex"
            statusLine={`> APEX /portfolio · PILLARS=${PORTFOLIO_PILLARS.length} · STATUS ACTIVE`}
        />

        <div className="xl:grid xl:grid-cols-[220px_1fr] xl:gap-12">
            <TableOfContents />
            <div className="min-w-0">
                <Hero />
                <Tension />
                <Epochs />
                <OperatorProof />
                <OperatorNetwork />
                <PublicBuilds />
                <Methodology />
                <RecruitmentMatrix />
                <ComplianceCanon />
                <DecisionLog />
                <Changelog />

                <section aria-labelledby="pillar-index-heading" className="mb-24 scroll-mt-24">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">
                            APEX · Pillar-Index
                        </h2>
                        <h3 id="pillar-index-heading" className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                            In die Tiefe gehen
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                            Die APEX-Seite kondensiert. Jeder Pillar öffnet eine eigene Ebene mit eigenem Narrative Arc,
                            eigenen Clustern und eigenen Evidenzen.
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {PORTFOLIO_PILLARS.map((pillar, i) => (
                                <motion.div
                                    key={pillar.slug}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <Link
                                        to={pillar.path}
                                        className="group block bg-[#0D0D0D] border border-white/10 rounded-lg p-6 hover:border-[#A855F7]/40 transition-colors h-full"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <span
                                                className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A855F7]"
                                            >
                                                {pillar.code} · {pillar.canon}
                                            </span>
                                            <ArrowUpRight
                                                className="w-4 h-4 text-gray-500 group-hover:text-[#A855F7] transition-colors"
                                                aria-hidden
                                            />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#A855F7] transition-colors">
                                            {pillar.label}
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                            {pillar.desc}
                                        </p>
                                        <span
                                            className="inline-block text-[9px] font-mono tracking-[0.25em] uppercase text-gray-500"
                                        >
                                            {pillar.status === 'live' ? 'Live' : pillar.status.toUpperCase()}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    );
};

export default ApexOverview;
