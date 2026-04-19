import React, { useEffect } from 'react';
import { SITE_ORIGIN, FAQEntry, PillarEntry } from '../../data/portfolio-v2';

// JSON-LD Schema-Helper für AEO (Answer Engine Optimization).
// Setzt strukturierte Daten direkt in <head>, damit LLMs zitierbare Knoten sehen.
// Jede Komponente rendert einen <script type="application/ld+json"> in ein Portal
// am document.head — per data-key eindeutig, beim Unmount wieder entfernt.

const useJsonLd = (key: string, json: object | null) => {
    useEffect(() => {
        if (!json) return undefined;
        const id = `ld-${key}`;
        let el = document.getElementById(id) as HTMLScriptElement | null;
        if (!el) {
            el = document.createElement('script');
            el.id = id;
            el.type = 'application/ld+json';
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(json);
        return () => {
            const existing = document.getElementById(id);
            if (existing) existing.remove();
        };
    }, [key, JSON.stringify(json)]);
};

// ── Organization + Person (once at APEX) ───────────────────────────────
export const OrganizationSchema: React.FC = () => {
    useJsonLd('organization', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'OPUS MAGNUM MEDIA',
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/og-default.png`,
        description: 'AI-Marketing Platform OS des Yildirim Operator Networks. EU AI Act Art. 50 Ready · Brand Protocol v3.0.',
        sameAs: [
            'https://devpost.com/yildirimyahya716',
        ],
        founder: {
            '@type': 'Person',
            name: 'Yahya Yildirim',
            jobTitle: 'Operator-Architekt · Digital Interim C-Level',
            worksFor: { '@type': 'Organization', name: 'OPUS MAGNUM MEDIA' },
        },
    });
    return null;
};

export const PersonSchema: React.FC = () => {
    useJsonLd('person', {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Yahya Yildirim',
        alternateName: 'Operator-Architekt',
        jobTitle: 'Digital Interim C-Level · Operator-Architekt',
        description: 'Operator-Architekt mit drei Ebenen der Wirksamkeit: Operation, Extension, Network. Interim-Management, AI-native Architektur, Yildirim Operator Network.',
        url: `${SITE_ORIGIN}/portfolio`,
        address: { '@type': 'PostalAddress', addressLocality: 'Berlin', addressCountry: 'DE' },
        knowsAbout: [
            'Interim Management',
            'AI-native Architecture',
            'Agentic Organization',
            'Perfect Twin Architecture',
            'EU AI Act Compliance',
            'Content Intelligence',
            'Operator Maxims',
        ],
        sameAs: [
            'https://devpost.com/yildirimyahya716',
        ],
    });
    return null;
};

// ── Pillar / CreativeWork Schema ───────────────────────────────────────
interface PillarSchemaProps { pillar: PillarEntry; }
export const PillarSchema: React.FC<PillarSchemaProps> = ({ pillar }) => {
    useJsonLd(`pillar-${pillar.slug}`, {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: pillar.seoTitle ?? pillar.label,
        headline: pillar.tagline,
        description: pillar.seoDescription ?? pillar.desc,
        url: `${SITE_ORIGIN}${pillar.path}`,
        keywords: pillar.keywords?.join(', '),
        author: { '@type': 'Person', name: 'Yahya Yildirim' },
        publisher: { '@type': 'Organization', name: 'OPUS MAGNUM MEDIA' },
        inLanguage: 'de',
        isPartOf: {
            '@type': 'CreativeWorkSeries',
            name: 'Portfolio APEX',
            url: `${SITE_ORIGIN}/portfolio`,
        },
        hasPart: pillar.clusters.map((c) => ({
            '@type': 'CreativeWork',
            name: c.label,
            url: `${SITE_ORIGIN}${c.path}`,
        })),
    });
    return null;
};

// ── FAQ Schema (AEO-Pflicht) ──────────────────────────────────────────
interface FAQSchemaProps { id: string; faqs: FAQEntry[]; }
export const FAQSchema: React.FC<FAQSchemaProps> = ({ id, faqs }) => {
    useJsonLd(
        `faq-${id}`,
        faqs.length === 0
            ? null
            : {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
    );
    return null;
};

// ── Breadcrumb Schema ─────────────────────────────────────────────────
interface BreadcrumbSchemaProps { crumbs: { label: string; path?: string }[]; }
export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ crumbs }) => {
    useJsonLd('breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: c.path ? `${SITE_ORIGIN}${c.path}` : undefined,
        })),
    });
    return null;
};
