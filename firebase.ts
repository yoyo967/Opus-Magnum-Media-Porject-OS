
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Konfiguration basierend auf deinen Projekt-Details
const firebaseConfig = {
  apiKey: "AIzaSyC-Pwwzh3Lr5OOwP7gHGfBzVdoCslr8gcA", // Dein API Key
  authDomain: "studio-4188712377-b3681.firebaseapp.com", // Standard Pattern für Auth Domain
  projectId: "studio-4188712377-b3681", // Deine Projekt ID
  storageBucket: "studio-4188712377-b3681.firebasestorage.app", // Standard Pattern
  messagingSenderId: "180023265254", // Deine Projektnummer
  appId: "1:180023265254:web:cd43700542641802763827" // Deine App ID aus dem Screenshot
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (Safe initialization)
let analytics: any = null;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics failed to initialize. This is expected in some restricted environments.", e);
}
export { analytics };

// Initialize Messaging (Only supported in secure contexts)
let messaging: any = null;
try {
    messaging = getMessaging(app);
} catch (e) {
    console.warn("Firebase Messaging failed to initialize. This is expected if running on HTTP (not HTTPS).");
}

export { messaging };

// Helper to request permission and get token
export const requestNotificationPermission = async () => {
    if (!messaging) return null;
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: 'BOs61AJ4uBfvrE_m1YpXwogJqbT43aTFHucorcPtkpq5A6mf3cJF7fwZ-5KbCfZKo0Mfx1LyKPsps7o6L6lhVO8'
            });
            console.log('Notification token:', token);
            return token;
        } else {
            console.log('Unable to get permission to notify.');
            return null;
        }
    } catch (error) {
        console.error('Error getting notification token:', error);
        return null;
    }
};
