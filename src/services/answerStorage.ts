const ANSWER_STORAGE_KEY = 'quiz_answers';

export interface AnswerData {
  [questionId: number]: string[] | string;
}

class AnswerStorage {
  // Load all saved answers from localStorage
  loadAnswers(): AnswerData {
    try {
      const stored = localStorage.getItem(ANSWER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading answers from localStorage:', error);
    }
    return {};
  }

  // Save answer for a specific question
  saveAnswer(questionId: number, answer: string[] | string): void {
    try {
      const currentAnswers = this.loadAnswers();
      currentAnswers[questionId] = answer;
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(currentAnswers));
    } catch (error) {
      console.error('Error saving answer to localStorage:', error);
    }
  }

  // Get answer for a specific question
  getAnswer(questionId: number): string[] | string | undefined {
    const answers = this.loadAnswers();
    return answers[questionId];
  }

  // Clear all saved answers
  clearAnswers(): void {
    try {
      localStorage.removeItem(ANSWER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing answers from localStorage:', error);
    }
  }

  // Clear answer for a specific question
  clearAnswer(questionId: number): void {
    try {
      const currentAnswers = this.loadAnswers();
      delete currentAnswers[questionId];
      localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(currentAnswers));
    } catch (error) {
      console.error('Error clearing specific answer from localStorage:', error);
    }
  }

  // Check if a question has a saved answer
  hasAnswer(questionId: number): boolean {
    const answer = this.getAnswer(questionId);
    if (answer === undefined) return false;
    
    if (Array.isArray(answer)) {
      return answer.length > 0;
    } else {
      return typeof answer === 'string' && answer.trim() !== '';
    }
  }

  // Get answers for a list of question IDs
  getAnswersForQuestions(questionIds: number[]): AnswerData {
    const allAnswers = this.loadAnswers();
    const filteredAnswers: AnswerData = {};
    
    questionIds.forEach(id => {
      if (allAnswers[id] !== undefined) {
        filteredAnswers[id] = allAnswers[id];
      }
    });
    
    return filteredAnswers;
  }
}

// Export singleton instance
export const answerStorage = new AnswerStorage();

// Answer validation and scoring functionality
export function validateAnswer(questionId: number, userAnswer: any, questions: any[]): boolean {
  const question = questions.find(q => q.id === questionId);
  if (!question) return false;

  const correctAnswer = question.answer;
  
  // Handle different question types
  switch (question.type) {
    case 'mcq':
      // MCQ answers are arrays of option IDs
      if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
        return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());
      }
      return false;
      
    case 'true_false':
      // True/false answers are strings
      return userAnswer === correctAnswer;
      
    case 'error_spotting':
    case 'output_prediction':
    case 'code_writing':
    case 'fill':
      // Text-based answers - exact match (case-insensitive, trimmed)
      if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
        return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      }
      return false;
      
    default:
      return false;
  }
}

export function calculateOverallStats(questions: any[]): any {
  const savedAnswers = answerStorage.loadAnswers();
  
  const stats = {
    totalQuestions: questions.length,
    answeredQuestions: 0,
    correctAnswers: 0,
    overallSuccessRate: 0
  };

  for (const question of questions) {
    const userAnswer = savedAnswers[question.id];
    if (userAnswer !== undefined) {
      stats.answeredQuestions++;
      if (validateAnswer(question.id, userAnswer, questions)) {
        stats.correctAnswers++;
      }
    }
  }

  stats.overallSuccessRate = stats.answeredQuestions > 0 ? (stats.correctAnswers / stats.answeredQuestions) * 100 : 0;

  return stats;
}

export function calculateCategoryStats(questions: any[]): any[] {
  const savedAnswers = answerStorage.loadAnswers();
  const categoryMap: Record<string, any> = {};

  // Initialize categories
  questions.forEach(question => {
    const category = question.metadata.category;
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        successRate: 0
      };
    }
    categoryMap[category].totalQuestions++;
  });

  // Calculate progress for each category
  questions.forEach(question => {
    const category = question.metadata.category;
    const userAnswer = savedAnswers[question.id];
    
    if (userAnswer !== undefined) {
      categoryMap[category].answeredQuestions++;
      if (validateAnswer(question.id, userAnswer, questions)) {
        categoryMap[category].correctAnswers++;
      }
    }
  });

  // Calculate success rates
  Object.values(categoryMap).forEach((categoryStats: any) => {
    categoryStats.successRate = categoryStats.answeredQuestions > 0 
      ? (categoryStats.correctAnswers / categoryStats.answeredQuestions) * 100 
      : 0;
  });

  return Object.values(categoryMap);
}

export function calculateTypeStats(questions: any[]): any[] {
  const savedAnswers = answerStorage.loadAnswers();
  const typeMap: Record<string, any> = {};

  // Initialize types
  questions.forEach(question => {
    const questionType = question.type;
    if (!typeMap[questionType]) {
      typeMap[questionType] = {
        questionType,
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        successRate: 0
      };
    }
    typeMap[questionType].totalQuestions++;
  });

  // Calculate progress for each type
  questions.forEach(question => {
    const questionType = question.type;
    const userAnswer = savedAnswers[question.id];
    
    if (userAnswer !== undefined) {
      typeMap[questionType].answeredQuestions++;
      if (validateAnswer(question.id, userAnswer, questions)) {
        typeMap[questionType].correctAnswers++;
      }
    }
  });

  // Calculate success rates
  Object.values(typeMap).forEach((typeStats: any) => {
    typeStats.successRate = typeStats.answeredQuestions > 0 
      ? (typeStats.correctAnswers / typeStats.answeredQuestions) * 100 
      : 0;
  });

  return Object.values(typeMap);
} 