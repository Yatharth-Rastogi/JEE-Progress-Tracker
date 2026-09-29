import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Play, Edit3, Trophy, 
  Settings as SettingsIcon, Sparkles, PlusCircle, CheckCircle2,
  ChevronRight, Brain, Flame
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppState, Chapter, PracticeSession, MockTest, ErrorLogEntry } from './types/jee';
import { MASTER_SYLLABUS, INITIAL_APP_STATE, getSampleDemonstrationData, mergeLoadedChaptersWithMaster } from './data/syllabus';
import { calculateMasteryPercent, safeJsonStringify } from './utils/calculations';
import { getValidVideoUrlForChapter, isKnownInvalidUrl } from './data/curatedVideos';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  saveProgressToCloud, 
  loadProgressFromCloud, 
  subscribeToAuth, 
  validateFirestoreConnection 
} from './utils/firebase';

// Components
import { Dashboard } from './components/Dashboard';
import { MasterChapterTracker } from './components/MasterChapterTracker';
import { YouTubeTracker } from './components/YouTubeTracker';
import { PracticeView } from './components/PracticeView';
import { PracticeLoggerModal } from './components/PracticeLoggerModal';
import { MockTestsAndErrorLog } from './components/MockTestsAndErrorLog';
import { SettingsAndBackup } from './components/SettingsAndBackup';
import { AuthSyncHeader } from './components/AuthSyncHeader';

const STORAGE_KEY = 'jee_mastery_tracker_state_v2';

