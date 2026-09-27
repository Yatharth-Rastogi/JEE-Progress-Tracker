import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Plus, Minus, HelpCircle, 
  Sparkles, BookOpen, Calculator, Calendar, Tag, FileText
} from 'lucide-react';
import { Chapter, PracticeSession, Subject } from '../types/jee';
import { calculateJeeScore } from '../utils/calculations';

interface PracticeLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  defaultChapterId?: string;
  onSaveSession: (session: Omit<PracticeSession, 'id' | 'createdAt'>) => void;
}

export const PracticeLoggerModal: React.FC<PracticeLoggerModalProps> = ({
  isOpen,
  onClose,
  chapters,
  defaultChapterId,
  onSaveSession,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Physics');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [practiceType, setPracticeType] = useState<'PYQ Practice' | 'Basic Practice'>('PYQ Practice');
  const [source, setSource] = useState('JEE Main 2024 PYQs');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Numbers
  const [attempted, setAttempted] = useState<number>(20);
  const [correct, setCorrect] = useState<number>(16);
  const [wrong, setWrong] = useState<number>(4);

  // Guess Tracker
  // Constraint: Genuine Solves + Guessed Correct = Correct
  // Guessed Wrong <= Wrong
  const [guessedCorrect, setGuessedCorrect] = useState<number>(2);
  const [guessedWrong, setGuessedWrong] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync selected chapter
  useEffect(() => {
    if (defaultChapterId) {
      const found = chapters.find((c) => c.id === defaultChapterId);
      if (found) {
        setSelectedSubject(found.subject);
        setSelectedChapterId(found.id);
        return;
      }
    }

    // Default to first chapter of selected subject
    const subjectChapters = chapters.filter((c) => c.subject === selectedSubject);
    if (subjectChapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(subjectChapters[0].id);
    }
  }, [defaultChapterId, selectedSubject, chapters]);

  // Subject change updates default chapter
  const handleSubjectChange = (newSub: Subject) => {
    setSelectedSubject(newSub);
    const firstSubCh = chapters.find((c) => c.subject === newSub);
    if (firstSubCh) {
      setSelectedChapterId(firstSubCh.id);
    }
  };

  // Keep wrong in sync when attempted or correct changes
  const handleAttemptedChange = (val: number) => {
    const validAttempted = Math.max(0, val);
    setAttempted(validAttempted);
    if (correct > validAttempted) {
      setCorrect(validAttempted);
      setWrong(0);
    } else {
      setWrong(validAttempted - correct);
    }
  };

  const handleCorrectChange = (val: number) => {
    const validCorrect = Math.min(attempted, Math.max(0, val));
    setCorrect(validCorrect);
    setWrong(attempted - validCorrect);
    if (guessedCorrect > validCorrect) {
      setGuessedCorrect(0);
    }
  };

  const handleWrongChange = (val: number) => {
    const validWrong = Math.min(attempted, Math.max(0, val));
    setWrong(validWrong);
    setCorrect(attempted - validWrong);
    if (guessedWrong > validWrong) {
      setGuessedWrong(0);
    }
  };

  // Calculations
  const genuineSolves = Math.max(0, correct - guessedCorrect);
  const score = calculateJeeScore(correct, wrong);
  const maxPossibleScore = attempted * 4;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const totalGuesses = guessedCorrect + guessedWrong;

  const currentSelectedChapter = chapters.find((c) => c.id === selectedChapterId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedChapterId) {
      setErrorMessage('Please select a target chapter.');
      return;
    }

    if (attempted <= 0) {
      setErrorMessage('Total questions attempted must be greater than 0.');
      return;
    }

    if (correct + wrong !== attempted) {
      setErrorMessage('Sum of Correct and Wrong questions must equal Attempted questions.');
      return;
    }

    if (guessedCorrect > correct) {
      setErrorMessage('Guessed Correct questions cannot exceed Total Correct.');
      return;
    }

    if (guessedWrong > wrong) {
      setErrorMessage('Guessed Wrong questions cannot exceed Total Wrong.');
      return;
    }

    const chapterName = currentSelectedChapter ? currentSelectedChapter.name : 'Unknown Chapter';

    onSaveSession({
      chapterId: selectedChapterId,
      chapterName,
      subject: selectedSubject,
      date,
      type: practiceType,
      source: source.trim() || 'General Practice',
      attempted,
      correct,
      wrong,
      genuineSolves,
      guessCorrect: guessedCorrect,
      guessWrong: guessedWrong,
      score,
      accuracy,
      notes: notes.trim(),
    });

    onClose();
  };

  if (!isOpen) return null;

  const availableChapters = chapters.filter((c) => c.subject === selectedSubject);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0c1220] border border-white/[0.1] rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Log Practice / PYQ Session</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Record genuine vs. guessed solves with JEE marking scheme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Subject & Type Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
              <div className="flex rounded-xl bg-[#080c14] p-1 border border-white/[0.08]">
                {(['Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSubjectChange(s)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      selectedSubject === s
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s === 'Mathematics' ? 'Maths' : s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Practice Category</label>
              <div className="flex rounded-xl bg-[#080c14] p-1 border border-white/[0.08]">
                {(['PYQ Practice', 'Basic Practice'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPracticeType(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      practiceType === t
                        ? 'bg-white/10 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Chapter ({availableChapters.length} in {selectedSubject})
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.priority} Priority)
                </option>
              ))}
            </select>
          </div>

          {/* Source / Sheet Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Session Source / Reference
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. JEE Main 2024 Jan 29 S1, Allen Ex-1"
                className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Core Numbers Counter */}
          <div className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-3.5">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Attempt Breakdown</span>
              <span className="text-cyan-400 font-mono text-[11px]">JEE Rule (+4 / -1)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Attempted */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block text-center truncate">Attempted</span>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={attempted}
                  onChange={(e) => handleAttemptedChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#080c14] border border-white/[0.1] rounded-xl py-2 px-2 text-center text-base sm:text-lg font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Correct */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium block text-center truncate">Correct (+4)</span>
                <input
                  type="number"
                  min="0"
                  max={attempted}
                  value={correct}
                  onChange={(e) => handleCorrectChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#080c14] border border-emerald-500/30 rounded-xl py-2 px-2 text-center text-base sm:text-lg font-bold font-mono text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Wrong */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] text-rose-400 font-medium block text-center truncate">Wrong (-1)</span>
                <input
                  type="number"
                  min="0"
                  max={attempted}
                  value={wrong}
                  onChange={(e) => handleWrongChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#080c14] border border-rose-500/30 rounded-xl py-2 px-2 text-center text-base sm:text-lg font-bold font-mono text-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Guess Tracker Section */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guess Diagnostic</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Genuine: <strong className="text-emerald-400">{genuineSolves}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-[#080c14] p-2.5 rounded-xl border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-emerald-400/90 font-medium truncate">
                    Guessed Correct (Lucky)
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={correct}
                    value={guessedCorrect}
                    onChange={(e) => setGuessedCorrect(Math.min(correct, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-emerald-300 focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-500">Won +4 on guess</div>
                </div>

                <div className="bg-[#080c14] p-2.5 rounded-xl border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-rose-400/90 font-medium truncate">
                    Guessed Wrong (Penalty)
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={wrong}
                    value={guessedWrong}
                    onChange={(e) => setGuessedWrong(Math.min(wrong, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-rose-300 focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-500">Lost -1 on guess</div>
                </div>
              </div>
            </div>

            {/* Score & Accuracy Calculated Badge */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono bg-[#080c14] p-2.5 rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-slate-400">Score: </span>
                <span className={`font-bold ${score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {score} / {maxPossibleScore} Marks
                </span>
              </div>
              <div>
                <span className="text-slate-400">Accuracy: </span>
                <span className="font-bold text-cyan-400">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Takeaways / Specific Mistakes to Remember
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. River boat relative motion angle convention was tricky; needed 2nd read."
              rows={2}
              className="w-full bg-[#080c14] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:shadow-cyan-500/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Practice Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
