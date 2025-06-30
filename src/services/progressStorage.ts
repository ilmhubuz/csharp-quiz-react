import type {
  UserProgress,
  CategoryProgress,
  TypeProgress,
  QuizSession,
  TopicCategory,
  QuestionType,
  DifficultyLevel,
  Question
} from '../types';

const STORAGE_KEY = 'csharp-quiz-progress';

// Default empty progress structure
const createDefaultProgress = (): UserProgress => ({
  totalQuestionsAnswered: 0,
  overallSuccessRate: 0,
  categoryProgress: {} as Record<TopicCategory, CategoryProgress>,
  typeProgress: {} as Record<QuestionType, TypeProgress>,
  questionProgress: {},
  sessions: [],
  lastActivityAt: new Date().toISOString(),
  stats: {
    totalTimeSpent: 0,
    averageSessionDuration: 0,
    longestStreak: 0,
    currentStreak: 0,
  },
});

// Initialize category progress
const createCategoryProgress = (category: TopicCategory, questions: Question[]): CategoryProgress => {
  const categoryQuestions = questions.filter(q => q.metadata.category === category);
  
  // Initialize difficulty breakdown with all possible difficulty levels found in questions
  const difficultyBreakdown: Record<DifficultyLevel, { total: number; answered: number; correct: number }> = {} as any;
  
  // First, initialize all known difficulty levels
  const knownDifficulties: DifficultyLevel[] = ['boshlang\'ich', 'o\'rta', 'murakkab'];
  knownDifficulties.forEach(difficulty => {
    difficultyBreakdown[difficulty] = { total: 0, answered: 0, correct: 0 };
  });

  // Then count questions for each difficulty, creating entries if they don't exist
  categoryQuestions.forEach(q => {
    const difficulty = q.metadata.difficulty;
    if (!difficultyBreakdown[difficulty]) {
      difficultyBreakdown[difficulty] = { total: 0, answered: 0, correct: 0 };
    }
    difficultyBreakdown[difficulty].total++;
  });

  return {
    category,
    totalQuestions: categoryQuestions.length,
    answeredQuestions: 0,
    correctAnswers: 0,
    averageTimePerQuestion: 0,
    successRate: 0,
    difficultyBreakdown,
  };
};

// Initialize type progress
const createTypeProgress = (questionType: QuestionType, questions: Question[]): TypeProgress => {
  const typeQuestions = questions.filter(q => q.type === questionType);
  
  return {
    questionType,
    totalQuestions: typeQuestions.length,
    answeredQuestions: 0,
    correctAnswers: 0,
    averageTimePerQuestion: 0,
    successRate: 0,
  };
};

class ProgressStorage {
  private progress: UserProgress | null = null;

  // Load progress from localStorage
  loadProgress(): UserProgress {
    if (this.progress) return this.progress;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.progress = JSON.parse(stored);
        return this.progress!;
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }

