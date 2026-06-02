# ADR-4 — Phase 2.4: Multi-User Workspace & Tenant-Restrukturierung

- **Datum:** 2026-06-02
- **Status:** akzeptiert · Phase 2.4 abgeschlossen
- **Kontext:** Restrukturierung des Firestore-Datenmodells zur Unterstützung von teamübergreifender Echtzeit-Kollaboration (Multi-User Workspace, Phase 2.4 des Mission Briefs) sowie die automatische Erstellung von Tenant-Mitgliedschaften im FastAPI-Backend.

---

## Entscheidungen

### 1. Trennung von geteilten Workspaces und privaten Konfigurationen
Um ein kollaboratives Cockpit zu ermöglichen, haben wir die Firestore-Struktur geteilt:
- **Shared Workspace (Tenant-Ebene):** Sämtliche operativen Daten (`tasks`, `documents`, `personas` und `systemLogs`) wurden von dem privaten Pfad `users/{uid}/` auf den mandantenbasierten Pfad `tenants/{tenantId}/` verschoben.
- **Private Settings (User-Ebene):** Individuelle und sensible Schlüssel sowie nutzerspezifische Konfigurationen (`geminiApiKey`, `profile`, `credits`) verbleiben unter `users/{uid}/` und sind nur für den jeweiligen Nutzer zugänglich.

### 2. Dynamischer Strategy- & Campaign-Brief Sync
Die Strategie- und Kampagnenentwürfe (`strategyBrief` und `campaignBrief`) wurden ebenfalls in den Firestore-Echtzeitsync aufgenommen.
- Speicherpfad: `tenants/{tenantId}/briefs/strategy` bzw. `tenants/{tenantId}/briefs/campaign`.
- Die UI-Komponenten interagieren über einen dual-write Wrapper (`changeStrategyBrief` und `changeCampaignBrief`), der Änderungen synchron im UI spiegelt und asynchron im Hintergrund nach Firestore schreibt.

### 3. Automatische Tenant-Mitgliedschaft (Backend-Level)
Da die clientseitige Schreibberechtigung auf `/tenants/{tid}/members/{uid}` aus Sicherheitsgründen in den Firestore Rules gesperrt ist, übernimmt das FastAPI-Backend nun die Pflicht:
- **Bei Registrierung:** Erstellt direkt den Mitgliedschaftseintrag unter `tenants/{tenantId}/members/{userId}` (Rolle: Owner, Permissions: all).
- **Bei Login:** Prüft, ob der Eintrag bereits existiert (für Alt-Accounts aus früheren Phasen) und erzeugt ihn andernfalls nachträglich (Abwärtskompatibilität).
Dies schließt die Sicherheitslücke, da die Firestore Rules einen Nutzertransaktions-Check (`isTenantMember`) gegen diesen Pfad erzwingen.

---

## Konsequenzen

- **Echte Team-Kollaboration:** Mehrere Nutzer, die sich denselben Tenant teilen, sehen, erstellen und bearbeiten Tasks, Dokumente und Personas in Echtzeit.
- **Sicherheits-Konformität:** Da sensible API-Schlüssel (BYOK) isoliert unter `users/{uid}/` liegen, können Teammitglieder im selben Workspace operieren, ohne gegenseitig ihre API-Keys einsehen zu müssen.
- **Datenintegrität:** Der Migrations-Assistent überträgt Sandbox-Daten des Erstnutzers nahtlos auf die neuen Tenant-Pfade, ohne Datenverlust zu verursachen.
