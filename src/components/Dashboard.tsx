import React, { useMemo } from 'react';
import { 
  Trophy, Target, Flame, Brain, CheckCircle2, AlertOctagon, 
  ArrowRight, Play, PlusCircle, Clock, Zap, BookCheck, TrendingUp,
  BarChart3, ShieldAlert, Sparkles, Layers
} from 'lucide-react';
import { Chapter, MockTest, PracticeSession, Subject } from '../types/jee';
import { 
  calculateMasteryPercent, calculateWeaknessLevel, 
  getPyqAccuracy, getBasicAccuracy 
} from '../utils/calculations';

interface DashboardProps {
  chapters: Chapter[];
  practiceSessions: PracticeSession[];
  mockTests: MockTest[];
  onOpenStudyRoom: (chapterId: string) => void;
  onOpenQuickLogModal: (chapterId?: string) => void;
  onNavigateTab: (tabIndex: number) => void;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  chapters,
  practiceSessions,
  mockTests,
  onOpenStudyRoom,
  onOpenQuickLogModal,
  onNavigateTab,
  onUpdateChapter,
}) => {
  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalMasterySum = 0;
    let chaptersMasteredCount = 0; // Mastery >= 75% or Strong
    let totalPyqAttempted = 0;
    let totalPyqCorrect = 0;
    let totalGenuineSolves = 0;
    let totalGuesses = 0;
    let totalGuessesCorrect = 0;

    // Subject aggregates
    const subjectStats: Record<Subject, {
      total: number;
      masterySum: number;
      theoryDone: number;
      pyqAttempted: number;
      pyqCorrect: number;
      weakCount: number;
      masteredCount: number;
    }> = {
      Physics: { total: 0, masterySum: 0, theoryDone: 0, pyqAttempted: 0, pyqCorrect: 0, weakCount: 0, masteredCount: 0 },
      Chemistry: { total: 0, masterySum: 0, theoryDone: 0, pyqAttempted: 0, pyqCorrect: 0, weakCount: 0, masteredCount: 0 },
      Mathematics: { total: 0, masterySum: 0, theoryDone: 0, pyqAttempted: 0, pyqCorrect: 0, weakCount: 0, masteredCount: 0 },
    };

    // Action needed candidates
    const actionNeededChapters: {
      chapter: Chapter;
      reason: string;
      severity: 'high' | 'medium';
    }[] = [];

    chapters.forEach((c) => {
      const mastery = calculateMasteryPercent(c);
      const weakness = calculateWeaknessLevel(c);
      const pyqAcc = getPyqAccuracy(c);

      totalMasterySum += mastery;
      if (mastery >= 75 || weakness === 'Strong') {
        chaptersMasteredCount++;
      }

      totalPyqAttempted += c.pyqAttempted || 0;
      totalPyqCorrect += c.pyqCorrect || 0;
      totalGenuineSolves += c.genuineSolves || 0;
      totalGuesses += c.guessAttempts || 0;
      totalGuessesCorrect += c.guessCorrect || 0;

      const sub = subjectStats[c.subject];
      if (sub) {
        sub.total++;
        sub.masterySum += mastery;
        if (c.theoryPercent >= 98 || c.theoryStatus === 'Completed') sub.theoryDone++;
        sub.pyqAttempted += c.pyqAttempted || 0;
        sub.pyqCorrect += c.pyqCorrect || 0;
        if (weakness === 'Weak') sub.weakCount++;
        if (mastery >= 75 || weakness === 'Strong') sub.masteredCount++;
      }

      // Action Needed Evaluation:
      // 1. Critical Priority + Weak Level
      if (c.priority === 'Critical' && weakness === 'Weak') {
        actionNeededChapters.push({
          chapter: c,
          reason: `Critical Priority & Low PYQ Accuracy (${pyqAcc}% / ${c.pyqAttempted - c.pyqCorrect} errors)`,
          severity: 'high',
        });
      }
      // 2. High error count (> 5 wrong)
      else if (c.pyqAttempted > 0 && (c.pyqAttempted - c.pyqCorrect) > 5) {
        actionNeededChapters.push({
          chapter: c,
          reason: `High Error Rate (${c.pyqAttempted - c.pyqCorrect} wrong out of ${c.pyqAttempted} attempts)`,
          severity: 'high',
        });
      }
      // 3. Theory finished but Revision 1 pending
      else if ((c.theoryPercent >= 90 || c.theoryStatus === 'Completed') && !c.revision1) {
        actionNeededChapters.push({
          chapter: c,
          reason: 'Theory completed, Spaced Revision 1 (24-48h) pending',
          severity: 'medium',
        });
      }
      // 4. Practiced PYQs but Revision 2 pending
      else if (c.pyqAttempted >= 15 && c.revision1 && !c.revision2) {
        actionNeededChapters.push({
          chapter: c,
          reason: 'Solid PYQ practice logged, Spaced Revision 2 (7-Day) due',
          severity: 'medium',
        });
      }
    });

    // Best mock test score
    let bestMockScore = 0;
    let avgMockScore = 0;
    if (mockTests.length > 0) {
      bestMockScore = Math.max(...mockTests.map((m) => m.totalScore));
      avgMockScore = Math.round(
        mockTests.reduce((acc, m) => acc + m.totalScore, 0) / mockTests.length
      );
    }

    const overallPyqAcc = totalPyqAttempted > 0 ? Math.round((totalPyqCorrect / totalPyqAttempted) * 100) : 0;
    const overallSyllabusMastery = Math.round(totalMasterySum / (chapters.length || 1));
    const genuinePercent = totalPyqAttempted > 0 ? Math.round((totalGenuineSolves / totalPyqAttempted) * 100) : 0;

    return {
      chaptersMasteredCount,
      overallSyllabusMastery,
      totalPyqAttempted,
      totalPyqCorrect,
      overallPyqAcc,
      totalGenuineSolves,
      genuinePercent,
      totalGuesses,
      totalGuessesCorrect,
      bestMockScore,
      avgMockScore,
      subjectStats,
      actionNeededChapters: actionNeededChapters.slice(0, 6), // Top 6 urgent actions
    };
  }, [chapters, mockTests]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JEE 2026 High-Yield Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Diagnostic Mastery Engine
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Track video theory duration, genuine vs guessed question accuracy, spaced revisions, and simulated mock test diagnostics to maximize JEE percentile.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuickLogModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Log PYQ Session
            </button>
            <button
              onClick={() => onNavigateTab(2)} // YouTube Study Room tab
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              Resume Theory Player
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Chapters Mastered */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Chapters Mastered</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {metrics.chaptersMasteredCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {chapters.length}</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">
              {Math.round((metrics.chaptersMasteredCount / (chapters.length || 1)) * 100)}%
            </span>
            <span>of syllabus mastered</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500" />
        </div>

        {/* Metric 2: Overall Syllabus Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Syllabus Mastery %</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {metrics.overallSyllabusMastery}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mt-3 border border-slate-800">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${metrics.overallSyllabusMastery}%` }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />
        </div>

        {/* Metric 3: Total PYQs Logged */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total PYQs Logged</span>
            <BookCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {metrics.totalPyqAttempted}
            </span>
            <span className="text-xs text-slate-500 font-mono">Qs</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-indigo-400 font-medium font-mono">{metrics.totalPyqCorrect}</span>
            <span>correct answers</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* Metric 4: Overall PYQ Accuracy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Overall PYQ Accuracy</span>
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${
              metrics.overallPyqAcc >= 75 ? 'text-emerald-400' :
              metrics.overallPyqAcc >= 50 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {metrics.overallPyqAcc}%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Genuine: </span>
            <span className="text-cyan-400 font-bold font-mono">{metrics.genuinePercent}%</span>
            <span>(no guess)</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Metric 5: Best Mock Test Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Best Mock Test</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {metrics.bestMockScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 300</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Avg: </span>
            <span className="text-amber-400 font-mono font-medium">{metrics.avgMockScore} Marks</span>
            <span className="text-slate-500">({mockTests.length} tests)</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>
      </div>

      {/* Middle Row: Subject-Wise Progress & Action Needed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject-Wise Progress Cards (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Subject-Wise Mastery Breakdown</h2>
            </div>
            <button
              onClick={() => onNavigateTab(1)} // Master Chapter Tracker tab
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              View All {chapters.length} Chapters <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map((subKey) => {
              const sub = metrics.subjectStats[subKey];
              const subMastery = Math.round(sub.masterySum / (sub.total || 1));
              const subAccuracy = sub.pyqAttempted > 0 ? Math.round((sub.pyqCorrect / sub.pyqAttempted) * 100) : 0;

              const themeColor =
                subKey === 'Physics' ? 'indigo' :
                subKey === 'Chemistry' ? 'emerald' : 'cyan';

              return (
                <div
                  key={subKey}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${
                        subKey === 'Physics' ? 'bg-indigo-400' :
                        subKey === 'Chemistry' ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`} />
                      <span className="font-bold text-white text-sm">{subKey}</span>
                      <span className="text-xs text-slate-500 font-mono">({sub.total} Chapters)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Mastery:</span>
                      <span className="text-sm font-bold font-mono text-white">{subMastery}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        subKey === 'Physics' ? 'bg-indigo-500' :
                        subKey === 'Chemistry' ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${subMastery}%` }}
                    />
                  </div>

                  {/* Sub metrics stats */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Theory Done</span>
                      <span className="text-slate-200 font-semibold">{sub.theoryDone} / {sub.total}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">PYQ Accuracy</span>
                      <span className={`font-semibold ${
                        subAccuracy >= 75 ? 'text-emerald-400' : subAccuracy >= 50 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {sub.pyqAttempted > 0 ? `${subAccuracy}%` : '0 Qs'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Mastered</span>
                      <span className="text-emerald-400 font-semibold">{sub.masteredCount} ch</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Weak (Help)</span>
                      <span className={`font-semibold ${sub.weakCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                        {sub.weakCount} ch
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guess Tracker Analysis Insight */}
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Guess Tracker Diagnostic</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-mono">
                  {metrics.totalGuesses} Total Guesses
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You logged <span className="text-white font-mono">{metrics.totalGenuineSolves}</span> genuine solves and <span className="text-amber-300 font-mono">{metrics.totalGuesses}</span> guesses ({metrics.totalGuessesCorrect} were lucky guesses). To avoid JEE negative marking traps, keep genuine solves above 85%.
              </p>
            </div>
          </div>
        </div>

        {/* Action Needed Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Action Needed (Priority Radar)</h2>
              </div>
              <span className="text-[11px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono font-bold">
                {metrics.actionNeededChapters.length} Urgent
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Chapters requiring urgent intervention due to critical priority errors, low accuracy, or pending spaced revisions.
            </p>

            {metrics.actionNeededChapters.length === 0 ? (
              <div className="text-center py-8 space-y-2 bg-slate-950/60 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-semibold text-white">No Critical Weaknesses!</div>
                <div className="text-xs text-slate-400 max-w-xs mx-auto">
                  You are completely caught up on revisions and critical priority accuracy. Keep practicing PYQs!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.actionNeededChapters.map(({ chapter, reason, severity }, idx) => (
                  <div
                    key={chapter.id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            severity === 'high' ? 'bg-rose-400 animate-ping' : 'bg-amber-400'
                          }`} />
                          <span>{chapter.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {chapter.subject} • {chapter.unit} • <span className="text-rose-400 font-semibold">{chapter.priority} Priority</span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        severity === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {severity === 'high' ? 'Immediate' : 'Review'}
                      </span>
                    </div>

                    <div className="text-[11px] text-amber-300/90 font-mono bg-slate-900/90 px-2 py-1 rounded border border-slate-800/80">
                      ⚠️ {reason}
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenStudyRoom(chapter.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium rounded flex items-center gap-1 transition-colors border border-slate-700"
                      >
                        <Play className="w-3 h-3 text-cyan-400" /> Watch Theory
                      </button>
                      <button
                        onClick={() => onOpenQuickLogModal(chapter.id)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-medium rounded flex items-center gap-1 transition-colors border border-cyan-800/60"
                      >
                        <PlusCircle className="w-3 h-3" /> Log Solves
                      </button>
                      {!chapter.revision1 && (
                        <button
                          onClick={() => onUpdateChapter(chapter.id, { revision1: true })}
                          className="px-2 py-1 bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 text-[11px] rounded transition-colors ml-auto border border-slate-700"
                        >
                          Mark R1 Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab(1)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700 text-center"
          >
            Open Full Master Syllabus Filter
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Practice Activity & Recent Mock Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Practice Sessions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Practice & PYQ Sessions
            </h3>
            <button
              onClick={() => onNavigateTab(3)} // Practice tab
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              All Practice ({practiceSessions.length})
            </button>
          </div>

          {practiceSessions.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No practice logged yet. Click "Log PYQ Session" above to start recording your solves!
            </div>
          ) : (
            <div className="space-y-2.5">
              {practiceSessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[240px]">
                    <div className="font-semibold text-white truncate">{s.chapterName}</div>
                    <div className="text-[11px] text-slate-400">
                      {s.source} • <span className="font-mono text-slate-500">{s.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-white">
                      {s.correct}/{s.attempted} ({s.accuracy}%)
                    </div>
                    <div className={`text-[10px] font-mono font-semibold ${
                      s.score >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {s.score >= 0 ? `+${s.score}` : s.score} Marks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Mock Tests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              Mock Test Performance
            </h3>
            <button
              onClick={() => onNavigateTab(4)} // Mock Tests tab
              className="text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              All Tests ({mockTests.length})
            </button>
          </div>

          {mockTests.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No mock tests recorded yet. Record full 300-mark tests in the Mock Tests module!
            </div>
          ) : (
            <div className="space-y-2.5">
              {mockTests.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[240px]">
                    <div className="font-semibold text-white truncate">{m.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {m.date} • {m.durationMinutes} min
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-cyan-300 text-sm">
                      {m.totalScore} / {m.maxScore}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      P: {m.physics.score} | C: {m.chemistry.score} | M: {m.maths.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
