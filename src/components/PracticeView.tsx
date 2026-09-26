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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4" />
              <span>Question Practice Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Practice & PYQ Sessions</h1>
            <p className="text-slate-400 text-xs mt-1">
              Review daily problem-solving sessions, genuine solves, and score distributions (+4/-1).
            </p>
          </div>

          <button
            onClick={onOpenLogModal}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Log New Practice Session
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Total Questions Logged</span>
            <div className="text-xl font-bold text-white font-mono">{totalAttempted}</div>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Overall Accuracy</span>
            <div className="text-xl font-bold text-cyan-400 font-mono">{avgAccuracy}%</div>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Genuine Solves</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">{totalGenuine} Qs</div>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">Guesses Logged</span>
            <div className="text-xl font-bold text-amber-400 font-mono">{totalGuessed} Qs</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by chapter name, test paper source, or your notes..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Subject Selector */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                    subjectFilter === s
                      ? 'bg-cyan-500 text-slate-950'
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
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-white font-semibold">No Practice Sessions Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Start by logging a 20-30 question PYQ session to see detailed score breakdowns and accuracy metrics.
            </p>
            <button
              onClick={onOpenLogModal}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              Log First Session
            </button>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      session.subject === 'Physics' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' :
                      session.subject === 'Chemistry' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                      'bg-cyan-950 text-cyan-300 border-cyan-700'
                    }`}>
                      {session.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {session.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {session.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{session.chapterName}</h3>
                  <div className="text-xs text-slate-400 font-mono">Source: {session.source}</div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-lg font-extrabold font-mono text-white flex items-center gap-2 justify-end">
                      <span className={session.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {session.score >= 0 ? `+${session.score}` : session.score} Marks
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({session.accuracy}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {session.correct} Correct • {session.wrong} Wrong • {session.attempted} Total
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    title="Delete log"
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Guess & Genuine Breakdown Banner */}
              <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400">
                    🧠 Genuine Solves: <strong>{session.genuineSolves}</strong>
                  </span>
                  {(session.guessCorrect > 0 || session.guessWrong > 0) && (
                    <span className="text-amber-400">
                      🎯 Guesses: <strong>{session.guessCorrect} Correct</strong> / <strong>{session.guessWrong} Wrong</strong>
                    </span>
                  )}
                </div>

                {session.notes && (
                  <div className="text-slate-300 italic text-[11px] font-sans truncate max-w-md">
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
