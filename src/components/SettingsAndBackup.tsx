import React, { useRef, useState } from 'react';
import { 
  Download, Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle, 
  Settings, Database, Sparkles, Shield, HardDrive, Target
} from 'lucide-react';
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
}

export const SettingsAndBackup: React.FC<SettingsAndBackupProps> = ({
  appState,
  onRestoreState,
  onLoadSampleData,
  onResetData,
  onUpdateDailyGoal,
  onUpdateTargetYear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>System & Local Storage</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Data Persistence</h1>
        <p className="text-slate-400 text-xs mt-1">
          All data is automatically preserved in your browser's private <code className="text-cyan-300">localStorage</code>. Export backups regularly to safeguard your progress across devices.
        </p>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Target Settings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          JEE Target Goals & Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Target JEE Year</label>
            <select
              value={appState.targetExamYear || 2026}
              onChange={(e) => onUpdateTargetYear(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono"
            >
              <option value={2025}>JEE 2025 (Final Push)</option>
              <option value={2026}>JEE 2026 (Target Batch)</option>
              <option value={2027}>JEE 2027 (Foundation / 11th)</option>
            </select>
            <p className="text-[11px] text-slate-500">Aligns revision intervals with exam schedule.</p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Daily Question Practice Target</label>
            <input
              type="number"
              min="10"
              max="200"
              step="5"
              value={appState.dailyGoalQuestions || 40}
              onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value) || 40)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500">Recommended: 35-50 high-yield questions/day.</p>
          </div>
        </div>
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Backup / Export Data (JSON)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your complete syllabus progress, timestamps, practice history, mock tests, and mistake notebook as a single portable JSON file.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON Backup
          </button>
        </div>

        {/* Import Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 w-fit">
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
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            Select JSON File to Restore
          </button>
        </div>
      </div>

      {/* Preset Data & Reset Danger Zone */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-400" />
          Data Management & Demo Utilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Load Sample Demo Data */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Load Realistic Demo Data
              </div>
              <p className="text-xs text-slate-400">
                Instantly populate sample practice logs, 220+ mock test scores, video tracking timestamps, and mistake logs to test all dashboards.
              </p>
            </div>
            <button
              onClick={onLoadSampleData}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Demo Data
            </button>
          </div>

          {/* Reset All Data */}
          <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Reset Everything to Fresh Syllabus
              </div>
              <p className="text-xs text-slate-400">
                Clears all practice logs, mock tests, and error notebooks, resetting all chapters to 0% fresh state.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="py-2 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-lg border border-rose-800/80 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All Progress
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Reset All Progress?</h3>
              <p className="text-xs text-slate-400">
                This will wipe out all recorded PYQ solves, mock tests, and bookmarks. This action cannot be undone unless you export a JSON backup first.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                  showNotification('success', 'Reset complete. Started fresh comprehensive syllabus.');
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/20"
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
