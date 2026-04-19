// Portfolio v2.5 — Single Source of Truth für die Portfolio-Landingpage.
// Basis: PORTFOLIO_CANONICAL.md v1.8 (19.04.2026).
// Regel: Änderungen am Canonical → Version-Bump hier → Seite aktualisiert automatisch.
// Architektur: APEX + 7 Pillars (P0 Doktrin · P1–P5 Operator · P6 Columna) + Clusters
// unter /portfolio/* mit eigenen Hero-Visuals, 8-Phasen Narrative Arc und SEO/AEO/GEO-Schicht
// nach Sovereign 2030 Master Production Framework.

export const PORTFOLIO_VERSION = 'v2.5';
export const CANONICAL_REF = 'v1.8';
export const LAST_UPDATED = '2026-04-19';
export const LOCATION = 'Berlin';
export const PORTFOLIO_TITLE = 'Digital Interim C-Level Architecture';
export const SITE_ORIGIN = 'https://opusmagnum.media';
export const OPERATOR_HANDLE = 'yildirimyahya716';

export interface ChangelogEntry {
    version: string;
    date: string;
    summary: string;
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: 'v2.5',
        date: '2026-04-19',
        summary: 'Sprint 4 · Evidenz-Layer: §4a mit EvidenceMetric + EvidenceCaseStudy-Typen, sechs kanonische Case-Studies (OPC-Restrukturierung · OMM-Platform · YON-Network · AGENTICUM G5 · G5 Genius · Perfect Twin Architecture) + Sovereign-Korpus-Transparenz. Metrik-Blöcke an Epochs-Cards, PublicBuilds-Cards, P1 Epochen und P3 Builds PillarPage. Regel: nur verifizierbare Fakten; verified=false markiert Operator-Disclosure; Sovereign-Zahlen explizit als Grounding-Korpus, nicht Produkt-Traction.',
    },
    {
        version: 'v2.4',
        date: '2026-04-19',
        summary: 'Canonical v1.8 · Sprint 3 parallel: P0 Operator-Doktrin (Maxims · Drei-Welten-Modell · Frontier-Firma · B2B2A · McKinsey-Paradox) als Fundament-Pillar vor Epochen; P6 Columna (Content-Intelligence · Competitive-Architecture · APC-Generator · SEO-AEO-GEO · Roadmap 2030) als Produkt-Pillar; P3 Builds um Perfect-Twin-Architecture-Cluster erweitert (Double Helix · APEX 4-Layer · Aurora Protocol L0–L3); LYGOX-Cluster um SIS/YON/KOB/GOL-Struktur vertieft; globale SEO/AEO/GEO-Infrastruktur (useSEO · JSON-LD · FAQ-Schema · Spec-Blocks · sitemap.xml · robots.txt · operator.json). Vier neue Hero-Visuals (Doctrine · Columna · PTA · Mesh).',
    },
    {
        version: 'v2.3',
        date: '2026-04-19',
        summary: 'Canonical v1.7 · Sprint 2: 5 Pillar-Seiten (Epochen · Netzwerk · Builds · Anwerbung · Compliance) jeweils mit eigenem SVG-Hero-Visual (Timeline · Network-Graph · Build-Stack · Recruitment-Funnel · Compliance-Shield), 8-Phasen Narrative Arc nach Sovereign-Framework, Cluster-Grid und Inter-Pillar-Links. Cluster-Routen als Scaffold mit Header-Visual (Content-Ausbau Sprint 3).',
    },
    {
        version: 'v2.2',
        date: '2026-04-19',
        summary: 'Canonical v1.6 · Sprint 1: Portfolio als eigenständige APEX/Pillar/Cluster-Architektur unter /portfolio/* mit PortfolioShell, Nucleus-Logo, Breadcrumb und System-Log-Footer nach OMM Brand Protocol v3.0. Sovereign 2030 mit transparentem Grounding-Korpus (Option B).',
    },
    {
        version: 'v2.1',
        date: '2026-04-19',
        summary: 'Canonical-Bump v1.5: Ganzheits-Prinzip im §1c (alle Yahya-Builds gehören zum Yildirim Operator Network), Sovereign 2030 und OMM als Netzwerk-Knoten, Familien-Prinzip ohne Namen, neue Sektionen §0b TENSION und §4 PUBLIC BUILDS (Devpost-Evidence).',
    },
    {
        version: 'v2.0',
        date: '2026-04-18',
        summary: 'Vollständiger Rewrite nach Canonical v1.4. Sektionierte Architektur, sichtbare Versionierung, OPC-Verantwortungs-Tabelle, Yildirim-Netzwerk, Compliance-Canon (§16), Entscheidungshistorie.',
    },
    {
        version: 'v1.0',
        date: '2026-04-17',
        summary: 'Erstfassung auf Basis Canonical v1.0–v1.3. Drei-Epochen-Struktur, Anwerbungs-Matrix, Kurz-Bio.',
    },
];

// § 0 — Positionierungs-Satz
export const POSITIONING = {
    headline: 'Yahya Yildirim',
    subheadline: 'Operator-Architekt mit drei Ebenen der Wirksamkeit',
    axes: ['Operation', 'Extension', 'Network'] as const,
    motto: 'Das Muster ist identisch durch alle drei Ebenen. Das Material hat sich geändert. Die Reichweite hat sich erweitert.',
};

// § 0b — Strukturelle Beobachtung (Tension vor dem Narrativ)
export const TENSION = {
    kicker: '§0b · Strukturelle Beobachtung',
    title: 'Warum Anwerbung, nicht Bewerbung',
    body: 'Lebensläufe messen Vergangenheits-Beiträge zu Strukturen, die andere gebaut haben. Sie sind für den Fall geeicht, dass Arbeit delegiert und in Titel übersetzt wurde. Operator-Architektur arbeitet in der anderen Richtung: sie baut die Strukturen, in denen Titel später entstehen. Zwischen beiden Modi liegt eine Wahrnehmungslücke, die kein Bewerbungsformular schließt.',
    closing: 'Dieses Portfolio ist nicht der Versuch, die Lücke zu füllen. Es ist der Versuch, auf der richtigen Seite sichtbar zu sein.',
};

// § 1 — Operator-Beweis (drei Epochen)
export interface Epoch {
    number: string;
    title: string;
    subtitle: string;
    period: string;
    description: string;
    tags: string[];
    icon: 'activity' | 'cpu' | 'network';
}

export const EPOCHS: Epoch[] = [
    {
        number: 'EPOCHE I',
        title: 'Proof of Operation',
        subtitle: 'The Foundations of Logic',
        period: 'ca. 2002 – 2008 und weitere Mandate',
        description: 'Restrukturierung und Refinanzierung einer deutschen Logistik-GmbH als Interim Manager mit voller Vollmacht und eigener Bonität. Operative Stabilisierung wiederhergestellt, Refinanzierung erfolgreich. Aus der stabilisierten Basis sind im Firmenverbund zwei weitere GmbHs hervorgegangen.',
        tags: ['OPC Overnight Parcel Courier', 'Interim Management', 'Restrukturierung', 'Refinanzierung'],
        icon: 'activity',
    },
    {
        number: 'EPOCHE II',
        title: 'Proof of Extension',
        subtitle: 'The Era of Directed Intelligence',
        period: '2023 – laufend',
        description: 'Bewusste Entscheidung 2023, ein neues Kapitel zu beginnen — mit AI-nativer Architektur als Material. Drei Jahre konsequenter Aufbau in Co-Creation mit Claude (Anthropic) und Gemini (Google DeepMind). Übergang vom Manager (delegiert an Menschen) zum Architect (dirigiert Intelligenz).',
        tags: ['OPUS MAGNUM', 'AI-Native Architecture', 'Directed Intelligence', 'System OS'],
        icon: 'cpu',
    },
    {
        number: 'EPOCHE III',
        title: 'Proof of Network',
        subtitle: 'The Yildirim Operator Network',
        period: 'parallel zu Epoche II, familiär seit Generationen',
        description: 'Architekt eines familiär verwurzelten Operator-Ökosystems mit physischer Basis (OPC), digitalen Plattformen (OMM, LYGOX, MASTER-X, Sovereign 2030) und einer Familien-Ebene, die bewusst auf eigenen Gebieten operiert. Die charakteristische Methode: der Start-Impuls — gezielte Aktivierung durch Öffnung, nicht Anleitung.',
        tags: ['Yildirim Operator Network', 'Start-Impuls-Methodik', 'Multi-Generation', 'Ecosystem Architect'],
        icon: 'network',
    },
];

// § 1a — OPC-Verantwortungs-Tabelle (primäres Mandat, ca. 4 Jahre, volle Vollmacht)
export interface ResponsibilityRow {
    area: string;
    delivery: string;
}

export const OPC_RESPONSIBILITIES: ResponsibilityRow[] = [
    { area: 'Operative Führung', delivery: 'Außendienst + Innendienst in Gesamtverantwortung' },
    { area: 'Finanzwesen', delivery: 'Drei Jahre Bilanzen nachgeholt mit externen Steuerberatern' },
    { area: 'Personalwesen', delivery: 'Komplette Personalführung, interne Vertragsverhandlungen' },
    { area: 'Vertragswesen', delivery: 'Externe Vertragsverhandlungen mit Kunden, Behörden, Partnern' },
    { area: 'Korrespondenz', delivery: 'Ämter, Privatkunden, Gesellschaften, Organisationen — digital wie vor Ort' },
    { area: 'Restrukturierung', delivery: 'Führung durch die Restrukturierungsphase bis zur Refinanzierungsfähigkeit' },
    { area: 'Refinanzierung', delivery: 'Als Geschäftsführer mit Einbringung der eigenen Bonität' },
    { area: 'QM-System', delivery: 'QM-Handbuch eigenhändig optimiert' },
];

export const OPC_STATUS_TODAY = 'Seit ca. 2008 nicht mehr operativ aktiv bei OPC. Rückkehr geplant nach Abschluss der aktuellen Weiterbildung zum Online Marketing Manager (AZAV-zertifiziert, DCI Berlin). Geplanter Aufgabenbereich: Vertretung der Marke OPC und der drei Kernstationen, digitale wie physische Wiedergewinnung der Markensichtbarkeit, Anbindung der operativen OPC-Realität an die AI-native Architektur der OMM-Holding.';

export const BELEG_STRATEGY = 'Detailbelege werden nicht aktiv im Portfolio ausgestellt. Sie existieren und sind auf Anfrage verfügbar: Handelsregister-Einträge, Referenz zum eigenhändig optimierten QM-Handbuch, Dokumentation der Restrukturierungs- und Refinanzierungsphase. Wer Belege als Vorbedingung fordert, ist nicht im Anwerbungs-Modus.';

// § 1c — Yildirim Operator Network
// Ganzheits-Prinzip: alle eigenen Builds + bewusst arbeitende Familien-Ebene.
export const NETWORK_PRINCIPLE = {
    kicker: 'Netzwerk-Prinzip',
    lead: 'Das Yildirim Operator Network ist keine Portfolio-Liste. Es ist ein Betriebssystem aus Haltung.',
    tenets: [
        {
            title: 'Jeder Build ist ein Knoten.',
            desc: 'Alles, was in diesem Netzwerk entsteht — Logistik, Plattformen, Life-OS, Agenten-Architekturen — gehört zum selben System. Keine Nebenprojekte.',
        },
        {
            title: 'Selbstständigkeit, geteilter Zweck.',
            desc: 'Jeder Knoten arbeitet auf seinem eigenen Gebiet, nach eigenen Regeln. Der höhere Zweck und die Verantwortung sind nicht verhandelbar.',
        },
        {
            title: 'Programmiert, nicht organisiert.',
            desc: 'Die Haltung ist kulturell, nicht strukturell. Kein Org-Chart würde das beschreiben. Es ist die Art, wie gearbeitet wird.',
        },
    ],
};

export const FAMILY_PRINCIPLE = {
    kicker: 'Familien-Ebene',
    body: 'Die Familien-Ebene des Netzwerks arbeitet ohne öffentliche Namen in diesem Dokument. Jedes Mitglied ist selbstständig auf eigenem Gebiet tätig; die geteilte Haltung — bewusst, verantwortungsvoll, auf den höheren Zweck ausgerichtet — macht die Ebene zum Knoten. Wer in dieses Netzwerk eintritt, tritt in ein Muster ein, nicht in eine Organisation.',
};

export interface NetworkProject {
    name: string;
    kind: string;
    initiator: string;
    role: string;
    team: string;
    status: string;
    grounding?: string;
}

