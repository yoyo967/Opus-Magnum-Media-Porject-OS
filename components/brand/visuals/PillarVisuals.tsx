import React from 'react';

// OMM Brand Protocol v3.0 · Visual Synthesis
// Linear Logic · 1.5pt outline · abstrakte Geometrie · neon purple accents · volumetric depth
// Alle Hero-SVGs nutzen eine gemeinsame Design-Sprache: Aurora Purple (#A855F7) als Kern,
// Strategy Blue (#3B82F6) als sekundär, Success Green (#22C55E) für aktive States,
// Alert Red (#EF4444) als Warnung, alles auf schwarzem Hintergrund mit volumetrischer Tiefe.

const AURORA = '#A855F7';
const BLUE = '#3B82F6';
const GREEN = '#22C55E';
const LOGIC = '#F5F5F5';

interface VisualProps {
    className?: string;
    title?: string;
    size?: 'hero' | 'cluster';
}

const wrap = (title: string, children: React.ReactNode, size: VisualProps['size'] = 'hero') => (
    <svg
        viewBox="0 0 640 360"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
        className={size === 'cluster' ? 'w-full h-auto max-h-[220px]' : 'w-full h-auto max-h-[420px]'}
        style={{ filter: 'drop-shadow(0 0 28px rgba(168, 85, 247, 0.18))' }}
    >
        <defs>
            <linearGradient id="viz-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A0A0A" />
                <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <radialGradient id="viz-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={AURORA} stopOpacity="0.28" />
                <stop offset="60%" stopColor={AURORA} stopOpacity="0.05" />
                <stop offset="100%" stopColor={AURORA} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="viz-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={AURORA} stopOpacity="0.8" />
                <stop offset="100%" stopColor={BLUE} stopOpacity="0.8" />
            </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#viz-bg)" />
        <rect width="640" height="360" fill="url(#viz-glow)" />
        {children}
    </svg>
);

// ── APEX ─────────────────────────────────────────────────────────────
// Nucleus mit 7 Pillars als orbitale Knoten mit Beschriftung (P0–P6)
export const ApexVisual: React.FC<VisualProps> = ({ title = 'Portfolio APEX', size }) => {
    const cx = 320, cy = 180;
    const labels = ['Doktrin', 'Epochen', 'Netzwerk', 'Builds', 'Anwerbung', 'Compliance', 'Columna'];
    // 7 Knoten gleichmäßig auf Kreis verteilt
    const angles = labels.map((_, i) => -90 + (i * 360) / labels.length);
    const r = 120;
    return wrap(title, (
        <g>
            {/* Orbit rings */}
            <circle cx={cx} cy={cy} r={r} stroke={AURORA} strokeOpacity="0.22" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r={r + 28} stroke={AURORA} strokeOpacity="0.08" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r={r - 42} stroke={BLUE} strokeOpacity="0.18" strokeWidth="1" fill="none" />
            {/* Connection lines */}
            {angles.map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const x = cx + Math.cos(rad) * r;
                const y = cy + Math.sin(rad) * r;
                return (
                    <line
                        key={`line-${i}`}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke={AURORA}
                        strokeOpacity="0.35"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                    />
                );
            })}
            {/* Nodes */}
            {angles.map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const x = cx + Math.cos(rad) * r;
                const y = cy + Math.sin(rad) * r;
                return (
                    <g key={`node-${i}`}>
                        <circle cx={x} cy={y} r="8" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.5" />
                        <circle cx={x} cy={y} r="3" fill={AURORA} />
                        <text
                            x={x + (Math.cos(rad) * 16)}
                            y={y + (Math.sin(rad) * 16) + 3}
                            fontFamily="JetBrains Mono, monospace"
                            fontSize="9"
                            letterSpacing="2"
                            fill={LOGIC}
                            textAnchor={Math.cos(rad) < -0.3 ? 'end' : Math.cos(rad) > 0.3 ? 'start' : 'middle'}
                        >
                            {labels[i].toUpperCase()}
                        </text>
                    </g>
                );
            })}
            {/* Core */}
            <circle cx={cx} cy={cy} r="26" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r="14" fill={LOGIC} />
            <circle cx={cx} cy={cy} r="14" stroke={AURORA} strokeOpacity="0.7" strokeWidth="0.8" fill="none" />
            <text x={cx} y={cy + 50} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={AURORA} textAnchor="middle">
                APEX
            </text>
        </g>
    ), size);
};

