<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OPUS MAGNUM MEDIA — Project OS

KI-gesteuertes Marketing-Betriebssystem („Project OS") mit einem Ökosystem aus ~40
spezialisierten Operator-Agenten (Stratege, Visionär, Analytiker, Markenwächter,
Berichterstatter …), Portfolio, Admin & Email-Marketing.

- **Frontend:** React 19 + Vite + TypeScript (SPA, `react-router-dom`) · `@google/genai` (Gemini)
- **Backend:** FastAPI (Python) auf GCP Cloud Run (`europe-west3`) · Docker + nginx
- **Auth/Daten (Stand jetzt):** localStorage + Mock-Auth — **Firebase/Firestore noch nicht
  verdrahtet** (geplant, siehe ADR-1)
- **API-Key:** **BYOK** (Bring Your Own Key) — der Gemini-Key wird vom Nutzer in den
  Einstellungen hinterlegt, **nie** im Client-Bundle. Auflösung zentral über
  [`utils/geminiClient.ts`](utils/geminiClient.ts), **pro Tenant** (`shared|byok|metered`).

## Status

**Mirrou-Integration läuft** — Opus Magnum wird Mirrou Studios Application-Cockpit
(Mirrou = Tenant #1; Mandanten-SaaS als spätere Seite B). Architektur:
[`opus-magnum-project-os.md`](https://github.com/yoyo967/mirrou-creative-studio/blob/main/01_strategie/opus-magnum-project-os.md) (Mirrou-Repo).

**Phase 1 (Kritische Fixes) — abgeschlossen, soweit ohne Firebase möglich** → [`docs/adr-1.md`](docs/adr-1.md):
- ✅ BYOK über zentralen Helper (kein Key im Bundle) · ✅ Modell-Namen `gemini-2.5-pro`
- ✅ Code-Splitting `React.lazy` (1,45 MB → 82 Chunks) · ✅ 403/404-Guard (kritische Tools)
- ✅ `firestore.rules` (per-User + Multi-Tenant) · ⛔ Firestore-Migration & Redirect-Login
  **blockiert** bis Firebase integriert ist

## Lokal starten

**Voraussetzungen:** Node.js

```bash
npm install
npm run dev          # Dev-Server (Port 3000)
npm run build        # Produktions-Build → dist/
```

Beim ersten Start: einloggen und den **eigenen Gemini-API-Key** in den Einstellungen
hinterlegen (BYOK). Kein `GEMINI_API_KEY` in `.env` nötig/erwünscht.

## Prinzipien (EU-first)

EU-Datenresidenz (`europe-west3`), keine US-only-Services im kritischen Pfad,
EU-AI-Act-Kennzeichnung KI-generierter Assets, kein Server-Key im Client. „Maximum
Excellence — kein Halbfertiges deployen."
