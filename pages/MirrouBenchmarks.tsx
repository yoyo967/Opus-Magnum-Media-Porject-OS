import React from 'react';
import { MIRROU_BENCHMARKS, BenchmarkRow } from '@/data/mirrou-benchmarks';
import { MIRROU_TENANT } from '@/tenants';

const fmt = (v: number | null, suffix = '') => (v === null ? '—' : `${v}${suffix}`);

const cell = "px-4 py-3 text-sm border-b border-[#C8A25A]/15";

const MirrouBenchmarks: React.FC<{ navigateTo?: (page: string) => void }> = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F2EFE9] px-6 md:px-12 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C8A25A] mb-3">
          {MIRROU_TENANT.BRAND.name} · Performance
        </p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Benchmark Library
        </h1>
        <p className="text-[#F2EFE9]/60 max-w-2xl mb-10 text-sm">
          CTR · CPC · ROAS nach Kanal &amp; Segment (DACH, D2C Beauty/Health). Die
          <span className="text-[#C8A25A]"> QFC</span>-Spalte (Qualified Future Conversions)
          ist vorbereitet und wird befüllt, sobald die ersten Pilot-Daten vorliegen.
        </p>

        <div className="overflow-x-auto border border-[#C8A25A]/20 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#121212] text-[#C8A25A] text-left font-mono text-[11px] uppercase tracking-[0.2em]">
                <th className="px-4 py-3">Kanal</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">CTR</th>
                <th className="px-4 py-3">CPC</th>
                <th className="px-4 py-3">ROAS</th>
                <th className="px-4 py-3">QFC</th>
              </tr>
            </thead>
            <tbody>
              {MIRROU_BENCHMARKS.map((r: BenchmarkRow, i) => (
                <tr key={i} className={i % 2 ? 'bg-[#0d0d0d]' : 'bg-[#0a0a0a]'}>
                  <td className={cell + ' text-[#C8A25A]'}>{r.channel}</td>
                  <td className={cell}>{r.segment}</td>
                  <td className={cell + ' text-[#F2EFE9]/70'}>{r.format}</td>
                  <td className={cell}>{fmt(r.ctr, ' %')}</td>
                  <td className={cell}>{fmt(r.cpc, ' €')}</td>
                  <td className={cell}>{fmt(r.roas)}</td>
                  <td className={cell + ' text-[#C8A25A]/50'}>{fmt(r.qfc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[#F2EFE9]/40 text-xs mt-6 font-mono">
          „—" = noch zu befüllen (Denys). KI-Layer: der Späher-Agent kann Benchmarks via
          Google-Search-Grounding aktualisieren.
        </p>

        {navigateTo && (
          <button
            onClick={() => navigateTo('home')}
            className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-[#C8A25A] hover:opacity-70 transition"
          >
            ← Zurück
          </button>
        )}
      </div>
    </div>
  );
};

export default MirrouBenchmarks;