// ── EPOCHS ────────────────────────────────────────────────────────────
// Drei Frames horizontal, jeweils mit Icon (Activity / CPU / Network)
export const EpochsVisual: React.FC<VisualProps> = ({ title = 'Epochen — Operator-Zeitachse', size }) => {
    const frames = [
        { x: 120, label: 'OPERATION', sub: 'I · 2002–2008', color: AURORA },
        { x: 320, label: 'EXTENSION', sub: 'II · 2023 –',   color: AURORA },
        { x: 520, label: 'NETWORK',   sub: 'III · parallel', color: BLUE   },
    ];
    const cy = 180;
    return wrap(title, (
        <g>
            {/* Timeline baseline */}
            <line x1="60" y1={cy} x2="580" y2={cy} stroke="url(#viz-line)" strokeWidth="1.2" strokeOpacity="0.6" />
            {/* Interconnections */}
            <path d="M 160 150 Q 240 110 320 150" stroke={AURORA} strokeOpacity="0.35" strokeWidth="1" fill="none" strokeDasharray="2 3" />
            <path d="M 360 210 Q 440 250 520 210" stroke={AURORA} strokeOpacity="0.35" strokeWidth="1" fill="none" strokeDasharray="2 3" />
            {frames.map((f, i) => (
                <g key={f.label}>
                    {/* Orbit */}
                    <circle cx={f.x} cy={cy} r="48" stroke={f.color} strokeOpacity="0.18" strokeWidth="1" fill="none" />
                    <circle cx={f.x} cy={cy} r="30" stroke={f.color} strokeOpacity="0.35" strokeWidth="1" fill="none" />
                    {/* Core */}
                    <circle cx={f.x} cy={cy} r="14" fill="#0A0A0A" stroke={f.color} strokeWidth="1.5" />
                    <circle cx={f.x} cy={cy} r="6" fill={f.color} />
                    {/* Roman numeral */}
                    <text x={f.x} y={cy + 4} fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" fill={LOGIC} textAnchor="middle">
                        {['I','II','III'][i]}
                    </text>
                    {/* Label */}
                    <text x={f.x} y={cy - 62} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={f.color} textAnchor="middle">
                        {f.label}
                    </text>
                    <text x={f.x} y={cy + 72} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#9CA3AF" textAnchor="middle">
                        {f.sub}
                    </text>
                </g>
            ))}
            {/* Header mono */}
            <text x="60" y="50" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA}>
                &gt; TIMELINE /operator.epochs
            </text>
            <text x="60" y="68" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#6B7280">
                FRAMES: 3 · PATTERN: identical · DELTA: material + reach
            </text>
        </g>
    ), size);
};

