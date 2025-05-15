export interface QuizQuestion {
  id: number;
  text: string;
  options: Record<string, string>;
  correctAnswer: string;
}

export interface Quiz {
  quizId: string;
  questions: QuizQuestion[];
}

export interface UserAnswers {
  [key: number]: string;
}

export interface EvaluationResponse {
  correct: number;
  total: number;
  feedback: Array<{
    id: number;
    yourAnswer: string | null;
    correctAnswer: string;
  }>;
}

export type notifySeverityType = 'error' | 'warning' | 'info' | 'success';