export const NETWORK_PROJECTS: NetworkProject[] = [
    {
        name: 'OMM — Opus Magnum Media',
        kind: 'AI-Marketing Platform OS',
        initiator: 'Yahya Yildirim (Lead-Architekt)',
        role: 'Architektur, Build, Lead-Entwicklung · ~40 Gemini-Agenten, Firebase-Backend',
        team: 'Co-Creation mit Claude (Anthropic) + Gemini (Google DeepMind)',
        status: 'v3.0 · aktive Entwicklung · lebendes Portfolio-Artefakt',
    },
    {
        name: 'LYGOX',
        kind: 'SaaS · Logistik-Vertical',
        initiator: 'Cebrail Yildirim (Bruder)',
        role: 'Architekt — Plattform-Wahl, Tech-Stack, SaaS-Architektur, Multi-Tenant-Dashboards, Fahrer-App',
        team: '2 Neffen als IT-Core (Master + Bachelor)',
        status: 'Konzept v1.0 · Build in Vorbereitung',
    },
    {
        name: 'MASTER-X 2.0',
        kind: 'SaaS · Trainings- und Wachstums-Architektur',
        initiator: 'Cebrail Yildirim (Bau) — übergeben an Yahya (17.04.2026)',
        role: 'Empfänger und Weiter-Architekt · künftige SaaS-Weiterentwicklung + Marketing-Architektur',
        team: 'Yahya als Weiter-Architekt',
        status: 'HTML-Single-File deployed (v2.6.1 · Prime v2.4.1 · Lite v1.3) · SaaS-Ausbau in Planung',
    },
    {
        name: 'Sovereign 2030',
        kind: 'Autonomous Life-OS · EU-first',
        initiator: 'Yildirim Operator Network · Build-Lead Yahya Yildirim',
        role: 'Architekt & Product Owner · APEX-Architektur (AgentMemory · Privacy Guardian · Execution Center · Audit Trail)',
        team: 'Stack: Google Cloud · Vertex AI · Gemini 2.5 Flash · finAPI PSD2 · EU-west4',
        status: 'Phase I Foundation OS live · Phase II Intelligence Layer in Development',
        grounding: 'Trainings-/Grounding-Korpus (keine Produkt-Traction): ca. 12.400+ öffentlich verfügbare Verträge, ~€2,8M Vertrags-Volumen und ~3.200+ Compliance-Nodes, aus dem Internet via Google-Search-Grounding bezogen und als Datenbasis für das Training der Agenten genutzt. Transparent deklariert gemäß EU AI Act Art. 50.',
    },
];

export const NETWORK_CONSEQUENCE = 'Ein Anwerbungs-Adressat, der Yahya einbindet, bindet nicht einen einzelnen Operator ein. Er bekommt Zugang zu einem belastbar vernetzten Operator-Netzwerk mit physischer Logistik-Basis (OPC), vier aktiven digitalen Knoten und einer bewussten Familien-Ebene, die sich über Generationen trägt.';

// § 2 — Positionierungs-Prinzip
export const POSITIONING_PRINCIPLES = [
    { title: 'Infrastruktur statt Lebenslauf', desc: 'Systeme sprechen lauter als Listen.' },
    { title: 'Dokumentation statt Selbstvermarktung', desc: 'Die Architektur beweist die Kompetenz.' },
    { title: 'Geduld statt Eile', desc: 'Strategischer Zeithorizont bis 2030.' },
];

// § 3 — Anwerbungs-Matrix (Reihenfolge A → B → C → D → E)
export interface RecruitmentOption {
    code: 'A' | 'B' | 'C' | 'D' | 'E';
    title: string;
    desc: string;
    terms: string;
}

export const RECRUITMENT_MATRIX: RecruitmentOption[] = [
    {
        code: 'A',
        title: 'Rückkehr OPC-Gruppe',
        desc: 'Geschäftsführender Gesellschafter / Holding-Architekt / Markenvertretung',
        terms: 'Start nach Weiterbildungs-Abschluss',
    },
    {
        code: 'B',
        title: 'Interim Operator / Chief AI Officer',
        desc: 'Mittelstand · 6–24 Monate Mandat',
        terms: 'Tagessatz + Erfolgsbeteiligung oder monatlicher Retainer',
    },
    {
        code: 'C',
        title: 'Co-Founder / Operator-in-Residence',
        desc: 'Venture-Strukturen · operative Mit-Gründung',
        terms: 'Equity-Beteiligung / Fund-Partner-Struktur',
    },
    {
        code: 'D',
        title: 'Advisory / Board-Mandat',
        desc: 'Strategische Begleitung auf Board-Ebene',
        terms: 'Board-Vergütung ggf. plus Equity-Optionen',
    },
    {
        code: 'E',
        title: 'System Investment',
        desc: 'Primäre Targets: SOVEREIGN 2030, AGENTICUM G5, LYGOX, MASTER-X SaaS',
        terms: 'Beteiligungsrunde je nach Reife',
    },
];

// § 4 — Public Builds (Evidence Layer · öffentlich auf Devpost dokumentiert)
export interface PublicBuild {
    name: string;
    tagline: string;
    stack: string[];
    platform: 'Devpost';
    url: string;
}

export const PUBLIC_BUILDS_SOURCE = 'https://devpost.com/yildirimyahya716';

export const PUBLIC_BUILDS: PublicBuild[] = [
    {
        name: 'AGENTICUM G5 — Modular Neural Orchestration OS',
        tagline: 'Autonomous marketing OS · wandelt Intent in Kampagnen-Assets über synergetische Multi-Agent-Dialoge, Imagen 3 Visuals und Real-Time-Search-Grounding.',
        stack: ['TypeScript', 'React', 'Vite', 'Tailwind', 'Gemini 1.5 Pro', 'Imagen 3', 'Google Cloud Functions', 'Firebase'],
        platform: 'Devpost',
        url: 'https://devpost.com/software/agenticum-g5-modular-neural-orchestration-os',
    },
    {
        name: 'AGENTICUM G5 Genius',
        tagline: 'Real-time AI Live-Agent · 52-Node Neural Mesh · Voice-first UX · autonome Marketing-Intelligenz at scale.',
        stack: ['TypeScript', 'React', 'Node.js', 'Gemini 2.0 Flash', 'Firebase', 'Firestore'],
        platform: 'Devpost',
        url: 'https://devpost.com/software/agenticum-g5-genius',
    },
];

export const PUBLIC_BUILDS_NOTE = 'Öffentliche Build-Evidenz stützt §3 E (System Investment). AGENTICUM G5 ist dort als primäres Invest-Target gelistet — die hier verlinkten Devpost-Einträge sind die öffentlichen Artefakte dazu. OMM, LYGOX, MASTER-X 2.0 und Sovereign 2030 sind zusätzliche Knoten, die nicht auf Devpost geführt werden.';

// § 4a — Evidenz-Layer · Metriken + Case-Studies
// Regel: Nur verifizierbare Fakten. Zahlen ohne Quelle werden hier nicht ausgestellt.
// verified=false markiert Operator-Disclosure (auf Anfrage belegbar, nicht öffentlich ausgestellt).
// Sovereign-2030-Zahlen sind explizit Grounding-Korpus (Decision #16) — KEINE Produkt-Traction.

export type MetricKind = 'count' | 'version' | 'status' | 'duration' | 'scope' | 'corpus';

export interface EvidenceMetric {
    kind: MetricKind;
    label: string;
    value: string;
    unit?: string;
    source: string;
    verified: boolean;
    note?: string;
}

export type CaseStatus = 'proof' | 'active' | 'corpus' | 'concept';

export interface EvidenceCaseStudy {
    slug: string;
    epoch?: 'I' | 'II' | 'III';
    kicker?: string;
    subject: string;
    period: string;
    challenge: string;
    architecture: string;
    outcome: string;
    metrics: EvidenceMetric[];
    status: CaseStatus;
    statusNote?: string;
    sourceLabel?: string;
    sourceHref?: string;
    disclosureNote?: string;
}

export const EPOCH_METRICS: Record<'I' | 'II' | 'III', EvidenceMetric[]> = {
    I: [
        { kind: 'duration', label: 'Vollmacht-Dauer', value: '~4', unit: 'Jahre', source: '§1a OPC Verantwortungs-Tabelle', verified: false, note: 'Detailbelege auf Anfrage (Handelsregister)' },
        { kind: 'scope', label: 'Verantwortungs-Bereiche', value: '8', source: 'OPC_RESPONSIBILITIES §1a', verified: true },
        { kind: 'scope', label: 'Bilanzen nachgeholt', value: '3', unit: 'Jahre', source: 'OPC_RESPONSIBILITIES · Finanzwesen', verified: false, note: 'Externe Steuerberater · Dokumentation auf Anfrage' },
        { kind: 'count', label: 'GmbHs hervorgegangen', value: '2', source: '§1 Epoche I · Firmenverbund', verified: false, note: 'Handelsregister-Einträge auf Anfrage' },
    ],
    II: [
        { kind: 'version', label: 'Platform-Version', value: 'v3.0', source: 'operator.json · NETWORK_PROJECTS.OMM', verified: true },
        { kind: 'count', label: 'Gemini-Agenten', value: '~40', source: 'NETWORK_PROJECTS.OMM.role', verified: true },
        { kind: 'count', label: 'Portfolio-Pillars', value: '7', source: 'PORTFOLIO_PILLARS (P0–P6)', verified: true },
        { kind: 'count', label: 'Portfolio-Cluster', value: '31', source: 'PORTFOLIO_PILLARS.clusters', verified: true },
        { kind: 'status', label: 'Reasoning-Core', value: 'Gemini 3.0 Pro', source: 'operator.json · compliance.reasoning_core', verified: true },
        { kind: 'status', label: 'Data-Region', value: 'europe-west3', source: 'operator.json · compliance.data_region', verified: true },
    ],
    III: [
        { kind: 'count', label: 'Digital Nodes', value: '5', source: 'operator.json · network.digital_nodes', verified: true, note: 'OMM · LYGOX · MASTER-X 2.0 · Sovereign 2030 · Columna' },
        { kind: 'status', label: 'Physical Core', value: 'OPC-Gruppe', source: 'operator.json · network.physical_core', verified: true },
        { kind: 'status', label: 'Familien-Ebene', value: 'pattern-only', source: 'FAMILY_PRINCIPLE', verified: true, note: 'Bewusst ohne Namen · Pattern-Disclosure' },
        { kind: 'version', label: 'MASTER-X Transfer', value: 'v2.6.1', source: 'NETWORK_PROJECTS.MASTER-X', verified: true, note: 'Übergabe 2026-04-17' },
    ],
};

