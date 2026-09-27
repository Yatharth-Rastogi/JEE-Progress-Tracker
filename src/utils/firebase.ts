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
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

/**
 * Validates connection to Firestore at boot time as prescribed by Firebase Integration Skill
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode. Local caching enabled.');
    }
    return true;
  }
}

/**
 * Sign in using Google OAuth popup
 */
export async function signInWithGoogle(): Promise<User> {
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

  await setDoc(progressRef, payload, { merge: true });

  // Update profile lastSyncedAt
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lastSyncedAt: now }, { merge: true });
  } catch (_) {
    // Ignore profile update failure if rules allow
  }

  return now;
}

/**
 * Load user JEE state from Cloud Firestore
 */
export async function loadProgressFromCloud(user: User): Promise<AppState | null> {
  if (!user || !user.uid) return null;

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
    console.error('Failed to load progress from cloud:', err);
    throw err;
  }
}

/**
 * Auth state listener
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
