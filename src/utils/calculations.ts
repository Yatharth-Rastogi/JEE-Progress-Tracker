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
 * - Strong/Mastered: PYQ Accuracy >= 75% AND Genuine Solves >= 10
 * - Weak: (pyqAttempted > 0 && pyqAccuracy < 50%) OR (pyqAttempted - pyqCorrect > 5)
 * - Moderate: otherwise
 */
export function calculateWeaknessLevel(chapter: Pick<Chapter, 'pyqAttempted' | 'pyqCorrect' | 'genuineSolves'>): WeaknessLevel {
  const attempted = chapter.pyqAttempted || 0;
  const correct = chapter.pyqCorrect || 0;
  const genuineSolves = chapter.genuineSolves || 0;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  const errorCount = attempted - correct;

  if (attempted >= 10 && accuracy >= 75 && genuineSolves >= 10) {
    return 'Strong';
  }

  if (attempted > 0 && (accuracy < 50 || errorCount > 5)) {
    return 'Weak';
  }

  return 'Moderate';
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
