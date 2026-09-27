import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LogOut, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthSyncHeaderProps {
  user: User | null;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const AuthSyncHeader: React.FC<AuthSyncHeaderProps> = ({
  user,
  isSyncing,
  lastSyncedAt,
  syncError,
  onSignIn,
  onSignOut,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignInClick = async () => {
    try {
      setIsSigningIn(true);
      await onSignIn();
    } catch (e: any) {
      console.error('Sign-in error:', e);
    } finally {
      setIsSigningIn(false);
    }
  };

  const formatLastSync = (isoString: string | null) => {
    if (!isoString) return 'Pending sync';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Synced';
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleSignInClick}
        disabled={isSigningIn}
        title="Sign in with Google to automatically backup & sync your JEE progress in Cloud"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-slate-200 hover:text-white border border-white/[0.08] hover:border-cyan-500/50 rounded-xl text-xs font-medium transition-all shadow-sm shrink-0"
      >
        {/* Google 4-Color 'G' SVG */}
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="hidden sm:inline">
          {isSigningIn ? 'Connecting...' : 'Backup with Google'}
        </span>
        <span className="sm:hidden text-[11px]">
          {isSigningIn ? '...' : 'Sign In'}
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1.5 sm:gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl p-1 pr-2 sm:pr-2.5 transition-all text-left shadow-sm active:scale-95"
        title="Google Account & Cloud Auto-Sync"
      >
        {/* User Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}

        <div className="hidden lg:block max-w-[90px] truncate font-medium text-xs text-slate-200">
          {user.displayName || user.email?.split('@')[0]}
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          {isSyncing ? (
            <span className="text-cyan-400 flex items-center gap-1 font-medium">
              <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
              <span className="hidden sm:inline">Syncing...</span>
            </span>
          ) : syncError ? (
            <span className="text-amber-400 flex items-center gap-1" title={syncError}>
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">{formatLastSync(lastSyncedAt)}</span>
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0c1220]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-3.5 shadow-2xl z-50 space-y-3">
          <div className="border-b border-white/[0.08] pb-2.5">
            <div className="text-xs font-bold text-white truncate">
              {user.displayName || 'Google Account'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {user.email}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Auto Cloud Sync Active</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
            Every change to your syllabus progress, PYQ counts, and test scores is automatically saved to Cloud Firestore. Logging in with this Gmail restores everything automatically.
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={async () => {
                setShowDropdown(false);
                await onSignOut();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-between"
            >
              <span>Sign Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
