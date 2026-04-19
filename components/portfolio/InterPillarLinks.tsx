import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PORTFOLIO_PILLARS, PORTFOLIO_APEX } from '../../data/portfolio-v2';

interface InterPillarLinksProps {
    currentSlug: string;
    relatedSlugs: string[];
}

export const InterPillarLinks: React.FC<InterPillarLinksProps> = ({ currentSlug, relatedSlugs }) => {
    const related = relatedSlugs
        .map((slug) => PORTFOLIO_PILLARS.find((p) => p.slug === slug))
        .filter((p): p is (typeof PORTFOLIO_PILLARS)[number] => Boolean(p));

    return (
        <section className="mb-24 md:mb-28">
            <div className="max-w-5xl mx-auto">
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-5">
                    Querverweise · Inter-Pillar
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
                    Was daran anschließt
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                    {related.map((pillar) => (
                        <Link
                            key={pillar.slug}
                            to={pillar.path}
                            className="group block bg-[#0D0D0D] border border-white/10 rounded-lg p-6 hover:border-[#A855F7]/40 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div
                                        className="font-mono text-[9px] tracking-[0.3em] uppercase mb-2"
                                        style={{ color: pillar.accent }}
                                    >
                                        {pillar.code} · {pillar.canon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#A855F7] transition-colors mb-2">
                                        {pillar.label}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {pillar.tagline}
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6">
                    <Link
                        to={PORTFOLIO_APEX.path}
                        className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500 hover:text-[#A855F7] transition-colors"
                    >
                        &gt; BACK_TO APEX /portfolio
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default InterPillarLinks;
