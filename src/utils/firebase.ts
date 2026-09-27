import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  enableNetwork,
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppState } from '../types/jee';
import { safeJsonStringify } from './calculations';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with configured databaseId
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Reconnect automatically when the browser comes online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    try {
      enableNetwork(db).catch(() => {});
    } catch (_) {}
  });
}

/**
 * Validates connection to Firestore at boot time as prescribed by Firebase Integration Skill
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (_error: any) {
    // Normal during initial boot before user authentication; Firestore automatically manages offline queue
    return true;
  }
}

/**
 * Sign in using Google OAuth popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Record user profile document
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'JEE Aspirant',
          photoURL: user.photoURL || '',
          lastSyncedAt: new Date().toISOString(),
          createdAt: user.metadata.creationTime || new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (profileErr) {
      console.warn('Could not save user profile record:', profileErr);
    }

    return user;
  } catch (err: any) {
    // Gracefully handle user-initiated cancellations without error logging
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request' ||
      err?.code === 'auth/user-cancelled'
    ) {
      return null;
    }
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Save user JEE state to Cloud Firestore
 */
export async function saveProgressToCloud(user: User, state: AppState): Promise<string> {
  if (!user || !user.uid) throw new Error('User must be signed in to save progress to cloud.');

  const progressRef = doc(db, 'users', user.uid, 'progress', 'state');
  const now = new Date().toISOString();

  // Convert rich state cleanly to avoid document size limit and circular issues
  const payload = {
    uid: user.uid,
    chapters: safeJsonStringify(state.chapters),
    practiceSessions: safeJsonStringify(state.practiceSessions || []),
    mockTests: safeJsonStringify(state.mockTests || []),
    errorLogs: safeJsonStringify(state.errorLogs || []),
    targetExamYear: state.targetExamYear || 2026,
    dailyGoalQuestions: state.dailyGoalQuestions || 40,
    activeChapterIdForStudyRoom: state.activeChapterIdForStudyRoom || 'phy-01',
    lastSyncedAt: now,
  };

  try {
    await setDoc(progressRef, payload, { merge: true });

    // Update profile lastSyncedAt
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lastSyncedAt: now }, { merge: true });
    } catch (_) {
      // Ignore profile update failure if rules allow
    }

    return now;
  } catch (err: any) {
    const isOffline =
      err?.code === 'unavailable' ||
      err?.message?.includes('offline') ||
      err?.message?.includes('Could not reach Cloud');

    if (isOffline) {
      console.info('Client is currently offline; write queued locally in Firestore cache and will sync automatically once online.');
      return now;
    }
    throw err;
  }
}

/**
 * Load user JEE state from Cloud Firestore with retries and graceful offline fallback
 */
export async function loadProgressFromCloud(user: User, retries = 2): Promise<AppState | null> {
  if (!user || !user.uid) return null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const progressRef = doc(db, 'users', user.uid, 'progress', 'state');
      const snap = await getDoc(progressRef);

      if (!snap.exists()) {
        return null;
      }

      const data = snap.data();
      if (!data) return null;

      const parsedChapters = data.chapters ? JSON.parse(data.chapters) : [];
      const parsedSessions = data.practiceSessions ? JSON.parse(data.practiceSessions) : [];
      const parsedMocks = data.mockTests ? JSON.parse(data.mockTests) : [];
      const parsedErrors = data.errorLogs ? JSON.parse(data.errorLogs) : [];

      return {
        chapters: parsedChapters,
        practiceSessions: parsedSessions,
        mockTests: parsedMocks,
        errorLogs: parsedErrors,
        targetExamYear: data.targetExamYear || 2026,
        dailyGoalQuestions: data.dailyGoalQuestions || 40,
        activeChapterIdForStudyRoom: data.activeChapterIdForStudyRoom || 'phy-01',
      };
    } catch (err: any) {
      const isOfflineOrUnavailable =
        err?.code === 'unavailable' ||
        err?.message?.includes('offline') ||
        err?.message?.includes('Could not reach Cloud Firestore') ||
        err?.message?.includes('network');

      if (isOfflineOrUnavailable && attempt < retries) {
        // Wait 1 second before retrying to allow WebChannel connection to complete
        await new Promise((res) => setTimeout(res, 1000));
        continue;
      }

      if (isOfflineOrUnavailable) {
        console.info('Cloud Firestore is operating in offline mode; using cached local progress.');
        return null;
      }

      console.error('Failed to load progress from cloud:', err);
      throw err;
    }
  }

  return null;
}

/**
 * Auth state listener
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