    this.progress = createDefaultProgress();
    return this.progress;
  }

  // Save progress to localStorage
  saveProgress(progress: UserProgress): void {
    try {
      this.progress = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }

  // Initialize progress with questions data
  initializeProgress(questions: Question[]): UserProgress {
    const progress = this.loadProgress();
    
    // Initialize category progress if not exists
    const categories: TopicCategory[] = [
      'asosiy-til-xususiyatlari',
      'tip-tizimi-oop',
      'metod-xususiyatlari',
      'kolleksiyalar-ma\'lumot-tuzilmalari',
      'linq-funksional-dasturlash',
      'ilg\'or-mavzular'
    ];

    categories.forEach(category => {
      if (!progress.categoryProgress[category]) {
        progress.categoryProgress[category] = createCategoryProgress(category, questions);
      }
    });

    // Initialize type progress if not exists
    const types: QuestionType[] = ['mcq', 'true_false', 'fill', 'error_spotting', 'output_prediction', 'code_writing'];
    
    types.forEach(type => {
      if (!progress.typeProgress[type]) {
        progress.typeProgress[type] = createTypeProgress(type, questions);
      }
    });

    this.saveProgress(progress);
    return progress;
  }

  // Update question progress
  updateQuestionProgress(
    questionId: number, 
    userAnswer: string[] | string, 
    isCorrect: boolean, 
    timeSpent?: number
  ): void {
    const progress = this.loadProgress();
    
    const existing = progress.questionProgress[questionId];
    const isFirstAnswer = !existing || !existing.isAnswered;

    progress.questionProgress[questionId] = {
      questionId,
      isAnswered: true,
      isCorrect,
      attempts: existing ? existing.attempts + 1 : 1,
      timeSpent: timeSpent || existing?.timeSpent,
      userAnswer,
      answeredAt: new Date().toISOString(),
    };

    // Update total questions answered if this is the first time answering
    if (isFirstAnswer) {
      progress.totalQuestionsAnswered++;
    }

    progress.lastActivityAt = new Date().toISOString();
    this.saveProgress(progress);
  }

  // Update category and type progress based on current question progress
  updateAggregateProgress(questions: Question[]): void {
    const progress = this.loadProgress();
    
    // Reset aggregate data
    Object.keys(progress.categoryProgress).forEach(category => {
      const cat = category as TopicCategory;
      progress.categoryProgress[cat].answeredQuestions = 0;
      progress.categoryProgress[cat].correctAnswers = 0;
      Object.keys(progress.categoryProgress[cat].difficultyBreakdown).forEach(diff => {
        const difficulty = diff as DifficultyLevel;
        progress.categoryProgress[cat].difficultyBreakdown[difficulty].answered = 0;
        progress.categoryProgress[cat].difficultyBreakdown[difficulty].correct = 0;
      });
    });

    Object.keys(progress.typeProgress).forEach(type => {
      const typ = type as QuestionType;
      progress.typeProgress[typ].answeredQuestions = 0;
      progress.typeProgress[typ].correctAnswers = 0;
    });

    // Recalculate from question progress
    let totalCorrect = 0;
    let totalAnswered = 0;

    Object.values(progress.questionProgress).forEach(qp => {
      if (!qp.isAnswered) return;

      const question = questions.find(q => q.id === qp.questionId);
      if (!question) return;

      totalAnswered++;
      if (qp.isCorrect) totalCorrect++;

      // Update category progress
      const categoryProg = progress.categoryProgress[question.metadata.category];
      if (categoryProg) {
        categoryProg.answeredQuestions++;
        if (qp.isCorrect) categoryProg.correctAnswers++;
        
        const difficulty = question.metadata.difficulty;
        // Ensure the difficulty level exists in the breakdown
        if (!categoryProg.difficultyBreakdown[difficulty]) {
          categoryProg.difficultyBreakdown[difficulty] = { total: 0, answered: 0, correct: 0 };
        }
        
        const diffBreakdown = categoryProg.difficultyBreakdown[difficulty];
        diffBreakdown.answered++;
        if (qp.isCorrect) diffBreakdown.correct++;
      }

      // Update type progress
      const typeProg = progress.typeProgress[question.type];
      if (typeProg) {
        typeProg.answeredQuestions++;
        if (qp.isCorrect) typeProg.correctAnswers++;
      }
    });

    // Update success rates
    progress.overallSuccessRate = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    Object.keys(progress.categoryProgress).forEach(category => {
      const cat = category as TopicCategory;
      const catProg = progress.categoryProgress[cat];
      catProg.successRate = catProg.answeredQuestions > 0 
        ? (catProg.correctAnswers / catProg.answeredQuestions) * 100 
        : 0;
    });

    Object.keys(progress.typeProgress).forEach(type => {
      const typ = type as QuestionType;
      const typeProg = progress.typeProgress[typ];
      typeProg.successRate = typeProg.answeredQuestions > 0 
        ? (typeProg.correctAnswers / typeProg.answeredQuestions) * 100 
        : 0;
    });

    this.saveProgress(progress);
  }

  // Create and save a new quiz session
  createSession(
    mode: 'category' | 'type' | 'mixed',
    questions: number[],
    filter: {
      categories?: TopicCategory[];
      types?: QuestionType[];
      difficulties?: DifficultyLevel[];
    }
  ): QuizSession {
    const session: QuizSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${mode === 'category' ? 'Category' : mode === 'type' ? 'Type' : 'Mixed'} Quiz`,
      mode,
      filter,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      startedAt: new Date().toISOString(),
      isCompleted: false,
    };

    const progress = this.loadProgress();
    progress.sessions.push(session);
    this.saveProgress(progress);

    return session;
  }

  // Update session progress
  updateSession(sessionId: string, updates: Partial<QuizSession>): void {
    const progress = this.loadProgress();
    const sessionIndex = progress.sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      const currentSession = progress.sessions[sessionIndex];
      progress.sessions[sessionIndex] = {
        ...currentSession,
        ...Object.fromEntries(
          Object.entries(updates).filter(([_, value]) => value !== undefined)
        )
      } as QuizSession;
      this.saveProgress(progress);
    }
  }

  // Clear all progress (for reset functionality)
  clearProgress(): void {
    this.progress = createDefaultProgress();
    localStorage.removeItem(STORAGE_KEY);
  }

  // Get progress statistics
  getProgressStats(): {
    totalQuestions: number;
    answeredQuestions: number;
    overallSuccessRate: number;
    categoryStats: Array<{ category: TopicCategory; progress: CategoryProgress }>;
    typeStats: Array<{ type: QuestionType; progress: TypeProgress }>;
  } {
    const progress = this.loadProgress();
    
    return {
      totalQuestions: Object.values(progress.categoryProgress).reduce((sum, cat) => sum + cat.totalQuestions, 0),
      answeredQuestions: progress.totalQuestionsAnswered,
      overallSuccessRate: progress.overallSuccessRate,
      categoryStats: Object.entries(progress.categoryProgress).map(([category, categoryProgress]) => ({
        category: category as TopicCategory,
        progress: categoryProgress,
      })),
      typeStats: Object.entries(progress.typeProgress).map(([type, typeProgress]) => ({
        type: type as QuestionType,
        progress: typeProgress,
      })),
    };
  }
}

// Export singleton instance
export const progressStorage = new ProgressStorage(); 