// ── NETWORK ───────────────────────────────────────────────────────────
// Konzentrische Ringe: Pilot-Kern, 4 digitale Nodes, Familien-Ring
export const NetworkVisual: React.FC<VisualProps> = ({ title = 'Yildirim Operator Network', size }) => {
    const cx = 320, cy = 185;
    const nodes = [
        { angle:  -90, label: 'OMM'      },
        { angle:    0, label: 'LYGOX'    },
        { angle:   90, label: 'MASTER-X' },
        { angle:  180, label: 'SOV 2030' },
    ];
    const r = 95;
    return wrap(title, (
        <g>
            {/* Family outer ring */}
            <circle cx={cx} cy={cy} r="155" stroke={AURORA} strokeOpacity="0.08" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r="138" stroke={AURORA} strokeOpacity="0.14" strokeWidth="1" strokeDasharray="1 6" fill="none" />
            {/* Digital node ring */}
            <circle cx={cx} cy={cy} r={r} stroke={AURORA} strokeOpacity="0.35" strokeWidth="1" fill="none" />
            {/* Connections core to nodes */}
            {nodes.map((n, i) => {
                const rad = (n.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * r;
                const y = cy + Math.sin(rad) * r;
                return (
                    <line key={`ln-${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke={AURORA} strokeOpacity="0.4" strokeWidth="1" />
                );
            })}
            {/* Node-to-node mesh */}
            {nodes.map((n, i) => {
                const next = nodes[(i + 1) % nodes.length];
                const rad1 = (n.angle * Math.PI) / 180;
                const rad2 = (next.angle * Math.PI) / 180;
                const x1 = cx + Math.cos(rad1) * r;
                const y1 = cy + Math.sin(rad1) * r;
                const x2 = cx + Math.cos(rad2) * r;
                const y2 = cy + Math.sin(rad2) * r;
                return (
                    <line key={`mesh-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="1 3" />
                );
            })}
            {/* Nodes */}
            {nodes.map((n, i) => {
                const rad = (n.angle * Math.PI) / 180;
                const x = cx + Math.cos(rad) * r;
                const y = cy + Math.sin(rad) * r;
                const dx = Math.cos(rad) * 20;
                const dy = Math.sin(rad) * 20;
                return (
                    <g key={`node-${i}`}>
                        <circle cx={x} cy={y} r="10" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.5" />
                        <circle cx={x} cy={y} r="4" fill={AURORA} />
                        <text
                            x={x + dx} y={y + dy + 3}
                            fontFamily="JetBrains Mono, monospace"
                            fontSize="9" letterSpacing="2" fill={LOGIC}
                            textAnchor={Math.cos(rad) < -0.3 ? 'end' : Math.cos(rad) > 0.3 ? 'start' : 'middle'}
                        >
                            {n.label}
                        </text>
                    </g>
                );
            })}
            {/* Core (Pilot) */}
            <circle cx={cx} cy={cy} r="22" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r="12" fill={LOGIC} />
            <circle cx={cx} cy={cy} r="12" stroke={AURORA} strokeOpacity="0.7" strokeWidth="0.8" fill="none" />
            {/* Family dots on outer ring */}
            {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 8;
                const x = cx + Math.cos(a) * 138;
                const y = cy + Math.sin(a) * 138;
                return <circle key={`fam-${i}`} cx={x} cy={y} r="1.8" fill={AURORA} opacity="0.5" />;
            })}
            {/* Header */}
            <text x="60" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA}>
                &gt; MOUNT /network
            </text>
            <text x="60" y="62" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#6B7280">
                CORE: pilot · NODES: 4 digital · RING: family (anon)
            </text>
        </g>
    ), size);
};

// ── BUILDS ────────────────────────────────────────────────────────────
// Vertikal gestapelter Build-Stack: Build-Name, Stack-Layer, Deploy-Chip
export const BuildsVisual: React.FC<VisualProps> = ({ title = 'Public Builds — Evidence Layer', size }) => {
    const layers = [
        { y: 70,  label: 'UI · TYPESCRIPT · REACT · TAILWIND',    color: AURORA },
        { y: 110, label: 'ORCHESTRATION · MULTI-AGENT · VOICE',   color: AURORA },
        { y: 150, label: 'MODEL · GEMINI 1.5 / 2.0 · IMAGEN 3',   color: BLUE   },
        { y: 190, label: 'RUNTIME · CLOUD FUNCTIONS · FIRESTORE', color: BLUE   },
        { y: 230, label: 'DEPLOY · DEVPOST · GOOGLE CLOUD',       color: GREEN  },
    ];
    return wrap(title, (
        <g>
            {/* Stack rectangles */}
            {layers.map((l, i) => (
                <g key={`lay-${i}`}>
                    <rect x="80" y={l.y} width="480" height="30" rx="4" fill="#0D0D0D" stroke={l.color} strokeOpacity="0.5" strokeWidth="1" />
                    <rect x="80" y={l.y} width="4" height="30" fill={l.color} />
                    <text x="100" y={l.y + 19} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={LOGIC}>
                        {l.label}
                    </text>
                    <text x="550" y={l.y + 19} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill={l.color} textAnchor="end">
                        L{i + 1}
                    </text>
                </g>
            ))}
            {/* Connection column */}
            <line x1="82" y1="70" x2="82" y2="260" stroke={AURORA} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" />
            {/* Status pulse */}
            <g transform="translate(80, 280)">
                <circle cx="6" cy="6" r="5" fill={GREEN} opacity="0.9" />
                <circle cx="6" cy="6" r="9" fill="none" stroke={GREEN} strokeOpacity="0.4" strokeWidth="1">
                    <animate attributeName="r" values="5;14;5" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <text x="22" y="10" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={GREEN}>
                    DEPLOYED · PUBLIC · EVIDENCE
                </text>
            </g>
            {/* Header */}
            <text x="80" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={BLUE}>
                &gt; STACK /builds.public
            </text>
        </g>
    ), size);
};

