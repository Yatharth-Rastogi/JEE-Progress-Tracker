import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, Circle, AlertTriangle, ShieldCheck, 
  Play, PlusCircle, ArrowUpDown, ChevronDown, Check, BookOpen,
  Sparkles, SlidersHorizontal, RefreshCw, Eye, LayoutGrid, List
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
  const [viewMode, setViewMode] = useState<'auto' | 'cards' | 'table'>('auto');

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

  // Aggregate stats - now dynamically syncs with the selected subject filter!
  const stats = useMemo(() => {
    const targetChapters = subjectFilter === 'All' 
      ? chapters 
      : chapters.filter((c) => c.subject === subjectFilter);

    let strongCount = 0;
    let weakCount = 0;
    let veryWeakCount = 0;
    let moderateCount = 0;
    let theoryCompleted = 0;
    let totalMasterySum = 0;

    targetChapters.forEach((c) => {
      const w = calculateWeaknessLevel(c);
      if (w === 'Strong') strongCount++;
      else if (w === 'Very Weak') veryWeakCount++;
      else if (w === 'Weak') weakCount++;
      else moderateCount++;

      if (c.theoryPercent >= 98 || c.theoryStatus === 'Completed') theoryCompleted++;
      totalMasterySum += calculateMasteryPercent(c);
    });

    return {
      total: targetChapters.length,
      strongCount,
      veryWeakCount,
      weakCount,
      actionNeededCount: veryWeakCount + weakCount,
      moderateCount,
      theoryCompleted,
      avgMastery: Math.round(totalMasterySum / (targetChapters.length || 1)),
      subjectLabel: subjectFilter === 'All' ? 'All Subjects' : subjectFilter,
    };
  }, [chapters, subjectFilter]);

  const toggleSort = (newSortBy: 'id' | 'mastery' | 'name' | 'priority' | 'pyqAccuracy') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'mastery' || newSortBy === 'pyqAccuracy' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Quick Stat Cards */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official NTA Syllabus Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Master Syllabus Tracker {subjectFilter !== 'All' && <span className="text-cyan-400 font-medium">({subjectFilter})</span>}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {stats.total} {subjectFilter === 'All' ? 'complete JEE Main & Advanced' : subjectFilter} chapters with precision weighting (30% Theory, 30% Basic, 40% PYQ).
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Formula:</span>
            <span className="text-[10px] sm:text-[11px] bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              30% Theory
            </span>
            <span className="text-[10px] sm:text-[11px] bg-cyan-950/60 border border-cyan-700/40 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
              30% Basic
            </span>
            <span className="text-[10px] sm:text-[11px] bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              40% PYQ
            </span>
          </div>
        </div>

        {/* Mini metrics bar - fully synced to selected subject */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 pt-3 border-t border-white/[0.06]">
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              {subjectFilter === 'All' ? 'Total Chapters' : `${subjectFilter} Total`}
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">{stats.total}</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              Avg Mastery
            </div>
            <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono">{stats.avgMastery}%</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Theory Done</div>
            <div className="text-base sm:text-lg font-bold text-indigo-400 font-mono">{stats.theoryCompleted} / {stats.total}</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Mastered
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{stats.strongCount}</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> Moderate
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-400 font-mono">{stats.moderateCount}</div>
          </div>
          <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" /> Focus Needed
            </div>
            <div className="text-base sm:text-lg font-bold text-rose-400 font-mono flex items-baseline gap-1.5">
              <span>{stats.actionNeededCount}</span>
              {stats.veryWeakCount > 0 && (
                <span className="text-[9px] sm:text-[10px] text-rose-300/80 font-normal">
                  ({stats.veryWeakCount} low)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch lg:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chapters, units (Mechanics, Calculus, GOC), or prerequisites..."
              className="w-full bg-[#080c14] border border-white/[0.08] text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Quick Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
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

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              className="bg-[#080c14] border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
              className="bg-[#080c14] border border-white/[0.08] text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Strong">Strong / Mastered</option>
              <option value="Moderate">Moderate</option>
              <option value="Weak">Weak</option>
              <option value="Very Weak">Very Weak</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex rounded-xl bg-[#080c14] p-1 border border-white/[0.08] shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                title="Card Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'cards' || (viewMode === 'auto')
                    ? 'bg-white/10 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Spreadsheet Table View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white/10 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Result counts & Clear filters */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.05]">
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
              className="text-cyan-400 hover:text-cyan-300 underline font-medium text-[11px]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* View 1: Mobile-Optimized Card Grid (visible on mobile or when cards mode chosen) */}
      <div className={`${viewMode === 'table' ? 'hidden' : viewMode === 'cards' ? 'grid' : 'grid md:hidden'} grid-cols-1 sm:grid-cols-2 gap-3`}>
        {filteredAndSortedChapters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
            No chapters match the selected search and filter criteria.
          </div>
        ) : (
          filteredAndSortedChapters.map((chapter) => {
            const basicAcc = getBasicAccuracy(chapter);
            const pyqAcc = getPyqAccuracy(chapter);
            const genuinePercent = getGenuineSolvesPercent(chapter);
            const weakness = calculateWeaknessLevel(chapter);
            const mastery = calculateMasteryPercent(chapter);

            return (
              <div
                key={chapter.id}
                className="bg-slate-900/50 backdrop-blur-md border border-white/[0.08] hover:border-white/15 rounded-2xl p-4 space-y-3 shadow-sm transition-all"
              >
                {/* Header row: Subject badge, Unit, Priority badge, Weakness */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] border ${
                      chapter.subject === 'Physics' ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50' :
                      chapter.subject === 'Chemistry' ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50' :
                      'bg-cyan-950/70 text-cyan-300 border-cyan-700/50'
                    }`}>
                      {chapter.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {chapter.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      chapter.priority === 'Critical'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                        : chapter.priority === 'High'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {chapter.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                      weakness === 'Strong'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : weakness === 'Very Weak'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-600/80'
                        : weakness === 'Weak'
                        ? 'bg-orange-950/80 text-orange-300 border-orange-700/60'
                        : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                    }`}>
                      {weakness}
                    </span>
                  </div>
                </div>

                {/* Chapter Title */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-sm leading-snug">
                    {chapter.name}
                  </h3>
                  {chapter.strategicTier && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                      <span className="text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded font-medium">
                        {chapter.strategicTier}
                      </span>
                      {chapter.historicalWeightage && (
                        <span className="text-slate-300 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded">
                          Weight: <strong className="text-white">{chapter.historicalWeightage}</strong> • ~{chapter.avgQsPerShift} Qs
                        </span>
                      )}
                    </div>
                  )}
                  {chapter.prerequisites && chapter.prerequisites.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                      <span className="text-slate-400">Prereq:</span>
                      <span className="truncate text-slate-400 font-mono">
                        {chapter.prerequisites.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Indicators: Theory & PYQs */}
                <div className="grid grid-cols-2 gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05] text-[11px]">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Theory</span>
                      <span className="font-mono text-white font-semibold">{chapter.theoryPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${chapter.theoryPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>PYQ Accuracy</span>
                      <span className={`font-mono font-semibold ${
                        pyqAcc >= 75 ? 'text-emerald-400' : pyqAcc >= 50 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {chapter.pyqAttempted > 0 ? `${pyqAcc}%` : '0 Qs'}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {chapter.pyqCorrect}/{chapter.pyqAttempted} Solved • {chapter.genuineSolves} Gen
                    </div>
                  </div>
                </div>

                {/* Revisions & Mastery */}
                <div className="flex items-center justify-between pt-1">
                  {/* Spaced Revisions */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">Revisions:</span>
                    <button
                      onClick={() => onUpdateChapter(chapter.id, { revision1: !chapter.revision1 })}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-colors ${
                        chapter.revision1
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
                      }`}
                      title="Revision 1 (24-48h)"
                    >
                      R1
                    </button>
                    <button
                      onClick={() => onUpdateChapter(chapter.id, { revision2: !chapter.revision2 })}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-colors ${
                        chapter.revision2
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
                      }`}
                      title="Revision 2 (7 Days)"
                    >
                      R2
                    </button>
                    <button
                      onClick={() => onUpdateChapter(chapter.id, { revision3: !chapter.revision3 })}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-colors ${
                        chapter.revision3
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
                      }`}
                      title="Revision 3 (21 Days)"
                    >
                      R3
                    </button>
                  </div>

                  {/* Mastery Score */}
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Mastery</div>
                    <div className="font-mono text-sm font-bold text-cyan-400">{mastery}%</div>
                  </div>
                </div>

                {/* Quick Action Footer */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
                  <button
                    onClick={() => onOpenStudyRoom(chapter.id)}
                    className="flex-1 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-cyan-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>Watch Theory</span>
                  </button>
                  <button
                    onClick={() => onOpenQuickLogModal(chapter.id)}
                    className="flex-1 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-cyan-800/60"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Log Solves</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View 2: Desktop Spreadsheet Table (visible on md screens or when table mode chosen) */}
      <div className={`${viewMode === 'cards' ? 'hidden' : viewMode === 'table' ? 'block' : 'hidden md:block'} bg-slate-900/50 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080c14]/90 border-b border-white/[0.08] text-slate-400 select-none">
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
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
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
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Subject & Unit */}
                      <td className="py-3 px-3">
                        <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[10px] border mb-1 ${
                          chapter.subject === 'Physics' ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50' :
                          chapter.subject === 'Chemistry' ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50' :
                          'bg-cyan-950/70 text-cyan-300 border-cyan-700/50'
                        }`}>
                          {chapter.subject}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[120px]">
                          {chapter.unit}
                        </div>
                      </td>

                      {/* Chapter Name & Prerequisites */}
                      <td className="py-3 px-3 min-w-[220px] max-w-md">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug break-words">
                          {chapter.name}
                        </div>
                        {chapter.prerequisites && chapter.prerequisites.length > 0 && (
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <span className="text-slate-400 font-medium">Prereq:</span>
                            <span className="truncate max-w-[240px] text-slate-400 font-mono">
                              {chapter.prerequisites.join(', ')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Priority & Weightage */}
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          chapter.priority === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                            : chapter.priority === 'High'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {chapter.priority}
                        </span>
                        {chapter.strategicTier && (
                          <div className="text-[10px] text-cyan-300 font-mono font-medium mt-1 whitespace-nowrap">
                            {chapter.strategicTier}
                          </div>
                        )}
                        {chapter.historicalWeightage && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {chapter.historicalWeightage} (~{chapter.avgQsPerShift} Q)
                          </div>
                        )}
                      </td>

                      {/* Theory Status & % */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
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
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onUpdateChapter(chapter.id, { revision1: !chapter.revision1 })}
                            title="Revision 1: Within 24-48 hours"
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                              chapter.revision1
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
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
                                : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
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
                                : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:border-white/20'
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
                            : weakness === 'Very Weak'
                            ? 'bg-rose-950/90 text-rose-300 border-rose-600/80 font-bold'
                            : weakness === 'Weak'
                            ? 'bg-orange-950/80 text-orange-300 border-orange-700/60'
                            : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        }`}>
                          {weakness === 'Strong' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                          {(weakness === 'Weak' || weakness === 'Very Weak') && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                          {weakness}
                        </span>
                      </td>

                      {/* Overall Mastery % */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono text-sm font-bold text-white">
                          {mastery}%
                        </div>
                        <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden ml-auto mt-1 border border-white/5">
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
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 transition-colors border border-white/[0.06]"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenQuickLogModal(chapter.id)}
                            title="Log Questions / PYQs"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 transition-colors border border-white/[0.06]"
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
