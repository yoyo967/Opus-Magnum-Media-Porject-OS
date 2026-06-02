# ADR-3 — Phase 1.4: Firestore Reactive Sync & Local Storage Migration

- **Datum:** 2026-06-02
- **Status:** akzeptiert · Phase 1.4 abgeschlossen
- **Kontext:** Integration des Firebase/Firestore-Layers in den Client. Migration der lokalen Sandbox-Daten aus dem `localStorage` des Webbrowsers in die sichere, verschlüsselte Firestore-Datenbank (`opus-eu` in `europe-west3`) für authentifizierte Workspace-Nutzer.

---

## Entscheidungen

### 1. Reaktive Echtzeit-Synchronisierung (`onSnapshot`)
Wir nutzen Firebase's `onSnapshot`-Listener, um den Client-State (`tasks`, `documents`, `personas`, `logs`) direkt bei jeder Datenbank-Änderung reaktiv zu aktualisieren. Dies hält das Application-Cockpit auch bei parallelen Team-Zugriffen (Multi-User, Phase 2.4) immer synchron.

### 2. Lokale Latenzfreiheit & Dual-Writing
Um die Latenz beim Erstellen/Ändern von Einträgen auf 0 ms zu halten, setzen wir ein lokales First-Muster um:
- Die UI-Aktionen (wie `addTask` oder `updateTask`) aktualisieren den React-State **synchron** für eine sofortige visuelle Rückmeldung.
- Ein asynchroner Hintergrund-Prozess (`setDoc`) schreibt den neuen Zustand parallel verschlüsselt nach Firestore (Dual-Writing).

### 3. One-Time Migrations-Assistent
Damit Bestandsnutzer beim Übergang von der lokalen Sandbox zur Cloud keine Stände verlieren, wurde ein Migrations-Assistent in einem `useEffect`-Hook verankert.
Beim ersten Login nach dem Deploy:
- Prüft die Anwendung, ob die Firestore-Collections des Nutzers leer sind.
- Falls ja, werden vorhandene `localStorage`-Objekte (`opus_tasks`, `opus_documents`, `opus_personas` und API-Einstellungen) gelesen und per transaktionalem `writeBatch` gebündelt in Firestore importiert.

### 4. API-Key-Sicherung (BYOK)
Der API-Schlüssel des Nutzers (`geminiApiKey`) wird nun ebenfalls verschlüsselt im Root-Dokument `users/{uid}` in Firestore abgelegt. Dadurch entfällt das manuelle Hinterlegen auf neuen Geräten des gleichen Nutzers.

---

## Konsequenzen

- **Latenzfreie UX:** Keine Lade-Verzögerung für den Nutzer durch asynchrones Hintergrund-Firestore-Writing.
- **Konsistenz:** Durch reaktives `onSnapshot` ist die Anwendung startklar für Multi-User-Kollaboration.
- **Haftungs- & DSGVO-Sicherheit:** Alle CRM-, Lead- und API-Daten liegen verschlüsselt in Frankfurt (`europe-west3`) unter Einhaltung der strengen Datensicherheitsregeln.
