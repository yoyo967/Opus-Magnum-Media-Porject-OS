/**
 * Mirrou Benchmark-Daten (DACH, D2C Beauty/Health) — Denys-Domäne.
 * Quelle: Mirrou benchmark-library.md (Meta-Werte real). TikTok/Google-Zeilen +
 * QFC-Spalte sind vorbereitet und werden befüllt, sobald Denys Daten hat
 * (QFC = Qualified Future Conversions, Pilot — siehe qfc-qualified-future-conversions.md).
 */

export interface BenchmarkRow {
  channel: 'Meta' | 'TikTok' | 'Google';
  segment: string;
  format: string;
  ctr: number | null;   // %
  cpc: number | null;   // €
  roas: number | null;
  qfc: number | null;   // befüllbar sobald QFC-Pilot-Daten vorliegen
}

export const MIRROU_BENCHMARKS: BenchmarkRow[] = [
  // Meta · Beauty & Skincare · DACH (verifizierte Mirrou-Benchmarks)
  { channel: 'Meta', segment: 'Beauty/Skincare', format: 'Single Image (Feed)', ctr: 0.85, cpc: 1.20, roas: 2.1, qfc: null },
  { channel: 'Meta', segment: 'Beauty/Skincare', format: 'Carousel',            ctr: 0.70, cpc: 1.40, roas: 1.9, qfc: null },
  { channel: 'Meta', segment: 'Beauty/Skincare', format: 'Reels (≤15s)',        ctr: 1.20, cpc: 0.95, roas: 2.4, qfc: null },
  { channel: 'Meta', segment: 'Beauty/Skincare', format: 'Collection Ad',       ctr: 1.05, cpc: 1.05, roas: 2.6, qfc: null },
  // Meta · Health & Supplements · DACH
  { channel: 'Meta', segment: 'Health/Supplement', format: 'Single Image (Feed)', ctr: 0.75, cpc: 1.35, roas: 1.9, qfc: null },
  { channel: 'Meta', segment: 'Health/Supplement', format: 'Reels (≤15s)',        ctr: 1.10, cpc: 1.05, roas: 2.3, qfc: null },
  // TikTok / Google — vorbereitet (Denys befüllt mit ersten Kampagnendaten)
  { channel: 'TikTok', segment: 'Beauty/Skincare',  format: 'In-Feed Video', ctr: null, cpc: null, roas: null, qfc: null },
  { channel: 'TikTok', segment: 'Health/Supplement', format: 'In-Feed Video', ctr: null, cpc: null, roas: null, qfc: null },
  { channel: 'Google', segment: 'Beauty/Skincare',  format: 'Demand Gen',    ctr: null, cpc: null, roas: null, qfc: null },
];
