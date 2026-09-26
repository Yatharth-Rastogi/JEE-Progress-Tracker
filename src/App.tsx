import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Play, Edit3, Trophy, 
  Settings as SettingsIcon, Sparkles, PlusCircle, CheckCircle2,
  ChevronRight, Brain, Flame
} from 'lucide-react';
import { AppState, Chapter, PracticeSession, MockTest, ErrorLogEntry } from './types/jee';
import { MASTER_SYLLABUS, INITIAL_APP_STATE, getSampleDemonstrationData, mergeLoadedChaptersWithMaster } from './data/syllabus';
import { calculateMasteryPercent, safeJsonStringify } from './utils/calculations';
import { getValidVideoUrlForChapter, isKnownInvalidUrl } from './data/curatedVideos';

// Components
import { Dashboard } from './components/Dashboard';
import { MasterChapterTracker } from './components/MasterChapterTracker';
import { YouTubeTracker } from './components/YouTubeTracker';
import { PracticeView } from './components/PracticeView';
import { PracticeLoggerModal } from './components/PracticeLoggerModal';
import { MockTestsAndErrorLog } from './components/MockTestsAndErrorLog';
import { SettingsAndBackup } from './components/SettingsAndBackup';

const STORAGE_KEY = 'jee_mastery_tracker_state_v2';

export default function App() {
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
            activeChapterIdForStudyRoom: parsed.activeChapterIdForStudyRoom || 'chem-16',
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, safeJsonStringify(appState));
    } catch (e: any) {
      console.warn('Failed to save state to localStorage:', e?.message || String(e));
    }
  }, [appState]);

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
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: `Master Syllabus (${appState.chapters.length})`, icon: BookOpen },
    { name: 'YouTube Study Room', icon: Play },
    { name: 'Practice & PYQs', icon: Edit3 },
    { name: 'Mock Tests & Errors', icon: Trophy },
    { name: 'Settings & Backup', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-base">
              JEE
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>Mastery Tracker</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Main & Adv
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                {appState.chapters.length}-Chapter Syllabus • Theory & Guess Analysis
              </p>
            </div>
          </div>

          {/* Quick Stats & Quick Action Button */}
          <div className="flex items-center gap-3">
            {/* Syllabus Mastery Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400">Mastery:</span>
              <span className="font-bold text-cyan-400">{totalMasteryAverage}%</span>
              <div className="w-12 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${totalMasteryAverage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleOpenQuickLogModal()}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Practice</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900/60 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-slate-900 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>JEE Main & Advanced Mastery Tracker • Offline & LocalStorage Powered</span>
          <span className="text-slate-600">Mastery = 30% Theory + 30% Basic Acc + 40% PYQ Acc</span>
        </div>
      </footer>
    </div>
  );
}