// ── RECRUITMENT ───────────────────────────────────────────────────────
// 5 Optionen als horizontale Bahnen, die in einen Mandats-Punkt konvergieren
export const RecruitmentVisual: React.FC<VisualProps> = ({ title = 'Anwerbungs-Matrix — A → E', size }) => {
    const options = [
        { code: 'A', y: 80,  label: 'OPC RETURN',        color: AURORA },
        { code: 'B', y: 120, label: 'INTERIM / CHIEF AI', color: AURORA },
        { code: 'C', y: 180, label: 'CO-FOUNDER',        color: BLUE },
        { code: 'D', y: 220, label: 'ADVISORY / BOARD',  color: BLUE },
        { code: 'E', y: 270, label: 'SYSTEM INVESTMENT', color: GREEN },
    ];
    const endX = 510, endY = 180;
    return wrap(title, (
        <g>
            {/* Convergence target */}
            <circle cx={endX} cy={endY} r="22" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.2" />
            <circle cx={endX} cy={endY} r="10" fill={LOGIC} />
            <text x={endX} y={endY + 42} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={AURORA} textAnchor="middle">
                MANDATE
            </text>
            {options.map((o) => (
                <g key={o.code}>
                    {/* Rail */}
                    <line x1="90" y1={o.y} x2={endX - 24} y2={endY} stroke={o.color} strokeOpacity="0.45" strokeWidth="1" />
                    {/* Start chip */}
                    <rect x="60" y={o.y - 12} width="36" height="24" rx="3" fill="#0D0D0D" stroke={o.color} strokeWidth="1" />
                    <text x="78" y={o.y + 4} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill={LOGIC} textAnchor="middle">
                        {o.code}
                    </text>
                    {/* Label */}
                    <text x="108" y={o.y + 4} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={LOGIC}>
                        {o.label}
                    </text>
                    {/* Dot midway */}
                    <circle cx={(90 + endX) / 2} cy={(o.y + endY) / 2} r="2" fill={o.color} />
                </g>
            ))}
            <text x="60" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA}>
                &gt; ENUM /options = [A..E]
            </text>
        </g>
    ), size);
};

// ── COMPLIANCE ────────────────────────────────────────────────────────
// Hexagonales Shield mit 3 Regimes + EU-Sternen-Rim
export const ComplianceVisual: React.FC<VisualProps> = ({ title = 'Compliance Canon', size }) => {
    const cx = 320, cy = 180;
    // Hexagon corners
    const hexPoints = Array.from({ length: 6 }).map((_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return [cx + Math.cos(a) * 100, cy + Math.sin(a) * 100];
    });
    const hexPath = hexPoints.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z';
    const stars = 12;
    return wrap(title, (
        <g>
            {/* Outer rings */}
            <circle cx={cx} cy={cy} r="145" stroke={GREEN} strokeOpacity="0.15" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r="132" stroke={GREEN} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 6" fill="none" />
            {/* EU-style stars */}
            {Array.from({ length: stars }).map((_, i) => {
                const a = (i / stars) * Math.PI * 2;
                const x = cx + Math.cos(a) * 132;
                const y = cy + Math.sin(a) * 132;
                return <circle key={`star-${i}`} cx={x} cy={y} r="2" fill={GREEN} opacity="0.85" />;
            })}
            {/* Shield hexagon */}
            <path d={hexPath} fill="#0A0A0A" stroke={AURORA} strokeWidth="1.5" />
            <path d={hexPath} fill="none" stroke={AURORA} strokeOpacity="0.3" strokeWidth="6" />
            {/* Three regime plates */}
            <g fontFamily="JetBrains Mono, monospace" letterSpacing="2">
                <text x={cx} y={cy - 38} fontSize="11" fill={LOGIC} textAnchor="middle" fontWeight="600">DSGVO</text>
                <text x={cx} y={cy - 24} fontSize="8" fill="#9CA3AF" textAnchor="middle">(EU) 2016/679</text>
                <text x={cx} y={cy + 2}  fontSize="11" fill={LOGIC} textAnchor="middle" fontWeight="600">EU AI ACT</text>
                <text x={cx} y={cy + 16} fontSize="8" fill="#9CA3AF" textAnchor="middle">Art. 50 · 2.8.2026</text>
                <text x={cx} y={cy + 42} fontSize="11" fill={LOGIC} textAnchor="middle" fontWeight="600">EU DATA ACT</text>
                <text x={cx} y={cy + 56} fontSize="8" fill="#9CA3AF" textAnchor="middle">(EU) 2023/2854</text>
            </g>
            {/* Status chip */}
            <g transform={`translate(${cx - 52}, ${cy + 76})`}>
                <rect width="104" height="22" rx="3" fill="#0D0D0D" stroke={GREEN} strokeWidth="1" />
                <circle cx="14" cy="11" r="4" fill={GREEN} />
                <text x="30" y="15" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill={GREEN}>
                    ART. 50 READY
                </text>
            </g>
            <text x="60" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={GREEN}>
                &gt; STATUS /compliance = ACTIVE
            </text>
        </g>
    ), size);
};

