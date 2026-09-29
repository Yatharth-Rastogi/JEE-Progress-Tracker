export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export type Priority = 'Critical' | 'High' | 'Medium';

export type TheoryStatus = 'Not Started' | 'In Progress' | 'Completed';

export type WeaknessLevel = 'Very Weak' | 'Weak' | 'Moderate' | 'Strong';

export type ErrorType = 
  | 'Conceptual Error' 
  | 'Calculation Mistake' 
  | 'Time Pressure' 
  | 'Silly Mistake' 
  | 'Misread Question';

export interface VideoBookmark {
  id: string;
  timeSeconds: number;
  label: string;
  timestampFormatted: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  subject: Subject;
  unit: string;
  name: string;
  priority: Priority;
  strategicTier?: string; // e.g. 'Tier 1 (Must-Master)', 'Tier 1 (High ROI)', 'Tier 2 (Core)', 'Tier 3 (Foundation)'
  historicalWeightage?: string; // e.g. '9.67%', '6.57%–9.90%'
  avgQsPerShift?: string; // e.g. '2–3', '1–2', '1', 'Integrated'
  prerequisites: string[]; // names or IDs
  
  // Theory
  theoryStatus: TheoryStatus;
  theoryPercent: number; // 0 - 100
  videoUrl?: string;
  videoTitle?: string;
  videoCurrentTime?: number; // seconds
  videoDuration?: number; // seconds
  bookmarks?: VideoBookmark[];
  theoryNotes?: string;

  // Basic Question Practice
  basicAttempted: number;
  basicCorrect: number;

  // PYQ Practice
  pyqAttempted: number;
  pyqCorrect: number;
  genuineSolves: number;
  guessAttempts: number;
  guessCorrect: number;
  guessWrong: number;

  // Revision Milestones
  revision1: boolean;
  revision2: boolean;
  revision3: boolean;

  // Last active timestamp
  lastUpdated?: string;
}

export interface PracticeSession {
  id: string;
  chapterId: string;
  chapterName: string;
  subject: Subject;
  date: string;
  type: 'PYQ Practice' | 'Basic Practice';
  source: string; // e.g. "JEE Main 2024 Jan 27 S1", "Allen Module", "HC Verma"
  attempted: number;
  correct: number;
  wrong: number;
  genuineSolves: number;
  guessCorrect: number;
  guessWrong: number;
  score: number; // +4 / -1
  accuracy: number;
  notes?: string;
  createdAt: string;
}

export interface MockTestSubjectScore {
  attempted: number;
  correct: number;
  wrong: number;
  guessCorrect: number;
  score: number;
}

export interface MockTest {
  id: string;
  title: string;
  date: string;
  testType: 'Full 300M Test' | 'Part Test' | 'Subject Mock';
  durationMinutes: number;
  physics: MockTestSubjectScore;
  chemistry: MockTestSubjectScore;
  maths: MockTestSubjectScore;
  totalScore: number;
  maxScore: number;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  overallAccuracy: number;
  guessAccuracy: number;
  notes?: string;
  createdAt: string;
}

export interface ErrorLogEntry {
  id: string;
  chapterId: string;
  chapterName: string;
  subject: Subject;
  questionSource: string; // e.g. "Mock 3 - Q14" or "JEE 2023 6th April S2"
  errorType: ErrorType;
  questionText?: string;
  correctConcept: string;
  actionItem: string;
  resolved: boolean;
  loggedAt: string;
}

export interface AppState {
  chapters: Chapter[];
  practiceSessions: PracticeSession[];
  mockTests: MockTest[];
  errorLogs: ErrorLogEntry[];
  activeChapterIdForStudyRoom: string;
  targetExamYear: number;
  dailyGoalQuestions: number;
}
