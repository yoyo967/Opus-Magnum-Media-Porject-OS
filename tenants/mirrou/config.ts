/**
 * Mirrou Creative Studio — Tenant-Konfiguration (Tenant #1).
 * Single Source of Truth für Brand, Team & ICP des Mirrou-Cockpits.
 * Key-Strategie: 'shared' (geteilter Team-Key) — siehe Blueprint §4a.
 */

export const MIRROU_TENANT = {
  TENANT_ID: 'mirrou',
  BRAND: {
    name: 'Mirrou Creative Studio',
    colors: { primary: '#080808', accent: '#C8A25A', light: '#F2EFE9' },
    fonts: ['Cormorant Garamond', 'Inter', 'JetBrains Mono'],
    claim: 'Algorithm of Soul',
  },
  TEAM: [
    { id: 'olha',  role: 'Creative Director',     focus: 'visual_production' },
    { id: 'denys', role: 'Performance Analytics', focus: 'data_campaigns' },
    { id: 'ralph', role: 'CRM Client Success',    focus: 'ops_onboarding' },
    { id: 'yahya', role: 'Growth Architecture',   focus: 'strategy_inbound' },
  ],
  ICP: {
    segments: ['D2C Skincare/Beauty', 'D2C Health/Supplement', 'White-Label Agency'],
    adSpendRange: { min: 10000, max: 150000, currency: 'EUR' },
    market: 'DACH',
    coreProblem: 'Creative Fatigue',
  },
  /** Mirrou = Tenant #1, geteilter Team-Key. Mandanten später: 'byok' | 'metered'. */
  keyStrategy: 'shared' as const,
} as const;

export type MirrouTenant = typeof MIRROU_TENANT;
