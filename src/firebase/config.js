// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const STORAGE_KEY = 'portfolio_firebase_custom_config';

const clean = (val) => (typeof val === 'string' ? val.trim() : val);

/**
 * Retrieves Firebase credentials either from runtime config (Admin UI)
 * or Vite environment variables.
 */
export function getFirebaseCredentials() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return {
          config: {
            apiKey: clean(parsed.apiKey),
            authDomain: clean(parsed.authDomain),
            projectId: clean(parsed.projectId),
            storageBucket: clean(parsed.storageBucket),
            messagingSenderId: clean(parsed.messagingSenderId),
            appId: clean(parsed.appId),
          },
          source: 'custom',
        };
      }
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config from localStorage:', e);
  }

  const envConfig = {
    apiKey: clean(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: clean(import.meta.env.VITE_FIREBASE_APP_ID),
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return { config: envConfig, source: 'env' };
  }

  return { config: null, source: 'none' };
}

let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;

export function initFirebase() {
  const { config } = getFirebaseCredentials();

  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, storage: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    return {
      app: firebaseApp,
      db: firestoreDb,
      storage: firebaseStorage,
      isConfigured: true,
    };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, db: null, storage: null, isConfigured: false, error };
  }
}

export function saveCustomFirebaseConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Re-initialize
    return initFirebase();
  } catch (e) {
    console.error('Error saving custom Firebase config:', e);
    return { isConfigured: false, error: e };
  }
}

export function clearCustomFirebaseConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    firebaseApp = null;
    firestoreDb = null;
    firebaseStorage = null;
  } catch (e) {
    console.error('Error clearing Firebase config:', e);
  }
}

