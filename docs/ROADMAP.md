# OPUS MAGNUM — Project OS · North Star & Leveling-Roadmap

> **Status:** kanonisch · v1 (2026-06-04)
> **Strategische Entscheidung:** **Mirrou-first** — erst Mirrou (Tenant #1) perfektionieren; Mandanten-SaaS bewusst später (decision-gated).
> **Prinzip:** Jede Stufe muss *echt* sein, bevor die nächste kommt (OPUS-PRIME: „kein Halbfertiges deployen").

---

## North Star
**Opus Magnum ist das Betriebssystem, das Mirrous Studio führt** — Strategie → Kreation → Performance → Reporting → Kundenkommunikation, ausgeführt von KI-Agenten, die auf Mirrous eigenem Wissen & echten Daten gründen, mit dem Menschen am Steuer. Erst an Mirrou bewiesen, dann (später) als SaaS für andere D2C-Teams.

**Nicht** das Ziel: mehr Tools. **Das** Ziel: aus ~49 Einzel-Prompts **ein denkendes System** machen — messbar schneller/besser als eine klassische Agentur, bei voller EU-/Markenkonformität.

## Ehrliche Ausgangslage (L1)
Heute = **Werkzeugkasten aus Prompts**: jedes Tool = eine Seite + ein single-shot Gemini-Prompt, isoliert. Es *sieht* aus wie ein OS, aber die Tools kennen Mirrou nicht, teilen kein Gedächtnis, verketten sich nicht und grounden nicht auf echten Daten. Genau diese **verbindende Schicht (Intelligenz + Logik)** ist die Reise.

## Reifegrade

| Level | Was | Status |
|---|---|---|
| **L1 — Toolbox** | Auth, geteilter Mirrou-Tenant, EU-Datenlayer, Deploy, Lead-Loop, Security (JWT/CORS/Rate-Limit) | ✅ erledigt |
| **L2 — Kontext-Schicht** | kanonische **Mirrou Knowledge Base** (Brand/ICP/Benchmarks/Angebot/Voice/Gewinner-Outputs); **jedes Tool grundet automatisch** darauf | 🎯 **als Nächstes** |
| **L3 — Orchestrierung** | CommandBar (kann schon Function-Calling) → echter Orchestrator: liest Workspace, **verkettet Tools**; 1–2 echte **Playbooks** | geplant |
| **L4 — Proaktiv + Lernend** | Trigger (Lead rein → Auto-Entwurf, Mensch gibt frei) + Feedback-Loop (was gewinnt → zurück in die KB) | Vision |
| **L5 — Autonome Frontier Firm + SaaS** | OS fährt Kern-Ops mit Mensch-Checkpoints; an Mirrou bewiesen → Mandanten-SaaS (`byok`/`metered`) | decision-gated |

## Querschnitt-Tracks (parallel, keine Stufen)
- **EU/DSGVO-Reife:** AI-Studio-Key → **Vertex AI europe-west** beim Ernstfall (Datenresidenz); EU-AI-Act-Labeling (Auditor) in *jeden* Creative-Output.
- **Vertrauen/Security:** `/api/leads` auf mirrou-Member einschränken; Audit-Trail (GitHub-OS).
- **Qualität statt Menge:** die ~49 Tools überlappen → **konsolidieren** auf ein kohärentes Set, Totes entfernen.

## Reihenfolge (Mirrou-first)
1. **Haus sauber:** kleine offene TODOs (`/api/leads`-Restriktion, Mobile-Perf, Impressum-Anschrift, optional Brevo-Lead-Mail).
2. **L2 Kontext-Schicht** — der große Sprung; macht alle Tools sofort „Mirrou-aware".
3. **L3** mit *einem* echten Mirrou-Playbook (z. B. *Lead → Qualifizieren → Creative Brief → Konzept → Compliance-Check*).
4. **L4** Trigger/Feedback für genau diesen Loop.
5. **L5 / SaaS** — erst wenn Mirrou-Betrieb nachweislich getragen wird.

## Definition of „nächstes Level erreicht"
- **L2 erreicht**, wenn ein beliebiges Tool ohne manuelles Reinpasten markenkonforme, ICP-passende, datengestützte Outputs liefert.
- **L3 erreicht**, wenn *ein* End-to-End-Playbook real durchläuft (Mensch nur als Checkpoint).

## Die Falle
Fortschritt an Tool-Zahl messen oder direkt L5 (`VISION.md`-Hype) jagen. Ohne L2-Kontext sind „Agenten" nur teure Prompts.

---

*Schwesterdokument zur [README](../README.md) (§14 Status) und zum Mirrou-Blueprint `01_strategie/opus-magnum-project-os.md`. Fortschreiben bei jedem Level-Schritt.*
