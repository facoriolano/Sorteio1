export interface Question {
  id: string;
  theme: string;
  questionText: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswerText: string;
  correctLetter: 'A' | 'B' | 'C' | 'D';
}

export interface ThemeStats {
  themeName: string;
  totalQuestions: number;
  completed: boolean;
  highScore: number;
}

export interface QuizState {
  currentTheme: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  selectedOptionLetter: 'A' | 'B' | 'C' | 'D' | null;
  isConfirmed: boolean;
  score: {
    correct: number;
    incorrect: number;
    streak: number;
    maxStreak: number;
  };
  history: {
    questionId: string;
    correct: boolean;
  }[];
}