// ── DOCTRINE ──────────────────────────────────────────────────────────
// Drei-Welten-Modell als triadische Kette: Origin → Processing → Target
// Mit Maxims-Satelliten (0 · I · III · VII) und B2B2A-Chip
export const DoctrineVisual: React.FC<VisualProps> = ({ title = 'Operator-Doktrin — Drei-Welten-Modell', size }) => {
    const worlds = [
        { x: 130, label: 'ORIGIN',     sub: 'Haltung · Intent',        color: AURORA },
        { x: 320, label: 'PROCESSING', sub: 'Agenten · Synergien',     color: AURORA },
        { x: 510, label: 'TARGET',     sub: 'Evidenz · Wirkung',       color: BLUE   },
    ];
    const cy = 180;
    const maxims = [
        { x: 130, y: 90,  code: '0'  },
        { x: 225, y: 268, code: 'I'  },
        { x: 415, y: 90,  code: 'III'},
        { x: 510, y: 268, code: 'VII'},
    ];
    return wrap(title, (
        <g>
            {/* Flow axis */}
            <line x1="60" y1={cy} x2="580" y2={cy} stroke="url(#viz-line)" strokeWidth="1.2" strokeOpacity="0.5" />
            {/* Direction arrows */}
            <path d="M 210 180 L 230 175 L 230 185 Z" fill={AURORA} opacity="0.85" />
            <path d="M 400 180 L 420 175 L 420 185 Z" fill={AURORA} opacity="0.85" />
            {/* World spheres */}
            {worlds.map((w, i) => (
                <g key={w.label}>
                    <circle cx={w.x} cy={cy} r="46" stroke={w.color} strokeOpacity="0.16" strokeWidth="1" fill="none" />
                    <circle cx={w.x} cy={cy} r="30" stroke={w.color} strokeOpacity="0.38" strokeWidth="1" fill="none" />
                    <circle cx={w.x} cy={cy} r="16" fill="#0A0A0A" stroke={w.color} strokeWidth="1.5" />
                    <text x={w.x} y={cy + 4} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="12" fill={LOGIC} textAnchor="middle">
                        {String(i + 1)}
                    </text>
                    <text x={w.x} y={cy - 62} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={w.color} textAnchor="middle">
                        {w.label}
                    </text>
                    <text x={w.x} y={cy + 72} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#9CA3AF" textAnchor="middle">
                        {w.sub}
                    </text>
                </g>
            ))}
            {/* Maxim satellites */}
            {maxims.map((m) => (
                <g key={m.code}>
                    <circle cx={m.x} cy={m.y} r="14" fill="#0D0D0D" stroke={AURORA} strokeOpacity="0.6" strokeWidth="1" />
                    <text x={m.x} y={m.y + 4} fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill={AURORA} textAnchor="middle">
                        {m.code}
                    </text>
                </g>
            ))}
            {/* B2B2A chip */}
            <g transform="translate(60, 290)">
                <rect width="96" height="22" rx="3" fill="#0D0D0D" stroke={BLUE} strokeWidth="1" />
                <text x="48" y="15" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={BLUE} textAnchor="middle">
                    B2B2A · PRIMARY=AGENT
                </text>
            </g>
            {/* Header */}
            <text x="60" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA}>
                &gt; DOCTRINE /three-worlds
            </text>
            <text x="60" y="62" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#6B7280">
                MAXIMS: 0 · I · III · VII · PARADIGM: agentic
            </text>
        </g>
    ), size);
};