export const BUILD_CASES: EvidenceCaseStudy[] = [
    {
        slug: 'opc-restrukturierung',
        epoch: 'I',
        kicker: 'Case I · Proof of Operation',
        subject: 'OPC-Gruppe · Restrukturierung & Refinanzierung',
        period: 'ca. 2002 – 2008',
        challenge: 'Deutsche Logistik-GmbH in Restrukturierungs-Bedarf. Bilanzen mehrjährig unvollständig. Refinanzierungs-Fähigkeit nicht gegeben. Operative Führung, Finanzwesen, Personal und Vertragswesen ungebündelt.',
        architecture: 'Interim-Mandat mit voller Vollmacht und eigener Bonität als Geschäftsführer. Acht Verantwortungs-Bereiche in Gesamtverantwortung gebündelt. Externe Steuerberater zur Nachholung der Bilanzen, parallel QM-Handbuch eigenhändig optimiert.',
        outcome: 'Bilanzen nachgeholt. Restrukturierung abgeschlossen. Refinanzierung erfolgreich. Aus der stabilisierten Basis sind im Firmenverbund zwei weitere GmbHs hervorgegangen. Seit ca. 2008 nicht mehr operativ aktiv — Rückkehr geplant nach AZAV-Abschluss.',
        metrics: [],
        status: 'proof',
        statusNote: 'Abgeschlossenes Mandat · Rückkehr-Option Anwerbungs-Matrix Option A',
        disclosureNote: 'Handelsregister-Einträge, QM-Handbuch und Restrukturierungs-Dokumentation auf Anfrage verfügbar. Nicht aktiv ausgestellt (BELEG_STRATEGY §1a).',
    },
    {
        slug: 'omm-platform',
        epoch: 'II',
        kicker: 'Case II · Proof of Extension',
        subject: 'OPUS MAGNUM MEDIA · AI-Marketing Platform OS',
        period: '2023 – laufend',
        challenge: 'Übergang vom Manager (delegiert an Menschen) zum Architect (dirigiert Intelligenz). Europäische Compliance und Daten-Souveränität bei gleichzeitiger Nutzung von Frontier-Modellen. Keine Lock-in-Gewalt auf einen Cloud-Anbieter, bei voller Nutzung von dessen Reasoning-Core.',
        architecture: 'React 19 · TypeScript · Vite · Firebase · Vertex AI · Gemini 3.0 Pro · europe-west3. ~40 Gemini-Agenten in synergetischer Orchestration (OMM v3.0 Framework). Perfect Twin Architecture als Doktrin: Google-Infra-Helix ∥ OMM-Logic-Helix, APEX 4-Layer Schutz, Aurora Protocol L0 → L3.',
        outcome: 'v3.0 live. 7-Pillar / 31-Cluster Portfolio-OS als lebendes Artefakt unter /portfolio. SEO/AEO/GEO-Schicht · EU AI Act Art. 50 Ready · Canonical v1.8. Die Plattform ist gleichzeitig Produkt, Methodik-Beweis und öffentliche Mandats-Oberfläche.',
        metrics: [],
        status: 'active',
        sourceLabel: 'Portfolio APEX',
        sourceHref: '/portfolio',
    },
    {
        slug: 'yon-network',
        epoch: 'III',
        kicker: 'Case III · Proof of Network',
        subject: 'Yildirim Operator Network · Multi-Node-Architektur',
        period: 'parallel zu Epoche II · familiär seit Generationen',
        challenge: 'Wie baut man ein Operator-Ökosystem, in dem jeder Knoten selbstständig arbeitet — ohne Org-Chart, ohne Delegations-Hierarchie, aber mit geteilter Haltung und geteiltem Zweck?',
        architecture: 'Physischer Kern OPC-Gruppe + fünf digitale Knoten (OMM · LYGOX · MASTER-X 2.0 · Sovereign 2030 · Columna) + eine Familien-Ebene ohne öffentliche Namen (pattern-only disclosure). Methode: der Start-Impuls — gezielte Aktivierung durch Öffnung, nicht Anleitung.',
        outcome: 'Netzwerk als Betriebssystem aus Haltung, nicht als Portfolio-Liste. MASTER-X 2.0 am 17.04.2026 von Cebrail an Yahya übergeben (v2.6.1 deployed). Sovereign 2030 Phase I live. Columna Canonical v2.0 als Produkt-Pillar integriert.',
        metrics: [],
        status: 'active',
        sourceLabel: 'Pillar · Netzwerk',
        sourceHref: '/portfolio/netzwerk',
    },
    {
        slug: 'agenticum-g5',
        kicker: 'Build · Public Evidence',
        subject: 'AGENTICUM G5 · Modular Neural Orchestration OS',
        period: 'Devpost · öffentlich',
        challenge: 'Intent → Kampagnen-Assets ohne Produktions-Overhead. Multi-Agent-Orchestrierung mit Imagen-Visuals und Real-Time-Grounding.',
        architecture: 'TypeScript · React · Vite · Tailwind · Gemini 1.5 Pro · Imagen 3 · Google Cloud Functions · Firebase. Synergetische Multi-Agent-Dialoge als Kern-Mechanik. Real-Time Search Grounding.',
        outcome: 'Öffentlicher Build auf Devpost. Artefakt-Evidenz für §3 E System Investment · primäres Invest-Target.',
        metrics: [
            { kind: 'status', label: 'Orchestration', value: 'Synergetisch', source: 'OMM v3.0 Framework', verified: true },
            { kind: 'status', label: 'Visuals', value: 'Imagen 3', source: 'Devpost Stack', verified: true },
            { kind: 'status', label: 'Reasoning', value: 'Gemini 1.5 Pro', source: 'Devpost Stack', verified: true },
            { kind: 'status', label: 'Status', value: 'Public', source: 'devpost.com/yildirimyahya716', verified: true },
        ],
        status: 'active',
        sourceLabel: 'Devpost · AGENTICUM G5',
        sourceHref: 'https://devpost.com/software/agenticum-g5-modular-neural-orchestration-os',
    },
    {
        slug: 'agenticum-g5-genius',
        kicker: 'Build · Public Evidence',
        subject: 'AGENTICUM G5 Genius · Voice-First Live-Agent',
        period: 'Devpost · öffentlich',
        challenge: 'Marketing-Intelligenz in Real-Time. Voice-first UX ohne Latency-Bruch. Autonome Agent-Koordination at scale.',
        architecture: 'TypeScript · React · Node.js · Gemini 2.0 Flash · Firebase · Firestore. 52-Node Neural Mesh. Voice-first Interface-Ebene.',
        outcome: 'Real-Time AI Live-Agent · public auf Devpost. Zweiter Evidenz-Anker für §3 E.',
        metrics: [
            { kind: 'count', label: 'Mesh-Nodes', value: '52', source: 'Devpost Tagline', verified: true },
            { kind: 'status', label: 'Modell', value: 'Gemini 2.0 Flash', source: 'Devpost Stack', verified: true },
            { kind: 'status', label: 'UX-Modus', value: 'Voice-first', source: 'Devpost Description', verified: true },
            { kind: 'status', label: 'Latency', value: 'Real-Time', source: 'Devpost Description', verified: true },
        ],
        status: 'active',
        sourceLabel: 'Devpost · AGENTICUM G5 Genius',
        sourceHref: 'https://devpost.com/software/agenticum-g5-genius',
    },
    {
        slug: 'perfect-twin-architecture',
        kicker: 'Build · Architecture Evidence',
        subject: 'Perfect Twin Architecture · Double Helix',
        period: 'Architektur-Doktrin · laufend',
        challenge: 'Wie nutzt man Frontier-Modelle (Gemini) ohne Lock-in, ohne Souveränitäts-Verlust, ohne Compliance-Bruch? Wie trennt man Infrastruktur-Helix von Logik-Helix, ohne die Vorteile des Reasoning-Cores zu verlieren?',
        architecture: 'Zwei parallele Helices: GOOGLE_INFRA_HELIX (Cloud · Vertex AI · Gemini) ∥ OMM_LOGIC_HELIX (Agents · Canonical · Framework). Verbunden durch APEX 4-Layer Schutz (AgentMemory · Privacy Guardian · Execution Center · Audit Trail). Aurora Protocol L0 → L1 → L3 als Zugriffs-Gradient. europe-west3 Data-Region.',
        outcome: 'Architektur-Muster kanonisiert und als Cluster C3.3 dokumentiert. Basis für alle eigenen Builds im Yildirim Operator Network. Compliance-by-Design statt Compliance-as-Afterthought.',
        metrics: [
            { kind: 'count', label: 'APEX-Layer', value: '4', source: 'operator.json · architecture', verified: true, note: 'AgentMemory · Privacy Guardian · Execution Center · Audit Trail' },
            { kind: 'scope', label: 'Aurora-Stufen', value: 'L0 → L3', source: 'Sprint 3 · PTA Cluster', verified: true },
            { kind: 'status', label: 'Data-Region', value: 'europe-west3', source: 'operator.json · compliance.data_region', verified: true },
            { kind: 'status', label: 'Reasoning-Core', value: 'Gemini 3.0 Pro', source: 'operator.json · compliance.reasoning_core', verified: true },
        ],
        status: 'active',
        sourceLabel: 'Cluster · Perfect Twin Architecture',
        sourceHref: '/portfolio/builds/perfect-twin-architecture',
    },
    {
        slug: 'sovereign-2030-corpus',
        kicker: 'Corpus Transparency',
        subject: 'Sovereign 2030 · Grounding-Korpus (nicht Produkt-Traction)',
        period: 'Phase I · live',
        challenge: 'Wie grenzt man Trainings-/Architektur-Korpus sauber von Produkt-Traction ab — ohne Claim-Inflation? Übliche Pitch-Rhetorik verwischt genau diesen Unterschied.',
        architecture: 'Grounding-Korpus transparent deklariert (Decision #16). Stack: Google Cloud · Vertex AI · Gemini 2.5 Flash · finAPI PSD2 · EU-west4. APEX-Architektur: AgentMemory · Privacy Guardian · Execution Center · Audit Trail.',
        outcome: 'Klarer Bruch mit üblicher Pitch-Rhetorik. Zahlen werden ausdrücklich als Korpus ausgewiesen, nicht als Traction. Sovereign-Framework als Produktions-Standard anerkannt (Decision #14).',
        metrics: [
            { kind: 'corpus', label: 'Verträge im Korpus', value: '12.400+', source: 'Decision #16', verified: true, note: 'Trainings-/Architektur-Basis — KEINE Produkt-Traction' },
            { kind: 'corpus', label: 'Korpus-Volumen', value: '€2,8M', source: 'Decision #16', verified: true, note: 'Trainings-/Architektur-Basis — KEINE Produkt-Traction' },
            { kind: 'corpus', label: 'Netzwerk-Nodes', value: '3.200+', source: 'Decision #16', verified: true, note: 'Trainings-/Architektur-Basis — KEINE Produkt-Traction' },
        ],
        status: 'corpus',
        statusNote: 'Keine Produkt-Traction-Claims · Transparenz über Herkunft der Zahlen',
    },
];

export const EVIDENCE_DISCLOSURE = {
    headline: 'Beleg-Strategie · Substanz vor Signal',
    body: 'Zahlen ohne Quelle werden hier nicht ausgestellt. Öffentlich verifizierbare Metriken sind direkt verlinkt (Devpost · Portfolio · operator.json). Historische Mandats-Daten (OPC) werden auf Anfrage belegt — Handelsregister-Einträge, QM-Handbuch, Restrukturierungs-Dokumentation. Sovereign-2030-Zahlen sind explizit Grounding-Korpus (Decision #16), keine Produkt-Traction.',
};

export const getEpochMetrics = (epoch: 'I' | 'II' | 'III'): EvidenceMetric[] => EPOCH_METRICS[epoch];
export const getBuildCase = (slug: string): EvidenceCaseStudy | undefined => BUILD_CASES.find((c) => c.slug === slug);
export const CASES_BY_EPOCH = (epoch: 'I' | 'II' | 'III'): EvidenceCaseStudy[] => BUILD_CASES.filter((c) => c.epoch === epoch);
export const CASES_ARTIFACTS: EvidenceCaseStudy[] = BUILD_CASES.filter((c) => !c.epoch);

// § 13 — Entscheidungshistorie (kumulativ aus Canonical, strategisch-sichtbare Auswahl)
export interface DecisionRow {
    id: number;
    decision: string;
    result: string;
    date: string;
}

export const KEY_DECISIONS: DecisionRow[] = [
    { id: 3, decision: 'Anwerbungs-Reihenfolge', result: 'A → B → C → D → E', date: '2026-04-17' },
    { id: 8, decision: 'Portfolio-Titel', result: 'Digital Interim C-Level Architecture', date: '2026-04-17' },
    { id: 9, decision: 'Familien-/Netzwerk-Framing', result: 'Yildirim Operator Network als §1c', date: '2026-04-17' },
    { id: 10, decision: 'MASTER-X 2.0 im Portfolio', result: 'Als Deliverable mit klarer Herkunftsangabe', date: '2026-04-17' },
    { id: 11, decision: 'Compliance-Terminologie', result: '„EU AI Act-ready · Art. 50 ab 2.8.2026" statt „konform"', date: '2026-04-17' },
    { id: 12, decision: 'DSGVO und EU Data Act', result: 'Eigener §16 im Canonical; Datenschutz-Abschnitt im Portfolio', date: '2026-04-17' },
    { id: 13, decision: 'Netzwerk-Ganzheitsprinzip', result: 'Alle eigenen Builds + bewusste Familien-Ebene gehören zum Yildirim Operator Network (Canonical §1c erweitert)', date: '2026-04-19' },
    { id: 14, decision: 'Sovereign 2030 als Netzwerk-Knoten', result: 'Öffentlich als digitales Co-Venture geführt; Sovereign-Framework als Produktions-Standard anerkannt', date: '2026-04-19' },
    { id: 15, decision: 'Evidence-Layer §4', result: 'Devpost-Builds (AGENTICUM G5) als öffentliche Belegquelle in Portfolio integriert', date: '2026-04-19' },
    { id: 16, decision: 'Sovereign-Zahlen-Framing (Option B)', result: 'Grounding-Korpus transparent deklariert: 12.400+ Verträge · €2,8M · 3.200+ Nodes als Trainingsbasis — keine Produkt-Traction-Claims', date: '2026-04-19' },
    { id: 17, decision: 'Portfolio-Architektur', result: 'APEX/Pillar/Cluster unter /portfolio/* mit eigener PortfolioShell · Nucleus-Logo · System-Log-Footer nach Brand Protocol v3.0', date: '2026-04-19' },
    { id: 18, decision: 'Pillar-Hero-Visuals', result: 'Je Pillar eigene SVG-Hero (Timeline · Network · Build-Stack · Funnel · Shield); Cluster-Header tragen das Pillar-Visual in Cluster-Größe', date: '2026-04-19' },
    { id: 19, decision: 'Narrative-Arc als Pillar-Pflicht', result: 'Jede Pillar-Seite folgt dem 8-Phasen-Arc (Hook→Tension→Insight→Architecture→Evidence→Tradeoffs→Roadmap→Ask) nach Sovereign 2030 Framework', date: '2026-04-19' },
    { id: 20, decision: 'P0 Operator-Doktrin als Fundament-Pillar', result: 'Frontier-Firma-Philosophie + Operator-Maxims (0/I/III/VII) + Drei-Welten-Modell + McKinsey-Paradox + B2B2A werden als eigener Pillar P0 vor den Epochen eingeführt — die philosophische Basis aller anderen Pillars.', date: '2026-04-19' },
    { id: 21, decision: 'P6 Columna als Produkt-Pillar', result: 'Columna Canonical v2.0 wird als eigener Pillar (nicht nur Netzwerk-Node) integriert: Content-Intelligence + Competitive-Architecture + APC-Generator + SEO/AEO/GEO + Roadmap 2030 — Google-Cloud-exklusiv, EU-first.', date: '2026-04-19' },
    { id: 22, decision: 'Perfect-Twin-Architecture als Builds-Cluster', result: 'PTA (Double Helix: GOOGLE_INFRA_HELIX ∥ OMM_LOGIC_HELIX) + APEX 4-Layer Schutz (AgentMemory · Privacy Guardian · Execution Center · Audit Trail) + Aurora Protocol L0→L3 als neuer Cluster C3.3 in P3 Builds; Querverweis in P5 Compliance.', date: '2026-04-19' },
    { id: 23, decision: 'SEO/AEO/GEO als globale Cross-Cutting-Schicht', result: 'Jede /portfolio-Route erhält useSEO-Hook (Title · Description · Canonical · OpenGraph · Twitter-Card) + JSON-LD (Person/Organization/CreativeWork/FAQPage) + Spec-Block (B2B2A-optimiert) + FAQ-Block (AEO). Cross-cutting über Pillars, nicht als separate Pillar.', date: '2026-04-19' },
    { id: 24, decision: 'Eigener SEO-Layer ohne react-helmet-async', result: 'Um die CDN-basierte Importmap nicht zu erweitern, wird ein eigener useSEO-Hook auf Basis von document.title + manueller <meta>-Mutation gebaut — schlanker, ohne Dependency-Overhead.', date: '2026-04-19' },
    { id: 25, decision: 'operator.json als Agent-Readable Identity', result: '/operator.json unter /public als maschinenlesbare Identitäts-Beschreibung (GEO · B2B2A) — Capability-Deklaration für LLM-Agents, Compliance-Flags, Kanonische Positionierung.', date: '2026-04-19' },
    { id: 26, decision: 'FAQ-Schema als AEO-Pflicht pro Pillar', result: 'Jede Pillar-Seite trägt mindestens 3 kanonische Q→A-Paare als FAQPage-JSON-LD + visuell sichtbaren FAQ-Block — für Answer-Engine-Optimization (Claude/Gemini/GPT zitierbar).', date: '2026-04-19' },
    { id: 27, decision: 'Evidenz-Layer §4a · Regel „Substanz vor Signal"', result: 'Metriken werden nur mit expliziter Quelle + verified-Flag ausgestellt. Nicht-öffentliche Mandats-Daten (OPC) bleiben auf Anfrage (BELEG_STRATEGY §1a). Sovereign-Zahlen explizit als Grounding-Korpus markiert, nicht als Produkt-Traction (re-bind zu Decision #16).', date: '2026-04-19' },
    { id: 28, decision: 'Case-Study-Struktur Challenge/Architecture/Outcome', result: 'Jede Evidenz-Case folgt demselben 3-Felder-Schema (Challenge · Architecture · Outcome) + Metriken-Strip + Status-Chip. Gewährleistet Lesbarkeit für Menschen wie für Answer-Engines.', date: '2026-04-19' },
];

