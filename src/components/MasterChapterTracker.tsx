import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, Circle, AlertTriangle, ShieldCheck, 
  Play, PlusCircle, ArrowUpDown, ChevronDown, Check, BookOpen,
  Sparkles, SlidersHorizontal, RefreshCw, Eye
} from 'lucide-react';
import { Chapter, Subject, Priority, WeaknessLevel } from '../types/jee';
import { 
  getBasicAccuracy, getPyqAccuracy, getGenuineSolvesPercent, 
  calculateWeaknessLevel, calculateMasteryPercent 
} from '../utils/calculations';

interface MasterChapterTrackerProps {
  chapters: Chapter[];
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  onOpenStudyRoom: (chapterId: string) => void;
  onOpenQuickLogModal: (chapterId: string) => void;
}

export const MasterChapterTracker: React.FC<MasterChapterTrackerProps> = ({
  chapters,
  onUpdateChapter,
  onOpenStudyRoom,
  onOpenQuickLogModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [weaknessFilter, setWeaknessFilter] = useState<WeaknessLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<'id' | 'mastery' | 'name' | 'priority' | 'pyqAccuracy'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Chapter quick editing inline modal/row
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // Filter & sort logic
  const filteredAndSortedChapters = useMemo(() => {
    return chapters
      .filter((c) => {
        const matchesSubject = subjectFilter === 'All' || c.subject === subjectFilter;
        const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
        const weakness = calculateWeaknessLevel(c);
        const matchesWeakness = weaknessFilter === 'All' || weakness === weaknessFilter;
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.prerequisites && c.prerequisites.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())));

        return matchesSubject && matchesPriority && matchesWeakness && matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'mastery') {
          comparison = calculateMasteryPercent(a) - calculateMasteryPercent(b);
        } else if (sortBy === 'pyqAccuracy') {
          comparison = getPyqAccuracy(a) - getPyqAccuracy(b);
        } else if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'priority') {
          const rank = { Critical: 3, High: 2, Medium: 1 };
          comparison = rank[a.priority] - rank[b.priority];
        } else {
          comparison = a.id.localeCompare(b.id);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [chapters, searchTerm, subjectFilter, priorityFilter, weaknessFilter, sortBy, sortOrder]);

  // Aggregate stats
  const stats = useMemo(() => {
    let strongCount = 0;
    let weakCount = 0;
    let moderateCount = 0;
    let theoryCompleted = 0;
    let totalMasterySum = 0;

    chapters.forEach((c) => {
      const w = calculateWeaknessLevel(c);
      if (w === 'Strong') strongCount++;
      else if (w === 'Weak') weakCount++;
      else moderateCount++;

      if (c.theoryPercent >= 98 || c.theoryStatus === 'Completed') theoryCompleted++;
      totalMasterySum += calculateMasteryPercent(c);
    });

    return {
      total: chapters.length,
      strongCount,
      weakCount,
      moderateCount,
      theoryCompleted,
      avgMastery: Math.round(totalMasterySum / (chapters.length || 1)),
    };
  }, [chapters]);

  const toggleSort = (newSortBy: 'id' | 'mastery' | 'name' | 'priority' | 'pyqAccuracy') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'mastery' || newSortBy === 'pyqAccuracy' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stat Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>NTA Official Syllabus Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Master Chapter Tracker</h1>
            <p className="text-slate-400 text-xs mt-1">
              {chapters.length} official JEE Main & Advanced chapters with real-time mastery weighting: 30% Theory + 30% Basic Q + 40% PYQ.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Mastery Weighting:</span>
            <span className="text-[11px] bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              Theory (30%)
            </span>
            <span className="text-[11px] bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
              Basic Q (30%)
            </span>
            <span className="text-[11px] bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              PYQ (40%)
            </span>
          </div>
        </div>

        {/* Mini metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Total Chapters</div>
            <div className="text-lg font-bold text-white font-mono">{stats.total}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Avg Syllabus Mastery</div>
            <div className="text-lg font-bold text-cyan-400 font-mono">{stats.avgMastery}%</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Theory Completed</div>
            <div className="text-lg font-bold text-indigo-400 font-mono">{stats.theoryCompleted} / {stats.total}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Strong / Mastered
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">{stats.strongCount}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono">{stats.moderateCount}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Weak (Action Needed)
            </div>
            <div className="text-lg font-bold text-rose-400 font-mono">{stats.weakCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by chapter name, unit (e.g. Mechanics, Calculus, GOC), or prerequisite..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                    subjectFilter === s
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s === 'Mathematics' ? 'Maths' : s}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
            </select>

            {/* Weakness Filter */}
            <select
              value={weaknessFilter}
              onChange={(e) => setWeaknessFilter(e.target.value as WeaknessLevel | 'All')}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Weakness Levels</option>
              <option value="Strong">Strong / Mastered</option>
              <option value="Moderate">Moderate</option>
              <option value="Weak">Weak (Needs Help)</option>
            </select>
          </div>
        </div>

        {/* Result counts & Clear filters */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            Showing <span className="text-white font-mono font-bold">{filteredAndSortedChapters.length}</span> of {chapters.length} chapters
          </div>
          {(searchTerm || subjectFilter !== 'All' || priorityFilter !== 'All' || weaknessFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSubjectFilter('All');
                setPriorityFilter('All');
                setWeaknessFilter('All');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 select-none">
                <th 
                  onClick={() => toggleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Subject / Unit</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:text-white min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Chapter Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('priority')}
                  className="py-3 px-2 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Theory %</th>
                <th className="py-3 px-3">Basic Practice</th>
                <th 
                  onClick={() => toggleSort('pyqAccuracy')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>PYQ Solves & Guess</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">Spaced Revisions</th>
                <th className="py-3 px-2 text-center">Weakness</th>
                <th 
                  onClick={() => toggleSort('mastery')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Mastery %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredAndSortedChapters.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No chapters match the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedChapters.map((chapter) => {
                  const basicAcc = getBasicAccuracy(chapter);
                  const pyqAcc = getPyqAccuracy(chapter);
                  const genuinePercent = getGenuineSolvesPercent(chapter);
                  const weakness = calculateWeaknessLevel(chapter);
                  const mastery = calculateMasteryPercent(chapter);

                  return (
                    <tr
                      key={chapter.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Subject & Unit */}
                      <td className="py-3 px-3">
                        <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] border mb-1 ${
                          chapter.subject === 'Physics' ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50' :
                          chapter.subject === 'Chemistry' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50' :
                          'bg-cyan-950/80 text-cyan-300 border-cyan-700/50'
                        }`}>
                          {chapter.subject}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
                          {chapter.unit}
                        </div>
                      </td>

                      {/* Chapter Name & Prerequisites */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {chapter.name}
                        </div>
                        {chapter.prerequisites && chapter.prerequisites.length > 0 && (
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <span className="text-slate-400">Prereq:</span>
                            <span className="truncate max-w-[200px] text-slate-400">
                              {chapter.prerequisites.join(', ')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          chapter.priority === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                            : chapter.priority === 'High'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {chapter.priority}
                        </span>
                      </td>

                      {/* Theory Status & % */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${chapter.theoryPercent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-slate-200">
                            {chapter.theoryPercent}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {chapter.theoryStatus}
                        </div>
                      </td>

                      {/* Basic Practice */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-[11px] text-slate-200">
                          {chapter.basicCorrect} / {chapter.basicAttempted}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {chapter.basicAttempted > 0 ? `${basicAcc}% acc` : 'Not tested'}
                        </div>
                      </td>

                      {/* PYQ Practice & Guess Breakdown */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-[11px]">
                            {chapter.pyqCorrect} / {chapter.pyqAttempted}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            pyqAcc >= 75 ? 'bg-emerald-950 text-emerald-300' :
                            pyqAcc >= 50 ? 'bg-amber-950 text-amber-300' :
                            chapter.pyqAttempted === 0 ? 'bg-slate-800 text-slate-400' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {chapter.pyqAttempted > 0 ? `${pyqAcc}%` : '0 PYQ'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono flex items-center gap-2">
                          <span title="Genuine Solves (No Guessing)">
                            🧠 {chapter.genuineSolves} genuine
                          </span>
                          {chapter.guessAttempts > 0 && (
                            <span className="text-amber-400/90" title={`Guesses: ${chapter.guessCorrect} Correct, ${chapter.guessWrong} Wrong`}>
                              🎯 {chapter.guessCorrect}G✓ / {chapter.guessWrong}G✗
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Spaced Revisions: R1, R2, R3 */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onUpdateChapter(chapter.id, { revision1: !chapter.revision1 })}
                            title="Revision 1: Within 24-48 hours"
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              chapter.revision1
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            R1
                          </button>
                          <button
                            onClick={() => onUpdateChapter(chapter.id, { revision2: !chapter.revision2 })}
                            title="Revision 2: 7 Days after"
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              chapter.revision2
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            R2
                          </button>
                          <button
                            onClick={() => onUpdateChapter(chapter.id, { revision3: !chapter.revision3 })}
                            title="Revision 3: 21 Days after"
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              chapter.revision3
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            R3
                          </button>
                        </div>
                      </td>

                      {/* Weakness Level */}
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          weakness === 'Strong'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                            : weakness === 'Weak'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700/60 animate-pulse'
                            : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        }`}>
                          {weakness === 'Strong' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                          {weakness === 'Weak' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                          {weakness}
                        </span>
                      </td>

                      {/* Overall Mastery % */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono text-sm font-bold text-white">
                          {mastery}%
                        </div>
                        <div className="w-20 bg-slate-950 rounded-full h-1.5 overflow-hidden ml-auto mt-1 border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              mastery >= 75 ? 'bg-emerald-400' :
                              mastery >= 45 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${mastery}%` }}
                          />
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenStudyRoom(chapter.id)}
                            title="Open Theory Study Room & Video Player"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-400 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenQuickLogModal(chapter.id)}
                            title="Log Questions / PYQs"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
