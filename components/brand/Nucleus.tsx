import React from 'react';

// Nucleus — OMM Brand Protocol v3.0 · Kern-Identität
// Innerer massiver Kern = unantastbare menschliche Intention (Der Pilot)
// Äußerer Ring = globales Netzwerk + Cloud-Infrastruktur
// Schutzzone (Clear Space) = 200% der inneren Kern-Breite
// Minimale Skalierung: 24px digital.

export type NucleusVariant = 'glyph' | 'badge' | 'mono';

interface NucleusProps {
    variant?: NucleusVariant;
    size?: number;
    glow?: boolean;
    className?: string;
    title?: string;
}

const AURORA = '#A855F7';
const LOGIC = '#F5F5F5';

const Glyph: React.FC<{ size: number; glow: boolean; title?: string }> = ({ size, glow, title }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title ?? 'OPUS MAGNUM MEDIA Nucleus'}
        style={glow ? { filter: `drop-shadow(0 0 18px ${AURORA}66)` } : undefined}
    >
        <defs>
            <radialGradient id="nucleus-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={LOGIC} stopOpacity="1" />
                <stop offset="70%" stopColor={LOGIC} stopOpacity="0.95" />
                <stop offset="100%" stopColor={LOGIC} stopOpacity="0.85" />
            </radialGradient>
            <linearGradient id="nucleus-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={AURORA} stopOpacity="0.9" />
                <stop offset="50%" stopColor={AURORA} stopOpacity="0.35" />
                <stop offset="100%" stopColor={AURORA} stopOpacity="0.9" />
            </linearGradient>
        </defs>

        {/* Outer ring — globales Netzwerk */}
        <circle cx="60" cy="60" r="54" stroke="url(#nucleus-ring)" strokeWidth="1.5" fill="none" />
        {/* Mid orbit — Infrastruktur */}
        <circle cx="60" cy="60" r="38" stroke={AURORA} strokeOpacity="0.25" strokeWidth="1" fill="none" />
        {/* Orbit tick marks */}
        <g stroke={AURORA} strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round">
            <line x1="60" y1="4"   x2="60" y2="10"  />
            <line x1="60" y1="110" x2="60" y2="116" />
            <line x1="4"  y1="60"  x2="10" y2="60"  />
            <line x1="110" y1="60" x2="116" y2="60" />
        </g>
        {/* Inner kernel — menschliche Intention (Der Pilot) */}
        <circle cx="60" cy="60" r="14" fill="url(#nucleus-core)" />
        <circle cx="60" cy="60" r="14" stroke={AURORA} strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
    </svg>
);

const Badge: React.FC<{ size: number; glow: boolean; title?: string }> = ({ size, glow, title }) => (
    <div className={`flex items-center gap-3`}>
        <Glyph size={size} glow={glow} title={title} />
        <div className="leading-tight">
            <div
                className="text-[11px] tracking-[0.32em] uppercase font-semibold"
                style={{ color: LOGIC, fontFamily: 'Inter, sans-serif' }}
            >
                Opus Magnum
            </div>
            <div
                className="text-[9px] tracking-[0.45em] uppercase"
                style={{ color: AURORA, fontFamily: 'JetBrains Mono, monospace' }}
            >
                Media · OS v3.0
            </div>
        </div>
    </div>
);

const Mono: React.FC<{ size: number; glow: boolean; title?: string }> = ({ size, glow, title }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title ?? 'OMM Nucleus'}
        style={glow ? { filter: `drop-shadow(0 0 6px ${AURORA}99)` } : undefined}
    >
        <circle cx="12" cy="12" r="10" stroke={AURORA} strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="12" r="3" fill={LOGIC} />
    </svg>
);

export const Nucleus: React.FC<NucleusProps> = ({
    variant = 'glyph',
    size,
    glow = false,
    className,
    title,
}) => {
    const resolvedSize = size ?? (variant === 'mono' ? 24 : variant === 'badge' ? 40 : 80);
    const content =
        variant === 'badge' ? <Badge size={resolvedSize} glow={glow} title={title} /> :
        variant === 'mono'  ? <Mono size={resolvedSize} glow={glow} title={title} /> :
                              <Glyph size={resolvedSize} glow={glow} title={title} />;
    return <span className={className}>{content}</span>;
};

export default Nucleus;