export default function App() {
  // User Authentication & Cloud Sync State
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [cloudNotification, setCloudNotification] = useState<string | null>(null);
  const isInitialCloudLoadDone = useRef(false);

  // Load state from localStorage or initialize with sample/default
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        if (parsed.chapters && Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
          // Auto-heal, upgrade priorities, and safely merge any newly added syllabus chapters with 100% unique IDs
          const mergedChapters = mergeLoadedChaptersWithMaster(parsed.chapters);

          return {
            ...parsed,
            chapters: mergedChapters,
            practiceSessions: parsed.practiceSessions || [],
            mockTests: parsed.mockTests || [],
            errorLogs: parsed.errorLogs || [],
            activeChapterIdForStudyRoom: parsed.activeChapterIdForStudyRoom || 'phy-01',
          };
        }
      }
    } catch (e: any) {
      console.warn('Failed to load saved state from localStorage:', e?.message || String(e));
    }
    // Return realistic initial data so the user immediately experiences the full value
    return getSampleDemonstrationData();
  });

  // Current Active Tab: 0 = Dashboard, 1 = Master Tracker, 2 = YouTube Study Room, 3 = Practice, 4 = Mocks & Error, 5 = Settings
  const [activeTab, setActiveTab] = useState<number>(0);

  // Quick Log Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [modalTargetChapterId, setModalTargetChapterId] = useState<string | undefined>(undefined);

  // Helper function to restore user data from Cloud Firestore automatically
  const restoreUserDataFromCloud = async (firebaseUser: User) => {
    try {
      setIsSyncing(true);
      const cloudData = await loadProgressFromCloud(firebaseUser);
      if (cloudData && cloudData.chapters && cloudData.chapters.length > 0) {
        const merged = mergeLoadedChaptersWithMaster(cloudData.chapters);
        const restoredState: AppState = {
          ...cloudData,
          chapters: merged,
          practiceSessions: cloudData.practiceSessions || [],
          mockTests: cloudData.mockTests || [],
          errorLogs: cloudData.errorLogs || [],
          activeChapterIdForStudyRoom: cloudData.activeChapterIdForStudyRoom || 'phy-01',
        };
        setAppState(restoredState);
        setLastSyncedAt(new Date().toISOString());
        setSyncError(null);
        setCloudNotification(`Welcome back, ${firebaseUser.displayName || 'Aspirant'}! Your progress was automatically restored from Google Cloud.`);
      } else {
        // First-time sync or using local data: persist to cloud
        try {
          const time = await saveProgressToCloud(firebaseUser, appState);
          setLastSyncedAt(time);
          setSyncError(null);
          setCloudNotification('Cloud sync connected! All changes will now be automatically saved to Google Cloud.');
        } catch (_) {}
      }
    } catch (err: any) {
      console.info('Auto cloud restore note:', err?.message || err);
      const isOffline =
        err?.message?.includes('offline') ||
        err?.code === 'unavailable' ||
        err?.message?.includes('Could not reach Cloud Firestore');
      if (!isOffline) {
        setSyncError(err?.message || 'Sync failed');
      }
    } finally {
      setIsSyncing(false);
      isInitialCloudLoadDone.current = true;
    }
  };

  // Subscribe to Firebase Auth and automatically restore data upon sign-in/page reload
  useEffect(() => {
    validateFirestoreConnection();
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && !isInitialCloudLoadDone.current) {
        await restoreUserDataFromCloud(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, safeJsonStringify(appState));
    } catch (e: any) {
      console.warn('Failed to save state to localStorage:', e?.message || String(e));
    }
  }, [appState]);

  // Debounced auto-sync to Cloud Firestore after every single change to appState
  useEffect(() => {
    if (!user || !isInitialCloudLoadDone.current) return;

    const timer = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const time = await saveProgressToCloud(user, appState);
        setLastSyncedAt(time);
        setSyncError(null);
      } catch (err: any) {
        console.warn('Auto cloud sync failed:', err);
        setSyncError(err?.message || 'Auto sync failed');
      } finally {
        setIsSyncing(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [appState, user]);

  // Handlers for Cloud Auth
  const handleSignIn = async () => {
    try {
      setIsSyncing(true);
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
        await restoreUserDataFromCloud(loggedInUser);
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        setSyncError(err?.message || 'Sign in failed');
        throw err;
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    isInitialCloudLoadDone.current = false;
    setCloudNotification('Signed out of Google account. Local progress remains safe on this device.');
  };

  // Update a single chapter's properties
  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    setAppState((prev) => {
      const updatedChapters = prev.chapters.map((ch) => {
        if (ch.id === chapterId) {
          return { ...ch, ...updates, lastUpdated: new Date().toISOString() };
        }
        return ch;
      });
      return { ...prev, chapters: updatedChapters };
    });
  };

  // Open YouTube Study Room for specific chapter
  const handleOpenStudyRoom = (chapterId: string) => {
    setAppState((prev) => ({ ...prev, activeChapterIdForStudyRoom: chapterId }));
    setActiveTab(2); // Switch to YouTube Study Room
  };

  // Open Quick Log Modal
  const handleOpenQuickLogModal = (chapterId?: string) => {
    setModalTargetChapterId(chapterId);
    setIsLogModalOpen(true);
  };

  // Save new Practice Session and increment cumulative stats
  const handleSavePracticeSession = (sessionData: Omit<PracticeSession, 'id' | 'createdAt'>) => {
    const newSession: PracticeSession = {
      ...sessionData,
      id: 'session-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => {
      // Update cumulative values on the target chapter
      const updatedChapters = prev.chapters.map((ch) => {
        if (ch.id === sessionData.chapterId) {
          if (sessionData.type === 'PYQ Practice') {
            return {
              ...ch,
              pyqAttempted: (ch.pyqAttempted || 0) + sessionData.attempted,
              pyqCorrect: (ch.pyqCorrect || 0) + sessionData.correct,
              genuineSolves: (ch.genuineSolves || 0) + sessionData.genuineSolves,
              guessAttempts: (ch.guessAttempts || 0) + (sessionData.guessCorrect + sessionData.guessWrong),
              guessCorrect: (ch.guessCorrect || 0) + sessionData.guessCorrect,
              guessWrong: (ch.guessWrong || 0) + sessionData.guessWrong,
              lastUpdated: new Date().toISOString(),
            };
          } else {
            return {
              ...ch,
              basicAttempted: (ch.basicAttempted || 0) + sessionData.attempted,
              basicCorrect: (ch.basicCorrect || 0) + sessionData.correct,
              lastUpdated: new Date().toISOString(),
            };
          }
        }
        return ch;
      });

      return {
        ...prev,
        chapters: updatedChapters,
        practiceSessions: [newSession, ...prev.practiceSessions],
      };
    });
  };

  // Delete Practice Session with rollback
  const handleDeletePracticeSession = (sessionId: string) => {
    setAppState((prev) => {
      const targetSession = prev.practiceSessions.find((s) => s.id === sessionId);
      if (!targetSession) return prev;

      const updatedChapters = prev.chapters.map((ch) => {
        if (ch.id === targetSession.chapterId) {
          if (targetSession.type === 'PYQ Practice') {
            return {
              ...ch,
              pyqAttempted: Math.max(0, (ch.pyqAttempted || 0) - targetSession.attempted),
              pyqCorrect: Math.max(0, (ch.pyqCorrect || 0) - targetSession.correct),
              genuineSolves: Math.max(0, (ch.genuineSolves || 0) - targetSession.genuineSolves),
              guessAttempts: Math.max(0, (ch.guessAttempts || 0) - (targetSession.guessCorrect + targetSession.guessWrong)),
              guessCorrect: Math.max(0, (ch.guessCorrect || 0) - targetSession.guessCorrect),
              guessWrong: Math.max(0, (ch.guessWrong || 0) - targetSession.guessWrong),
            };
          } else {
            return {
              ...ch,
              basicAttempted: Math.max(0, (ch.basicAttempted || 0) - targetSession.attempted),
              basicCorrect: Math.max(0, (ch.basicCorrect || 0) - targetSession.correct),
            };
          }
        }
        return ch;
      });

      return {
        ...prev,
        chapters: updatedChapters,
        practiceSessions: prev.practiceSessions.filter((s) => s.id !== sessionId),
      };
    });
  };

  // Add Mock Test
  const handleAddMockTest = (mockData: Omit<MockTest, 'id' | 'createdAt'>) => {
    const newTest: MockTest = {
      ...mockData,
      id: 'mock-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      mockTests: [newTest, ...prev.mockTests],
    }));
  };

  // Delete Mock Test
  const handleDeleteMockTest = (testId: string) => {
    setAppState((prev) => ({
      ...prev,
      mockTests: prev.mockTests.filter((m) => m.id !== testId),
    }));
  };

  // Add Error Log Entry
  const handleAddErrorLog = (errorData: Omit<ErrorLogEntry, 'id' | 'loggedAt'>) => {
    const newEntry: ErrorLogEntry = {
      ...errorData,
      id: 'err-' + Date.now(),
      loggedAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      errorLogs: [newEntry, ...prev.errorLogs],
    }));
  };

  // Toggle Error Resolved
  const handleToggleErrorResolved = (entryId: string) => {
    setAppState((prev) => ({
      ...prev,
      errorLogs: prev.errorLogs.map((e) =>
        e.id === entryId ? { ...e, resolved: !e.resolved } : e
      ),
    }));
  };

  // Delete Error Log
  const handleDeleteErrorLog = (entryId: string) => {
    setAppState((prev) => ({
      ...prev,
      errorLogs: prev.errorLogs.filter((e) => e.id !== entryId),
    }));
  };

  // Restore State from JSON
  const handleRestoreState = (newState: AppState) => {
    setAppState(newState);
  };

  // Load realistic sample data
  const handleLoadSampleData = () => {
    const sample = getSampleDemonstrationData();
    setAppState(sample);
  };

  // Reset all to fresh syllabus
  const handleResetData = () => {
    setAppState({
      ...INITIAL_APP_STATE,
      chapters: JSON.parse(JSON.stringify(MASTER_SYLLABUS)),
    });
  };

  // Overall syllabus mastery quick percentage
  const totalMasteryAverage = Math.round(
    appState.chapters.reduce((acc, c) => acc + calculateMasteryPercent(c), 0) /
      (appState.chapters.length || 1)
  );

  const tabs = [
    { name: 'Dashboard', shortName: 'Dashboard', icon: LayoutDashboard },
    { name: `Master Syllabus (${appState.chapters.length})`, shortName: `Syllabus (${appState.chapters.length})`, icon: BookOpen },
    { name: 'YouTube Study Room', shortName: 'Study Room', icon: Play },
    { name: 'Practice & PYQs', shortName: 'Practice', icon: Edit3 },
    { name: 'Mock Tests & Errors', shortName: 'Tests & Errors', icon: Trophy },
    { name: 'Settings & Backup', shortName: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-slate-950 font-black text-xs sm:text-sm tracking-tight shrink-0 ring-1 ring-white/20">
              JEE
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                  Mastery Engine
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block truncate">
                {appState.chapters.length}-Chapter Precision Tracking • PYQs & Guess Analysis
              </p>
            </div>
          </div>

          {/* Quick Stats, Cloud Sync & Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Syllabus Mastery Pill - hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-white/[0.08] px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Mastery:</span>
              <span className="font-bold text-cyan-400">{totalMasteryAverage}%</span>
              <div className="w-10 sm:w-14 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${totalMasteryAverage}%` }}
                />
              </div>
            </div>

            {/* Quick Log PYQ Button */}
            <button
              onClick={() => handleOpenQuickLogModal()}
              className="px-2.5 sm:px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-cyan-500/25 transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Log PYQ</span>
              <span className="sm:hidden">Log</span>
            </button>

            {/* Google Account & Cloud Backup Component */}
            <AuthSyncHeader
              user={user}
              isSyncing={isSyncing}
              lastSyncedAt={lastSyncedAt}
              syncError={syncError}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
            />
          </div>
        </div>

        {/* Tab Navigation Bar - Sleek minimal horizontal scroll with indicator */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-white/[0.05] overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-1.5 py-1.5 min-w-max" aria-label="Tabs">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-white/[0.08] text-cyan-300 font-semibold shadow-inner border border-white/[0.08]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.name}</span>
                  <span className="md:hidden">{tab.shortName}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Cloud Auto-Restore / Notification Banner */}
      {cloudNotification && (
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-cyan-950/70 border-b border-cyan-500/20 px-3 sm:px-4 py-2 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-cyan-200">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-medium truncate">{cloudNotification}</span>
            </div>
            <button
              onClick={() => setCloudNotification(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-[11px] shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Tab 0: Dashboard */}
        {activeTab === 0 && (
          <Dashboard
            chapters={appState.chapters}
            practiceSessions={appState.practiceSessions}
            mockTests={appState.mockTests}
            onOpenStudyRoom={handleOpenStudyRoom}
            onOpenQuickLogModal={handleOpenQuickLogModal}
            onNavigateTab={setActiveTab}
            onUpdateChapter={handleUpdateChapter}
          />
        )}

        {/* Tab 1: Master Chapter Tracker */}
        {activeTab === 1 && (
          <MasterChapterTracker
            chapters={appState.chapters}
            onUpdateChapter={handleUpdateChapter}
            onOpenStudyRoom={handleOpenStudyRoom}
            onOpenQuickLogModal={handleOpenQuickLogModal}
          />
        )}

        {/* Tab 2: YouTube Study Room */}
        {activeTab === 2 && (
          <YouTubeTracker
            chapters={appState.chapters}
            activeChapterId={appState.activeChapterIdForStudyRoom || 'phy-02'}
            onSelectChapter={(id) => {
              setAppState((prev) => ({ ...prev, activeChapterIdForStudyRoom: id }));
            }}
            onUpdateChapter={handleUpdateChapter}
          />
        )}

        {/* Tab 3: Practice & PYQ Logger */}
        {activeTab === 3 && (
          <PracticeView
            practiceSessions={appState.practiceSessions}
            onOpenLogModal={() => handleOpenQuickLogModal()}
            onDeleteSession={handleDeletePracticeSession}
          />
        )}

        {/* Tab 4: Mock Tests & Error Log */}
        {activeTab === 4 && (
          <MockTestsAndErrorLog
            chapters={appState.chapters}
            mockTests={appState.mockTests}
            errorLogs={appState.errorLogs}
            onAddMockTest={handleAddMockTest}
            onDeleteMockTest={handleDeleteMockTest}
            onAddErrorLog={handleAddErrorLog}
            onToggleErrorResolved={handleToggleErrorResolved}
            onDeleteErrorLog={handleDeleteErrorLog}
          />
        )}

        {/* Tab 5: Settings & Backup */}
        {activeTab === 5 && (
          <SettingsAndBackup
            appState={appState}
            onRestoreState={handleRestoreState}
            onLoadSampleData={handleLoadSampleData}
            onResetData={handleResetData}
            onUpdateDailyGoal={(goal) => setAppState((prev) => ({ ...prev, dailyGoalQuestions: goal }))}
            onUpdateTargetYear={(year) => setAppState((prev) => ({ ...prev, targetExamYear: year }))}
            user={user}
            isSyncing={isSyncing}
            lastSyncedAt={lastSyncedAt}
            onSignInWithGoogle={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Global Quick Practice Logger Modal */}
      <PracticeLoggerModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        chapters={appState.chapters}
        defaultChapterId={modalTargetChapterId}
        onSaveSession={handleSavePracticeSession}
      />

      {/* Minimalist Footer */}
      <footer className="border-t border-white/[0.06] bg-[#080c14]/90 py-5 text-center text-[11px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>JEE Main & Advanced Mastery Engine • Cloud Synced & Offline Ready</span>
          </div>
          <span className="text-slate-600">Formula: 30% Theory + 30% Basic Acc + 40% PYQ Acc</span>
        </div>
      </footer>
    </div>
  );
}
