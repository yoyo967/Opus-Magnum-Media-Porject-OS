import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Lock, Info } from 'lucide-react';
import {
    CASES_BY_EPOCH,
    CASES_ARTIFACTS,
    EPOCH_METRICS,
    EVIDENCE_DISCLOSURE,
    type EvidenceMetric,
    type EvidenceCaseStudy,
    type CaseStatus,
    type PillarEntry,
} from '../../data/portfolio-v2';

const STATUS_LABEL: Record<CaseStatus, string> = {
    proof: 'Proof · abgeschlossen',
    active: 'Active · laufend',
    corpus: 'Corpus · Grounding',
    concept: 'Concept · in Vorbereitung',
};

const STATUS_ACCENT: Record<CaseStatus, string> = {
    proof: '#22C55E',
    active: '#A855F7',
    corpus: '#3B82F6',
    concept: '#9CA3AF',
};

interface MetricCardProps {
    metric: EvidenceMetric;
    accent?: string;
    size?: 'sm' | 'md';
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, accent = '#A855F7', size = 'md' }) => {
    const isVerified = metric.verified;
    return (
        <div
            className="relative rounded-md border bg-black/30 backdrop-blur-sm px-4 py-3"
            style={{ borderColor: `${accent}22` }}
        >
            <div className="flex items-center gap-2 mb-1.5">
                {isVerified ? (
                    <ShieldCheck className="w-3 h-3" style={{ color: accent }} aria-label="verifiziert" />
                ) : (
                    <Lock className="w-3 h-3 text-gray-500" aria-label="auf Anfrage" />
                )}
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-500 truncate">
                    {metric.label}
                </span>
            </div>
            <div className={`font-bold text-white leading-none ${size === 'sm' ? 'text-xl' : 'text-2xl'}`}>
                {metric.value}
                {metric.unit && (
                    <span className="ml-1 text-sm font-medium text-gray-400">{metric.unit}</span>
                )}
            </div>
            {metric.note && (
                <div className="mt-2 text-[10px] leading-snug text-gray-500">{metric.note}</div>
            )}
            <div className="mt-2 font-mono text-[9px] tracking-[0.2em] uppercase text-gray-600 truncate">
                {isVerified ? '▸' : '✱'} {metric.source}
            </div>
        </div>
    );
};

interface MetricGridProps {
    metrics: EvidenceMetric[];
    accent?: string;
    columns?: 2 | 3 | 4;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ metrics, accent = '#A855F7', columns = 4 }) => {
    if (!metrics.length) return null;
    const cols = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
    return (
        <div className={`grid grid-cols-1 ${cols} gap-3`}>
            {metrics.map((m) => (
                <MetricCard key={`${m.label}-${m.value}`} metric={m} accent={accent} />
            ))}
        </div>
    );
};

interface EvidenceRibbonProps {
    metrics: EvidenceMetric[];
    accent?: string;
}

export const EvidenceRibbon: React.FC<EvidenceRibbonProps> = ({ metrics, accent = '#A855F7' }) => {
    if (!metrics.length) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {metrics.map((m) => (
                <div
                    key={`${m.label}-${m.value}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-black/40 backdrop-blur-sm"
                    style={{ borderColor: `${accent}2A` }}
                    title={`${m.source}${m.note ? ' · ' + m.note : ''}`}
                >
                    {m.verified ? (
                        <ShieldCheck className="w-3 h-3" style={{ color: accent }} />
                    ) : (
                        <Lock className="w-3 h-3 text-gray-500" />
                    )}
                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gray-400">
                        {m.label}
                    </span>
                    <span className="text-white text-xs font-semibold">
                        {m.value}
                        {m.unit && <span className="ml-0.5 text-gray-500 font-normal">{m.unit}</span>}
                    </span>
                </div>
            ))}
        </div>
    );
};

interface CaseStudyBlockProps {
    caseStudy: EvidenceCaseStudy;
    accent?: string;
    index?: number;
}

export const CaseStudyBlock: React.FC<CaseStudyBlockProps> = ({ caseStudy, accent = '#A855F7', index = 0 }) => {
    const statusColor = STATUS_ACCENT[caseStudy.status];
    const isExternal = caseStudy.sourceHref?.startsWith('http');
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="relative rounded-xl border bg-[#0D0D0D]/80 backdrop-blur-md overflow-hidden"
            style={{ borderColor: `${accent}22` }}
        >
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${accent} 0%, transparent 60%)` }}
            />
            <div className="p-6 md:p-8">
                <header className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                    <div className="min-w-0">
                        {caseStudy.kicker && (
                            <div
                                className="font-mono text-[10px] tracking-[0.35em] uppercase mb-2"
                                style={{ color: accent }}
                            >
                                {caseStudy.kicker}
                            </div>
                        )}
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug mb-1">
                            {caseStudy.subject}
                        </h3>
                        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-500">
                            {caseStudy.period}
                        </div>
                    </div>
                    <div
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-[0.25em] uppercase flex-shrink-0"
                        style={{ borderColor: `${statusColor}44`, color: statusColor, background: `${statusColor}10` }}
                    >
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                        {STATUS_LABEL[caseStudy.status]}
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-5 mb-6">
                    <CaseField label="Challenge" body={caseStudy.challenge} accent={accent} />
                    <CaseField label="Architecture" body={caseStudy.architecture} accent={accent} />
                    <CaseField label="Outcome" body={caseStudy.outcome} accent={accent} />
                </div>

                {caseStudy.metrics.length > 0 && (
                    <div className="mb-5">
                        <MetricGrid metrics={caseStudy.metrics} accent={accent} columns={4} />
                    </div>
                )}

                {(caseStudy.statusNote || caseStudy.disclosureNote) && (
                    <div className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-500 border-t border-white/5 pt-4">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-600" />
                        <div className="space-y-1">
                            {caseStudy.statusNote && <div>{caseStudy.statusNote}</div>}
                            {caseStudy.disclosureNote && <div>{caseStudy.disclosureNote}</div>}
                        </div>
                    </div>
                )}

                {caseStudy.sourceHref && caseStudy.sourceLabel && (
                    <a
                        href={caseStudy.sourceHref}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-white transition-colors"
                    >
                        <span>{caseStudy.sourceLabel}</span>
                        <ArrowUpRight className="w-3 h-3" />
                    </a>
                )}
            </div>
        </motion.article>
    );
};

const CaseField: React.FC<{ label: string; body: string; accent: string }> = ({ label, body, accent }) => (
    <div>
        <div
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ color: accent }}
        >
            {label}
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{body}</p>
    </div>
);