// ── COLUMNA ───────────────────────────────────────────────────────────
// Columna als stratified stack: Ingest → Synthesis → Expansion (APC-Generator)
// mit SEO/AEO/GEO-Layer-Chip und GCP_EU_WEST3 Regions-Marker
export const ColumnaVisual: React.FC<VisualProps> = ({ title = 'Columna — Content-Intelligence Stack', size }) => {
    const layers = [
        { y: 70,  code: 'L0', label: 'INGESTION · SERP · COMPETITIVE GRAPH',      color: AURORA },
        { y: 108, code: 'L1', label: 'SYNTHESIS · SEMANTIC · CANONICAL',           color: AURORA },
        { y: 146, code: 'L3', label: 'EXPANSION · APEX → PILLAR → CLUSTER',        color: BLUE   },
        { y: 184, code: 'UI', label: 'SEO · AEO · GEO · B2B2A DELIVERY',           color: BLUE   },
        { y: 222, code: 'EU', label: 'GCP · europe-west3 (Frankfurt) · VERTEX AI', color: GREEN  },
    ];
    return wrap(title, (
        <g>
            {/* Vertical pillar (Columna) — the 'column' metaphor */}
            <rect x="60" y="62" width="8" height="198" fill={AURORA} opacity="0.25" />
            <rect x="60" y="62" width="8" height="198" fill="none" stroke={AURORA} strokeOpacity="0.6" strokeWidth="0.5" />
            {/* Capital / base ornaments */}
            <rect x="52" y="58" width="24" height="6" fill={AURORA} opacity="0.5" />
            <rect x="52" y="258" width="24" height="6" fill={AURORA} opacity="0.5" />
            {/* Stack layers */}
            {layers.map((l, i) => (
                <g key={l.code}>
                    <rect x="92" y={l.y} width="478" height="28" rx="4" fill="#0D0D0D" stroke={l.color} strokeOpacity="0.55" strokeWidth="1" />
                    <rect x="92" y={l.y} width="4" height="28" fill={l.color} />
                    <text x="110" y={l.y + 18} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={LOGIC}>
                        {l.label}
                    </text>
                    <text x="560" y={l.y + 18} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill={l.color} textAnchor="end">
                        {l.code}
                    </text>
                </g>
            ))}
            {/* Topology arrow: APEX → PILLAR → CLUSTER */}
            <g transform="translate(92, 268)">
                <text fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={AURORA}>
                    <tspan x="0" y="8">APEX</tspan>
                    <tspan x="74" y="8" fill="#6B7280">→</tspan>
                    <tspan x="98" y="8">PILLAR</tspan>
                    <tspan x="186" y="8" fill="#6B7280">→</tspan>
                    <tspan x="210" y="8">CLUSTER</tspan>
                </text>
                <g transform="translate(360, 0)">
                    <rect width="110" height="16" rx="2" fill="#0D0D0D" stroke={GREEN} strokeWidth="1" />
                    <circle cx="10" cy="8" r="3" fill={GREEN} />
                    <text x="20" y="12" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="2" fill={GREEN}>
                        CANONICAL v2.0
                    </text>
                </g>
            </g>
            {/* Header */}
            <text x="92" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={BLUE}>
                &gt; COLUMNA /apc-generator
            </text>
        </g>
    ), size);
};

