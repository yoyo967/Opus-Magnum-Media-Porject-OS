import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase-Client-Konfiguration (öffentlich — Firebase-Web-API-Keys sind KEINE
 * Secrets; die Sicherheit liegt in firestore.rules + Auth-Domain).
 * Projekt: studio-4188712377-b3681 (föderiert mit Mirrou).
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyC-Pwwzh3Lr5OOwP7gHGfBzVdoCslr8gcA',
  authDomain: 'studio-4188712377-b3681.firebaseapp.com',
  projectId: 'studio-4188712377-b3681',
  storageBucket: 'studio-4188712377-b3681.firebasestorage.app',
  messagingSenderId: '180023265254',
  appId: '1:180023265254:web:cd43700542641802763827',
  measurementId: 'G-XB1W9GCE82',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

/**
 * EU-Datenresidenz (DSGVO): benannte Firestore-DB in europe-west3 — NICHT die
 * us-central1-Default-DB. Alle App-Daten laufen über `db`.
 */
export const db = getFirestore(firebaseApp, 'opus-eu');