interface CaseStudyGridProps {
    cases: EvidenceCaseStudy[];
    accent?: string;
    heading?: string;
    kicker?: string;
    intro?: string;
}

export const CaseStudyGrid: React.FC<CaseStudyGridProps> = ({ cases, accent = '#A855F7', heading, kicker, intro }) => {
    if (!cases.length) return null;
    return (
        <section className="mb-24 scroll-mt-24">
            <div className="max-w-5xl mx-auto">
                {(heading || kicker) && (
                    <header className="mb-8">
                        {kicker && (
                            <div
                                className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                                style={{ color: accent }}
                            >
                                {kicker}
                            </div>
                        )}
                        {heading && (
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                                {heading}
                            </h2>
                        )}
                        {intro && (
                            <p className="text-gray-400 leading-relaxed max-w-3xl">{intro}</p>
                        )}
                    </header>
                )}
                <div className="flex flex-col gap-6">
                    {cases.map((c, i) => (
                        <CaseStudyBlock key={c.slug} caseStudy={c} accent={accent} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const EvidenceDisclosureNote: React.FC<{ accent?: string }> = ({ accent = '#A855F7' }) => (
    <div
        className="mt-6 rounded-md border bg-black/30 px-4 py-3 text-[11px] leading-relaxed text-gray-400"
        style={{ borderColor: `${accent}22` }}
    >
        <div
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1"
            style={{ color: accent }}
        >
            {EVIDENCE_DISCLOSURE.headline}
        </div>
        {EVIDENCE_DISCLOSURE.body}
    </div>
);

interface PillarEvidenceBlockProps {
    pillar: PillarEntry;
}

// Routed Evidence-Block · rendert pillar-spezifische Case-Studies + Metriken.
// Epochen → drei Epoch-Cases mit Epoch-Metriken. Builds → Artefakt-Cases (ohne Epoch).
export const PillarEvidenceBlock: React.FC<PillarEvidenceBlockProps> = ({ pillar }) => {
    if (pillar.slug === 'epochen') {
        const epochs: Array<'I' | 'II' | 'III'> = ['I', 'II', 'III'];
        return (
            <section className="mb-24 scroll-mt-24">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8">
                        <div
                            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                            style={{ color: pillar.accent }}
                        >
                            {pillar.code} · Evidenz-Layer
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                            Drei Epochen, drei Evidenz-Profile
                        </h2>
                        <p className="text-gray-400 leading-relaxed max-w-3xl">
                            Jede Epoche trägt ihre eigenen Metriken und ihren eigenen Case. Verifizierte Fakten sind markiert; historische Mandats-Daten werden auf Anfrage belegt (BELEG_STRATEGY §1a).
                        </p>
                    </header>

                    <div className="flex flex-col gap-10">
                        {epochs.map((epochKey, idx) => {
                            const cases = CASES_BY_EPOCH(epochKey);
                            const caseStudy = cases[0];
                            const metrics = EPOCH_METRICS[epochKey];
                            if (!caseStudy) return null;
                            return (
                                <div key={epochKey}>
                                    <div className="mb-4">
                                        <EvidenceRibbon metrics={metrics} accent={pillar.accent} />
                                    </div>
                                    <CaseStudyBlock caseStudy={caseStudy} accent={pillar.accent} index={idx} />
                                </div>
                            );
                        })}
                    </div>

                    <EvidenceDisclosureNote accent={pillar.accent} />
                </div>
            </section>
        );
    }

    if (pillar.slug === 'builds') {
        const cases = CASES_ARTIFACTS;
        return (
            <section className="mb-24 scroll-mt-24">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-8">
                        <div
                            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                            style={{ color: pillar.accent }}
                        >
                            {pillar.code} · Evidenz-Layer
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                            Artefakte, nicht Ankündigungen
                        </h2>
                        <p className="text-gray-400 leading-relaxed max-w-3xl">
                            Jeder Build hier ist entweder öffentlich auf Devpost oder als Architektur-Cluster im Portfolio dokumentiert. Sovereign 2030 erscheint getrennt als Grounding-Korpus — bewusst nicht als Produkt-Traction.
                        </p>
                    </header>

                    <div className="flex flex-col gap-6">
                        {cases.map((c, i) => (
                            <CaseStudyBlock key={c.slug} caseStudy={c} accent={pillar.accent} index={i} />
                        ))}
                    </div>

                    <EvidenceDisclosureNote accent={pillar.accent} />
                </div>
            </section>
        );
    }

    return null;
};