// ── PTA (Perfect Twin Architecture) ───────────────────────────────────
// Double Helix: zwei verschränkte Stränge (GOOGLE_INFRA_HELIX ∥ OMM_LOGIC_HELIX)
// mit 4 Rungs (APEX 4-Layer) und einem Aurora-Protocol-Badge (L0 → L1 → L3)
export const PTAVisual: React.FC<VisualProps> = ({ title = 'Perfect Twin Architecture — Double Helix', size }) => {
    const cxL = 200, cxR = 440;
    const top = 70, bot = 290;
    // Build two sinusoidal strands between top and bot
    const samples = 40;
    const makePath = (baseX: number, phase: number) => {
        const amp = 28;
        const pts: string[] = [];
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const y = top + (bot - top) * t;
            const x = baseX + Math.sin(t * Math.PI * 3 + phase) * amp;
            pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
        }
        return pts.join(' ');
    };
    const rungs = [
        { t: 0.15, label: 'AGENT MEMORY' },
        { t: 0.4,  label: 'PRIVACY GUARD' },
        { t: 0.65, label: 'EXECUTION' },
        { t: 0.9,  label: 'AUDIT TRAIL'  },
    ];
    return wrap(title, (
        <g>
            {/* Helix strands */}
            <path d={makePath(cxL, 0)}        fill="none" stroke={AURORA} strokeOpacity="0.85" strokeWidth="1.6" />
            <path d={makePath(cxR, Math.PI)}  fill="none" stroke={BLUE}   strokeOpacity="0.85" strokeWidth="1.6" />
            {/* Ghost strands (depth) */}
            <path d={makePath(cxL, 0)}        fill="none" stroke={AURORA} strokeOpacity="0.2"  strokeWidth="5" />
            <path d={makePath(cxR, Math.PI)}  fill="none" stroke={BLUE}   strokeOpacity="0.2"  strokeWidth="5" />
            {/* Rungs with labels */}
            {rungs.map((r, i) => {
                const y = top + (bot - top) * r.t;
                const amp = 28;
                const x1 = cxL + Math.sin(r.t * Math.PI * 3 + 0) * amp;
                const x2 = cxR + Math.sin(r.t * Math.PI * 3 + Math.PI) * amp;
                return (
                    <g key={`rung-${i}`}>
                        <line x1={x1} y1={y} x2={x2} y2={y} stroke={LOGIC} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx={x1} cy={y} r="4" fill={AURORA} />
                        <circle cx={x2} cy={y} r="4" fill={BLUE} />
                        <text x={(x1 + x2) / 2} y={y - 8} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill={LOGIC} textAnchor="middle">
                            L{i + 1} · {r.label}
                        </text>
                    </g>
                );
            })}
            {/* Strand labels */}
            <text x={cxL} y={55} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={AURORA} textAnchor="middle">
                GOOGLE_INFRA_HELIX
            </text>
            <text x={cxR} y={55} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={BLUE} textAnchor="middle">
                OMM_LOGIC_HELIX
            </text>
            {/* Aurora Protocol badge */}
            <g transform="translate(224, 306)">
                <rect width="192" height="22" rx="3" fill="#0D0D0D" stroke={GREEN} strokeWidth="1" />
                <text x="96" y="15" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="3" fill={GREEN} textAnchor="middle">
                    AURORA · L0 → L1 → L3
                </text>
            </g>
        </g>
    ), size);
};

