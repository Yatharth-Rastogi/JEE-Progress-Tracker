import React, { useState } from 'react';
import { 
  Trophy, PlusCircle, AlertTriangle, CheckCircle2, Clock, 
  Trash2, BookOpen, Sparkles, Filter, PieChart, ChevronRight,
  TrendingUp, BarChart2, ShieldAlert, Check, X
} from 'lucide-react';
import { Chapter, MockTest, ErrorLogEntry, ErrorType, Subject } from '../types/jee';
import { calculateJeeScore } from '../utils/calculations';

interface MockTestsAndErrorLogProps {
  chapters: Chapter[];
  mockTests: MockTest[];
  errorLogs: ErrorLogEntry[];
  onAddMockTest: (test: Omit<MockTest, 'id' | 'createdAt'>) => void;
  onDeleteMockTest: (testId: string) => void;
  onAddErrorLog: (entry: Omit<ErrorLogEntry, 'id' | 'loggedAt'>) => void;
  onToggleErrorResolved: (entryId: string) => void;
  onDeleteErrorLog: (entryId: string) => void;
}

export const MockTestsAndErrorLog: React.FC<MockTestsAndErrorLogProps> = ({
  chapters,
  mockTests,
  errorLogs,
  onAddMockTest,
  onDeleteMockTest,
  onAddErrorLog,
  onToggleErrorResolved,
  onDeleteErrorLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mockTests' | 'errorLog'>('mockTests');

  // Modal states
  const [showAddMockModal, setShowAddMockModal] = useState(false);
  const [showAddErrorModal, setShowAddErrorModal] = useState(false);

  // New Mock Test Form State
  const [mockTitle, setMockTitle] = useState('JEE Main Full Syllabus Simulation');
  const [mockDate, setMockDate] = useState(new Date().toISOString().split('T')[0]);
  const [mockType, setMockType] = useState<'Full 300M Test' | 'Part Test' | 'Subject Mock'>('Full 300M Test');
  const [mockDuration, setMockDuration] = useState(180);
  const [mockNotes, setMockNotes] = useState('');

  // Physics numbers
  const [phyAtt, setPhyAtt] = useState(20);
  const [phyCor, setPhyCor] = useState(16);
  const [phyWro, setPhyWro] = useState(4);
  const [phyGuessCor, setPhyGuessCor] = useState(2);

  // Chemistry numbers
  const [chemAtt, setChemAtt] = useState(24);
  const [chemCor, setChemCor] = useState(20);
  const [chemWro, setChemWro] = useState(4);
  const [chemGuessCor, setChemGuessCor] = useState(2);

  // Maths numbers
  const [mathAtt, setMathAtt] = useState(18);
  const [mathCor, setMathCor] = useState(13);
  const [mathWro, setMathWro] = useState(5);
  const [mathGuessCor, setMathGuessCor] = useState(1);

  // New Error Log Form State
  const [errorSubject, setErrorSubject] = useState<Subject>('Physics');
  const [errorChapterId, setErrorChapterId] = useState(chapters[0]?.id || '');
  const [errorSource, setErrorSource] = useState('');
  const [errorType, setErrorType] = useState<ErrorType>('Conceptual Error');
  const [errorQuestionText, setErrorQuestionText] = useState('');
  const [errorCorrectConcept, setErrorCorrectConcept] = useState('');
  const [errorActionItem, setErrorActionItem] = useState('');

  // Error Log Filter states
  const [errorFilterSubject, setErrorFilterSubject] = useState<Subject | 'All'>('All');
  const [errorFilterType, setErrorFilterType] = useState<ErrorType | 'All'>('All');
  const [errorFilterResolved, setErrorFilterResolved] = useState<'All' | 'Unresolved' | 'Resolved'>('All');

  // Submit Mock Test
  const handleSaveMockTest = (e: React.FormEvent) => {
    e.preventDefault();

    const phyScore = calculateJeeScore(phyCor, phyWro);
    const chemScore = calculateJeeScore(chemCor, chemWro);
    const mathScore = calculateJeeScore(mathCor, mathWro);

    const totalAttempted = phyAtt + chemAtt + mathAtt;
    const totalCorrect = phyCor + chemCor + mathCor;
    const totalWrong = phyWro + chemWro + mathWro;
    const totalScore = phyScore + chemScore + mathScore;
    const totalGuessCorrect = phyGuessCor + chemGuessCor + mathGuessCor;

    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const guessAccuracy = totalCorrect > 0 ? Math.round((totalGuessCorrect / totalCorrect) * 100) : 0;

    onAddMockTest({
      title: mockTitle.trim() || 'JEE Main Mock',
      date: mockDate,
      testType: mockType,
      durationMinutes: mockDuration,
      physics: {
        attempted: phyAtt,
        correct: phyCor,
        wrong: phyWro,
        guessCorrect: phyGuessCor,
        score: phyScore,
      },
      chemistry: {
        attempted: chemAtt,
        correct: chemCor,
        wrong: chemWro,
        guessCorrect: chemGuessCor,
        score: chemScore,
      },
      maths: {
        attempted: mathAtt,
        correct: mathCor,
        wrong: mathWro,
        guessCorrect: mathGuessCor,
        score: mathScore,
      },
      totalScore,
      maxScore: 300,
      totalAttempted,
      totalCorrect,
      totalWrong,
      overallAccuracy,
      guessAccuracy,
      notes: mockNotes.trim(),
    });

    setShowAddMockModal(false);
  };

  // Submit Error Log
  const handleSaveErrorLog = (e: React.FormEvent) => {
    e.preventDefault();
    const ch = chapters.find((c) => c.id === errorChapterId);

    onAddErrorLog({
      chapterId: errorChapterId,
      chapterName: ch ? ch.name : 'General',
      subject: errorSubject,
      questionSource: errorSource.trim() || 'Mock Practice',
      errorType,
      questionText: errorQuestionText.trim(),
      correctConcept: errorCorrectConcept.trim(),
      actionItem: errorActionItem.trim(),
      resolved: false,
    });

    // Reset error form
    setErrorSource('');
    setErrorQuestionText('');
    setErrorCorrectConcept('');
    setErrorActionItem('');
    setShowAddErrorModal(false);
  };

  // Error type breakdown metrics
  const errorTypeCounts = errorLogs.reduce((acc, log) => {
    acc[log.errorType] = (acc[log.errorType] || 0) + 1;
    return acc;
  }, {} as Record<ErrorType, number>);

  const filteredErrors = errorLogs.filter((log) => {
    const matchSub = errorFilterSubject === 'All' || log.subject === errorFilterSubject;
    const matchType = errorFilterType === 'All' || log.errorType === errorFilterType;
    const matchRes =
      errorFilterResolved === 'All'
        ? true
        : errorFilterResolved === 'Resolved'
        ? log.resolved
        : !log.resolved;

    return matchSub && matchType && matchRes;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Diagnostic Benchmarks</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Mock Tests & Mistake Notebook</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Track official 300-mark mock scores, analyze silly mistakes vs conceptual gaps, and review action items.
            </p>
          </div>

          {/* Sub Tab Switcher - Responsive Grid on mobile */}
          <div className="grid grid-cols-2 sm:flex rounded-xl bg-[#080c14] p-1 border border-white/[0.08] w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('mockTests')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'mockTests'
                  ? 'bg-rose-500 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Mocks ({mockTests.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('errorLog')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'errorLog'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Mistakes ({errorLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SUB-TAB 1: MOCK TESTS */}
      {/* ==================================================== */}
      {activeSubTab === 'mockTests' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Full-Length Test History</h2>
            <button
              onClick={() => setShowAddMockModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Record New Mock Test
            </button>
          </div>

          {/* Mock Test Cards Grid */}
          <div className="space-y-4">
            {mockTests.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-white font-semibold">No Mock Tests Logged Yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Take a 3-hour JEE Main mock test and record your subject-wise scores to track your rank trajectory.
                </p>
                <button
                  onClick={() => setShowAddMockModal(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Record First Mock Test
                </button>
              </div>
            ) : (
              mockTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {test.testType}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {test.date} • {test.durationMinutes} mins
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{test.title}</h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                          {test.totalScore} <span className="text-xs text-slate-400 font-normal">/ {test.maxScore}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Accuracy: <strong className="text-emerald-400">{test.overallAccuracy}%</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteMockTest(test.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete Mock Test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subject-Wise Score Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {/* Physics */}
                    <div className="bg-slate-950/60 border border-indigo-500/20 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-indigo-400 font-semibold">Physics</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {test.physics.score} Marks
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                        <span>{test.physics.correct} Correct, {test.physics.wrong} Wrong</span>
                        <span className="text-amber-400">{test.physics.guessCorrect} Guess✓</span>
                      </div>
                    </div>

                    {/* Chemistry */}
                    <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-semibold">Chemistry</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {test.chemistry.score} Marks
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                        <span>{test.chemistry.correct} Correct, {test.chemistry.wrong} Wrong</span>
                        <span className="text-amber-400">{test.chemistry.guessCorrect} Guess✓</span>
                      </div>
                    </div>

                    {/* Maths */}
                    <div className="bg-slate-950/60 border border-cyan-500/20 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-cyan-400 font-semibold">Mathematics</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {test.maths.score} Marks
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                        <span>{test.maths.correct} Correct, {test.maths.wrong} Wrong</span>
                        <span className="text-amber-400">{test.maths.guessCorrect} Guess✓</span>
                      </div>
                    </div>
                  </div>

                  {test.notes && (
                    <div className="p-2.5 bg-slate-950/50 border border-white/[0.05] rounded-xl text-xs text-slate-300 italic">
                      Takeaway: "{test.notes}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 2: ERROR LOG / MISTAKE NOTEBOOK */}
      {/* ==================================================== */}
      {activeSubTab === 'errorLog' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Error Type Distribution Analytics */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                Mistake Root-Cause Diagnostics
              </h3>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                {errorLogs.filter((e) => !e.resolved).length} Unresolved Errors
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 pt-1">
              {(
                [
                  { type: 'Conceptual Error', icon: '🔴', color: 'border-rose-500/20 bg-rose-500/10 text-rose-300' },
                  { type: 'Calculation Mistake', icon: '🟡', color: 'border-amber-500/20 bg-amber-500/10 text-amber-300' },
                  { type: 'Time Pressure', icon: '⏱️', color: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300' },
                  { type: 'Silly Mistake', icon: '🤦', color: 'border-purple-500/20 bg-purple-500/10 text-purple-300' },
                  { type: 'Misread Question', icon: '📖', color: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300' },
                ] as const
              ).map(({ type, icon, color }) => (
                <div
                  key={type}
                  className={`p-2.5 rounded-xl border ${color} space-y-1`}
                >
                  <div className="text-[11px] font-medium truncate flex items-center gap-1">
                    <span>{icon}</span> <span className="truncate">{type}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono">
                    {errorTypeCounts[type] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:flex flex-wrap items-center gap-2">
              {/* Subject Filter */}
              <select
                value={errorFilterSubject}
                onChange={(e) => setErrorFilterSubject(e.target.value as any)}
                className="bg-slate-950/80 border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>

              {/* Type Filter */}
              <select
                value={errorFilterType}
                onChange={(e) => setErrorFilterType(e.target.value as any)}
                className="bg-slate-950/80 border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Mistake Types</option>
                <option value="Conceptual Error">Conceptual Error</option>
                <option value="Calculation Mistake">Calculation Mistake</option>
                <option value="Time Pressure">Time Pressure</option>
                <option value="Silly Mistake">Silly Mistake</option>
                <option value="Misread Question">Misread Question</option>
              </select>

              {/* Resolved Filter */}
              <select
                value={errorFilterResolved}
                onChange={(e) => setErrorFilterResolved(e.target.value as any)}
                className="bg-slate-950/80 border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
              >
                <option value="All">All Statuses</option>
                <option value="Unresolved">Unresolved Only</option>
                <option value="Resolved">Resolved Only</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddErrorModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Log Mistake
            </button>
          </div>

          {/* Error Notebook List */}
          <div className="space-y-3">
            {filteredErrors.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-white font-semibold">No Errors Match Filters</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Logging your mistakes immediately after a mock test or practice set is the single highest ROI revision habit in JEE preparation.
                </p>
                <button
                  onClick={() => setShowAddErrorModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Log a Mistake
                </button>
              </div>
            ) : (
              filteredErrors.map((err) => (
                <div
                  key={err.id}
                  className={`bg-slate-900 border rounded-2xl p-4 shadow-lg transition-all space-y-3 ${
                    err.resolved
                      ? 'border-slate-800/80 opacity-75'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          err.subject === 'Physics' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' :
                          err.subject === 'Chemistry' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                          'bg-cyan-950 text-cyan-300 border-cyan-700'
                        }`}>
                          {err.subject}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                          {err.errorType}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Source: {err.questionSource}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{err.chapterName}</h4>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        onClick={() => onToggleErrorResolved(err.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          err.resolved
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {err.resolved ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Resolved
                          </>
                        ) : (
                          'Mark Resolved'
                        )}
                      </button>

                      <button
                        onClick={() => onDeleteErrorLog(err.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete mistake entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {err.questionText && (
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <strong className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
                        Question Context:
                      </strong>
                      {err.questionText}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Correct Concept & Formula
                      </span>
                      <p className="text-slate-200">{err.correctConcept}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Concrete Action Item
                      </span>
                      <p className="text-slate-200">{err.actionItem}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD MOCK TEST */}
      {/* ==================================================== */}
      {showAddMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0c1220] border border-white/[0.1] rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Record Full Mock Test</h3>
              </div>
              <button
                onClick={() => setShowAddMockModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMockTest} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Test Name</label>
                  <input
                    type="text"
                    value={mockTitle}
                    onChange={(e) => setMockTitle(e.target.value)}
                    required
                    placeholder="e.g. Allen Leader Test 4, JEE Main Shift 1"
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={mockDate}
                    onChange={(e) => setMockDate(e.target.value)}
                    required
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>

              {/* Subject Breakdown Form */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-white">Subject Marks (JEE +4 / -1 Rule)</div>

                {/* Physics */}
                <div className="p-3 bg-slate-950/50 border border-indigo-500/20 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-indigo-400">Physics</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Attempted</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={phyAtt}
                        onChange={(e) => setPhyAtt(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block mb-0.5">Correct (+4)</span>
                      <input
                        type="number"
                        min="0"
                        max={phyAtt}
                        value={phyCor}
                        onChange={(e) => setPhyCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-emerald-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block mb-0.5">Wrong (-1)</span>
                      <input
                        type="number"
                        min="0"
                        max={phyAtt}
                        value={phyWro}
                        onChange={(e) => setPhyWro(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-rose-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block mb-0.5">Guessed Correct</span>
                      <input
                        type="number"
                        min="0"
                        max={phyCor}
                        value={phyGuessCor}
                        onChange={(e) => setPhyGuessCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Chemistry */}
                <div className="p-3 bg-slate-950/50 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Chemistry</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Attempted</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={chemAtt}
                        onChange={(e) => setChemAtt(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block mb-0.5">Correct (+4)</span>
                      <input
                        type="number"
                        min="0"
                        max={chemAtt}
                        value={chemCor}
                        onChange={(e) => setChemCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-emerald-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block mb-0.5">Wrong (-1)</span>
                      <input
                        type="number"
                        min="0"
                        max={chemAtt}
                        value={chemWro}
                        onChange={(e) => setChemWro(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-rose-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block mb-0.5">Guessed Correct</span>
                      <input
                        type="number"
                        min="0"
                        max={chemCor}
                        value={chemGuessCor}
                        onChange={(e) => setChemGuessCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Maths */}
                <div className="p-3 bg-slate-950/50 border border-cyan-500/20 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-cyan-400">Mathematics</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Attempted</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={mathAtt}
                        onChange={(e) => setMathAtt(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block mb-0.5">Correct (+4)</span>
                      <input
                        type="number"
                        min="0"
                        max={mathAtt}
                        value={mathCor}
                        onChange={(e) => setMathCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-emerald-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block mb-0.5">Wrong (-1)</span>
                      <input
                        type="number"
                        min="0"
                        max={mathAtt}
                        value={mathWro}
                        onChange={(e) => setMathWro(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-rose-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block mb-0.5">Guessed Correct</span>
                      <input
                        type="number"
                        min="0"
                        max={mathCor}
                        value={mathGuessCor}
                        onChange={(e) => setMathGuessCor(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-white/[0.08] rounded-lg py-1.5 px-2 text-center text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total preview */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-white/[0.08] flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Calculated Total:</span>
                <span className="text-sm sm:text-base font-bold text-cyan-300">
                  {calculateJeeScore(phyCor, phyWro) + calculateJeeScore(chemCor, chemWro) + calculateJeeScore(mathCor, mathWro)} / 300 Marks
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Takeaways</label>
                <textarea
                  value={mockNotes}
                  onChange={(e) => setMockNotes(e.target.value)}
                  placeholder="e.g. Physics speed was great; Maths coordinate section took 15 mins extra..."
                  rows={2}
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddMockModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Save Mock Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD ERROR LOG */}
      {/* ==================================================== */}
      {showAddErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0c1220] border border-white/[0.1] rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Log Mistake in Notebook</h3>
              </div>
              <button
                onClick={() => setShowAddErrorModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveErrorLog} className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={errorSubject}
                    onChange={(e) => {
                      const sub = e.target.value as Subject;
                      setErrorSubject(sub);
                      const subCh = chapters.find((c) => c.subject === sub);
                      if (subCh) setErrorChapterId(subCh.id);
                    }}
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Error Type</label>
                  <select
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value as ErrorType)}
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Conceptual Error">Conceptual Error</option>
                    <option value="Calculation Mistake">Calculation Mistake</option>
                    <option value="Time Pressure">Time Pressure</option>
                    <option value="Silly Mistake">Silly Mistake</option>
                    <option value="Misread Question">Misread Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
                <select
                  value={errorChapterId}
                  onChange={(e) => setErrorChapterId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  {chapters
                    .filter((c) => c.subject === errorSubject)
                    .map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Source / Reference
                </label>
                <input
                  type="text"
                  value={errorSource}
                  onChange={(e) => setErrorSource(e.target.value)}
                  required
                  placeholder="e.g. Mock 4 - Q12 or JEE 2024 Jan 27 S1"
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Summary / Trap Description
                </label>
                <textarea
                  value={errorQuestionText}
                  onChange={(e) => setErrorQuestionText(e.target.value)}
                  rows={2}
                  placeholder="Describe where you went wrong or the trap in the question..."
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correct Concept / Standard Formula
                </label>
                <textarea
                  value={errorCorrectConcept}
                  onChange={(e) => setErrorCorrectConcept(e.target.value)}
                  required
                  rows={2}
                  placeholder="e.g. For adiabatic process, T * V^(gamma-1) = constant, not P * V = constant."
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concrete Action Item
                </label>
                <input
                  type="text"
                  value={errorActionItem}
                  onChange={(e) => setErrorActionItem(e.target.value)}
                  required
                  placeholder="e.g. Revise adiabatic expansion work formula; solve 5 PYQs."
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddErrorModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Save to Mistake Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
