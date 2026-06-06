import React from 'react';
import { useTasks } from '../contexts/AppContext';
import { getGeminiClient } from '@/utils/geminiClient';
import { MIRROU_KNOWLEDGE } from '@/tenants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Lead {
  id: string;
  name: string;
  email: string;
  brand: string;
  website?: string;
  ad_spend?: string | null;
  message: string;
  consent: boolean;
  status: string;
  created_at: string | null;
}

const SPEND_LABEL: Record<string, string> = {
  'under-10k': '< 10k €',
  '10-30k': '10–30k €',
  '30-80k': '30–80k €',
  '80-150k': '80–150k €',
  'over-150k': '> 150k €',
};

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost', 'archived'] as const;
const STATUS_STYLE: Record<string, string> = {
  new:       'bg-[#A855F7]/20 text-[#C9A0FF] border-[#A855F7]/40',
  contacted: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  qualified: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  won:       'bg-green-500/15 text-green-300 border-green-500/40',
  lost:      'bg-red-500/15 text-red-300 border-red-500/40',
  archived:  'bg-white/10 text-gray-400 border-white/15',
};
const STATUS_LABEL: Record<string, string> = {
  new: 'Neu', contacted: 'Kontaktiert', qualified: 'Qualifiziert',
  won: 'Gewonnen', lost: 'Verloren', archived: 'Archiviert',
};
const badgeClass = (s: string) => STATUS_STYLE[s] || STATUS_STYLE.archived;

