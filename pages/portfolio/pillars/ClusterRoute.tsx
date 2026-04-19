import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
    getCluster,
    getPillar,
    PORTFOLIO_APEX,
} from '../../../data/portfolio-v2';
import { PillarVisual } from '../../../components/brand/visuals/PillarVisuals';
import { useSEO } from '../../../components/seo/useSEO';

// Cluster-Seite · Header-Visual + Summary + Roadmap-Hinweis auf Sprint 3+
const ClusterRoute: React.FC = () => {
    const { pillarSlug, clusterSlug } = useParams<{ pillarSlug: string; clusterSlug: string }>();
    const pillar = pillarSlug ? getPillar(pillarSlug) : undefined;
    const cluster = pillarSlug && clusterSlug ? getCluster(pillarSlug, clusterSlug) : undefined;

    const hasCluster = Boolean(pillar && cluster);
    useSEO({
        title: cluster?.seoTitle ?? (cluster ? `${cluster.label} · ${pillar?.label} · Yahya Yildirim` : 'Portfolio APEX'),
        description: cluster?.seoDescription ?? cluster?.summary ?? '',
        canonicalPath: cluster?.path ?? PORTFOLIO_APEX.path,
        keywords: cluster?.keywords,
        ogType: 'article',
    });

    if (!pillar || !cluster || !hasCluster) {
        return <Navigate to={PORTFOLIO_APEX.path} replace />;
    }

    const neighbors = pillar.clusters;
    const idx = neighbors.findIndex((c) => c.slug === cluster.slug);
    const prev = idx > 0 ? neighbors[idx - 1] : null;
    const next = idx < neighbors.length - 1 ? neighbors[idx + 1] : null;

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 relative">
            <div className="max-w-5xl mx-auto">
                <Link
                    to={pillar.path}
                    className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500 hover:text-[#A855F7] transition-colors mb-8"
                >
                    <ArrowLeft className="w-3 h-3" />
                    {pillar.code} · {pillar.label}
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md mb-10"
                >
                    <PillarVisual name={cluster.visualKey ?? pillar.visualKey} size="cluster" />
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 pointer-events-none">
                        <div
                            className="font-mono text-[10px] tracking-[0.35em] uppercase px-2 py-1 rounded"
                            style={{ color: pillar.accent, background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(6px)' }}
                        >
                            {cluster.code}
                        </div>
                        {cluster.visualHint && (
                            <div
                                className="font-mono text-[10px] tracking-[0.3em] uppercase px-2 py-1 rounded"
                                style={{ color: '#9CA3AF', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(6px)' }}
                            >
                                {cluster.visualHint}
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div
                        className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
                        style={{ color: pillar.accent }}
                    >
                        {pillar.code} · {pillar.canon} · {cluster.code}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
                        {cluster.label}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">
                        {cluster.summary}
                    </p>
                </motion.div>

                <div
                    className="p-6 md:p-8 rounded-lg border"
                    style={{ borderColor: `${pillar.accent}33`, background: `${pillar.accent}08` }}
                >
                    <div
                        className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
                        style={{ color: pillar.accent }}
                    >
                        &gt; SYSTEM STATUS / CLUSTER_IN_DEVELOPMENT
                    </div>
                    <p className="text-white text-lg leading-relaxed mb-3">
                        Diese Cluster-Seite wird in Sprint 3 mit Tiefen-Content, Case-Studies und Evidenz-Layer ausgebaut.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Bis dahin findest du Substanz auf der Pillar-Seite ({pillar.label}) und in der APEX-Übersicht.
                    </p>
                </div>

                <nav className="mt-12 flex items-center justify-between gap-4 pt-8 border-t border-white/5">
                    {prev ? (
                        <Link
                            to={prev.path}
                            className="group flex items-center gap-3 text-sm text-gray-400 hover:text-[#A855F7] transition-colors max-w-[45%]"
                        >
                            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                            <div>
                                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-600">
                                    {prev.code}
                                </div>
                                <div className="truncate">{prev.label}</div>
                            </div>
                        </Link>
                    ) : <span />}
                    {next ? (
                        <Link
                            to={next.path}
                            className="group flex items-center gap-3 text-sm text-gray-400 hover:text-[#A855F7] transition-colors max-w-[45%] ml-auto text-right"
                        >
                            <div>
                                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-gray-600">
                                    {next.code}
                                </div>
                                <div className="truncate">{next.label}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                        </Link>
                    ) : <span />}
                </nav>
            </div>
        </div>
    );
};

export default ClusterRoute;