// § 16 — Compliance-Canon (Kurzfassung für Portfolio-Seite)
export interface ComplianceRow {
    regime: string;
    regulation: string;
    status: string;
    obligation: string;
}

export const COMPLIANCE_FRAMEWORK: ComplianceRow[] = [
    {
        regime: 'DSGVO',
        regulation: '(EU) 2016/679',
        status: 'voll anwendbar',
        obligation: 'Rechtsgrundlage, Informationspflichten, AV-Verträge, DSFA, Drittlandschutz',
    },
    {
        regime: 'EU AI Act',
        regulation: '(EU) 2024/1689',
        status: 'Art. 50 Enforcement ab 2.8.2026',
        obligation: 'Chatbot-Kennzeichnung, Output-Markierung, Deployer-Disclosure',
    },
    {
        regime: 'EU Data Act',
        regulation: '(EU) 2023/2854',
        status: 'Hauptbestimmungen seit 12.9.2025',
        obligation: 'B2B Unfair Terms, Portabilität, Switching-Gebühren-Verbot ab 12.1.2027',
    },
    {
        regime: 'ISO 27001',
        regulation: '—',
        status: 'aligned Architecture',
        obligation: 'keine formale Zertifizierung; Pfad optional für Enterprise-Deals',
    },
];

// Methodik (§1c)
export const METHOD_STARTIMPULS = {
    title: 'Der Start-Impuls',
    body: 'Yahyas charakteristische Operator-Methode ist die gezielte Aktivierung von Menschen in seinem Umfeld — ein Start-Impuls, der nicht als Anleitung oder Vorgabe funktioniert, sondern als Öffnung: die richtige Gelegenheit zum richtigen Zeitpunkt mit der richtigen Richtung.',
    quote: 'Der Empfänger durchläuft den Weg selbst, und was zurückkommt, ist autonome Kompetenz, nicht Anleitungs-Ergebnis.',
};

// § APEX · Portfolio-Architektur (APEX/Pillar/Cluster-Registry für Routing & Navigation)
export type PillarVisualKey =
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

export type ArcPhaseKey = 'hook' | 'tension' | 'insight' | 'architecture' | 'evidence' | 'tradeoffs' | 'roadmap' | 'ask';

export interface ArcPhase {
    key: ArcPhaseKey;
    label: string;
    heading: string;
    body: string;
    mono?: string;
}

export interface FAQEntry {
    q: string;
    a: string;
}

export interface SpecClaim {
    key: string;
    value: string;
}

export interface ClusterEntry {
    slug: string;
    path: string;
    code: string;
    label: string;
    summary: string;
    visualKey?: PillarVisualKey;
    visualHint?: string;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
}

