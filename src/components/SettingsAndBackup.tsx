import React, { useRef, useState } from 'react';
import { 
  Download, Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle, 
  Settings, Database, Sparkles, Shield, HardDrive, Target, Cloud, CloudUpload, LogOut, ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppState } from '../types/jee';
import { safeJsonStringify } from '../utils/calculations';
import { getValidVideoUrlForChapter } from '../data/curatedVideos';
import { mergeLoadedChaptersWithMaster } from '../data/syllabus';

interface SettingsAndBackupProps {
  appState: AppState;
  onRestoreState: (newState: AppState) => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
  onUpdateDailyGoal: (goal: number) => void;
  onUpdateTargetYear: (year: number) => void;
  user?: User | null;
  isSyncing?: boolean;
  lastSyncedAt?: string | null;
  onSignInWithGoogle?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}

export const SettingsAndBackup: React.FC<SettingsAndBackupProps> = ({
  appState,
  onRestoreState,
  onLoadSampleData,
  onResetData,
  onUpdateDailyGoal,
  onUpdateTargetYear,
  user,
  isSyncing,
  lastSyncedAt,
  onSignInWithGoogle,
  onSignOut,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isCloudActionLoading, setIsCloudActionLoading] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMsg(text);
      setErrorMsg(null);
    } else {
      setErrorMsg(text);
      setSuccessMsg(null);
    }
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 4000);
  };

  // Export JSON
  const handleExportJson = () => {
    try {
      const dataStr = safeJsonStringify(appState, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `jee_mastery_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('success', 'Backup exported successfully!');
    } catch (err) {
      showNotification('error', 'Failed to generate JSON backup.');
    }
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as AppState;

        // Basic schema validation
        if (!parsed.chapters || !Array.isArray(parsed.chapters) || parsed.chapters.length === 0) {
          throw new Error('Invalid JSON format: chapters array missing or empty.');
        }

        // Auto-heal any chapters, ensure 100% unique IDs, and merge with master syllabus
        const mergedChapters = mergeLoadedChaptersWithMaster(parsed.chapters);
        const healedState: AppState = {
          ...parsed,
          chapters: mergedChapters,
          practiceSessions: parsed.practiceSessions || [],
          mockTests: parsed.mockTests || [],
          errorLogs: parsed.errorLogs || [],
        };

        onRestoreState(healedState);
        showNotification('success', `Restored ${mergedChapters.length} chapters and history successfully!`);
      } catch (err: any) {
        showNotification('error', `Failed to restore file: ${err.message || 'Invalid JSON format'}`);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Cloud Persistence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Settings & Data Persistence</h1>
        <p className="text-slate-400 text-xs mt-0.5">
          All progress is preserved in your browser's private <code className="text-cyan-300 font-mono">localStorage</code> and continuously auto-synced with Google Cloud.
        </p>

        {successMsg && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-rose-200">
                  {errorMsg.includes('unauthorized-domain') 
                    ? 'Domain Not Authorized in Firebase' 
                    : errorMsg}
                </span>
                {errorMsg.includes('unauthorized-domain') && (
                  <div className="text-[11px] text-slate-300 leading-relaxed space-y-1.5 pt-1">
                    <p>
                      Your app is hosted on a custom domain or GitHub Pages (<code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-[10px]">{typeof window !== 'undefined' ? window.location.hostname : 'custom-domain'}</code>) which needs to be added to Firebase Authorized Domains.
                    </p>
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.08] text-slate-300 font-mono text-[10px] space-y-1">
                      <div>1. Open <a href="https://console.firebase.google.com/project/gen-lang-client-0161368789/authentication/settings" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Firebase Console &gt; Authentication &gt; Settings</a></div>
                      <div>2. Click on the <strong>Authorized domains</strong> tab</div>
                      <div>3. Click <strong>Add domain</strong> &amp; enter: <span className="text-amber-300 font-bold">{typeof window !== 'undefined' ? window.location.hostname : 'yatharth-rastogi.github.io'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Settings Card */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <span>JEE Target Goals & Configuration</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Target JEE Year</label>
            <select
              value={appState.targetExamYear || 2026}
              onChange={(e) => onUpdateTargetYear(parseInt(e.target.value))}
              className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value={2025}>JEE 2025 (Final Push)</option>
              <option value={2026}>JEE 2026 (Target Batch)</option>
              <option value={2027}>JEE 2027 (Foundation / 11th)</option>
            </select>
            <p className="text-[11px] text-slate-500">Aligns revision intervals with exam schedule.</p>
          </div>

          <div className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Daily Question Target</label>
            <input
              type="number"
              min="10"
              max="200"
              step="5"
              value={appState.dailyGoalQuestions || 40}
              onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value) || 40)}
              className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-500">Recommended: 35-50 high-yield questions/day.</p>
          </div>
        </div>
      </div>

      {/* Google Cloud Backup (Firebase Firestore) Card */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Google Cloud Automatic Backup</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 font-semibold">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically saves your entire 67-chapter syllabus, PYQ solve metrics, and test logs to Cloud Firestore.
              </p>
            </div>
          </div>

          {/* Connect / User Status */}
          <div className="shrink-0">
            {!user ? (
              <button
                onClick={async () => {
                  if (onSignInWithGoogle && !isCloudActionLoading) {
                    try {
                      setIsCloudActionLoading(true);
                      await onSignInWithGoogle();
                    } catch (e: any) {
                      if (
                        e?.code !== 'auth/popup-closed-by-user' &&
                        e?.code !== 'auth/cancelled-popup-request'
                      ) {
                        showNotification('error', e?.message || 'Failed to sign in with Google');
                      }
                    } finally {
                      setIsCloudActionLoading(false);
                    }
                  }
                }}
                disabled={isCloudActionLoading}
                className="w-full sm:w-auto px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-white font-medium text-xs rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{isCloudActionLoading ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (onSignOut) {
                      try {
                        await onSignOut();
                        showNotification('success', 'Signed out of Google account.');
                      } catch (e: any) {
                        showNotification('error', 'Sign out failed');
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-white/[0.04] hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* When connected: show account badge + sync operations */}
        {user ? (
          <div className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google Account'}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-1 ring-white/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    <span className="truncate">{user.displayName || 'Google Account'}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">{user.email}</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block">Cloud Status:</span>
                <span className="text-xs font-mono text-emerald-400 font-medium flex items-center sm:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSyncing ? 'Syncing...' : 'Auto-Sync Active'}</span>
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Automatic Live Cloud Synchronization</span>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed">
                Every change you make (updating syllabus progress, ticking lectures, adding PYQ sessions, error notes, or mock exams) is <strong className="text-emerald-400 font-medium">automatically saved to Cloud Firestore</strong> after every update.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you ever clear browser cookies, lose device storage, or log in from a new computer with this same Google account, your data is <strong className="text-cyan-400 font-medium">restored automatically</strong> upon signing in.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs text-slate-400 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Sign in with your Google account to enable auto-cloud synchronization. Your progress is tied securely to your Google UID and will automatically restore whenever you sign in.
            </span>
          </div>
        )}
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Export Data */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Backup / Export Data (JSON)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your complete syllabus progress, timestamps, practice history, mock tests, and mistake notebook as a single portable JSON file.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export JSON Backup</span>
          </button>
        </div>

        {/* Import Data */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Restore / Import Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restore previously saved data from another computer, incognito session, or backup file. Existing data will be safely replaced.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-xs rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Select JSON File to Restore</span>
          </button>
        </div>
      </div>

      {/* Preset Data & Reset Danger Zone */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          Data Management & Demo Utilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
          {/* Load Sample Demo Data */}
          <div className="p-4 bg-slate-950/50 border border-white/[0.06] rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Load Realistic Demo Data
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Instantly populate sample practice logs, 220+ mock test scores, video tracking timestamps, and mistake logs to test all dashboards.
              </p>
            </div>
            <button
              onClick={onLoadSampleData}
              className="py-2 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-medium rounded-lg border border-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Demo Data
            </button>
          </div>

          {/* Reset All Data */}
          <div className="p-4 bg-slate-950/50 border border-rose-500/15 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Reset Everything to Fresh Syllabus
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Clears all practice logs, mock tests, and error notebooks, resetting all chapters to 0% fresh state.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All Progress
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0c1220] border border-white/[0.1] rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">Reset All Progress?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will wipe out all recorded PYQ solves, mock tests, and bookmarks. This action cannot be undone unless you export a JSON backup first.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                  showNotification('success', 'Reset complete. Started fresh comprehensive syllabus.');
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/20 transition-all"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
