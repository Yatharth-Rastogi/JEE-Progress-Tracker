import React, { useState } from 'react';
import { 
  PlusCircle, Search, Trash2, Calendar, FileText, CheckCircle2, 
  HelpCircle, ArrowUpDown, Sparkles, Filter, Brain
} from 'lucide-react';
import { PracticeSession, Subject } from '../types/jee';

interface PracticeViewProps {
  practiceSessions: PracticeSession[];
  onOpenLogModal: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  practiceSessions,
  onOpenLogModal,
  onDeleteSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'PYQ Practice' | 'Basic Practice'>('All');

  const filteredSessions = practiceSessions.filter((s) => {
    const matchesSubject = subjectFilter === 'All' || s.subject === subjectFilter;
    const matchesType = typeFilter === 'All' || s.type === typeFilter;
    const matchesSearch =
      s.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSubject && matchesType && matchesSearch;
  });

  // Aggregates
  const totalAttempted = practiceSessions.reduce((acc, s) => acc + s.attempted, 0);
  const totalCorrect = practiceSessions.reduce((acc, s) => acc + s.correct, 0);
  const totalGenuine = practiceSessions.reduce((acc, s) => acc + s.genuineSolves, 0);
  const totalGuessed = practiceSessions.reduce((acc, s) => acc + (s.guessCorrect + s.guessWrong), 0);
  const avgAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <Brain className="w-3.5 h-3.5" />
              <span>Practice Analytics Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Practice & PYQ History</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Review daily question sessions, genuine solves, and JEE (+4/-1) mark distributions.
            </p>
          </div>

          <button
            onClick={onOpenLogModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Log Practice Session</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 pt-4 border-t border-white/[0.06]">
          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Total Questions</span>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">{totalAttempted}</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Overall Accuracy</span>
            <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono">{avgAccuracy}%</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Genuine Solves</span>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">{totalGenuine} Qs</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Guesses Logged</span>
            <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono">{totalGuessed} Qs</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by chapter, paper source, or personal notes..."
              className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Selector */}
            <div className="flex rounded-xl bg-[#080c14] p-1 border border-white/[0.08] shrink-0">
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    subjectFilter === s
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s === 'Mathematics' ? 'Maths' : s}
                </button>
              ))}
            </div>

            {/* Type Selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-[#080c14] border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Types</option>
              <option value="PYQ Practice">PYQ Practice</option>
              <option value="Basic Practice">Basic Practice</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-10 sm:p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-white font-semibold text-sm">No Practice Sessions Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Start by logging a 20-30 question PYQ session to see detailed score breakdowns and accuracy metrics.
            </p>
            <button
              onClick={onOpenLogModal}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors active:scale-95"
            >
              Log First Session
            </button>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/[0.08] hover:border-white/15 rounded-2xl p-3.5 sm:p-4 shadow-sm transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      session.subject === 'Physics' ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50' :
                      session.subject === 'Chemistry' ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50' :
                      'bg-cyan-950/70 text-cyan-300 border-cyan-700/50'
                    }`}>
                      {session.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] font-mono">
                      {session.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {session.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{session.chapterName}</h3>
                  <div className="text-[11px] text-slate-400 font-mono truncate">Source: {session.source}</div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-1.5 sm:justify-end">
                      <span className={session.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {session.score >= 0 ? `+${session.score}` : session.score} Marks
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({session.accuracy}%)
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                      {session.correct} Correct • {session.wrong} Wrong • {session.attempted} Total
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    title="Delete log"
                    className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Guess & Genuine Breakdown Banner */}
              <div className="p-2 sm:p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px]">
                  <span className="text-emerald-400">
                    🧠 Genuine: <strong>{session.genuineSolves}</strong>
                  </span>
                  {(session.guessCorrect > 0 || session.guessWrong > 0) && (
                    <span className="text-amber-400">
                      🎯 Guesses: <strong>{session.guessCorrect} Correct</strong> / <strong>{session.guessWrong} Wrong</strong>
                    </span>
                  )}
                </div>

                {session.notes && (
                  <div className="text-slate-400 italic text-[11px] font-sans truncate max-w-md w-full sm:w-auto">
                    "{session.notes}"
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
