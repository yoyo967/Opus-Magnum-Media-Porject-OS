# ADR-2 — Phase 2.1–2.3: Mirrou-Tenant, Tool-Prompts & Benchmarks

- **Datum:** 2026-06-02
- **Status:** akzeptiert · Phase 2.1–2.3 abgeschlossen (2.4 Multi-User folgt nach Firebase)
- **Kontext:** Mirrou als **Tenant #1** im Opus-Magnum-Cockpit (Blueprint §4a). GCP-Projekte
  werden **föderiert** (Entscheidung 2026-06-02). Diese Phase ist client-/statisch und braucht
  Firebase **nicht**.

## Umgesetzt (build-verifiziert)
- **P2.1 — Tenant-Config:** `tenants/mirrou/config.ts` (BRAND Onyx/Gold/Ivory + Fonts + Claim
  „Algorithm of Soul", TEAM Olha/Denys/Ralph/Yahya, ICP D2C Beauty/Health/White-Label,
  10–150k€, DACH, Creative Fatigue, `keyStrategy: 'shared'`). `tenants/index.ts` exportiert
  `ACTIVE_TENANT` (bis Multi-Tenant-Auflösung via Firebase, P2.4).
- **P2.2 — Tool-System-Prompts:** kanonische SoT `tenants/mirrou/prompts.ts` (alle 5 Prompts).
  Als `systemInstruction` verdrahtet in die **3 funktional passenden** Tools:
  **Markenwächter** (Brand Guard, inkl. Verbotsliste), **Späher** (Market Intelligence,
  Search Grounding), **Prometheus** (Growth Strategist).
- **P2.3 — Benchmark-Dashboard:** `data/mirrou-benchmarks.ts` (echte Meta-Werte aus
  `benchmark-library.md`; TikTok/Google + **QFC-Spalte vorbereitet**) + `pages/MirrouBenchmarks.tsx`
  (Dark-Luxury-Tabelle) + Route in `App.tsx` (`mirroubenchmarks`, eigener Lazy-Chunk).

## Reality-Check (wichtig)
Das Tool-Mapping des Briefs passt **nur teilweise** zur echten Tool-Funktion:
- ✅ Markenwächter (Brand-Check), Späher (Recon/Search), Prometheus (Strategie) — passen, verdrahtet.
- ⛔ **Baumeister** baut real Seiten/JSX-**Code** (kein „Creative Brief Engine") · **Auditor**
  ist eine **Live-Audio-Session** (kein „Compliance Checker"). Ihre Mirrou-Umwidmung würde die
  bestehende Funktion brechen → **eigene Design-Aufgabe** (Tool umbauen/neu anlegen), **kein**
  Prompt-Inject. Prompts liegen in der SoT bereit.

## Konsequenzen
- Das Cockpit ist jetzt **als Mirrou-Tenant konfiguriert** (Brand/Team/ICP zentral) + 3 Agenten
  Mirrou-spezifisch. Sichtbarer, build-grüner Fortschritt ohne Firebase-Abhängigkeit.
- Offen: P2.4 (Multi-User/Tenant-Rules) braucht Firebase (gated). Baumeister/Auditor-Umwidmung
  = separate Aufgabe. Tenant-Branding im UI (Farben/Fonts global anwenden) als Folgeschritt.