export interface PillarEntry {
    slug: string;
    path: string;
    code: string;
    label: string;
    canon: string;
    status: 'live' | 'sprint-2' | 'sprint-3';
    desc: string;
    tagline: string;
    kicker: string;
    visualKey: PillarVisualKey;
    accent: string;
    narrative: ArcPhase[];
    clusters: ClusterEntry[];
    related: string[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    faqs?: FAQEntry[];
    spec?: SpecClaim[];
}

export const PORTFOLIO_APEX = {
    path: '/portfolio',
    code: 'APEX',
    label: 'Portfolio',
    title: 'Digital Interim C-Level Architecture',
    kicker: 'APEX · /portfolio',
    visualKey: 'apex' as PillarVisualKey,
};

export const PORTFOLIO_PILLARS: PillarEntry[] = [
    {
        slug: 'doktrin',
        path: '/portfolio/doktrin',
        code: 'P0',
        label: 'Operator-Doktrin',
        canon: '§0a',
        status: 'live',
        desc: 'Frontier-Firma · Operator-Maxims · Drei-Welten-Modell · B2B2A · McKinsey-Paradox.',
        tagline: 'Die philosophische Basis — nicht Zusatz, sondern Bedingung.',
        kicker: 'P0 · §0a · Operator-Doktrin',
        visualKey: 'doctrine',
        accent: '#A855F7',
        seoTitle: 'Operator-Doktrin — Frontier Firma · Maxims · Drei-Welten-Modell · B2B2A',
        seoDescription: 'Die Operator-Doktrin des Yildirim-Netzwerks: Frontier-Firma-Philosophie, Maxims 0/I/III/VII, Drei-Welten-Modell (Origin/Processing/Target), B2B2A-Paradigma und das McKinsey-Paradox (88% AI-Nutzung / 6% EBIT-Impact).',
        keywords: ['Frontier Firma', 'Operator Maxims', 'Drei-Welten-Modell', 'B2B2A', 'Agentic Organization', 'AI-nativ', 'McKinsey Paradox'],
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Die Ära der Frontier Firma hat begonnen.',
              body: 'Zwischen AI-benutzenden und AI-nativ operierenden Organisationen liegt kein gradueller Unterschied — sondern eine strukturelle Differenz. Die Frontier Firma ist kein Zukunftsszenario; sie ist die Organisation, die heute schon anders gebaut ist.',
              mono: '> LOAD /doctrine --scope=frontier' },
            { key: 'tension',      label: '02 · TENSION',      heading: '88 % nutzen AI · 6 % spüren EBIT-Impact.',
              body: 'Das McKinsey-Paradox beschreibt die Lücke zwischen AI-Aktivität und AI-Wirkung. Wer AI als Tool hinzufügt, landet im 88%-Cluster. Wer Organisation als AI-natives Netzwerk denkt, gehört zu den 6% — der Unterschied ist nicht die Technologie, sondern die Haltung.',
              mono: '> DELTA /usage(88%) ↔ /impact(6%) = STRUCTURAL' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Agentic, nicht additiv.',
              body: 'Agentic Networks ersetzen Hierarchien nicht — sie operieren in einer anderen Logik-Ebene. Entscheidungen werden nicht eskaliert, sondern orchestriert. Verantwortung wird nicht delegiert, sondern instantiiert. Die Organisation wird zum Laufzeit-Artefakt, nicht zum Org-Chart.',
              mono: '> PATTERN = AGENTIC_NETWORK' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Drei-Welten-Modell + Operator-Maxims.',
              body: 'Origin (Haltung · Intention · Zweck) trägt Processing (Agenten · Modelle · Synergien) trägt Target (Deliverables · Evidenz · Wirkung). Dazu die Maxims: 0 (Haltung vor Handlung) · I (Substanz vor Signal) · III (Architektur vor Abschluss) · VII (Zweck vor Zuständigkeit). Dies sind keine Regeln — es sind Zustandsbedingungen.',
              mono: '> LAYERS = [ORIGIN, PROCESSING, TARGET] · MAXIMS = {0, I, III, VII}' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'B2B2A — der Agent ist der primäre User.',
              body: 'Business-to-Business-to-Agent ist kein Marketing-Label. Es ist die strukturelle Konsequenz: Content, APIs, Interfaces werden für Agenten gebaut, die im Auftrag von Organisationen entscheiden. Wer B2B denkt, optimiert für Menschen. Wer B2B2A denkt, optimiert für Agent-Konsum.',
              mono: '> PRIMARY_USER = AGENT · SECONDARY = HUMAN' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Doktrin ist nicht automatisierbar.',
              body: 'Toolchains kann man kaufen. Haltung nicht. Die Doktrin ist der Engpass jeder AI-nativen Transformation — und zugleich der einzige Hebel, der sie unkopierbar macht. Wer die Toolchain kopiert, ohne die Doktrin zu übernehmen, baut ein 88%-Artefakt.',
              mono: '> COPY(toolchain) = EASY · COPY(doctrine) = NULL' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'OMM-Framework v3.0 · 2026 → 2030.',
              body: 'Die Synergistic Dialogue Engine ist der operative Kern des OMM-Frameworks — Agenten, die nicht nacheinander arbeiten, sondern dialogisch synchron. Roadmap 2026–2030: jedes Quartal ein weiterer Doktrin-Layer in Produktion.',
              mono: '> PHASE = SYNERGISTIC_DIALOGUE · TARGET = 2030' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Lies die Doktrin als Bedingung, nicht als Zusatz.',
              body: 'Jeder andere Pillar (Epochen, Netzwerk, Builds, Anwerbung, Compliance, Columna) entfaltet sich aus diesem Fundament. Wer die Doktrin überspringt, liest das Portfolio auf der falschen Ebene.',
              mono: '> PRECONDITION = DOCTRINE · DEPENDENTS = [P1..P6]' },
        ],
        clusters: [
            { slug: 'operator-maximen', path: '/portfolio/doktrin/operator-maximen', code: 'C0.1',
              label: 'Operator-Maxims · 0 · I · III · VII',
              summary: 'Vier Zustandsbedingungen: Haltung vor Handlung · Substanz vor Signal · Architektur vor Abschluss · Zweck vor Zuständigkeit.',
              visualKey: 'doctrine', visualHint: 'Maxims · 0·I·III·VII',
              seoTitle: 'Operator-Maxims — Die vier Zustandsbedingungen der Frontier Firma',
              seoDescription: 'Maxim 0: Haltung vor Handlung. Maxim I: Substanz vor Signal. Maxim III: Architektur vor Abschluss. Maxim VII: Zweck vor Zuständigkeit. Die Zustandsbedingungen des Operator-Architekten.',
              keywords: ['Operator Maxim', 'Maxim 0', 'Haltung vor Handlung', 'Frontier Firma Prinzipien', 'Operator-Architekt'] },
            { slug: 'drei-welten-modell', path: '/portfolio/doktrin/drei-welten-modell', code: 'C0.2',
              label: 'Drei-Welten-Modell',
              summary: 'Origin (Haltung · Intention · Zweck) → Processing (Agenten · Modelle · Synergien) → Target (Deliverables · Evidenz · Wirkung).',
              visualKey: 'doctrine', visualHint: 'Origin → Processing → Target',
              seoTitle: 'Drei-Welten-Modell — Origin · Processing · Target · Operator-Architektur',
              seoDescription: 'Das Drei-Welten-Modell strukturiert jede AI-native Operation: Origin (Haltung/Intent), Processing (Agenten/Modelle/Synergien), Target (Deliverables/Evidenz/Wirkung).',
              keywords: ['Drei-Welten-Modell', 'Origin Processing Target', 'Operator Framework', 'AI-native Architektur'] },
            { slug: 'frontier-firma', path: '/portfolio/doktrin/frontier-firma', code: 'C0.3',
              label: 'Frontier Firma · 88/6 Paradox',
              summary: 'AI-nativ ≠ AI-additiv. Die strukturelle Differenz zwischen AI-Nutzung (88%) und AI-Wirkung (6%) ist keine Tool-Frage, sondern eine Haltungs-Frage.',
              visualKey: 'doctrine', visualHint: 'AI-nativ vs. AI-additiv',
              seoTitle: 'Frontier Firma — AI-nativ vs. AI-additiv · McKinsey-Paradox erklärt',
              seoDescription: 'Warum 88% der Unternehmen AI nutzen, aber nur 6% EBIT-Impact spüren: Die Frontier Firma ist strukturell anders gebaut — Haltung statt Toolchain.',
              keywords: ['Frontier Firma', 'AI-nativ', 'McKinsey AI Paradox', '88 6 Paradox', 'AI EBIT Impact'] },
            { slug: 'b2b2a-paradigm', path: '/portfolio/doktrin/b2b2a-paradigm', code: 'C0.4',
              label: 'B2B2A · Agent als Primär-User',
              summary: 'Business-to-Business-to-Agent. Content, APIs, Interfaces werden für Agenten gebaut, die im Auftrag von Organisationen entscheiden.',
              visualKey: 'doctrine', visualHint: 'Primary = Agent',
              seoTitle: 'B2B2A — Business-to-Business-to-Agent · Das neue Paradigma',
              seoDescription: 'B2B2A: Der Agent ist der primäre User. Content, APIs und Interfaces werden für agentische Konsumenten gebaut — Menschen werden zur Sekundär-Zielgruppe.',
              keywords: ['B2B2A', 'Agent Primary User', 'Agentic Commerce', 'GEO', 'Generative Engine Optimization'] },
            { slug: 'agentic-network', path: '/portfolio/doktrin/agentic-network', code: 'C0.5',
              label: 'Agentic Network · vs. Hierarchie',
              summary: 'Agentic Networks orchestrieren statt eskalieren. Synergistic Dialogue Engine · OMM-Framework v3.0 · Organisation als Laufzeit-Artefakt.',
              visualKey: 'doctrine', visualHint: 'Orchestrate, not escalate',
              seoTitle: 'Agentic Network — Die Organisation als Laufzeit-Artefakt',
              seoDescription: 'Agentic Networks sind kein Hierarchie-Ersatz — sie operieren auf einer anderen Logik-Ebene. Synergistic Dialogue Engine, OMM-Framework v3.0, Organisation als Runtime.',
              keywords: ['Agentic Organization', 'Synergistic Dialogue Engine', 'OMM Framework', 'Multi-Agent Orchestration'] },
        ],
        related: ['epochen', 'columna'],
        faqs: [
            { q: 'Was unterscheidet eine Frontier Firma von einem AI-nutzenden Unternehmen?',
              a: 'Eine Frontier Firma ist AI-nativ strukturiert — Entscheidungen werden orchestriert statt eskaliert, Agenten sind primäre User, die Organisation existiert zur Laufzeit. AI-nutzende Unternehmen addieren Tools an bestehende Hierarchien, spüren aber kaum EBIT-Impact (McKinsey: 88% Nutzung, 6% Wirkung).' },
            { q: 'Was bedeutet das B2B2A-Paradigma konkret?',
              a: 'Business-to-Business-to-Agent: der primäre Konsument von Content, APIs und Interfaces ist ein Agent, der im Auftrag einer Organisation entscheidet. Optimierung verschiebt sich von menschlicher Lesbarkeit (SEO) zu agentischer Konsumierbarkeit (GEO · Generative Engine Optimization).' },
            { q: 'Warum ist die Operator-Doktrin ein eigener Pillar und kein Kapitel?',
              a: 'Weil sie die Bedingung aller anderen Pillars ist. Epochen, Netzwerk, Builds, Anwerbung, Compliance und Columna entfalten sich nur sinnvoll aus der Doktrin. Wer sie als Anhang behandelt, liest das Portfolio auf der falschen Ebene.' },
        ],
        spec: [
            { key: 'doctrine.version',       value: 'v1.8' },
            { key: 'doctrine.maxims',        value: '0, I, III, VII' },
            { key: 'doctrine.world-model',   value: 'Origin → Processing → Target' },
            { key: 'doctrine.paradigm',      value: 'B2B2A' },
            { key: 'doctrine.framework',     value: 'OMM v3.0 · Synergistic Dialogue Engine' },
            { key: 'doctrine.paradox.source', value: 'McKinsey · 88% usage / 6% EBIT impact' },
        ],
    },
    {
        slug: 'epochen',
        path: '/portfolio/epochen',
        code: 'P1',
        label: 'Epochen',
        canon: '§1',
        status: 'live',
        desc: 'Operator-Zeitachse: Operation · Extension · Network.',
        tagline: 'Dasselbe Muster in drei Materialien.',
        kicker: 'P1 · §1 · Operator-Zeitachse',
        visualKey: 'epochs',
        accent: '#A855F7',
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Eine Operator-Handschrift, drei Epochen.',
              body: 'Physisch, digital, netzwerkbasiert — die Methode bleibt identisch. Was sich ändert: das Material, mit dem sie arbeitet, und die Reichweite, die sie erzeugt.', mono: '> LOAD /timeline --frames=3' },
            { key: 'tension',      label: '02 · TENSION',      heading: 'Lebensläufe kennen nur eine Zeitrichtung.',
              body: 'CVs rekonstruieren die Vergangenheit. Operator-Architektur baut die Strukturen, aus denen Titel später entstehen. Diese zwei Modi liegen orthogonal zueinander.', mono: '> DELTA /cv  vs  /operator-arch' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Das Muster, nicht die Stationen.',
              body: 'Nicht Jobs, nicht Branchen. Die wiedererkennbare Konstante: Stabilisierung → Refinanzierung → Skalierung — ob als GmbH-GF, als AI-Architect oder als Ecosystem-Designer.', mono: '> PATTERN_MATCH = 1.0' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Drei Epochen als Layer, nicht als Phasen.',
              body: 'Operation (physische Logistik) trägt Extension (AI-native Architektur) trägt Network (Yildirim Operator Network). Keine abgelösten Stationen — kumulative Substanz.', mono: '> LAYERS = [OPC, OMM, NET]' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Operative Nachweise, nicht Versprechen.',
              body: 'Restrukturierung & Refinanzierung einer Logistik-GmbH mit eigener Bonität. QM-Handbuch eigenhändig optimiert. Zwei Folge-GmbHs aus dem stabilisierten Verbund.', mono: '> LEDGER /opc-era' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Sichtbarkeit vs. Beleg-Pflicht.',
              body: 'Detailbelege existieren und liegen auf Anfrage vor — werden aber nicht proaktiv ausgestellt. Wer Belege als Vorbedingung fordert, agiert nicht im Anwerbungs-Modus.', mono: '> DISCLOSURE = on-request' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'Operation kehrt zurück, parallel zu Extension.',
              body: 'Nach Abschluss der AZAV-Weiterbildung: Rückkehr in die OPC-Markenvertretung. Physisch + digital. Kein Bruch mit der AI-Schicht — Anbindung daran.', mono: '> RESUME /opc --with /omm' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Behandle Epochen als Material-Evidenz.',
              body: 'Was auf dieser Seite steht, ist die operative Substanz — nicht der Pitch. Wer hier anwirbt, wirbt die Methode an, nicht die Rolle.', mono: '> AWAITING OPERATOR INPUT' },
        ],
        clusters: [
            { slug: 'operation',  path: '/portfolio/epochen/operation',  code: 'C1.1', label: 'Epoche I · Proof of Operation',
              summary: 'OPC-Gruppe · Interim-Management, Restrukturierung, Refinanzierung mit eigener Bonität.',
              visualKey: 'epochs', visualHint: 'Frame I · Operation' },
            { slug: 'extension',  path: '/portfolio/epochen/extension',  code: 'C1.2', label: 'Epoche II · Proof of Extension',
              summary: 'OPUS MAGNUM MEDIA · AI-native Architektur · Co-Creation mit Claude & Gemini.',
              visualKey: 'epochs', visualHint: 'Frame II · Extension' },
            { slug: 'network',    path: '/portfolio/epochen/network',    code: 'C1.3', label: 'Epoche III · Proof of Network',
              summary: 'Yildirim Operator Network · physisch + digital + familiär.',
              visualKey: 'epochs', visualHint: 'Frame III · Network' },
        ],
        related: ['netzwerk', 'builds'],
        seoTitle: 'Drei Epochen — Operation · Extension · Network · Yahya Yildirim',
        seoDescription: 'Die Operator-Zeitachse von Yahya Yildirim in drei Epochen: Proof of Operation (OPC-Gruppe · Restrukturierung · Refinanzierung), Proof of Extension (OPUS MAGNUM MEDIA · AI-native Architektur) und Proof of Network (Yildirim Operator Network).',
        keywords: ['Yahya Yildirim', 'Operator-Architekt', 'Interim Management', 'OPC', 'OPUS MAGNUM MEDIA', 'Drei Epochen', 'Proof of Operation'],
        faqs: [
            { q: 'Was bedeutet Proof of Operation?',
              a: 'Proof of Operation bezeichnet Epoche I von Yahya Yildirim: Interim-Management einer deutschen Logistik-GmbH (OPC-Gruppe) mit voller Vollmacht und eigener Bonität. Restrukturierung und Refinanzierung erfolgreich abgeschlossen, zwei weitere GmbHs aus dem stabilisierten Verbund hervorgegangen.' },
            { q: 'Was ist Proof of Extension?',
              a: 'Epoche II · 2023–laufend: Bewusste Entscheidung zum AI-nativen Architektur-Neubau. Drei Jahre Co-Creation mit Claude (Anthropic) und Gemini (Google DeepMind). Übergang vom Manager (delegiert an Menschen) zum Architect (dirigiert Intelligenz).' },
            { q: 'Warum sind die drei Epochen keine Phasen, sondern Layer?',
              a: 'Sie lösen sich nicht ab, sondern tragen sich. Operation (physische Logistik) trägt Extension (AI-native Architektur) trägt Network (Yildirim Operator Network). Kumulative Substanz statt sequenzieller Stationen.' },
        ],
        spec: [
            { key: 'pillar.frames',   value: '3 (I · II · III)' },
            { key: 'pillar.pattern',  value: 'identical across materials' },
            { key: 'pillar.canon',    value: '§1' },
        ],
    },
    {
        slug: 'netzwerk',
        path: '/portfolio/netzwerk',
        code: 'P2',
        label: 'Netzwerk',
        canon: '§1c',
        status: 'live',
        desc: 'Yildirim Operator Network — digitale Knoten + Familien-Ebene.',
        tagline: 'Ein Betriebssystem aus Haltung.',
        kicker: 'P2 · §1c · Yildirim Operator Network',
        visualKey: 'network',
        accent: '#A855F7',
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Kein Einzeloperator.',
              body: 'Wer einen Yildirim einbindet, bindet ein verwobenes Muster aus physischer Logistik, digitalen Plattformen und einer bewussten Familien-Ebene ein.', mono: '> MOUNT /network' },
            { key: 'tension',      label: '02 · TENSION',      heading: 'Netzwerke werden oft nur als Kontakt-Listen verstanden.',
              body: 'Kontakte sind Namen. Das Yildirim Operator Network ist eine Haltung — keine Adressliste, kein Org-Chart, keine LinkedIn-Gruppe.', mono: '> DELTA /contacts  vs  /network' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Ganzheits-Prinzip.',
              body: 'Alles, was in diesem Netzwerk entsteht — Logistik, Plattformen, Life-OS, Agenten — gehört zum selben System. Keine Nebenprojekte. Kein "was-nebenbei-passiert".', mono: '> WHOLE > SUM(parts)' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Physischer Kern + digitale Knoten + Familien-Ring.',
              body: 'OPC als physische Basis. OMM, LYGOX, MASTER-X 2.0, Sovereign 2030 als digitale Knoten. Familien-Ebene ohne öffentliche Namen als Haltungs-Schicht.', mono: '> NODES = 1 + 4 + n' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Jeder Knoten hat eine eigene Spur.',
              body: 'OMM v3.0 in aktiver Entwicklung. Sovereign 2030 Phase I live. LYGOX in Build-Vorbereitung. MASTER-X 2.0 deployed. Alle unter §1c dokumentiert.', mono: '> LEDGER /nodes/*' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Transparenz vs. Privatsphäre.',
              body: 'Digitale Knoten werden vollständig offengelegt. Die Familien-Ebene wird als Pattern beschrieben — ohne Namen. Wer den Pattern erkennt, versteht die Substanz.', mono: '> DISCLOSURE = pattern-only' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'Weitere Knoten entstehen organisch.',
              body: 'Das Netzwerk skaliert nicht durch Rekrutierung, sondern durch Start-Impulse. Wer in der Familie beginnt, bleibt selbstständig auf eigenem Gebiet — der Zweck verbindet.', mono: '> IMPULSE --> AUTONOMY' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Verhandele mit dem Netzwerk, nicht mit der Person.',
              body: 'Mandate, Beteiligungen, Beiräte — alle Optionen geben Zugang zum verwobenen System, nicht zu einem einzelnen Operator.', mono: '> BIND /network --scope=deal' },
        ],
        clusters: [
            { slug: 'prinzip',        path: '/portfolio/netzwerk/prinzip',        code: 'C2.1', label: 'Netzwerk-Prinzip',
              summary: 'Drei Tenets · programmiert, nicht organisiert.', visualKey: 'network', visualHint: 'Prinzip · 3 Tenets' },
            { slug: 'omm',            path: '/portfolio/netzwerk/omm',            code: 'C2.2', label: 'OMM — Opus Magnum Media',
              summary: 'AI-Marketing Platform OS · ~40 Gemini-Agenten · lebendes Portfolio-Artefakt.', visualKey: 'network', visualHint: 'Node · OMM' },
            { slug: 'lygox',          path: '/portfolio/netzwerk/lygox',          code: 'C2.3', label: 'LYGOX',
              summary: 'SaaS · Logistik-Vertical · semi-atomar (SIS · YON · KOB · GOL) · Multi-Tenant + Fahrer-App.',
              visualKey: 'network', visualHint: 'Node · SIS·YON·KOB·GOL',
              seoTitle: 'LYGOX — Semi-atomare Logistik-SaaS · Yildirim Operator Network',
              seoDescription: 'LYGOX ist die semi-atomare Logistik-Plattform des Yildirim Operator Networks: SIS · YON · KOB · GOL als 120–150 Einzelfunktionen, mandantenfähig, NFR-first.',
              keywords: ['LYGOX', 'Logistik-SaaS', 'Multi-Tenant', 'SIS YON KOB GOL', 'Fahrer-App', 'Yildirim'] },
            { slug: 'master-x',       path: '/portfolio/netzwerk/master-x',       code: 'C2.4', label: 'MASTER-X 2.0',
              summary: 'Trainings- und Wachstums-Architektur · übergeben an Yahya (17.04.2026).', visualKey: 'network', visualHint: 'Node · MASTER-X' },
            { slug: 'sovereign-2030', path: '/portfolio/netzwerk/sovereign-2030', code: 'C2.5', label: 'Sovereign 2030',
              summary: 'Autonomous Life-OS · EU-first · Art. 50 Disclosure: Grounding-Korpus transparent.', visualKey: 'network', visualHint: 'Node · SOV 2030' },
            { slug: 'familie',        path: '/portfolio/netzwerk/familie',        code: 'C2.6', label: 'Familien-Ebene',
              summary: 'Haltungs-Schicht ohne öffentliche Namen · Pattern statt Organisation.', visualKey: 'network', visualHint: 'Ring · Familie' },
        ],
        related: ['epochen', 'anwerbung'],
        seoTitle: 'Yildirim Operator Network — OMM · LYGOX · MASTER-X · Sovereign 2030',
        seoDescription: 'Das Yildirim Operator Network: physischer Kern (OPC) + vier digitale Knoten (OMM · LYGOX · MASTER-X · Sovereign 2030) + Familien-Ebene als Haltungs-Schicht. Ein Betriebssystem aus Haltung, kein Org-Chart.',
        keywords: ['Yildirim Operator Network', 'OMM', 'LYGOX', 'MASTER-X', 'Sovereign 2030', 'OPC', 'Operator-Netzwerk'],
        faqs: [
            { q: 'Was ist das Yildirim Operator Network?',
              a: 'Das Yildirim Operator Network ist ein Betriebssystem aus Haltung: physischer Kern (OPC-Gruppe), vier digitale Knoten (OMM · LYGOX · MASTER-X 2.0 · Sovereign 2030) und eine bewusste Familien-Ebene. Keine Portfolio-Liste, kein Org-Chart — ein Pattern.' },
            { q: 'Warum wird die Familien-Ebene ohne Namen geführt?',
              a: 'Weil Haltung beschrieben wird, nicht Personen. Jedes Familien-Mitglied arbeitet selbstständig auf eigenem Gebiet; die geteilte Haltung macht die Ebene zum Knoten. Wer den Pattern erkennt, versteht die Substanz — Namen würden nur Privatsphäre verletzen.' },
            { q: 'Was bekommt ein Anwerbungs-Adressat, der Yahya einbindet?',
              a: 'Zugang zum verwobenen System: physische Logistik-Basis, vier aktive digitale Knoten und eine generationsübergreifende Familien-Ebene. Kein Einzeloperator, sondern ein belastbares Netzwerk.' },
        ],
        spec: [
            { key: 'pillar.nodes',    value: '1 physical + 4 digital + n family' },
            { key: 'pillar.canon',    value: '§1c' },
            { key: 'pillar.principle', value: 'Ganzheits-Prinzip' },
        ],
    },
    {
        slug: 'builds',
        path: '/portfolio/builds',
        code: 'P3',
        label: 'Builds',
        canon: '§4',
        status: 'live',
        desc: 'Public Builds · Evidence Layer (Devpost-Artefakte).',
        tagline: 'Beleg-Layer, nicht Demo-Parade.',
        kicker: 'P3 · §4 · Evidence Layer',
        visualKey: 'builds',
        accent: '#3B82F6',
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Öffentliche Artefakte statt Bildschirmtexte.',
              body: 'Wer System-Investment-Optionen prüft, will Artefakte sehen. Dieser Pillar sammelt die öffentlichen Builds, die §3 E stützen.', mono: '> GET /builds/public' },
            { key: 'tension',      label: '02 · TENSION',      heading: 'Showcases beweisen selten Substanz.',
              body: 'Pitch-Decks und Roadmaps sind preiswert. Gehostete, getaggte, dokumentierte Builds sind teuer — und der einzige Beleg, der in Anwerbungen trägt.', mono: '> DELTA /deck  vs  /artifact' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Devpost ist nicht zufällig.',
              body: 'Die AGENTICUM-G5-Builds sind auf Devpost geführt — mit Stack, Quelltext-Hinweisen, öffentlichen Demos. Kein kuratierter Schaukasten, sondern ein öffentlich prüfbarer Registry-Eintrag.', mono: '> SOURCE = devpost.com/yildirimyahya716' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Build · Stack · Demo · Link.',
              body: 'Jeder Build trägt dieselben vier Felder: Name + Tagline, Stack, Plattform, Live-URL. Kein Storytelling, keine Adjektive — Schnitttabelle.', mono: '> SCHEMA = {name, tagline, stack, url}' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Zwei Flaggschiff-Builds, eine Linie.',
              body: 'AGENTICUM G5 Modular Neural Orchestration OS (Multi-Agent-Synergie) und AGENTICUM G5 Genius (52-Node Neural Mesh + Voice-UX). Beide auf Gemini + Firebase + Google Cloud.', mono: '> LEDGER /agenticum/*' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Öffentlich vs. privat.',
              body: 'OMM, LYGOX, MASTER-X 2.0, Sovereign 2030 laufen nicht auf Devpost. Sie sind proprietär oder im Netzwerk-Kontext — der Evidence-Layer ersetzt keine NDA-basierten Einblicke.', mono: '> SCOPE = public-only' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'Weitere Public-Builds folgen.',
              body: 'Jeder künftige öffentlich deploy-bare Build wird hier registriert — mit klarer Co-Creation-Attribution (Pilot · Entwickler-Agent · Kernintelligenz).', mono: '> WATCH /builds --new' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Leite System-Investment aus Artefakten ab.',
              body: 'Wer Option E prüft (§3 E), sollte hier starten. Artefakte sind prüfbar; was sie implizieren, ist das Invest-Target.', mono: '> LINK /builds -> /anwerbung/e' },
        ],
        clusters: [
            { slug: 'agenticum-g5-orchestration', path: '/portfolio/builds/agenticum-g5-orchestration', code: 'C3.1',
              label: 'AGENTICUM G5 · Orchestration OS',
              summary: 'Modular Neural Orchestration OS · Autonomous marketing OS · synergetische Multi-Agent-Dialoge.',
              visualKey: 'builds', visualHint: 'Build · Orchestration' },
            { slug: 'agenticum-g5-genius',        path: '/portfolio/builds/agenticum-g5-genius',        code: 'C3.2',
              label: 'AGENTICUM G5 · Genius',
              summary: 'Real-time AI Live-Agent · 52-Node Neural Mesh · Voice-first UX.',
              visualKey: 'mesh', visualHint: 'Mesh · 52 Nodes',
              seoTitle: 'AGENTICUM G5 Genius — 52-Node Neural Mesh · Voice-first Marketing-AI',
              seoDescription: 'AGENTICUM G5 Genius: Real-time AI Live-Agent als 52-Node Neural Mesh mit Voice-first UX. Autonome Marketing-Intelligenz auf Google-Cloud · Gemini · Firebase.',
              keywords: ['AGENTICUM G5', 'Neural Mesh', 'Voice AI', 'Real-time Agent', 'Gemini', 'Google Cloud'] },
            { slug: 'perfect-twin-architecture',  path: '/portfolio/builds/perfect-twin-architecture',  code: 'C3.3',
              label: 'Perfect Twin Architecture',
              summary: 'Double Helix · GOOGLE_INFRA_HELIX ∥ OMM_LOGIC_HELIX · APEX 4-Layer Schutz · Aurora Protocol L0→L3.',
              visualKey: 'pta', visualHint: 'PTA · Double Helix',
              seoTitle: 'Perfect Twin Architecture — Double-Helix AI-Betriebssystem · EU-souverän',
              seoDescription: 'Perfect Twin Architecture (PTA) · zwei verschränkte Helices: GOOGLE_INFRA_HELIX und OMM_LOGIC_HELIX · APEX 4-Layer-Schutz · Aurora Protocol L0 Ingestion → L1 Synthesis → L3 Expansion.',
              keywords: ['Perfect Twin Architecture', 'PTA', 'Double Helix', 'APEX Layers', 'Aurora Protocol', 'EU Sovereign AI'] },
        ],
        related: ['anwerbung', 'netzwerk', 'compliance'],
        seoTitle: 'Public Builds — AGENTICUM G5 · Perfect Twin Architecture · Devpost-Evidenz',
        seoDescription: 'Öffentliche Build-Evidenz: AGENTICUM G5 Modular Neural Orchestration OS, AGENTICUM G5 Genius (52-Node Neural Mesh · Voice-first), Perfect Twin Architecture (Double Helix · APEX 4-Layer · Aurora Protocol). Auf Devpost dokumentiert.',
        keywords: ['AGENTICUM G5', 'Perfect Twin Architecture', 'Devpost', 'Neural Mesh', 'Multi-Agent Orchestration', 'Gemini', 'Firebase'],
        faqs: [
            { q: 'Warum liegt die Build-Evidenz auf Devpost?',
              a: 'Devpost ist ein öffentlich prüfbarer Registry-Eintrag mit Stack, Quelltext-Hinweisen und Live-Demos. Kein kuratierter Showcase, sondern ein extern hostbarer Artefakt-Layer, der System-Investment-Optionen (§3 E) stützt.' },
            { q: 'Was ist das AGENTICUM G5 52-Node Neural Mesh?',
              a: 'Ein Real-time AI Live-Agent mit 52 synergetisch verbundenen Node-Agenten, Voice-first UX und autonomer Marketing-Intelligenz. Stack: Gemini 2.0 Flash · Firebase · Google Cloud. Dokumentiert auf Devpost.' },
            { q: 'Was unterscheidet Perfect Twin Architecture (PTA)?',
              a: 'PTA verschränkt zwei Helices: GOOGLE_INFRA_HELIX (Infrastruktur · Vertex AI · GCP) und OMM_LOGIC_HELIX (Doktrin · Agenten · Kontext). Dazu APEX 4-Layer-Schutz und Aurora Protocol L0→L3 — ein souveränes AI-Betriebssystem auf EU-Region.' },
        ],
        spec: [
            { key: 'pillar.public-source', value: 'devpost.com/yildirimyahya716' },
            { key: 'pillar.canon',         value: '§4' },
            { key: 'pillar.scope',         value: 'public-only' },
        ],
    },
    {
        slug: 'anwerbung',
        path: '/portfolio/anwerbung',
        code: 'P4',
        label: 'Anwerbung',
        canon: '§3',
        status: 'live',
        desc: 'Fünf Anwerbungs-Optionen A–E mit klaren Terms.',
        tagline: 'Fünf Kanäle, eine Intention.',
        kicker: 'P4 · §3 · Anwerbungs-Matrix',
        visualKey: 'recruitment',
        accent: '#A855F7',
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Fünf Optionen, keine Graubereiche.',
              body: 'A bis E. Jede Option mit klarem Scope, klaren Terms, klarer Reihenfolge. Kein "passen-wir-später-an".', mono: '> ENUM /options = [A..E]' },
            { key: 'tension',      label: '02 · TENSION',      heading: 'Bewerbungs-Logik greift nicht.',
              body: 'Klassische Stellenausschreibungen fragen "wer passt in unsere Struktur". Anwerbung fragt: "welche Struktur entsteht, wenn wir zusammen arbeiten".', mono: '> DELTA /apply  vs  /recruit' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Die Reihenfolge ist nicht beliebig.',
              body: 'A vor B vor C vor D vor E. Die OPC-Rückkehr hat Vorrang, weil sie das physische Fundament des Netzwerks bindet.', mono: '> ORDER = A > B > C > D > E' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Rolle · Scope · Terms.',
              body: 'Jede Option dreifach strukturiert: welche Rolle, in welchem Scope, zu welchen kommerziellen Bedingungen. Kein Raum für Missverständnisse.', mono: '> SCHEMA = {role, scope, terms}' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Optionen sind an Epochen gekoppelt.',
              body: 'A an Epoche I (OPC). B an Epoche I+II (Interim mit AI-Stack). C/D an Epoche III (Network). E an §4 Public Builds.', mono: '> BIND /options -> /epochen' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Geschwindigkeit vs. Passung.',
              body: 'Schnelle Entscheidungen sind möglich — aber nicht erzwungen. Der strategische Zeithorizont reicht bis 2030; jede Option respektiert das.', mono: '> DEADLINE = 2030' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'Ab AZAV-Abschluss ist A operativ.',
              body: 'Die Weiterbildung Online Marketing Manager (DCI Berlin) strukturiert den Rückkehr-Zeitpunkt in die OPC-Gruppe.', mono: '> UNLOCK /a --on azav-completion' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Wähle eine Option, nicht ein Gespräch.',
              body: 'Jede Option öffnet einen konkreten Dialog. Allgemeine "Kennenlern"-Anfragen fallen aus der Matrix raus.', mono: '> POST /options/{A..E}' },
        ],
        clusters: [
            { slug: 'option-a', path: '/portfolio/anwerbung/option-a', code: 'C4.A', label: 'Option A · Rückkehr OPC-Gruppe',
              summary: 'Geschäftsführender Gesellschafter · Holding-Architekt · Markenvertretung.', visualKey: 'recruitment', visualHint: 'Funnel · A' },
            { slug: 'option-b', path: '/portfolio/anwerbung/option-b', code: 'C4.B', label: 'Option B · Interim / Chief AI Officer',
              summary: 'Mittelstand · 6–24 Monate · Tagessatz + Erfolgsbeteiligung oder Retainer.', visualKey: 'recruitment', visualHint: 'Funnel · B' },
            { slug: 'option-c', path: '/portfolio/anwerbung/option-c', code: 'C4.C', label: 'Option C · Co-Founder / Operator-in-Residence',
              summary: 'Venture-Strukturen · Equity · Fund-Partner-Struktur.', visualKey: 'recruitment', visualHint: 'Funnel · C' },
            { slug: 'option-d', path: '/portfolio/anwerbung/option-d', code: 'C4.D', label: 'Option D · Advisory / Board',
              summary: 'Board-Mandat · Vergütung ggf. + Equity-Optionen.', visualKey: 'recruitment', visualHint: 'Funnel · D' },
            { slug: 'option-e', path: '/portfolio/anwerbung/option-e', code: 'C4.E', label: 'Option E · System Investment',
              summary: 'Targets: SOVEREIGN 2030 · AGENTICUM G5 · LYGOX · MASTER-X.', visualKey: 'recruitment', visualHint: 'Funnel · E' },
        ],
        related: ['builds', 'compliance'],
        seoTitle: 'Anwerbungs-Matrix — 5 Optionen A·B·C·D·E · Interim · Co-Founder · Advisory',
        seoDescription: 'Anwerbung statt Bewerbung · 5 Optionen mit klaren Terms: A Rückkehr OPC · B Interim / Chief AI Officer · C Co-Founder / Operator-in-Residence · D Advisory / Board · E System Investment.',
        keywords: ['Interim Management', 'Chief AI Officer', 'Anwerbung', 'Operator-in-Residence', 'Advisory Board', 'System Investment', 'Yahya Yildirim'],
        faqs: [
            { q: 'Warum "Anwerbung" und nicht "Bewerbung"?',
              a: 'Bewerbungen messen Vergangenheits-Beiträge zu Strukturen, die andere gebaut haben. Operator-Architektur baut die Strukturen, in denen Titel später entstehen. Anwerbung öffnet diesen Modus: eine Organisation meldet sich, weil sie die Operator-Handschrift braucht — nicht umgekehrt.' },
            { q: 'Was bedeutet Option B · Chief AI Officer Interim?',
              a: 'Interim-Mandat im Mittelstand · 6–24 Monate · Tagessatz plus Erfolgsbeteiligung oder monatlicher Retainer. Fokus: AI-native Transformation, nicht Tool-Rollout. Bindet an die gesamte Operator-Doktrin (P0).' },
            { q: 'Was fällt unter Option E · System Investment?',
              a: 'Beteiligungsrunden in die Netzwerk-Knoten: SOVEREIGN 2030, AGENTICUM G5, LYGOX, MASTER-X SaaS. Öffentliche Evidenz auf Devpost (§4); privater Due-Diligence-Layer auf Anfrage.' },
        ],
        spec: [
            { key: 'pillar.options',  value: '5 (A · B · C · D · E)' },
            { key: 'pillar.order',    value: 'A > B > C > D > E' },
            { key: 'pillar.canon',    value: '§3' },
        ],
    },
    {
        slug: 'compliance',
        path: '/portfolio/compliance',
        code: 'P5',
        label: 'Compliance',
        canon: '§16',
        status: 'live',
        desc: 'EU AI Act · DSGVO · EU Data Act · Entscheidungshistorie.',
        tagline: 'Compliance als Architektur-Eigenschaft.',
        kicker: 'P5 · §16 · Compliance-Canon',
        visualKey: 'compliance',
        accent: '#22C55E',
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Compliance ist kein Anhang.',
              body: 'In dieser Architektur wird Compliance als Eigenschaft des Systems gebaut — nicht als Nachrüst-Dokument. Jeder Build trägt den Ready-Status.', mono: '> STATUS /compliance = ACTIVE' },
            { key: 'tension',      label: '02 · TENSION',      heading: '"Konform" ist ein gefährliches Wort.',
              body: 'Konformität erzeugt Eindruck von Abschluss. EU AI Act Art. 50 wird erst ab 2.8.2026 enforced — wir sprechen daher von "ready", nicht von "konform".', mono: '> LEXICON: ready != conform' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Drei aktive Regimes, eine Haltung.',
              body: 'DSGVO voll anwendbar · EU AI Act Art. 50 Enforcement Termin 2.8.2026 · EU Data Act Hauptbestimmungen seit 12.9.2025. Alle drei werden aktiv eingehalten.', mono: '> REGIMES = [DSGVO, AI_ACT, DATA_ACT]' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Disclosure + Watermarking + Audit Trail.',
              body: 'Semantische UI-States in Aurora Purple signalisieren KI-Interaktion. Imagen-4-Assets tragen Metadata-Watermarks. Jede Entscheidung wird im Decision-Log dokumentiert.', mono: '> LAYERS = [UX, META, LOG]' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Der System-Log-Footer ist kein Deko-Element.',
              body: 'Auf jeder Portfolio-Route steht der Footer: "SYSTEM LOG // AI-GENERATED ASSET // OPUS MAGNUM MEDIA® // BRAND PROTOCOL v3.0 // COMPLIANCE: EU AI ACT ART. 50 READY". Das ist die Disclosure.', mono: '> LOG_FOOTER = MANDATORY' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'ISO 27001 aligned, aber nicht zertifiziert.',
              body: 'Die Architektur ist ISO-aligned — eine formale Zertifizierung ist optional und wird erst für Enterprise-Deals eingeholt, wenn der Fall es rechtfertigt.', mono: '> ISO27001 = aligned, not certified' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: 'EU Data Act Switching-Gebühren-Verbot 12.1.2027.',
              body: 'B2B Unfair Terms ab 2025, Portabilität + Switching-Gebühren-Verbot ab 12.1.2027. Architektur ist darauf ausgelegt.', mono: '> UNLOCK /switching = 2027-01-12' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Akzeptiere Compliance als Design-Eigenschaft.',
              body: 'Wer hier anwirbt, erhält kein Nachrüst-Dokument, sondern ein System, das Compliance strukturell trägt.', mono: '> COMPLIANCE = by-design' },
        ],
        clusters: [
            { slug: 'eu-ai-act',    path: '/portfolio/compliance/eu-ai-act',    code: 'C5.1', label: 'EU AI Act · Art. 50 Ready',
              summary: 'Disclosure · Output-Markierung · Deployer-Transparenz · 2.8.2026 Enforcement.', visualKey: 'compliance', visualHint: 'Shield · AI Act' },
            { slug: 'gdpr',         path: '/portfolio/compliance/gdpr',         code: 'C5.2', label: 'DSGVO · (EU) 2016/679',
              summary: 'Rechtsgrundlage · Informationspflichten · AV-Verträge · DSFA · Drittlandschutz.', visualKey: 'compliance', visualHint: 'Shield · GDPR' },
            { slug: 'eu-data-act',  path: '/portfolio/compliance/eu-data-act',  code: 'C5.3', label: 'EU Data Act · (EU) 2023/2854',
              summary: 'B2B Unfair Terms · Portabilität · Switching-Gebühren-Verbot ab 12.1.2027.', visualKey: 'compliance', visualHint: 'Shield · Data Act' },
            { slug: 'decision-log', path: '/portfolio/compliance/decision-log', code: 'C5.4', label: 'Decision Log · §13',
              summary: 'Kumulative Entscheidungshistorie der Portfolio-Architektur.', visualKey: 'compliance', visualHint: 'Shield · Log' },
        ],
        related: ['builds', 'anwerbung'],
        seoTitle: 'Compliance-Canon — EU AI Act Art. 50 Ready · DSGVO · EU Data Act',
        seoDescription: 'Compliance als Architektur-Eigenschaft: EU AI Act (Art. 50 Enforcement 2.8.2026) Ready, DSGVO voll anwendbar, EU Data Act (Switching-Verbot 12.1.2027), ISO 27001 aligned. System-Log-Footer auf allen Routen.',
        keywords: ['EU AI Act', 'Art. 50', 'DSGVO', 'GDPR', 'EU Data Act', 'Compliance by Design', 'ISO 27001', 'Art. 50 Ready'],
        faqs: [
            { q: 'Was bedeutet "Art. 50 Ready"?',
              a: 'EU AI Act Artikel 50 regelt Transparenz-Pflichten für AI-Systeme (Chatbot-Kennzeichnung, Output-Markierung, Deployer-Disclosure). Enforcement ab 2.8.2026. "Ready" heißt: architektonisch vorbereitet — nicht "konform" (weil Enforcement noch nicht läuft). Der System-Log-Footer auf jeder Route ist die operative Disclosure.' },
            { q: 'Was ändert sich durch den EU Data Act am 12.1.2027?',
              a: 'Ab diesem Datum greift das Switching-Gebühren-Verbot: Kunden müssen kostenfrei zwischen Cloud-Providern wechseln können. Ab 12.9.2025 sind zudem B2B Unfair Terms und Portabilitäts-Pflichten aktiv. Die Architektur ist darauf ausgelegt.' },
            { q: 'Warum nicht ISO 27001 zertifiziert?',
              a: 'Die Architektur ist ISO-27001-aligned — eine formale Zertifizierung ist optional und wird nur für konkrete Enterprise-Deals eingeholt, wenn der Fall es rechtfertigt. Zertifizierung als Reaktion auf Business-Anforderung, nicht als Selbstzweck.' },
        ],
        spec: [
            { key: 'pillar.regimes',  value: 'DSGVO · EU AI Act · EU Data Act' },
            { key: 'pillar.ai-act',   value: 'Art. 50 Ready · Enforcement 2.8.2026' },
            { key: 'pillar.data-act', value: 'Switching-Verbot 12.1.2027' },
            { key: 'pillar.canon',    value: '§16' },
        ],
    },
    {
        slug: 'columna',
        path: '/portfolio/columna',
        code: 'P6',
        label: 'Columna',
        canon: '§6',
        status: 'live',
        desc: 'Strategisches Produkt · Content-Intelligence · Competitive-Architecture · Apex/Pillar/Cluster-Generator · Google-Cloud-exklusiv.',
        tagline: 'Content-Intelligence ist die neue Supply Chain.',
        kicker: 'P6 · §6 · Columna Canonical v2.0',
        visualKey: 'columna',
        accent: '#3B82F6',
        seoTitle: 'Columna — Content-Intelligence · Apex/Pillar/Cluster-Generator · EU-souverän',
        seoDescription: 'Columna ist das strategische Produkt der OMM-Holding für Content-Intelligence & Competitive-Architecture: APC-Generator, SEO/AEO/GEO-Layer, Google-Cloud-exklusiv, EU-first, Canonical v2.0.',
        keywords: ['Columna', 'Content Intelligence', 'Competitive Architecture', 'APC Generator', 'SEO AEO GEO', 'Google Cloud EU', 'Apex Pillar Cluster'],
        narrative: [
            { key: 'hook',         label: '01 · HOOK',         heading: 'Content-Intelligence ist die neue Supply Chain.',
              body: 'Wer Content-Produktion orchestriert, orchestriert Märkte. Columna macht diese Supply-Chain sichtbar — als Architektur, nicht als Redaktionskalender.',
              mono: '> MOUNT /columna --canonical=v2.0' },
            { key: 'tension',      label: '02 · TENSION',      heading: 'Traditionelle Content-Tools sind lineare Pipelines.',
              body: 'CMS, SEO-Suites, Schreib-Agenten denken in Listen. Generative Engines (Google AI Mode · ChatGPT · Perplexity · Claude) lesen aber Graphen — Topic-Authority, Cluster-Tiefe, kanonische Beziehungen. Wer linear produziert, bleibt unsichtbar.',
              mono: '> DELTA /pipeline ↔ /graph' },
            { key: 'insight',      label: '03 · INSIGHT',      heading: 'Apex / Pillar / Cluster ist keine SEO-Taktik.',
              body: 'Es ist die einzige Topologie, die sowohl Menschen (SEO) als auch Agenten (AEO · GEO) navigierbar macht. Columna generiert diese Topologie nicht als Nebeneffekt — als primäres Artefakt. Dieses Portfolio ist der erste öffentliche Beweis.',
              mono: '> TOPOLOGY = APEX ↦ PILLAR ↦ CLUSTER' },
            { key: 'architecture', label: '04 · ARCHITECTURE', heading: 'Google-Cloud-exklusiv · EU-Compliance-Core.',
              body: 'Vertex AI · Gemini 3.0 Pro · BigQuery · Cloud Run · Firestore · GCP_EU_WEST3 (Frankfurt). Kein Cloud-Mix. Keine Shadow-Workflows. EU-Datenresidenz ist kein Feature, sondern Architektur-Eigenschaft.',
              mono: '> REGION = europe-west3 · STACK = GCP_ONLY' },
            { key: 'evidence',     label: '05 · EVIDENCE',     heading: 'Canonical v2.0 · 10 Decisions · Ingest validiert.',
              body: 'Columna ist dokumentiert auf dem Niveau, auf dem dieses Portfolio dokumentiert ist — mit eigenem Canonical, eigener Decision-History, eigener Roadmap. Das Ingest-Verhalten ist auf öffentlichen SERPs und Wettbewerbs-Architekturen validiert.',
              mono: '> LEDGER /columna/canonical-v2.0' },
            { key: 'tradeoffs',    label: '06 · TRADEOFFS',    heading: 'Cloud-Lock-in vs. Souveränitätsgewinn.',
              body: 'Google-Cloud-Exklusivität erzeugt Lock-in. Dafür bekommt Columna: EU-Region Frankfurt, Vertex AI Reasoning Core auf Gemini 3.0 Pro, saubere Audit-Kette, keine Cross-Provider-Drift. Bewusste Entscheidung zugunsten Souveränität in EU-Kontext.',
              mono: '> LOCK_IN = GCP · BENEFIT = EU_SOVEREIGN' },
            { key: 'roadmap',      label: '07 · ROADMAP',      heading: '2026 → 2030 · gestufter Rollout.',
              body: '2026: APC-Generator Release 1 + SEO-Layer. 2027: AEO-Layer + FAQ-Schema-Engine. 2028: GEO-Layer (B2B2A) + operator.json Standard. 2029–2030: Partner-Tier für Interim-Mandate + Fund-Struktur (§3 E).',
              mono: '> TIMELINE = [2026..2030]' },
            { key: 'ask',          label: '08 · ASK',          heading: 'Columna ist für Operatoren, nicht für Redakteure.',
              body: 'Wer Content als Marketing-Asset denkt, findet anderswo bessere Tools. Wer Content-Märkte als Architektur liest, findet in Columna den Generator — und im Netzwerk den Mandats-Kanal.',
              mono: '> AUDIENCE = OPERATORS · CHANNEL = /anwerbung' },
        ],
        clusters: [
            { slug: 'content-intelligence', path: '/portfolio/columna/content-intelligence', code: 'C6.1',
              label: 'Content-Intelligence · Aurora Protocol L0→L3',
              summary: 'Ingest (L0 Ingestion) → Synthesis (L1) → Expansion (L3). Roher Content wird zu navigierbarer Architektur.',
              visualKey: 'columna', visualHint: 'L0 → L1 → L3',
              seoTitle: 'Content-Intelligence — Aurora Protocol L0 Ingestion → L1 Synthesis → L3 Expansion',
              seoDescription: 'Aurora Protocol · drei Stufen: L0 Ingestion (rohes Einsammeln), L1 Synthesis (semantische Verdichtung), L3 Expansion (kanonische Artefakte). Columna als Content-Intelligence-Engine.',
              keywords: ['Content Intelligence', 'Aurora Protocol', 'L0 Ingestion', 'L1 Synthesis', 'L3 Expansion', 'Content Pipeline'] },
            { slug: 'competitive-architecture', path: '/portfolio/columna/competitive-architecture', code: 'C6.2',
              label: 'Competitive-Architecture · SERP-Topologie',
              summary: 'Wettbewerbs-Architekturen werden als Graphen gelesen — Cluster-Tiefen, Link-Geometrien, Autor-Signale. Nicht Keywords, sondern Topologien.',
              visualKey: 'columna', visualHint: 'SERP als Graph',
              seoTitle: 'Competitive-Architecture — SERP-Topologie · Wettbewerb als Graph lesen',
              seoDescription: 'Competitive-Architecture: SERPs werden als Graphen analysiert — Cluster-Tiefe, Link-Geometrie, Autor-Signale. Columna dekodiert Wettbewerber-Topologien.',
              keywords: ['Competitive Architecture', 'SERP Analysis', 'Topic Graph', 'Cluster Depth', 'Link Geometry'] },
            { slug: 'apc-generator', path: '/portfolio/columna/apc-generator', code: 'C6.3',
              label: 'APC-Generator · Apex/Pillar/Cluster',
              summary: 'Der produktive Kern: generiert APEX-Überbau, Pillar-Architektur und Cluster-Tiefen als kanonisch navigierbare Struktur — dieses Portfolio ist der Self-Host-Beweis.',
              visualKey: 'columna', visualHint: 'APEX → PILLAR → CLUSTER',
              seoTitle: 'APC-Generator — Apex/Pillar/Cluster als produktives Artefakt',
              seoDescription: 'Der APC-Generator von Columna erzeugt die Apex/Pillar/Cluster-Topologie, die Menschen (SEO) und Agenten (AEO · GEO) gleichermaßen navigieren können. Self-Host-Beweis: dieses Portfolio.',
              keywords: ['APC Generator', 'Apex Pillar Cluster', 'Topic Authority', 'SEO Architecture', 'Self-Host'] },
            { slug: 'seo-aeo-geo', path: '/portfolio/columna/seo-aeo-geo', code: 'C6.4',
              label: 'SEO · AEO · GEO',
              summary: 'Drei Optimierungs-Layer auf einer Topologie: SEO (Google Search), AEO (Answer Engines), GEO (Generative Engines · B2B2A).',
              visualKey: 'columna', visualHint: 'Triad · SEO/AEO/GEO',
              seoTitle: 'SEO · AEO · GEO — Die drei Optimierungs-Layer von Columna',
              seoDescription: 'SEO für Google Search, AEO (Answer Engine Optimization) für Perplexity/Claude/Gemini, GEO (Generative Engine Optimization) für B2B2A-Agenten. Columna orchestriert alle drei Layer.',
              keywords: ['SEO', 'AEO', 'Answer Engine Optimization', 'GEO', 'Generative Engine Optimization', 'B2B2A'] },
            { slug: 'roadmap-2030', path: '/portfolio/columna/roadmap-2030', code: 'C6.5',
              label: 'Roadmap · 2026 → 2030',
              summary: 'Canonical v2.0 Timeline: 2026 APC+SEO · 2027 AEO · 2028 GEO + operator.json · 2029–2030 Partner-Tier + Fund.',
              visualKey: 'columna', visualHint: 'Timeline · 2026–2030',
              seoTitle: 'Columna Roadmap 2026 → 2030 · Gestufter Rollout',
              seoDescription: 'Columna-Roadmap nach Canonical v2.0: 2026 APC-Generator + SEO · 2027 AEO · 2028 GEO + operator.json · 2029–2030 Partner-Tier für Interim-Mandate und Fund-Struktur.',
              keywords: ['Columna Roadmap', 'Canonical v2.0', '2026 2030', 'Staged Rollout', 'Product Timeline'] },
        ],
        related: ['builds', 'doktrin', 'compliance'],
        faqs: [
            { q: 'Was ist Columna?',
              a: 'Columna ist das strategische Produkt der OMM-Holding für Content-Intelligence und Competitive-Architecture. Kern ist der APC-Generator (Apex/Pillar/Cluster), der Content-Märkte als navigierbare Topologie produziert — optimiert für SEO, AEO und GEO gleichzeitig.' },
            { q: 'Warum ist Columna Google-Cloud-exklusiv?',
              a: 'Um EU-Datenresidenz, saubere Audit-Ketten und einen kohärenten Reasoning-Core (Vertex AI · Gemini 3.0 Pro · GCP_EU_WEST3 Frankfurt) zu garantieren. Lock-in ist bewusster Tradeoff für Souveränität im EU-Kontext.' },
            { q: 'Was unterscheidet GEO von SEO und AEO?',
              a: 'SEO optimiert für Suchmaschinen-Ranking (Menschen als Konsumenten). AEO optimiert für Answer Engines (Claude · Gemini · Perplexity · ChatGPT zitieren). GEO optimiert für Generative Engines im B2B2A-Paradigma — Agenten konsumieren Content autonom im Auftrag von Organisationen.' },
            { q: 'Wo ist Columna schon zu sehen?',
              a: 'Dieses Portfolio ist der Self-Host-Beweis. Apex /portfolio → 7 Pillars → je 3–6 Cluster, jede Seite mit SEO-Meta, JSON-LD, FAQ-Schema, Spec-Block, operator.json-Capability-Deklaration.' },
        ],
        spec: [
            { key: 'product.name',         value: 'Columna' },
            { key: 'product.canonical',    value: 'v2.0' },
            { key: 'product.cloud',        value: 'Google Cloud · europe-west3 (Frankfurt)' },
            { key: 'product.reasoning',    value: 'Vertex AI · Gemini 3.0 Pro' },
            { key: 'product.core',         value: 'APC-Generator (Apex / Pillar / Cluster)' },
            { key: 'product.layers',       value: 'SEO · AEO · GEO' },
            { key: 'product.compliance',   value: 'DSGVO · EU AI Act Art. 50 · EU Data Act' },
            { key: 'product.self-host',    value: '/portfolio (v2.5 · Evidenz-Layer)' },
        ],
    },
];

