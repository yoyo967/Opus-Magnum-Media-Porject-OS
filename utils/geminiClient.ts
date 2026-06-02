import { GoogleGenAI } from '@google/genai';

/**
 * Zentrale Gemini-Client-Auflösung (BYOK).
 *
 * Single Source of Truth für den aktiven API-Key. AppContext pusht den Key des
 * AKTIVEN TENANTS hierher (per-Tenant `keyStrategy`: 'shared' | 'byok' | 'metered' —
 * siehe 01_strategie/opus-magnum-project-os.md §4a). Kein Key im Client-Bundle,
 * kein `process.env.API_KEY` mehr in den Tools.
 *
 * Modul-Singleton statt React-Hook → in async Handlern aufrufbar ohne
 * rules-of-hooks-Verletzung.
 */

let _apiKey: string | null = null;

/** Von AppContext aufgerufen, sobald sich der (Tenant-)Key ändert. */
export function setActiveGeminiKey(key: string | null): void {
  _apiKey = key;
}

export class MissingApiKeyError extends Error {
  constructor() {
    super('Gemini API Key missing. Please provide it in Settings.');
    this.name = 'MissingApiKeyError';
  }
}

/** Roh-Key (z. B. für Video-Download-URLs). Wirft, wenn kein Key gesetzt ist. */
export function getGeminiApiKey(): string {
  if (!_apiKey) throw new MissingApiKeyError();
  return _apiKey;
}

/** Konfigurierter Client. Wirft MissingApiKeyError, wenn kein Key gesetzt ist. */
export function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}

/**
 * P1.5 — Model-Availability-Guard: mappt Fehler auf eine nutzerfreundliche Meldung.
 * 403/404 = Modell für diesen Key nicht freigeschaltet.
 */
export function mapGeminiError(err: unknown): string {
  const e = err as { status?: number; code?: number; message?: string; response?: { status?: number } };
  const status = e?.status ?? e?.code ?? e?.response?.status;
  if (status === 403 || status === 404) {
    return 'Dieses Modell ist für deinen API-Key nicht freigeschaltet. Aktiviere den Zugang unter aistudio.google.com.';
  }
  if (err instanceof MissingApiKeyError || /API Key missing/i.test(e?.message ?? '')) {
    return 'Kein Gemini-API-Key hinterlegt. Bitte in den Einstellungen eintragen.';
  }
  return e?.message ?? 'Unbekannter Fehler bei der KI-Anfrage.';
}
