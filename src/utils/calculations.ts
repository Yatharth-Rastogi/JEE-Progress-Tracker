import { Chapter, WeaknessLevel } from '../types/jee';

export function getBasicAccuracy(chapter: Pick<Chapter, 'basicAttempted' | 'basicCorrect'>): number {
  if (!chapter.basicAttempted || chapter.basicAttempted === 0) return 0;
  return Math.min(100, Math.round((chapter.basicCorrect / chapter.basicAttempted) * 100));
}

export function getPyqAccuracy(chapter: Pick<Chapter, 'pyqAttempted' | 'pyqCorrect'>): number {
  if (!chapter.pyqAttempted || chapter.pyqAttempted === 0) return 0;
  return Math.min(100, Math.round((chapter.pyqCorrect / chapter.pyqAttempted) * 100));
}

export function getGenuineSolvesPercent(chapter: Pick<Chapter, 'pyqAttempted' | 'genuineSolves'>): number {
  if (!chapter.pyqAttempted || chapter.pyqAttempted === 0) return 0;
  return Math.min(100, Math.round((chapter.genuineSolves / chapter.pyqAttempted) * 100));
}

/**
 * Weakness Level rule:
 * - Very Weak:
 *   - Untouched or early theory (< 50% theory) with 0 or minimal practice (< 5 questions)
 *   - Practiced with severe failure (accuracy < 40% or >= 6 errors)
 * - Weak:
 *   - Partial or completed theory (>= 50%) but 0 questions practiced (untested in exam conditions)
 *   - Practiced with low accuracy (accuracy < 55% or > 3 errors)
 *   - Minimal question sample (< 5 questions) even if theory >= 50%
 * - Moderate:
 *   - Substantial theory (>= 50%) AND verified practice (>= 5 questions solved with >= 55% accuracy and no severe errors)
 * - Strong:
 *   - High mastery (>= 50% theory, >= 10 PYQs attempted with >= 75% accuracy and >= 10 genuine solves)
 */
export function calculateWeaknessLevel(
  chapter: Pick<Chapter, 'pyqAttempted' | 'pyqCorrect' | 'genuineSolves'> & {
    basicAttempted?: number;
    basicCorrect?: number;
    theoryPercent?: number;
    theoryStatus?: string;
  }
): WeaknessLevel {
  const pyqAttempted = chapter.pyqAttempted || 0;
  const pyqCorrect = chapter.pyqCorrect || 0;
  const genuineSolves = chapter.genuineSolves || 0;
  const basicAttempted = chapter.basicAttempted || 0;
  const basicCorrect = chapter.basicCorrect || 0;
  const theoryPercent = chapter.theoryPercent || 0;

  const totalAttempted = pyqAttempted + basicAttempted;
  const totalCorrect = pyqCorrect + basicCorrect;
  const pyqAccuracy = pyqAttempted > 0 ? (pyqCorrect / pyqAttempted) * 100 : 0;
  const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
  const pyqErrorCount = pyqAttempted - pyqCorrect;
  const totalErrorCount = totalAttempted - totalCorrect;

  // 1. Zero Questions Practiced
  if (totalAttempted === 0) {
    // If student hasn't reached at least 50% theory, it is Very Weak
    if (theoryPercent < 50) {
      return 'Very Weak';
    }
    // If theory is >= 50% but 0 questions have been tested, it remains Weak (needs practice)
    return 'Weak';
  }

  // 2. High Mastery: At least 10 PYQs with >= 75% accuracy and >= 10 genuine solves, plus solid theory
  if (theoryPercent >= 50 && pyqAttempted >= 10 && pyqAccuracy >= 75 && genuineSolves >= 10) {
    return 'Strong';
  }

  // 3. Severe Practice Issues (Accuracy < 40% or >= 6 errors)
  if (
    (pyqAttempted > 0 && pyqAccuracy < 40) ||
    (totalAttempted >= 5 && overallAccuracy < 40) ||
    pyqErrorCount >= 6 ||
    totalErrorCount >= 6
  ) {
    return 'Very Weak';
  }

  // 4. Low Accuracy / Noticeable Struggle (Accuracy < 55% or > 3 errors)
  if (
    (pyqAttempted > 0 && pyqAccuracy < 55) ||
    (totalAttempted >= 5 && overallAccuracy < 55) ||
    pyqErrorCount > 3 ||
    totalErrorCount > 3
  ) {
    return 'Weak';
  }

  // 5. Minimal Practice Sample Size (< 5 questions attempted)
  if (totalAttempted < 5) {
    return theoryPercent < 50 ? 'Very Weak' : 'Weak';
  }

  // 6. Moderate: Decent theory (>= 50%) AND at least 5 questions solved with >= 55% accuracy
  if (theoryPercent >= 50 && overallAccuracy >= 55) {
    return 'Moderate';
  }

  return theoryPercent < 50 ? 'Very Weak' : 'Weak';
}

/**
 * Overall Mastery % formula:
 * Mastery % = (0.3 * Theory %) + (0.3 * Basic Q Accuracy %) + (0.4 * PYQ Accuracy %)
 */
export function calculateMasteryPercent(chapter: Chapter): number {
  const theory = Math.min(100, Math.max(0, chapter.theoryPercent || 0));
  const basicAcc = getBasicAccuracy(chapter);
  const pyqAcc = getPyqAccuracy(chapter);

  const mastery = (0.3 * theory) + (0.3 * basicAcc) + (0.4 * pyqAcc);
  return Math.min(100, Math.max(0, Math.round(mastery)));
}

/**
 * Calculate JEE Score: +4 for correct, -1 for wrong
 */
export function calculateJeeScore(correct: number, wrong: number): number {
  return (correct * 4) - (wrong * 1);
}

/**
 * Extracts YouTube Video ID from any standard URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Standard full or short patterns
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ
  // https://www.youtube.com/embed/dQw4w9WgXcQ
  // https://www.youtube.com/shorts/dQw4w9WgXcQ
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // If user pasted pure 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatSeconds(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Safely stringifies an object without throwing TypeError: Converting circular structure to JSON.
 * Ignores circular references and DOM nodes/React fibers.
 */
export function safeJsonStringify(obj: any, indent?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (_key, value) => {
      if (
        typeof window !== 'undefined' &&
        (value instanceof Element ||
          value instanceof Node ||
          value instanceof Window ||
          (value && typeof value === 'object' && ('nodeType' in value || 'stateNode' in value)))
      ) {
        return undefined;
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }
      return value;
    },
    indent
  );
}
