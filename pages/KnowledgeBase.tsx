import React from 'react';
import { useTasks } from '../contexts/AppContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getMirrouKnowledge, setMirrouKnowledge, DEFAULT_MIRROU_KNOWLEDGE } from '@/tenants';

/**
 * Knowledge Base editor (L2.5). The Mirrou KB is the shared "brain" injected
 * into every grounded tool + the orchestrator. Editing + saving here writes
 * tenants/{tenantId}/knowledge/main; the AppContext onSnapshot propagates the
 * change live to all tools (they read MIRROU_KNOWLEDGE at call time) — no deploy.
 */
const KnowledgeBase: React.FC<{ navigateTo: (page: string) => void }> = () => {
  const { user } = useTasks();
  const tenantId = user?.tenantId || user?.uid || 'mirrou';

  const [text, setText] = React.useState(getMirrouKnowledge());
  const [state, setState] = React.useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>('loading');
  const [error, setError] = React.useState('');
  const [source, setSource] = React.useState<'firestore' | 'default'>('default');

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) { setState('idle'); return; }
      try {
        const snap = await getDoc(doc(db, 'tenants', tenantId, 'knowledge', 'main'));
        if (cancelled) return;
        if (snap.exists() && typeof snap.data()?.content === 'string') {
          setText(snap.data()!.content);
          setSource('firestore');
        } else {
          setText(getMirrouKnowledge());
          setSource('default');
        }
        setState('idle');
      } catch (e: any) {
        if (!cancelled) { setError(e?.message || 'Laden fehlgeschlagen'); setState('error'); }
      }
    })();
    return () => { cancelled = true; };
  }, [user, tenantId]);

  const save = React.useCallback(async () => {
    if (!user) { setError('Nicht eingeloggt.'); setState('error'); return; }
    setState('saving');
    setError('');
    try {
      await setDoc(
        doc(db, 'tenants', tenantId, 'knowledge', 'main'),
        { content: text, updated_at: serverTimestamp(), updated_by: user.uid },
        { merge: true },
      );
      setMirrouKnowledge(text); // optimistic; AppContext onSnapshot also fires
      setSource('firestore');
      setState('saved');
      setTimeout(() => setState('idle'), 2000);
    } catch (e: any) {
      setError(e?.message || 'Speichern fehlgeschlagen'); setState('error');
    }
  }, [user, tenantId, text]);

  const dirty = text !== getMirrouKnowledge();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#A855F7] mb-2">L2.5 · Kontext-Schicht</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Knowledge Base</h1>
          <p className="text-sm text-gray-400 mt-2">
            Das geteilte „Gehirn" — geerdet in <span className="text-white">18 Tools</span> + den ⌘K-Orchestrator.
            Speichern wirkt <span className="text-white">live</span>, ohne Deploy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setText(DEFAULT_MIRROU_KNOWLEDGE)}
            className="font-mono text-xs uppercase tracking-widest text-gray-300 border border-white/15 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            ↺ Default laden
          </button>
          <button
            onClick={save}
            disabled={state === 'saving' || state === 'loading' || !dirty}
            className="font-mono text-xs uppercase tracking-widest text-white border border-[#A855F7]/50 bg-[#A855F7]/10 px-4 py-2 rounded-full hover:bg-[#A855F7]/20 transition-colors disabled:opacity-40"
          >
            {state === 'saving' ? 'Speichert…' : state === 'saved' ? '✓ Gespeichert' : 'Speichern & live schalten'}
          </button>
        </div>
      </div>

      {/* Source + status */}
      <div className="flex items-center gap-3 mb-3 font-mono text-[10px] uppercase tracking-widest">
        <span className={`px-2.5 py-1 rounded-full border ${source === 'firestore' ? 'bg-green-500/15 text-green-300 border-green-500/40' : 'bg-white/10 text-gray-400 border-white/15'}`}>
          {source === 'firestore' ? 'Quelle: Firestore (EU)' : 'Quelle: Code-Default'}
        </span>
        {dirty && state !== 'saving' && <span className="text-amber-300">● ungespeicherte Änderungen</span>}
        <span className="text-gray-600 ml-auto">{text.length.toLocaleString('de-DE')} Zeichen</span>
      </div>

      {state === 'error' && (
        <div className="mb-3 rounded-lg p-4 border border-red-500/30 bg-red-900/10 text-red-300 font-mono text-sm">
          {error}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={state === 'loading'}
        spellCheck={false}
        className="w-full h-[60vh] bg-[#0A0A0A] text-gray-200 border border-white/10 rounded-xl p-5 font-mono text-[13px] leading-relaxed focus:outline-none focus:border-[#A855F7]/50 resize-y disabled:opacity-50"
        placeholder={state === 'loading' ? 'Lade Knowledge Base…' : ''}
      />

      <p className="mt-3 text-xs text-gray-500">
        Markdown-Struktur (MARKE · VOICE · ICP · METHODIK · COMPLIANCE · BENCHMARK-ANKER) beibehalten — die Tools verlassen sich darauf.
        Änderungen greifen sofort beim nächsten Tool-Aufruf für alle Team-Mitglieder.
      </p>
    </div>
  );
};

export default KnowledgeBase;