export const getPillar = (slug: string): PillarEntry | undefined =>
    PORTFOLIO_PILLARS.find((p) => p.slug === slug);

export const getCluster = (pillarSlug: string, clusterSlug: string): ClusterEntry | undefined =>
    getPillar(pillarSlug)?.clusters.find((c) => c.slug === clusterSlug);

// System-Log-Footer nach OMM Brand Protocol v3.0 (EU AI Act Art. 50 Transparenz)
export const SYSTEM_LOG_FOOTER = 'SYSTEM LOG // AI-GENERATED ASSET // OPUS MAGNUM MEDIA® // BRAND PROTOCOL v3.0 // COMPLIANCE: EU AI ACT ART. 50 READY';

// Sektions-Index (für Sticky-TOC)
export interface TocEntry {
    id: string;
    label: string;
    canon: string;
}

export const TOC: TocEntry[] = [
    { id: 'hero', label: 'Positionierung', canon: '§0' },
    { id: 'tension', label: 'Anwerbung statt Bewerbung', canon: '§0b' },
    { id: 'epochs', label: 'Drei Epochen', canon: '§1' },
    { id: 'operator-proof', label: 'Operator-Beweis', canon: '§1a' },
    { id: 'network', label: 'Operator-Netzwerk', canon: '§1c' },
    { id: 'public-builds', label: 'Public Builds', canon: '§4' },
    { id: 'method', label: 'Methodik & Prinzipien', canon: '§2' },
    { id: 'recruitment', label: 'Anwerbungs-Matrix', canon: '§3' },
    { id: 'compliance', label: 'Compliance-Canon', canon: '§16' },
    { id: 'decisions', label: 'Entscheidungshistorie', canon: '§13' },
    { id: 'changelog', label: 'Changelog', canon: '—' },
];
