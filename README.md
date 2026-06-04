<div align="center">
<img width="1200" height="475" alt="OPUS MAGNUM MEDIA — Project OS" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# OPUS MAGNUM MEDIA — Project OS

**KI-gesteuertes Marketing-Betriebssystem** · ~49 spezialisierte Operator-Agenten · Multi-Tenant · EU-first
React 19 + Vite · FastAPI · Firebase/Firestore (`europe-west3`) · Google Gemini (BYOK)

</div>

> **Status (Stand 2026-06-04):** 🟢 produktiv auf GCP Cloud Run · Firebase/Firestore **verdrahtet & live** · Multi-Tenant aktiv · Mirrou = Tenant #1 (Dogfooding). Lead-Pipeline der Mirrou-Website end-to-end verifiziert.

---

## 📖 Inhalt

1. [TL;DR — Briefing für Mensch & KI](#1-tldr--briefing-für-mensch--ki)
2. [Was das ist (gebaut vs. Vision)](#2-was-das-ist-gebaut-vs-vision)
3. [Architektur](#3-architektur)
4. [Auth-Flow & Datenmodell](#4-auth-flow--datenmodell)
5. [Die Operator-Agenten (~49 Tools)](#5-die-operator-agenten-49-tools)
6. [BYOK & Multi-Tenant-Key-Strategie](#6-byok--multi-tenant-key-strategie)
7. [Backend-API-Referenz](#7-backend-api-referenz)
8. [Tech-Stack (verifiziert)](#8-tech-stack-verifiziert)
9. [Repo-Struktur](#9-repo-struktur)
10. [Lokal entwickeln](#10-lokal-entwickeln)
11. [Deployment (GCP Cloud Run)](#11-deployment-gcp-cloud-run)
12. [Secrets & Umgebung](#12-secrets--umgebung)
13. [Sicherheit & DSGVO](#13-sicherheit--dsgvo)
14. [Status, Phasen & Roadmap](#14-status-phasen--roadmap)
15. [Architecture Decision Records (ADRs)](#15-architecture-decision-records-adrs)
16. [Konventionen & Prinzipien](#16-konventionen--prinzipien)
17. [Für KI-Agenten: verbindliches Briefing](#17-für-ki-agenten-verbindliches-briefing)

---

## 1. TL;DR — Briefing für Mensch & KI

| Frage | Antwort |
|---|---|
| **Was ist das?** | Ein **„Project OS"**: ein KI-Cockpit aus ~49 spezialisierten Operator-Agenten (Stratege, Markenwächter, Späher, Baumeister, Auditor, Prometheus …) für professionelles Performance-Marketing. |
| **Für wen?** | Mirrou Creative Studio (= **Tenant #1**, Dogfooding). Später Mandanten-SaaS (Seite B). |
| **Frontend** | React 19 + Vite 6 + TypeScript, **client-seitige SPA**, `@google/genai` (Gemini). State-basiertes Routing (`currentPage`), nur `/portfolio/*` über `react-router-dom`. |
| **Backend** | FastAPI (Python 3.11) auf **GCP Cloud Run** (`europe-west3`). |
| **Daten/Auth** | **Firebase Auth (Custom-Token-Brücke) + Firestore** (`opus-eu` / `europe-west3`). Shared Workspace unter `tenants/{tid}`, private Settings unter `users/{uid}`. |
| **KI-Key** | **BYOK** (Bring Your Own Key), **pro Tenant** aufgelöst (`shared\|byok\|metered`). Nie im Client-Bundle. |
| **Zwei GCP-Projekte** | Backend/Frontend in `opus-magnum-ai` (`923137317598`); Firebase/Firestore in `studio-4188712377-b3681` (`180023265254`). **Föderiert** über Cross-Project-IAM. |
| **Mirrou-Website-Brücke** | Das Kontaktformular der Mirrou-Website postet an `POST /api/lead` → Firestore `tenants/mirrou/leads` (EU). E2E verifiziert 2026-06-04. |
| **Zuerst lesen (KI)** | Diese README → [`docs/adr-1.md`](docs/adr-1.md) … [`docs/adr-4.md`](docs/adr-4.md) → [`utils/geminiClient.ts`](utils/geminiClient.ts) → [`contexts/AppContext.tsx`](contexts/AppContext.tsx) → [`backend/main.py`](backend/main.py) → [`firestore.rules`](firestore.rules). |
| **Eiserne Regeln** | Kein Key im Bundle · EU-Region `europe-west3` · `JWT_SECRET` fail-closed in Prod · „kein Halbfertiges deployen". Siehe [§17](#17-für-ki-agenten-verbindliches-briefing). |

---

## 2. Was das ist (gebaut vs. Vision)

OPUS MAGNUM MEDIA positioniert sich als **Marketing-Operations-Plattform**, die strategische Präzision mit kreativer Exzellenz verbindet — Leitsatz **„Wo Strategie auf Kunst trifft"**. KI verstärkt menschliche Kreativität, ersetzt sie nicht (**Human-in-the-Loop**).

> **Wichtig für eine ehrliche Einschätzung (Reality-Check):** [`VISION.md`](VISION.md) beschreibt die **langfristige Vision** (BigQuery-Marketing-Data-Warehouse, Vertex AI, Imagen/Veo-Vollintegration, Customer-360, agentic Self-Optimization). Das ist **Zielbild, nicht der gebaute Stand**.
>
> **Tatsächlich gebaut und live:** ein client-seitiges **Agenten-Cockpit** (~49 Tools auf `@google/genai`) + **FastAPI-Backend** + **Firestore-EU-Persistenz** + **Multi-Tenant-Auth**. Das BigQuery-/Vertex-/Marketing-Warehouse aus der Vision ist **noch nicht** Teil dieses Repos.

### Mirrou-Beziehung (kanonisch)
Opus Magnum ist Mirrou Studios **Application-Cockpit**. **Mirrou = Tenant #1** (geteilter Team-Key, Dogfooding). Der Mandanten-SaaS (jeder Kunde ein eigener Tenant mit `byok`/`metered`) ist die **spätere Seite B** — harte Sequenzierung: erst Dogfood, dann SaaS öffnen.
Vollständiger Blueprint: [`opus-magnum-project-os.md`](https://github.com/yoyo967/mirrou-creative-studio/blob/main/01_strategie/opus-magnum-project-os.md) (Mirrou-Repo).

---

## 3. Architektur

```
                        ┌──────────────────────────────────────────────────────────┐
                        │  GCP-Projekt  studio-4188712377-b3681  (Nr. 180023265254) │
                        │  ┌────────────────────────────────────────────────────┐  │
   Browser              │  │  Firebase Auth  +  Firestore "opus-eu"             │  │
   ┌──────────────┐     │  │  (europe-west3, DSGVO)                              │  │
   │ React SPA    │     │  │   users/{uid}      → private (API-Key, Profil)      │  │
   │ (Cockpit)    │◀────┼──┤   tenants/{tid}    → shared workspace              │  │
   │ @google/genai│     │  │   tenants/mirrou/leads → Website-Leads             │  │
   └──────┬───────┘     │  └────────────────────────────────────────────────────┘  │
          │             └──────────────────────────────────────────────────────────┘
          │ 1) Login/Register, 2) shared-key, 3) Lead          ▲  signInWithCustomToken
          ▼                                                     │  (request.auth.uid = tenant_id)
   ┌──────────────────────────────────────────────┐            │
   │  FastAPI Backend (Cloud Run, europe-west3)    │────────────┘ prägt Firebase Custom Token
   │  Projekt: opus-magnum-ai (923137317598)       │              (cross-project, firebase-admin)
   │  /api/auth/* · /api/tenant/shared-key         │
   │  /api/lead · /health                          │   Secrets (Secret Manager):
   │  JWT (HS256) · bcrypt · firebase-admin         │   GEMINI_API_KEY=mirrou-gemini-key
   └──────────────────────────────────────────────┘   JWT_SECRET=opus-jwt-secret
          ▲
          │ POST /api/lead  (Kontaktformular)
   ┌──────────────┐
   │ Mirrou-Website│  (separates Repo: mirrou-creative-studio)
   └──────────────┘
```

**Zwei föderierte GCP-Projekte:** Das Backend (SA `923137317598-compute@…`) schreibt **cross-project** in Firestore von `studio-4188712377-b3681` und prägt dort Custom Tokens (benötigt `roles/iam.serviceAccountTokenCreator` + Firestore-Zugriff). Firebase-Web-Config siehe [`services/firebase.ts`](services/firebase.ts).

---

## 4. Auth-Flow & Datenmodell

### Auth-Flow (Backend-Token + Firebase-Custom-Token-Brücke)
1. **Register/Login:** `POST /api/auth/{register,login}` mit `{email, password}` → Credentials in **`accounts/{uid}`** (bcrypt-Hash). **`uid`** = pro Person (sanitierte E-Mail); **`tenant_id`** = `mirrou` für Team-Mails (Allowlist `MIRROU_TEAM_EMAILS`), sonst eigener Tenant. Mitgliedschaft `tenants/{tid}/members/{uid}` + Tenant-Doc werden serverseitig angelegt.
2. Backend antwortet mit: **App-JWT** (HS256, 7 Tage, `JWT_SECRET` aus Secret Manager), `uid`, `tenant_id`, `email` und **`firebaseToken`** (Firebase Custom Token mit der **per-Person-`uid`**, damit private `users/{uid}` nie kollidieren).
3. Client ruft **`signInWithCustomToken(firebaseToken)`** → Firebase Auth → `request.auth.uid == tenant_id` → erfüllt `firestore.rules`.
4. Client liest/schreibt Firestore **direkt** (durch Rules abgesichert): Shared unter `tenants/{tid}`, privat unter `users/{uid}`.
5. **Geteilter Gemini-Key:** `GET /api/tenant/shared-key` (JWT-geschützt) → nur im Client-**Speicher**, nie auf Platte/DB.

### Firestore-Datenmodell (`opus-eu`, `europe-west3`)
| Pfad | Inhalt | Zugriff (Rules) |
|---|---|---|
| `accounts/{uid}` | **Credentials:** email, bcrypt-Hash, `tenant_id` | nur Server (Admin SDK) |
| `users/{uid}` | **privat:** `geminiApiKey` (verschlüsselt), `profile`, `credits` | nur Eigentümer (`request.auth.uid == uid`) |
| `tenants/{tid}` | **shared workspace:** `tasks`, `documents`, `personas`, `systemLogs`, `briefs/{strategy,campaign}` | nur Tenant-Mitglieder |
| `tenants/{tid}/members/{uid}` | Mitgliedschaft (Rolle, Permissions) | lesen: Mitglieder · **schreiben: nur Server (Admin SDK)** |
| `tenants/mirrou/leads/{id}` | Leads der Mirrou-Website | nur Server (Admin SDK) |

**Sync-Muster** ([ADR-3](docs/adr-3.md)): reaktiv via `onSnapshot` + **Local-First Dual-Write** (UI-State synchron für 0 ms Latenz, `setDoc` async im Hintergrund) + **One-Time-Migration** aus `localStorage` beim ersten Login.
**Tenant-Restrukturierung** ([ADR-4](docs/adr-4.md)): shared vs. private getrennt; Mitgliedschaften werden serverseitig erzeugt (Register/Login), weil Rules den Client-Write sperren.

---

## 5. Die Operator-Agenten (~49 Tools)

Jedes Tool ist eine lazy-geladene Seite ([`pages/*.tsx`](pages/), Registry in [`App.tsx`](App.tsx)). Navigation ist **State-basiert** (`currentPage`), nicht URL-basiert. Tenant-spezifische System-Prompts: [`tenants/mirrou/prompts.ts`](tenants/mirrou/prompts.ts).

### Verdrahtete Mirrou-Tenant-Prompts (kanonisch)
| Tool | Rolle | Kern |
|---|---|---|
| **Markenwächter** | Brand Guard | prüft gegen Mirrous Design-System (Onyx/Gold/Ivory, Claim „Algorithm of Soul") + verbotene Floskeln |
| **Späher** | Market Intelligence | D2C Beauty/Health DACH, Creative-Fatigue-Trends, Meta/TikTok-Updates, EU-AI-Act — **Google Search Grounding** |
| **Baumeister** | Creative Brief Engine | Mirrous 5-Schritt-Algorithmus → strukturierte Briefs (Hook-Hypothesen, Format-Specs, KI-Einsatz-Level, HCVO-Check) |
| **Auditor** | Compliance Checker | EU AI Act Art. 50, HCVO Health Claims, DSGVO, C2PA-Kennzeichnung → klare Ja/Nein-Empfehlung |
| **Prometheus** | Growth Strategist | ~2.800 D2C-Brands DACH (10k–150k € Spend), Inbound/Outbound, Qualifizierungs-Score |

> Markenwächter/Späher/Prometheus wurden in P2.2 verdrahtet ([ADR-2](docs/adr-2.md)); **Baumeister** + **Auditor** wurden in Commit `94e1823` von ihrer ursprünglichen Funktion (Seiten-Builder bzw. Live-Audio) auf Creative-Brief-Engine bzw. Compliance-Checker umgebaut.

### Tool-Kategorien (Auswahl — vollständige Liste in [`App.tsx`](App.tsx))
- **Strategie & Wachstum:** `Stratege` (Thinking-Mode), `Prometheus`, `Masterplan`, `Baumeister`, `Orakel`, `Kalkulator`, `Experimentator`, `Sequenzer`, `Taktgeber`, `Resonator`
- **Content & Kreativ:** `Visionär` (Imagen 4 + „Nano Banana"-Editing via Gemini 2.5 Flash Image), `Animator` (Veo-Video), `Persona`, `Kolorit`, `Ensemble`, `Meisterwerk`, `Mediathek` (Video-Understanding)
- **Analyse & Intelligence:** `Analytiker`, `Observatorium`, `Späher`, `Berichterstatter`, `StatusBericht`, `MirrouBenchmarks`, `Nexus` (Gemini Analyse/Edit)
- **Brand & Compliance:** `Markenwächter`, `Auditor`, `BrandingKit`, `Legal`, `SystemAudit`
- **Konversation & Voice:** `Konversator` (Marketing-Chat + Maps-Grounding), `Gesprächsleiter`, `Diplomat`, `Chronist` (Gemini Live API / Voice)
- **E-Mail, Publishing & Kampagnen:** `EmailMarketing`, `Publisher`, `Campaign`, `Conductor`/`Dirigent` (Orchestrierung), `Einreichung`
- **Orchestrierung & System:** `AIOperator`, `InterimManager`, `Akademie`, `Auditorium`, `Personalisator`, `Nexus`, `GrantBook`, `Secret`
- **Portfolio (öffentlich):** `/portfolio/*` — Apex / Pillar / Cluster (SEO-Architektur)

> Eingesetzte Gemini-Fähigkeiten (siehe `FEATURES` in [`constants.tsx`](constants.tsx)): **Gemini 2.5 Pro** (Thinking-Mode), **2.5 Flash / Flash-Lite** (Speed), **Imagen 4** (Bild), **Veo** (Video), **Gemini 2.5 Flash Image** („Nano Banana"-Editing), **Gemini Live API** (Voice), **Google Search & Maps Grounding**.

---

## 6. BYOK & Multi-Tenant-Key-Strategie

Single Source of Truth: [`utils/geminiClient.ts`](utils/geminiClient.ts) (Modul-Singleton, kein React-Hook → in async Handlern aufrufbar).

- `setActiveGeminiKey(key)` — `AppContext` pusht den Key des **aktiven Tenants** hierher.
- `getGeminiClient()` / `getGeminiApiKey()` — wirft `MissingApiKeyError`, wenn kein Key gesetzt ist.
- `mapGeminiError(err)` — **403/404 → „Modell für deinen Key nicht freigeschaltet"** (Model-Availability-Guard, P1.5).

**Key-Strategie pro Tenant** (`keyStrategy` in [`tenants/mirrou/config.ts`](tenants/mirrou/config.ts)):
- `shared` — geteilter Team-Key (Mirrou = Tenant #1). Bezug über `GET /api/tenant/shared-key`.
- `byok` — jeder Mandant hinterlegt eigenen Key (Settings → verschlüsselt in `users/{uid}`).
- `metered` — kostenpflichtige Nutzung über Plattform-Key (späterer SaaS).

**Niemals** ein `process.env.API_KEY` in Tools, **niemals** ein Key im Client-Bundle (`vite.config.ts` enthält bewusst kein `define`).

---

## 7. Backend-API-Referenz

Basis-URL (live): `https://opus-magnum-ai-backend-923137317598.europe-west3.run.app` · Quelle: [`backend/main.py`](backend/main.py)

| Methode | Pfad | Auth | Body / Antwort |
|---|---|---|---|
| `GET` | `/health` | — | `{status, system}` |
| `POST` | `/api/auth/register` | — | `{email,password}` → `{token, uid, tenant_id, email, firebaseToken, status}` (Team-Mail → `tenant_id:"mirrou"`) |
| `POST` | `/api/auth/login` | — | `{email,password}` → `{token, uid, tenant_id, email, firebaseToken}` |
| `GET` | `/api/tenant/shared-key` | **Bearer JWT** | → `{geminiApiKey}` (aus Secret Manager; nur In-Memory beim Client) |
| `POST` | `/api/lead` | — | `{name,email,brand,website?,ad_spend?,message,consent,company_website?}` → `{status,message}` |
| `GET` | `/api/leads` | **JWT · nur Mirrou-Member** | → `{leads:[…], count}` — Lead-Inbox; liest `tenants/mirrou/leads` via Admin SDK. `require_mirrou_member` erzwingt `tenant_id==mirrou` (Fremde → 403). |
| `PATCH` | `/api/leads/{id}` | **JWT · nur Mirrou-Member** | `{status}` ∈ {new,contacted,qualified,won,lost,archived} → setzt Pipeline-Status (+ `updated_at`/`updated_by`) |

**`/api/lead`-Logik:** Honeypot (`company_website` → Spam-Sink, 200), Pflichtfelder + `consent` erzwungen, Schreiben nach `tenants/mirrou/leads` via Admin SDK (`SERVER_TIMESTAMP`, `status:"new"`).
**CORS:** First-Party-Allowlist (`mirrou.studio`, `www`/`app.`, `.web.app`, Cockpit, `localhost`), überschreibbar via `ALLOWED_ORIGINS`-Env. **Rate-Limiting** (slowapi, keyed auf `X-Forwarded-For`): `/api/lead` 10/min · Login 10/min · Register 5/min.

---

## 8. Tech-Stack (verifiziert)

**Frontend** ([`package.json`](package.json)): React `19.2.0` · Vite `^6.2` · TypeScript `~5.8` · `react-router-dom` `^7.9` · `@google/genai` (latest) · `firebase` `^12.14` · `motion` `^12.38` · `lucide-react` `^1.8` · Tailwind via CDN (`index.html`).
**Backend** ([`backend/requirements.txt`](backend/requirements.txt)): FastAPI `≥0.111` · uvicorn · pydantic `≥2` · `google-cloud-firestore` · `firebase-admin` `≥6.5` · `pyjwt` · `passlib[bcrypt]` · `python-multipart` · Python `3.11-slim`.
**Infra:** Docker Multi-Stage (Frontend → `nginx:alpine`, [`Dockerfile`](Dockerfile) + [`nginx.conf`](nginx.conf)) · Backend ([`backend/Dockerfile`](backend/Dockerfile)) · GCP Cloud Run `europe-west3` · Firebase Hosting/Firestore.

---

## 9. Repo-Struktur

```
opus-magnum-media/
├── App.tsx                  # Routing-Registry aller ~49 Tools (lazy) + Layout/Auth-Gate
├── index.tsx / index.html   # Entry + Tailwind-CDN-Setup
├── index.css / constants.tsx# Globale Styles · Icons + FEATURES-Capability-Map
├── pages/                   # 49 Operator-Agenten (je eine Seite) + portfolio/ (Apex/Pillar/Cluster)
├── components/              # ~90 UI-Bausteine (Header, CommandBar, Tool-Teilkomponenten …)
├── contexts/AppContext.tsx  # Globaler State: Auth, Firestore-Sync (onSnapshot), Dual-Write, BYOK
├── utils/geminiClient.ts    # BYOK-Singleton (Key-Auflösung + Fehler-Mapping)
├── services/firebase.ts     # Firebase-Web-Config + Firestore-Handle (DB 'opus-eu')
├── tenants/                 # index.ts (ACTIVE_TENANT) · mirrou/config.ts · mirrou/prompts.ts
├── data/                    # mirrou-benchmarks.ts · portfolio-v2.ts
├── backend/                 # FastAPI: main.py · requirements.txt · Dockerfile
├── firestore.rules          # Sicherheitsregeln (default-deny, per-User + Multi-Tenant)
├── firestore.indexes.json · firebase.json · .firebaserc
├── deploy_backend_gcp.ps1   # Backend-Deploy → Cloud Run (+ Secret-Mounts)
└── docs/adr-1…4.md          # Architecture Decision Records
```

---

## 10. Lokal entwickeln

**Voraussetzung:** Node.js (18+).

```bash
npm install
npm run dev        # Vite Dev-Server  → http://localhost:3000
npm run build      # Produktions-Build → dist/
npm run preview    # gebautes dist/ servieren
```

**Erststart:** Registrieren/Einloggen → in **Settings** den **eigenen Gemini-API-Key** (BYOK) hinterlegen (Tenant `shared` zieht ihn alternativ vom Backend). **Kein** `GEMINI_API_KEY` in `.env` nötig/erwünscht.
Lokal ohne Backend-Credentials läuft die App im Local-First-Modus (Firestore-Writes scheitern sanft; UI bleibt nutzbar).

---

## 11. Deployment (GCP Cloud Run)

Zwei Dienste, beide `europe-west3`, Projekt `opus-magnum-ai` (`923137317598`):

| Dienst | Quelle | URL |
|---|---|---|
| **Frontend** | `Dockerfile` (Vite → `nginx:alpine`) | `opus-magnum-media-v3-…run.app` |
| **Backend** | `backend/` ([`deploy_backend_gcp.ps1`](deploy_backend_gcp.ps1)) | `opus-magnum-ai-backend-…run.app` |

**Backend deployen:**
```powershell
# Einmalig: Secrets in Secret Manager anlegen (siehe deploy_backend_gcp.ps1 Kopf)
#   GEMINI_API_KEY → mirrou-gemini-key   ·   JWT_SECRET → opus-jwt-secret
.\deploy_backend_gcp.ps1     # gcloud run deploy + Secret-Mounts
```
Das Skript mountet `GEMINI_API_KEY` und `JWT_SECRET` aus Secret Manager. **Reihenfolge zwingend:** Secrets + SA-Binding **vor** Deploy — sonst startet der Container nicht (Fail-Closed, siehe §13).

---

## 12. Secrets & Umgebung

| Variable | Quelle | Zweck |
|---|---|---|
| `GEMINI_API_KEY` | Secret Manager `mirrou-gemini-key` | geteilter Gemini-Key (Tenant `shared`) |
| `JWT_SECRET` | Secret Manager `opus-jwt-secret` | JWT-Signing (HS256). **Pflicht in Prod** |
| `FIREBASE_PROJECT_ID` | optional (Default `studio-4188712377-b3681`) | Custom-Token-Minting |
| `MIRROU_TEAM_EMAILS` | optional (Default = die 4 Team-Mails im Code) | Komma-Liste der E-Mails, die den geteilten `mirrou`-Tenant teilen |
| `VITE_API_URL` | [`.env.production`](.env.production) (öffentlich) | Backend-URL fürs Frontend |

**Niemals** echte Secrets committen. Firebase-Web-`apiKey` in `services/firebase.ts` ist **kein** Secret (öffentlicher Client-Identifier; Sicherheit liegt in `firestore.rules`). ⚠️ `.gitignore` deckt `.env*` aktuell **nicht** breit ab (`.env.production` ist absichtlich getrackt, enthält nur die öffentliche URL) — keine echten `.env`-Dateien hinzufügen.

---

## 13. Sicherheit & DSGVO

- **JWT fail-closed:** `JWT_SECRET` wird zur Laufzeit injiziert; **kein hartcodierter Fallback**. In managed Runtimes (Cloud Run `K_SERVICE`) **verweigert das Backend den Start ohne `JWT_SECRET`** ([`backend/main.py`](backend/main.py)). Lokal: ephemerer Per-Prozess-Key.
- **Secret Manager** für `GEMINI_API_KEY` + `JWT_SECRET` (nie im Repo/Bundle).
- **`firestore.rules`:** default-deny; `users/{uid}` owner-only; `tenants/{tid}` member-gated; `members` nur serverseitig schreibbar.
- **EU-Datenresidenz:** Firestore `opus-eu` = **`europe-west3`** (verifiziert), nicht der `us-central1`-Default. Alle PII (Leads, CRM, Keys) bleiben in der EU.
- **EU AI Act:** KI-generierte Assets werden gekennzeichnet (Labeling-Matrix: 100 % KI → „AI-Generated", 60–99 % → „AI-Assisted", <20 % → „Human-Crafted" — siehe `Auditor`).
- ✅ **CORS** auf First-Party-Allowlist eingegrenzt (env-überschreibbar `ALLOWED_ORIGINS`) · ✅ **Rate-Limiting** (slowapi: `/api/lead` 10/min, Login 10/min, Register 5/min). *(Live verifiziert 2026-06-04, Rev `00012-8g9`.)*

---

## 14. Status, Phasen & Roadmap

> **Strategische Roadmap (North Star + L1→L5):** [`docs/ROADMAP.md`](docs/ROADMAP.md) — Entscheidung **Mirrou-first** (erst Tenant #1 perfektionieren, SaaS später). Nächster Sprung: **L2 Kontext-Schicht**.

| Phase | Inhalt | Status |
|---|---|---|
| **1** | Kritische Fixes: BYOK-Helper, Modell-Rename `gemini-2.5-pro`, Code-Splitting (1,45 MB → 82 Chunks), 403/404-Guard, `firestore.rules` | ✅ [ADR-1](docs/adr-1.md) |
| **1.4** | Firestore Reactive Sync (`onSnapshot`), Local-First Dual-Write, One-Time-Migration | ✅ [ADR-3](docs/adr-3.md) |
| **2.1–2.3** | Mirrou-Tenant-Config, Tool-Prompts (5 Tools), Benchmark-Dashboard | ✅ |
| **2.4** | Multi-User Workspace (`tenants/{tid}`), Auto-Tenant-Membership | ✅ [ADR-4](docs/adr-4.md) |
| **3** | Secure Deployment + GCP Secret Manager (`shared-key`-Endpoint) | ✅ |
| **—** | Firebase Custom-Token-Brücke (FE + BE) | ✅ |
| **—** | Mirrou-Website-Lead-Pipeline (`/api/lead` → Firestore EU) **E2E verifiziert** | ✅ 2026-06-04 |
| **—** | Backend-Härtung: CORS-Allowlist + Rate-Limiting | ✅ 2026-06-04 (rev `00012`) |
| **—** | **Lead-Inbox** (v1 View + `GET /api/leads` · v2 Status-Pipeline + `PATCH /api/leads/{id}`) | ✅ 2026-06-04 (BE `00015` / FE `00012`) |
| **—** | **Geteilter Mirrou-Tenant** (Team-Allowlist → 1 Workspace, per-Person-`uid`, `accounts`-Collection) | ✅ 2026-06-04 (BE `00018` / FE `00013`) |
| **—** | Auth-Fix: `bcrypt <4.1` — `register` **und** echtes `login` warfen 500 | ✅ 2026-06-04 |

**Offen / Roadmap:**
- ✅ Backend gehärtet: CORS-Allowlist + Rate-Limiting (Rev `00012-8g9`, 2026-06-04).
- 🟡 Lead-Benachrichtigung (Brevo, EU) + Lead-Inbox-UI (Leads liegen aktuell still in Firestore).
- 🟡 P1.5 Model-Guard auf **alle** ~40 Tools ausrollen (Helper steht, kritische Tools verdrahtet).
- 🔵 SaaS-Seite B: Mandanten-Onboarding, `byok`/`metered`-Pfad, Billing.
- 🔵 Vision-Layer (BigQuery/Vertex/Customer-360) — noch nicht begonnen.

---

## 15. Architecture Decision Records (ADRs)

| ADR | Thema |
|---|---|
| [ADR-1](docs/adr-1.md) | Phase 1: Kritische Fixes & Reality-Check (Brief vs. Realität) |
| [ADR-2](docs/adr-2.md) | Phase 2.1–2.3: Mirrou-Tenant-Config, Tool-Prompts (SoT), Benchmark-Dashboard |
| [ADR-3](docs/adr-3.md) | Phase 1.4: Firestore Reactive Sync & localStorage-Migration |
| [ADR-4](docs/adr-4.md) | Phase 2.4: Multi-User Workspace & Tenant-Restrukturierung |

---

## 16. Konventionen & Prinzipien

- **EU-first / DSGVO:** Datenresidenz `europe-west3`, keine US-only-Services im kritischen Pfad, EU-AI-Act-Kennzeichnung.
- **Maximum Excellence:** „Kein Halbfertiges deployen." Reality-Check gegen echten Code statt gegen (teils veraltete) Annahmen.
- **Content = Single Source of Truth:** Tenant-Config in `tenants/`, Prompts in `tenants/*/prompts.ts` — nicht in Tool-Komponenten hardcoden.
- **Human-in-the-Loop:** KI assistiert, Mensch gibt kritische Schritte frei.

---

## 17. Für KI-Agenten: verbindliches Briefing

> Wenn du eine KI bist, die in diesem Repo arbeitet — **lies diesen Abschnitt zuerst**, dann die in [§1](#1-tldr--briefing-für-mensch--ki) verlinkten Dateien.

**Mentales Modell:** Client-SPA (49 Tools) ⟶ FastAPI (Auth/Lead/Key) ⟶ Firebase Auth + Firestore-EU. Mirrou = Tenant #1. Zwei föderierte GCP-Projekte.

**Invarianten — niemals verletzen:**
1. **Kein API-Key im Client-Bundle.** Keys laufen über [`utils/geminiClient.ts`](utils/geminiClient.ts) (per-Tenant). Kein `process.env.API_KEY` in Tools.
2. **`JWT_SECRET` ist Pflicht in Prod** und kommt aus Secret Manager. Niemals einen hartcodierten Fallback einbauen.
3. **EU-Region `europe-west3`** für alle Daten/Compute. Niemals `us-central1`-Firestore-Default verwenden.
4. **Firestore-Schreibrechte:** `members` + `tenants/mirrou/leads` nur serverseitig (Admin SDK). Client-Writes gehen nur, wo `firestore.rules` es erlauben.
5. **Navigation ist State-basiert** (`currentPage` in `App.tsx`), nicht URL-basiert (Ausnahme `/portfolio/*`). Neue Tools = Eintrag in `App.tsx` + lazy-Import + `pages/<Name>.tsx`.
6. **Tenant-Prompts** gehören in `tenants/<tenant>/prompts.ts`, nicht in die Komponente.
7. **Reality-Check vor Annahmen:** Briefs/Docs können veraltet sein — immer gegen den echten Code verifizieren (siehe ADR-1).

**Wenn du etwas änderst:** `vite build` muss grün sein; Backend-Änderungen erst nach Secret-Setup deployen; relevante ADRs fortschreiben.

---

<div align="center">
<sub>OPUS MAGNUM MEDIA — Project OS · Tenant #1: Mirrou Creative Studio · EU-first · Stand 2026-06-04</sub>
</div>
