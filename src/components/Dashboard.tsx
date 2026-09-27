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
        if (weakness === 'Weak' || weakness === 'Very Weak') sub.weakCount++;
        if (mastery >= 75 || weakness === 'Strong') sub.masteredCount++;
      }

      // Action Needed Evaluation:
      // 1. Critical Priority + Weak / Very Weak Level
      if (c.priority === 'Critical' && (weakness === 'Weak' || weakness === 'Very Weak')) {
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
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-[#0d1424] to-[#080c14] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/25 text-cyan-300 text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>JEE Mastery Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Diagnostic Mastery Engine
            </h1>
            <p className="text-slate-300/90 text-xs sm:text-sm leading-relaxed max-w-xl">
              Track lecture theory duration, genuine vs guessed question accuracy, spaced revisions, and simulated mock test diagnostics to maximize JEE percentile.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              onClick={() => onOpenQuickLogModal()}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Log PYQ Session</span>
            </button>
            <button
              onClick={() => onNavigateTab(2)} // YouTube Study Room tab
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-xs rounded-xl border border-white/[0.1] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Study Room</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 5 Core Metric Cards - Responsive Grid (2 cols on small mobile, 3 on sm, 5 on lg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Metric 1: Chapters Mastered */}
        <div className="bg-slate-900/60 border border-white/[0.07] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="truncate">Mastered</span>
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.chaptersMasteredCount}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">/ {chapters.length}</span>
          </div>
          <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
            <span className="text-emerald-400 font-medium">
              {Math.round((metrics.chaptersMasteredCount / (chapters.length || 1)) * 100)}%
            </span>
            <span>of syllabus</span>
          </div>
        </div>

        {/* Metric 2: Overall Syllabus Mastery */}
        <div className="bg-slate-900/60 border border-white/[0.07] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="truncate">Syllabus %</span>
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {metrics.overallSyllabusMastery}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 sm:h-1.5 overflow-hidden mt-2 border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all"
              style={{ width: `${metrics.overallSyllabusMastery}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Total PYQs Logged */}
        <div className="bg-slate-900/60 border border-white/[0.07] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="truncate">PYQs Solved</span>
            <BookCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.totalPyqAttempted}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">Qs</span>
          </div>
          <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
            <span className="text-indigo-400 font-medium font-mono">{metrics.totalPyqCorrect}</span>
            <span>correct</span>
          </div>
        </div>

        {/* Metric 4: Overall PYQ Accuracy */}
        <div className="bg-slate-900/60 border border-white/[0.07] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="truncate">Accuracy</span>
            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-black font-mono ${
              metrics.overallPyqAcc >= 75 ? 'text-emerald-400' :
              metrics.overallPyqAcc >= 50 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {metrics.overallPyqAcc}%
            </span>
          </div>
          <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
            <span>Genuine: </span>
            <span className="text-cyan-400 font-bold font-mono">{metrics.genuinePercent}%</span>
          </div>
        </div>

        {/* Metric 5: Best Mock Test Score - takes 2 cols on mobile if odd, or 1 col on desktop */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/60 border border-white/[0.07] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm hover:border-white/15 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-[11px] sm:text-xs mb-1.5 sm:mb-2">
            <span className="truncate">Best Mock</span>
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.bestMockScore}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">/ 300</span>
          </div>
          <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
            <span>Avg: </span>
            <span className="text-amber-400 font-mono font-medium">{metrics.avgMockScore}M</span>
            <span className="text-slate-500">({mockTests.length} tests)</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Subject-Wise Progress & Action Needed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Subject-Wise Progress Cards (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Subject Mastery Breakdown</h2>
            </div>
            <button
              onClick={() => onNavigateTab(1)} // Master Chapter Tracker tab
              className="text-[11px] sm:text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>{chapters.length} Chapters</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map((subKey) => {
              const sub = metrics.subjectStats[subKey];
              const subMastery = Math.round(sub.masterySum / (sub.total || 1));
              const subAccuracy = sub.pyqAttempted > 0 ? Math.round((sub.pyqCorrect / sub.pyqAttempted) * 100) : 0;

              return (
                <div
                  key={subKey}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        subKey === 'Physics' ? 'bg-indigo-400' :
                        subKey === 'Chemistry' ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`} />
                      <span className="font-bold text-white text-xs sm:text-sm">{subKey}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({sub.total} Ch)</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[11px] text-slate-400">Mastery:</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-white">{subMastery}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        subKey === 'Physics' ? 'bg-indigo-500' :
                        subKey === 'Chemistry' ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${subMastery}%` }}
                    />
                  </div>

                  {/* Sub metrics stats - Responsive 2x2 on mobile, 4-col on tablet/desktop */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                    <div className="bg-white/[0.02] sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Theory Done</span>
                      <span className="text-slate-200 font-semibold">{sub.theoryDone} / {sub.total}</span>
                    </div>
                    <div className="bg-white/[0.02] sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">PYQ Accuracy</span>
                      <span className={`font-semibold ${
                        subAccuracy >= 75 ? 'text-emerald-400' : subAccuracy >= 50 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {sub.pyqAttempted > 0 ? `${subAccuracy}%` : '0 Qs'}
                      </span>
                    </div>
                    <div className="bg-white/[0.02] sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Mastered</span>
                      <span className="text-emerald-400 font-semibold">{sub.masteredCount} ch</span>
                    </div>
                    <div className="bg-white/[0.02] sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Needs Focus</span>
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
          <div className="p-3 sm:p-3.5 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl flex items-start gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-semibold text-white flex flex-wrap items-center gap-2">
                <span>Guess Tracker Diagnostic</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 font-mono">
                  {metrics.totalGuesses} Total Guesses
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                You logged <span className="text-white font-mono">{metrics.totalGenuineSolves}</span> genuine solves and <span className="text-amber-300 font-mono">{metrics.totalGuesses}</span> guesses ({metrics.totalGuessesCorrect} lucky). Maintain genuine solves above 85% to protect your JEE negative marking.
              </p>
            </div>
          </div>
        </div>

        {/* Action Needed Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Priority Focus Radar</h2>
              </div>
              <span className="text-[10px] sm:text-[11px] bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full font-mono font-bold">
                {metrics.actionNeededChapters.length} Urgent
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 mb-3 leading-relaxed">
              Targeted recommendations based on Critical priority errors, low PYQ accuracy, or due spaced revisions.
            </p>

            {metrics.actionNeededChapters.length === 0 ? (
              <div className="text-center py-8 space-y-2 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                <div className="text-xs sm:text-sm font-semibold text-white">No Critical Weaknesses!</div>
                <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  You are caught up on revisions and high priority accuracy. Keep practicing PYQs!
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {metrics.actionNeededChapters.map(({ chapter, reason, severity }, idx) => (
                  <div
                    key={chapter.id}
                    className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/15 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            severity === 'high' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'
                          }`} />
                          <span className="truncate">{chapter.name}</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                          {chapter.subject} • {chapter.unit} • <span className="text-rose-400 font-semibold">{chapter.priority}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-mono font-semibold shrink-0 ${
                        severity === 'high' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}>
                        {severity === 'high' ? 'Immediate' : 'Review'}
                      </span>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-amber-300/90 font-mono bg-amber-500/[0.05] px-2 py-1 rounded border border-amber-500/20">
                      ⚠️ {reason}
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <button
                        onClick={() => onOpenStudyRoom(chapter.id)}
                        className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-cyan-300 text-[10px] sm:text-[11px] font-medium rounded-lg flex items-center gap-1 transition-colors border border-white/[0.08]"
                      >
                        <Play className="w-3 h-3 text-cyan-400" /> Theory
                      </button>
                      <button
                        onClick={() => onOpenQuickLogModal(chapter.id)}
                        className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-[10px] sm:text-[11px] font-medium rounded-lg flex items-center gap-1 transition-colors border border-cyan-800/60"
                      >
                        <PlusCircle className="w-3 h-3" /> Log PYQs
                      </button>
                      {!chapter.revision1 && (
                        <button
                          onClick={() => onUpdateChapter(chapter.id, { revision1: true })}
                          className="px-2 py-1 bg-white/[0.03] hover:bg-emerald-950/60 text-slate-400 hover:text-emerald-300 text-[10px] sm:text-[11px] rounded-lg transition-colors ml-auto border border-white/[0.06]"
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
            className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-white/[0.08] text-center active:scale-98"
          >
            Explore Master Syllabus
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Practice Activity & Recent Mock Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Recent Practice Sessions */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Practice & PYQs
            </h3>
            <button
              onClick={() => onNavigateTab(3)} // Practice tab
              className="text-[11px] sm:text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              All Practice ({practiceSessions.length})
            </button>
          </div>

          {practiceSessions.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No practice logged yet. Click "Log PYQ Session" above to start recording your solves!
            </div>
          ) : (
            <div className="space-y-2">
              {practiceSessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 sm:p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[210px] sm:max-w-xs truncate">
                    <div className="font-semibold text-white truncate">{s.chapterName}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                      {s.source} • <span className="font-mono text-slate-500">{s.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-white text-[11px] sm:text-xs">
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
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Recent Mock Tests
            </h3>
            <button
              onClick={() => onNavigateTab(4)} // Mock Tests tab
              className="text-[11px] sm:text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              All Tests ({mockTests.length})
            </button>
          </div>

          {mockTests.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No mock tests recorded yet. Open Mock Tests & Error Log tab to record your first 300-mark test.
            </div>
          ) : (
            <div className="space-y-2">
              {mockTests.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 sm:p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between text-xs hover:border-white/15 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[210px] sm:max-w-xs truncate">
                    <div className="font-semibold text-white truncate">{m.title}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400">
                      {m.testType} • <span className="font-mono text-slate-500">{m.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-cyan-400 text-sm">
                      {m.totalScore} <span className="text-[10px] text-slate-500">/ 300</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {m.overallAccuracy}% acc
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