const fmtDate = (iso: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const LeadInbox: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
  const { user, setToolInput } = useTasks();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error'>('loading');
  const [error, setError] = React.useState('');
  const [selected, setSelected] = React.useState<Lead | null>(null);
  const [qualifying, setQualifying] = React.useState(false);
  const [qualifications, setQualifications] = React.useState<Record<string, string>>({});

  const load = React.useCallback(async () => {
    if (!user?.token) {
      setState('error');
      setError('Nicht eingeloggt — bitte zuerst anmelden.');
      return;
    }
    setState('loading');
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setState('idle');
    } catch (e: any) {
      setError(e?.message || 'Fehler beim Laden der Leads.');
      setState('error');
    }
  }, [user]);

  const [saving, setSaving] = React.useState(false);
  const updateStatus = React.useCallback(async (id: string, status: string) => {
    if (!user?.token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch {
      load(); // bei Fehler frisch laden
    } finally {
      setSaving(false);
    }
  }, [user, load]);

  const exportCSV = React.useCallback(() => {
    if (leads.length === 0) return;
    const headers = ['Eingang', 'Name', 'E-Mail', 'Brand', 'Website', 'Ad-Spend', 'Status', 'DSGVO-Consent', 'Nachricht'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) => [
      fmtDate(l.created_at), l.name, l.email, l.brand, l.website || '',
      l.ad_spend ? (SPEND_LABEL[l.ad_spend] || l.ad_spend) : '',
      STATUS_LABEL[l.status] || l.status, l.consent ? 'Ja' : 'Nein',
      (l.message || '').replace(/[\r\n]+/g, ' '),
    ]);
    const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
    // BOM so Excel reads UTF-8 (Umlaute) correctly.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirrou-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [leads]);

  // L3 Playbook step 1: qualify a lead against the Mirrou ICP (grounded).
  const qualifyLead = React.useCallback(async (lead: Lead) => {
    setQualifying(true);
    try {
      const ai = getGeminiClient();
      const spend = lead.ad_spend ? (SPEND_LABEL[lead.ad_spend] || lead.ad_spend) : '—';
      const prompt =
        `Qualifiziere diesen eingehenden Lead für Mirrou (D2C Beauty/Health DACH, Ad-Spend 10–150k €/Monat).\n` +
        `Lead — Name: ${lead.name}; Brand: ${lead.brand}; Website: ${lead.website || '—'}; ` +
        `Ad-Spend: ${spend}; Nachricht: "${lead.message}".\n\n` +
        `Antworte KURZ auf Deutsch (max. ~120 Wörter, Markdown):\n` +
        `1. **ICP-Fit:** Passt / Teilweise / Außerhalb — 1 Satz Begründung.\n` +
        `2. **Signale:** Ad-Spend-Einordnung + mögliche Creative-Fatigue-Hinweise.\n` +
        `3. **Nächster Schritt + Brief-Angle:** 1–2 Sätze.`;
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { systemInstruction: MIRROU_KNOWLEDGE },
      });
      setQualifications((prev) => ({ ...prev, [lead.id]: res.text }));
    } catch (e: any) {
      setQualifications((prev) => ({ ...prev, [lead.id]: 'Qualifizierung fehlgeschlagen: ' + (e?.message || 'Fehler') }));
    } finally {
      setQualifying(false);
    }
  }, []);

  // L3 Playbook step 2: hand the lead (+ qualification) to Baumeister as a
  // Creative Brief. setToolInput auto-navigates there (App.tsx) and prefills.
  const sendToBrief = React.useCallback((lead: Lead) => {
    const q = qualifications[lead.id];
    const spend = lead.ad_spend ? (SPEND_LABEL[lead.ad_spend] || lead.ad_spend) : '—';
    const goal =
      `Creative Brief für eingehenden Lead.\n` +
      `Brand: ${lead.brand} · Ad-Spend: ${spend}\n` +
      `Anfrage: "${lead.message}"\n` +
      (q ? `\nQualifizierung:\n${q}\n` : '') +
      `\nErstelle einen Creative Brief, der die Creative-Fatigue dieser Brand adressiert (ICP-konform, Mirrou-Methodik).`;
    setToolInput({ tool: 'baumeister', prompt: goal, fields: { brand: lead.brand }, sourceTaskId: -1 });
  }, [qualifications, setToolInput]);

  React.useEffect(() => { load(); }, [load]);

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#A855F7] mb-2">CRM · Inbound</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Lead Inbox</h1>
          <p className="text-sm text-gray-400 mt-2">
            Anfragen vom Mirrou-Website-Kontaktformular · <span className="text-white">{leads.length}</span> gesamt
            {newCount > 0 && <span className="ml-2 text-[#A855F7]">· {newCount} neu</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <button
              onClick={exportCSV}
              className="font-mono text-xs uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              ↓ CSV-Export
            </button>
          )}
          <button
            onClick={load}
            disabled={state === 'loading'}
            className="font-mono text-xs uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {state === 'loading' ? 'Lädt…' : '↻ Aktualisieren'}
          </button>
        </div>
      </div>

      {/* States */}
      {state === 'loading' && (
        <div className="glass-panel rounded-xl p-12 text-center text-gray-400 font-mono text-sm">
          Lade Leads aus Firestore (europe-west3)…
        </div>
      )}

      {state === 'error' && (
        <div className="rounded-xl p-6 border border-red-500/30 bg-red-900/10 text-red-300 font-mono text-sm">
          <p className="font-bold mb-1">Konnte Leads nicht laden</p>
          <p className="opacity-80">{error}</p>
          <button onClick={load} className="mt-4 text-xs underline hover:text-white">Erneut versuchen</button>
        </div>
      )}

      {state === 'idle' && leads.length === 0 && (
        <div className="glass-panel rounded-xl p-12 text-center">
          <p className="text-white font-bold mb-1">Noch keine Leads</p>
          <p className="text-gray-400 text-sm">Sobald jemand das Kontaktformular absendet, erscheint die Anfrage hier.</p>
        </div>
      )}

      {/* Table */}
      {state === 'idle' && leads.length > 0 && (
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                  <th className="px-5 py-3">Eingang</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Ad-Spend</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs whitespace-nowrap">{fmtDate(l.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="text-white font-medium">{l.name || '—'}</div>
                      <div className="text-gray-500 text-xs">{l.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{l.brand || '—'}</td>
                    <td className="px-5 py-4 text-gray-300 whitespace-nowrap">{l.ad_spend ? (SPEND_LABEL[l.ad_spend] || l.ad_spend) : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${badgeClass(l.status || 'new')}`}>
                        {STATUS_LABEL[l.status] || l.status || 'new'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md h-full bg-[#0A0A0A] border-l border-white/10 p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A855F7] mb-2">Lead-Detail</p>
                <h2 className="text-2xl font-bold text-white">{selected.name || '—'}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>

            {/* L3 Playbook: Lead → Qualify → Brief */}
            <div className="mb-6 rounded-lg border border-[#A855F7]/25 bg-[#A855F7]/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#A855F7] mb-3">Playbook · Lead → Brief</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => qualifyLead(selected)}
                  disabled={qualifying}
                  className="font-mono text-[10px] uppercase tracking-wider text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {qualifying ? 'Qualifiziert…' : '🎯 Qualifizieren (KI)'}
                </button>
                <button
                  onClick={() => sendToBrief(selected)}
                  className="font-mono text-[10px] uppercase tracking-wider text-white border border-[#A855F7]/50 bg-[#A855F7]/10 px-3 py-1.5 rounded-full hover:bg-[#A855F7]/20 transition-colors"
                >
                  → Creative Brief
                </button>
              </div>
              {qualifications[selected.id] && (
                <div className="mt-3 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed border-t border-white/10 pt-3">
                  {qualifications[selected.id]}
                </div>
              )}
            </div>

            {/* Status-Pipeline */}
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Status {saving && <span className="text-[#A855F7]">· speichert…</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={saving}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all disabled:opacity-50 ${
                      selected.status === s
                        ? badgeClass(s) + ' ring-1 ring-white/30'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <dl className="space-y-4 text-sm">
              <Field label="E-Mail"><a href={`mailto:${selected.email}`} className="text-[#C9A0FF] hover:underline break-all">{selected.email}</a></Field>
              <Field label="Brand">{selected.brand || '—'}</Field>
              <Field label="Website">
                {selected.website
                  ? <a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-[#C9A0FF] hover:underline break-all">{selected.website}</a>
                  : '—'}
              </Field>
              <Field label="Ad-Spend">{selected.ad_spend ? (SPEND_LABEL[selected.ad_spend] || selected.ad_spend) : '—'}</Field>
              <Field label="Eingang">{fmtDate(selected.created_at)}</Field>
              <Field label="DSGVO-Consent">{selected.consent ? 'Ja ✓' : 'Nein'}</Field>
              <Field label="Nachricht">
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{selected.message || '—'}</p>
              </Field>
            </dl>

            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent('Deine Anfrage bei Mirrou Creative Studio')}`}
              className="mt-8 inline-block w-full text-center font-mono text-xs uppercase tracking-widest text-white border border-[#A855F7]/50 bg-[#A855F7]/10 px-4 py-3 rounded-full hover:bg-[#A855F7]/20 transition-colors"
            >
              Antworten →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <dt className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</dt>
    <dd className="text-gray-200">{children}</dd>
  </div>
);

export default LeadInbox;
