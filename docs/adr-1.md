# ADR-1 — Phase 1: Kritische Fixes & Reality-Check (Mission OPUS PRIME)

- **Datum:** 2026-06-02
- **Status:** akzeptiert · Phase 1 abgeschlossen (soweit ohne Firebase-Integration möglich)
- **Kontext:** Mission-Brief „OPUS MAGNUM MEDIA → MIRROU Integration", Phase 1 (Blocker-Fixes)
  vor dem Aufbau des Mirrou-Tenants (Phase 2). Verifiziert gegen den realen Code statt gegen
  die (teils veralteten) Brief-Annahmen.

---

## Entscheidungen & Befunde

### Brief vs. Realität (verifiziert beim Klonen des Repos)
| Brief | Realität | Folge |
|-------|----------|-------|
| 1.1 `define`-Key-Leak in `vite.config.ts` | bereits BYOK-bereinigt (kein `define`) | hinfällig |
| 1.1 `AppContext:599/613`, `ClusterRegistry:33`, `VITE_GEMINI_API_KEY` | so nicht vorhanden | Zeilen-/Datei-Refs falsch |
| *(echtes 1.1)* | **53× `process.env.API_KEY` in 40 Tools** → zur Laufzeit `undefined` | Kern-Fix |
| 1.2 `gemini-3-pro-preview` | 52× in 37 Dateien | bestätigt |
| 1.4 Firestore-Migration · 1.6 `signInWithPopup` | **Firebase gar nicht verdrahtet** (localStorage + Mock-Auth, kein `firebase`-Paket) | **blockiert** |
| 1.7 `untitled.tsx`/`DRAFT_firestore.rules` löschen | existieren nicht; `firestore.rules` fehlte | → neu erstellen |

### Umgesetzt (jeweils mit grünem `vite build` verifiziert)
- **P1.1 — BYOK-Rewire [P0]:** zentraler `utils/geminiClient.ts` (Modul-Singleton:
  `setActiveGeminiKey`/`getGeminiApiKey`/`getGeminiClient`/`mapGeminiError`). Key wird **pro
  aktivem Tenant** aufgelöst (`keyStrategy: shared|byok|metered`) → kein Key im Client-Bundle,
  keine `rules-of-hooks`-Falle. AppContext spiegelt `geminiApiKey` in den Helper. 53 Call-Sites
  in 40 Dateien umgestellt. *(Commit `7f7ba83`)*
- **P1.2 — Modell-Rename [P0]:** `gemini-3-pro-preview` → `gemini-2.5-pro` (37 Dateien);
  Späher (`2.5-flash`)/StatusBericht (`2.5-pro`) unberührt. *(Commit `d540488`)*
- **P1.3 — Code-Splitting [P1]:** `React.lazy` + `<Suspense>` für 48 Seiten + `LoadingScreen`
  (Dark-Luxury). Bundle **1,45 MB → 82 Chunks**. *(Commit `8f5fedb`)*
- **P1.5 — Model-Availability-Guard [P1] (Kern):** `mapGeminiError()` (403/404 →
  nutzerfreundliche Meldung) im Helper; verdrahtet in den modell-kritischen Tools
  **Persona (imagen)** + **Animator (veo)**. Key-Missing wird global freundlich geworfen.
- **P1.7 — `firestore.rules` [P2]:** produktionsreife Regeln neu erstellt (per-User +
  Multi-Tenant-Vorlage für P2.4); aktiv, sobald Firestore verdrahtet ist. Keine verwaisten
  Dateien gefunden.

### Blockiert (eigener Workstream „Firebase-Integration")
- **P1.4 (localStorage → Firestore)** und **P1.6 (signInWithRedirect)** setzen einen Firebase-
  Layer voraus, der im Client **nicht existiert**. Voraussetzung: Firebase-SDK + Config +
  Firestore + Firebase-Auth integrieren — abhängig vom GCP/Firebase-Projekt-Entscheid
  (siehe Mirrou-Blueprint `opus-magnum-project-os.md` §4). **Nicht** als Quickfix gefaket.
- **P1.5 voll (alle 40 Tools):** ausstehender Rollout; Helper steht, kritische Tools verdrahtet.

---

## Konsequenzen
- **Positiv:** Die zwei P0 (Security/BYOK, Modell-Namen) sind behoben → Tools grundsätzlich
  lauffähig. Der **per-Tenant-Key-Helper** macht den späteren Mandanten-SaaS-Pivot (Seite B)
  zur Config- statt Rewrite-Frage (Blueprint §4a).
- **Offen/Risiko:** Persistenz & echte Auth hängen an der Firebase-Integration — diese ist
  Voraussetzung für Multi-Tenant (Phase 2.4) und Deploy (Phase 3).
- **Nächster sinnvoller Schritt:** Entscheidung GCP/Firebase-Projekt (föderieren/fusionieren),
  dann Firebase-Integration (entsperrt P1.4/P1.6/P2.4), parallel Phase 2 (Mirrou-Tenant-Config).
