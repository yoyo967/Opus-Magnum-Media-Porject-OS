import { useEffect } from 'react';
import { SITE_ORIGIN } from '../../data/portfolio-v2';

// useSEO — framework-light SEO-Hook ohne react-helmet Dependency.
// Setzt document.title, <meta name="description">, <link rel="canonical">,
// OpenGraph + Twitter Card Tags per direkter Head-Mutation.
// Räumt eigene Mutationen beim Unmount/Re-Route nicht weg — jede Route
// überschreibt den gleichen Tag-Slot (per data-attribute markiert).

export interface SEOInput {
    title: string;
    description: string;
    canonicalPath?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    locale?: string;
}

const DATA_KEY = 'data-omm-seo';

const upsertMeta = (attr: 'name' | 'property', key: string, value: string) => {
    if (!value) return;
    const selector = `meta[${attr}="${key}"]`;
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute(DATA_KEY, '1');
        document.head.appendChild(el);
    }
    el.setAttribute('content', value);
};

const upsertLink = (rel: string, href: string) => {
    if (!href) return;
    const selector = `link[rel="${rel}"][${DATA_KEY}]`;
    let el = document.head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        el.setAttribute(DATA_KEY, '1');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
};

export function useSEO(seo: SEOInput) {
    useEffect(() => {
        const canonicalUrl = seo.canonicalPath
            ? `${SITE_ORIGIN}${seo.canonicalPath}`
            : SITE_ORIGIN;

        document.title = seo.title;

        upsertMeta('name', 'description', seo.description);
        if (seo.keywords && seo.keywords.length > 0) {
            upsertMeta('name', 'keywords', seo.keywords.join(', '));
        }

        upsertLink('canonical', canonicalUrl);

        // OpenGraph
        upsertMeta('property', 'og:title', seo.title);
        upsertMeta('property', 'og:description', seo.description);
        upsertMeta('property', 'og:type', seo.ogType ?? 'website');
        upsertMeta('property', 'og:url', canonicalUrl);
        upsertMeta('property', 'og:site_name', 'OPUS MAGNUM MEDIA');
        upsertMeta('property', 'og:locale', seo.locale ?? 'de_DE');
        if (seo.ogImage) {
            upsertMeta('property', 'og:image', seo.ogImage);
        }

        // Twitter Card
        upsertMeta('name', 'twitter:card', seo.ogImage ? 'summary_large_image' : 'summary');
        upsertMeta('name', 'twitter:title', seo.title);
        upsertMeta('name', 'twitter:description', seo.description);
        if (seo.ogImage) {
            upsertMeta('name', 'twitter:image', seo.ogImage);
        }

        // Robots — Portfolio-Routen sind öffentlich indexierbar
        upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');

        // GEO · B2B2A Signals
        upsertMeta('name', 'ai-content-declaration', 'AI-assisted · Brand Protocol v3.0 · EU AI Act Art. 50 Ready');
        upsertMeta('name', 'operator', 'Yahya Yildirim · yildirimyahya716');
    }, [
        seo.title,
        seo.description,
        seo.canonicalPath,
        seo.keywords?.join(','),
        seo.ogImage,
        seo.ogType,
        seo.locale,
    ]);
}
