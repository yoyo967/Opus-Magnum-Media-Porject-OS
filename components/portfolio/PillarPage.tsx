import React from 'react';
import { Link } from 'react-router-dom';
import { PillarEntry } from '../../data/portfolio-v2';
import { PillarHero } from './PillarHero';
import { NarrativeArc } from './NarrativeArc';
import { ClusterGrid } from './ClusterGrid';
import { InterPillarLinks } from './InterPillarLinks';
import { FAQBlock } from './FAQBlock';
import { SpecBlock } from './SpecBlock';
import { PillarEvidenceBlock } from './EvidenceLayer';
import { useSEO } from '../seo/useSEO';
import { PillarSchema, FAQSchema } from '../seo/Schemas';

interface PillarPageProps {
    pillar: PillarEntry;
    children?: React.ReactNode;
}

// Template für alle Pillar-Seiten: Hero → Narrative Arc (8 Phasen) → optionale Custom-Sections → Spec-Block (GEO) → FAQ-Block (AEO) → Cluster-Grid → Inter-Pillar-Links
export const PillarPage: React.FC<PillarPageProps> = ({ pillar, children }) => {
    useSEO({
        title: pillar.seoTitle ?? `${pillar.label} — ${pillar.tagline} · Yahya Yildirim`,
        description: pillar.seoDescription ?? pillar.desc,
        canonicalPath: pillar.path,
        keywords: pillar.keywords,
        ogType: 'article',
    });

    return (
    <div className="container mx-auto px-6 py-12 md:py-20 relative">
        <PillarSchema pillar={pillar} />
        {pillar.faqs && pillar.faqs.length > 0 && (
            <FAQSchema id={pillar.slug} faqs={pillar.faqs} />
        )}

        <PillarHero
            kicker={pillar.kicker}
            title={pillar.tagline}
            tagline={pillar.desc}
            visualKey={pillar.visualKey}
            accent={pillar.accent}
            statusLine={`> PILLAR /${pillar.slug} · ${pillar.canon} · STATUS ACTIVE`}
        />

        <NarrativeArc phases={pillar.narrative} accent={pillar.accent} />

        <PillarEvidenceBlock pillar={pillar} />

        {children}

        {pillar.spec && pillar.spec.length > 0 && (
            <SpecBlock spec={pillar.spec} accent={pillar.accent} label={`> SPEC /${pillar.slug}`} />
        )}

        <ClusterGrid
            clusters={pillar.clusters}
            accent={pillar.accent}
            heading={`${pillar.label} · Cluster-Tiefe`}
            kicker={`${pillar.code} · Sub-Nodes`}
        />

        {pillar.faqs && pillar.faqs.length > 0 && (
            <FAQBlock
                faqs={pillar.faqs}
                accent={pillar.accent}
                kicker={`${pillar.code} · AEO · Answer Engine Optimization`}
                heading="Kanonische Fragen zu dieser Pillar"
            />
        )}

        <InterPillarLinks currentSlug={pillar.slug} relatedSlugs={pillar.related} />

        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10 border-t border-white/5">
                <div>
                    <div
                        className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2"
                        style={{ color: pillar.accent }}
                    >
                        CTA · nächster Schritt
                    </div>
                    <p className="text-white text-lg leading-snug max-w-xl">
                        Gefunden, was relevant ist? Dann ist der nächste Schritt die passende Option in der Anwerbungs-Matrix.
                    </p>
                </div>
                <Link
                    to="/portfolio/anwerbung"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#A855F7] text-black font-semibold tracking-wide rounded-md hover:bg-[#A855F7]/90 transition-colors"
                    style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
                >
                    Anwerbungs-Matrix ansehen →
                </Link>
            </div>
        </div>
    </div>
    );
};

export default PillarPage;