// ── MESH (52-Node Neural Mesh für AGENTICUM G5 Genius) ───────────────
// Gitter aus Knoten mit prozeduralen Verbindungen, zentraler Hub, Voice-Puls
export const MeshVisual: React.FC<VisualProps> = ({ title = 'Agenticum G5 — 52-Node Neural Mesh', size }) => {
    const cx = 320, cy = 180;
    // 52 Nodes: 1 center + 6 inner + 12 mid + 18 outer + 15 scatter
    const ring = (count: number, r: number) =>
        Array.from({ length: count }).map((_, i) => {
            const a = (i / count) * Math.PI * 2 - Math.PI / 2;
            return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
        });
    const inner = ring(6, 40);
    const mid   = ring(12, 78);
    const outer = ring(18, 118);
    // 15 scatter nodes
    const scatter: { x: number; y: number }[] = Array.from({ length: 15 }).map((_, i) => {
        const seed = (i * 1301 + 7) % 360;
        const r = 140 + ((i * 17) % 28);
        const a = (seed * Math.PI) / 180;
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.6 };
    });
    return wrap(title, (
        <g>
            {/* Ring outlines */}
            <circle cx={cx} cy={cy} r="40"  stroke={AURORA} strokeOpacity="0.22" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r="78"  stroke={AURORA} strokeOpacity="0.15" strokeWidth="1" fill="none" />
            <circle cx={cx} cy={cy} r="118" stroke={AURORA} strokeOpacity="0.10" strokeWidth="1" fill="none" />
            {/* Radial connections: center → inner */}
            {inner.map((p, i) => (
                <line key={`i-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={AURORA} strokeOpacity="0.45" strokeWidth="1" />
            ))}
            {/* inner → mid (every 2nd) */}
            {inner.map((p, i) => {
                const m = mid[(i * 2) % mid.length];
                return <line key={`im-${i}`} x1={p.x} y1={p.y} x2={m.x} y2={m.y} stroke={AURORA} strokeOpacity="0.28" strokeWidth="1" />;
            })}
            {/* mid → outer mesh */}
            {mid.map((p, i) => {
                const o = outer[(i * 3) % outer.length];
                return <line key={`mo-${i}`} x1={p.x} y1={p.y} x2={o.x} y2={o.y} stroke={BLUE} strokeOpacity="0.22" strokeWidth="1" />;
            })}
            {/* Nodes */}
            {inner.map((p, i)  => <circle key={`in-${i}`}  cx={p.x} cy={p.y} r="4" fill={AURORA} />)}
            {mid.map((p, i)    => <circle key={`md-${i}`}  cx={p.x} cy={p.y} r="3" fill={LOGIC} opacity="0.8" />)}
            {outer.map((p, i)  => <circle key={`ou-${i}`}  cx={p.x} cy={p.y} r="2.5" fill={BLUE} opacity="0.75" />)}
            {scatter.map((p, i)=> <circle key={`sc-${i}`}  cx={p.x} cy={p.y} r="1.8" fill={AURORA} opacity="0.45" />)}
            {/* Hub */}
            <circle cx={cx} cy={cy} r="20" fill="#0A0A0A" stroke={AURORA} strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="10" fill={LOGIC} />
            {/* Voice pulse */}
            <circle cx={cx} cy={cy} r="20" fill="none" stroke={AURORA} strokeOpacity="0.5" strokeWidth="1">
                <animate attributeName="r" values="20;38;20" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite" />
            </circle>
            {/* Header */}
            <text x="60" y="45" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA}>
                &gt; MOUNT /agenticum.mesh
            </text>
            <text x="60" y="62" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#6B7280">
                NODES: 52 · TOPOLOGY: 1 + 6 + 12 + 18 + 15 · VOICE-FIRST
            </text>
            {/* Node count chip */}
            <g transform="translate(510, 300)">
                <rect width="70" height="22" rx="3" fill="#0D0D0D" stroke={AURORA} strokeWidth="1" />
                <text x="35" y="15" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill={AURORA} textAnchor="middle">
                    52 · LIVE
                </text>
            </g>
        </g>
    ), size);
};

// ── Router ────────────────────────────────────────────────────────────
export type PillarVisualName =
    | 'apex'
    | 'doctrine'
    | 'epochs'
    | 'network'
    | 'builds'
    | 'recruitment'
    | 'compliance'
    | 'columna'
    | 'pta'
    | 'mesh';

export const PillarVisual: React.FC<VisualProps & { name: PillarVisualName }> = ({ name, ...rest }) => {
    switch (name) {
        case 'apex':        return <ApexVisual {...rest} />;
        case 'doctrine':    return <DoctrineVisual {...rest} />;
        case 'epochs':      return <EpochsVisual {...rest} />;
        case 'network':     return <NetworkVisual {...rest} />;
        case 'builds':      return <BuildsVisual {...rest} />;
        case 'recruitment': return <RecruitmentVisual {...rest} />;
        case 'compliance':  return <ComplianceVisual {...rest} />;
        case 'columna':     return <ColumnaVisual {...rest} />;
        case 'pta':         return <PTAVisual {...rest} />;
        case 'mesh':        return <MeshVisual {...rest} />;
    }
};
