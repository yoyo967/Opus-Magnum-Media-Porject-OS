# Mirrou Operating Model — das Project OS *als* Mirrou Studio betreiben

> **Status:** kanonisch · v1 (2026-06-05)
> **Zweck:** Wie Mirrou Creative Studio (Tenant #1) das Opus-Magnum Project OS *operativ* nutzt — Mirrous echte Wertschöpfungskette auf Agenten-Ketten abgebildet, nicht „49 Einzel-Tools".
> Schwesterdokument zu [`ROADMAP.md`](ROADMAP.md) (L2/L3) und dem Mirrou-Blueprint `01_strategie/opus-magnum-project-os.md`.

## Leitgedanke
Mirrou ist ein **AI-natives Performance-Creative-Studio** (D2C Beauty/Health, DACH, 10–150k € Spend). Kernproblem der Kunden: **Creative Fatigue**. Mirrous 5-Schritt-Algorithmus: **Creative Audit → Visual Brief → Hybrid Execution → Performance Layer → Data Feedback Loop.**
→ Das OS „ist Mirrou Studio", wenn genau diese Kette von Agenten ausgeführt wird — geerdet auf Mirrous Wissen, mit dem Menschen am Steuer.

---

## 1. Agenten-Katalog (⭐ = bereits Mirrou-geerdet/-Prompt)

**Strategie & Intelligence:** Prometheus⭐ (Growth) · Späher⭐ (Market Intel, Search Grounding) · Stratege · Dirigent · Orakel · Masterplan
**Kreation & Content (Kern):** Baumeister⭐ (Brief Engine) · Visionär (Imagen) · Animator (Veo) · Persona · Kolorit · Resonator · Personalisator · Meisterwerk (Board) · Ensemble
**Marke & Compliance:** Markenwächter⭐ (Brand Guard) · Auditor⭐ (EU AI Act/HCVO) · BrandingKit
**Analyse & Reporting:** Analytiker · Experimentator · Berichterstatter · Kalkulator · MirrouBenchmarks⭐ · Observatorium · SystemAudit · StatusBericht · Nexus
**CRM, Kommunikation & Leads:** Lead Inbox⭐ · Chronist (CRM) · Diplomat · Gesprächsleiter · Konversator · EmailMarketing
**Orchestrierung & Distribution:** Conductor · Sequenzer · Taktgeber · Publisher · Auditorium · AIOperator/CommandBar (⌘K)
**System/Meta:** Akademie · GrantBook · InterimManager · Mediathek · Campaign · Einreichung · Secret/AURORA

---

## 2. Mirrou Operating Playbooks (die Agenten-Ketten)

### ▶ Playbook 1 — Lead → Kunde (Akquise)
`Lead Inbox` → `Späher` (Brand des Leads recherchieren) → `Prometheus` (qualifizieren + Growth-Plan) → `Diplomat` (Outreach) → `Chronist` (CRM) → bei Win: `Stratege` (Kampagnen-Strategie)

### ▶ Playbook 2 — Creative Production (Mirrous Kern) 🎯
`Baumeister` (Creative Brief, 5-Schritt) → `Visionär` + `Animator` (Assets) → `Markenwächter` (Brand-Check) → `Auditor` (EU-AI-Act/HCVO + Labeling) → `Resonator`/`Publisher` (kanalgerecht ausspielen) → `Analytiker` + `MirrouBenchmarks` (messen) → Feedback zurück in den Brief

### ▶ Playbook 3 — Studio-Ops & Reporting
`Meisterwerk` (Tasks) · `Dirigent` (Status) · `Berichterstatter` (Kunden-Reports) · `Kalkulator` (Budget) · `SystemAudit` (Selbst-Zustand) · `Observatorium` (Mission Control)

### ▶ Playbook 4 — Nurturing & E-Mail (sobald Brevo + Domain stehen)
`Sequenzer` (Drip) → `EmailMarketing` (Gemini-Inhalt) → **Brevo** (Versand, EU)

---

## 3. Team-Rollen → Playbook-Ownership (aus `tenants/mirrou/config.ts`)
| Person | Rolle | Owner von |
|---|---|---|
| **Olha** | Creative Director | Playbook 2 (Baumeister, Visionär, Animator, Persona, Kolorit, Markenwächter, Auditor, Auditorium) |
| **Denys** | Performance & Analytics | Analytiker, Experimentator, MirrouBenchmarks, Berichterstatter, Orakel, Kalkulator |
| **Ralph** | CRM & Client Success | Playbook 1+4 (Lead Inbox, Chronist, Diplomat, Gesprächsleiter, Taktgeber, Sequenzer, EmailMarketing) |
| **Yahya** | Growth & Architektur | Prometheus, Späher, Stratege, Conductor, AIOperator, Publisher/Resonator, System/Audit |

---

## 4. Agenten-Triage (Vorschlag — „Qualität statt Menge")
- **Core (erden + verketten):** Baumeister, Visionär, Animator, Markenwächter, Auditor, Prometheus, Späher, Stratege, Analytiker, MirrouBenchmarks, Lead Inbox, Resonator, Diplomat, Persona, Berichterstatter.
- **Supporting (behalten):** Meisterwerk, Dirigent, Kalkulator, Chronist, Publisher, Sequenzer, EmailMarketing, Konversator, Observatorium, SystemAudit, Kolorit, Personalisator.
- **Trim / Merge-Kandidaten (entscheiden):**
  - `SystemAudit` + `StatusBericht` → **zu einem** zusammenführen (beide = Diagnose).
  - `Konversator` / `Gesprächsleiter` / `Diplomat` → Überlappung „KI-Kommunikation" → ggf. konsolidieren.
  - `Secret/AURORA`, `GrantBook`, `Einreichung`, `Akademie`, `Mediathek` → für den Mirrou-Betrieb nicht Kern → ausblenden/zurückstellen.

---

## 5. Der Weg (an die Roadmap gekoppelt)
1. **L2-Rollout:** restliche Core-Agenten auf die Mirrou-KB (`tenants/mirrou/knowledge.ts` + `buildMirrouContext`) erden — heute nur 3 (Baumeister, Prometheus, Markenwächter) + 2 mit Prompt (Späher, Auditor).
2. **L3-Verkettung:** Playbooks über `Conductor`/CommandBar ausführbar machen (Output→nächstes Tool; Keim sind die `OutputActions`).
3. **Trimmen:** Triage (§4) umsetzen.
4. **Branding + Rollen:** Mirrou-Skin (Onyx/Gold/Ivory/Cormorant) global; Agenten den Rollen (§3) zuordnen.

## ⚠️ Design-Entscheidung: Mirrou-Methode vs. Mirrou-eigene-Marke vs. Kunden-Marke
Die Mirrou-KB mischt zwei Ebenen, die unterschiedlich breit gelten:
- **(a) Methode & Compliance & Markt** (5-Schritt-Algorithmus, HCVO/EU-AI-Act-Labeling, ICP, Benchmarks) → gilt für **jede** Arbeit, auch Kundenprojekte. **Immer an.**
- **(b) Mirrous *eigene* Markenidentität** (Voice, Onyx/Gold/Ivory, Verbotsliste) → gilt **nur** für *Mirrous eigene* Inhalte; bei **Kundenarbeit** muss die **Kunden-Marke** rein.

**Folge:** Reasoning/Strategie/Compliance-Agenten breit erden (a). Marken-/Asset-erzeugende Agenten (Copy, Bild, Video) NICHT blind mit Mirrous Marke erden — sonst werden Kunden-Deliverables „mirrou-isiert". Für echte Kundenarbeit: **Multi-Brand-Schicht** — Methode immer an, „aktive Marke" pro Projekt wählbar (Mirrou als Default). → das ist der saubere Pfad Richtung SaaS (Seite B).

## Definition of „Mirrou Studio läuft auf dem OS"
**Playbook 2 läuft end-to-end:** ein Brief → markenkonforme, compliance-geprüfte Assets → ausgespielt → gemessen, alle Schritte Mirrou-geerdet, Mensch nur als Checkpoint.
