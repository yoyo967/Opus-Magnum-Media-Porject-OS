import React from 'react';
import { useTasks } from '../contexts/AppContext';

type DocCategory = 'strategy' | 'tactic' | 'operation' | 'knowledge';

interface OutputActionsProps {
  /** Output als Markdown/Plaintext — Basis für Copy, Download, PDF, Workspace, Task. */
  content: string;
  /** Titel für Dateiname, gespeichertes Dokument und Task. */
  title?: string;
  /** Workspace-Kategorie beim Speichern. */
  category?: DocCategory;
  /** Optionale Kurzbeschreibung für „Als Task". */
  taskDescription?: string;
  /** L3-Verkettung: Buttons „→ An nächstes Tool senden" (übergibt Output via setToolInput). */
  chainTargets?: { tool: string; label: string; prompt?: string }[];
}

const slug = (s: string) =>
  (s || 'output').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'output';

/** Minimaler Markdown → HTML Renderer für den PDF-Druck (kein externes Dependency). */
const mdToHtml = (md: string): string =>
  md
    .split('\n')
    .map((raw) => {
      const l = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (/^### /.test(l)) return `<h3>${l.slice(4)}</h3>`;
      if (/^## /.test(l)) return `<h2>${l.slice(3)}</h2>`;
      if (/^# /.test(l)) return `<h1>${l.slice(2)}</h1>`;
      if (/^- /.test(l)) return `<li>${l.slice(2)}</li>`;
      if (l.trim() === '') return '<br/>';
      return `<p>${l}</p>`;
    })
    .join('\n')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/**
 * Einheitliche Output-Aktions-Schicht („Funktionskatalog") — in jedes Tool unter
 * den Output hängen. Kopieren · Download (Markdown) · Als PDF (Browser-Print) ·
 * In Workspace speichern (geteiltes Team-Dokument) · Als Task anlegen.
 */
const OutputActions: React.FC<OutputActionsProps> = ({
  content,
  title = 'Opus Magnum Output',
  category = 'knowledge',
  taskDescription,
  chainTargets,
}) => {
  const { addDocument, addTask, setToolInput } = useTasks();
  const [msg, setMsg] = React.useState('');
  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(''), 2200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      flash('Kopiert ✓');
    } catch {
      flash('Kopieren fehlgeschlagen');
    }
  };

  const downloadMd = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug(title)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('Markdown geladen ✓');
  };

  const printPdf = () => {
    const w = window.open('', '_blank');
    if (!w) {
      flash('Pop-up blockiert — bitte erlauben');
      return;
    }
    w.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${title}</title>
      <style>
        body{font-family:'Inter',system-ui,-apple-system,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#111;line-height:1.6}
        h1{font-size:24px;margin:22px 0 8px} h2{font-size:18px;margin:20px 0 6px;border-bottom:1px solid #ddd;padding-bottom:4px}
        h3{font-size:15px;margin:14px 0 4px;color:#444} p{margin:4px 0} li{margin:2px 0 2px 20px}
        strong{color:#000}
        .hd{border-bottom:2px solid #C8A25A;padding-bottom:8px;margin-bottom:18px}
        .hd .b{font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-size:11px;color:#C8A25A}
        .ft{margin-top:34px;border-top:1px solid #eee;padding-top:8px;color:#999;font-size:10px}
      </style></head><body>
      <div class="hd"><div class="b">OPUS MAGNUM · Mirrou Creative Studio</div><div>${title}</div></div>
      ${mdToHtml(content)}
      <div class="ft">Generiert mit Opus Magnum · ${new Date().toLocaleDateString('de-DE')}</div>
      </body></html>`);
    w.document.close();
    w.focus();
    window.setTimeout(() => w.print(), 350);
    flash('PDF-Druck geöffnet ✓');
  };

  const saveWorkspace = () => {
    addDocument(title, content, category);
    flash('Im Workspace gespeichert ✓');
  };

  const makeTask = () => {
    addTask(title, taskDescription || content.slice(0, 400));
    flash('Als Task angelegt ✓');
  };

  const btn =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider border border-white/10 bg-white/5 text-gray-300 hover:border-[#A855F7]/50 hover:text-white transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/10 no-print">
      <button onClick={copy} className={btn} title="In Zwischenablage kopieren">⧉ Kopieren</button>
      <button onClick={downloadMd} className={btn} title="Als Markdown herunterladen">↓ Markdown</button>
      <button onClick={printPdf} className={btn} title="Als PDF drucken/speichern">⎙ PDF</button>
      <button onClick={saveWorkspace} className={btn} title="Als geteiltes Dokument im Workspace speichern">★ In Workspace</button>
      <button onClick={makeTask} className={btn} title="Als Task im Masterpiece anlegen">✓ Als Task</button>
      {chainTargets && chainTargets.length > 0 && <span className="text-gray-700 mx-1 select-none">|</span>}
      {chainTargets?.map((t) => (
        <button
          key={t.tool}
          onClick={() => { setToolInput({ tool: t.tool, prompt: t.prompt ?? content, sourceTaskId: -1 }); flash('→ ' + t.label); }}
          className={`${btn} border-[#A855F7]/40 text-[#C9A0FF] hover:border-[#A855F7]`}
          title={`Output an ${t.label} übergeben und dorthin wechseln`}
        >
          → {t.label}
        </button>
      ))}
      {msg && <span className="text-[11px] text-[#A855F7] font-mono ml-1">{msg}</span>}
    </div>
  );
};

export default OutputActions;
