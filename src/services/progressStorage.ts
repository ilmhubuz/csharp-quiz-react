import type {
    UserProgress,
    CategoryProgress,
    TypeProgress,
    QuizSession,
    TopicCategory,
    QuestionType,
    Question,
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
const createCategoryProgress = (
    category: TopicCategory,
    questions: Question[],
): CategoryProgress => {
    const categoryQuestions = questions.filter(
        q => q.metadata.category === category
    );

    return {
        category,
        totalQuestions: categoryQuestions.length,
        answeredQuestions: 0,
        correctAnswers: 0,
        averageTimePerQuestion: 0,
        successRate: 0,
    };
};

// Initialize type progress
const createTypeProgress = (
    questionType: QuestionType,
    questions: Question[],
): TypeProgress => {
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
            "kolleksiyalar-ma'lumot-tuzilmalari",
            'linq-funksional-dasturlash',
            "ilg'or-mavzular",
            'exception-handling',
        ];

        categories.forEach(category => {
            if (!progress.categoryProgress[category]) {
                progress.categoryProgress[category] = createCategoryProgress(
                    category,
                    questions
                );
            }
        });

        // Initialize type progress if not exists
        const types: QuestionType[] = [
            'mcq',
            'true_false',
            'fill',
            'error_spotting',
            'output_prediction',
            'code_writing',
        ];
        types.forEach(type => {
            if (!progress.typeProgress[type]) {
                progress.typeProgress[type] = createTypeProgress(
                    type,
                    questions
                );
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
            totalAnswered++;
            if (qp.isCorrect) totalCorrect++;

            const question = questions.find(q => q.id === qp.questionId);
            if (!question) return;

            const categoryProg =
                progress.categoryProgress[question.metadata.category];
            const typeProg = progress.typeProgress[question.type];

            if (categoryProg) {
                categoryProg.answeredQuestions++;
                if (qp.isCorrect) categoryProg.correctAnswers++;
            }
            if (typeProg) {
                typeProg.answeredQuestions++;
                if (qp.isCorrect) typeProg.correctAnswers++;
            }
        });

        // Calculate success rates
        progress.totalQuestionsAnswered = totalAnswered;
        progress.overallSuccessRate =
            totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

        Object.values(progress.categoryProgress).forEach(cat => {
            cat.successRate =
                cat.answeredQuestions > 0
                    ? (cat.correctAnswers / cat.answeredQuestions) * 100
                    : 0;
        });
        Object.values(progress.typeProgress).forEach(type => {
            type.successRate =
                type.answeredQuestions > 0
                    ? (type.correctAnswers / type.answeredQuestions) * 100
                    : 0;
        });

        this.saveProgress(progress);
    }

    // Create a new quiz session
    createSession(
        mode: 'category' | 'type' | 'mixed',
        questions: number[],
        filter: {
            categories?: TopicCategory[];
            types?: QuestionType[];
        },
    ): QuizSession {
        const progress = this.loadProgress();

        const session: QuizSession = {
            id: Date.now().toString(),
            name: `Quiz ${new Date().toLocaleDateString()}`,
            mode,
            filter,
            questions,
            currentQuestionIndex: 0,
            answers: {},
            startedAt: new Date().toISOString(),
            isCompleted: false,
        };

        progress.sessions.push(session);
        this.saveProgress(progress);

        return session;
    }

    // Update session progress
    updateSession(sessionId: string, updates: Partial<QuizSession>): void {
        const progress = this.loadProgress();

        const sessionIndex = progress.sessions.findIndex(
            s => s.id === sessionId,
        );
        if (sessionIndex >= 0) {
            progress.sessions[sessionIndex] = {
                ...progress.sessions[sessionIndex],
                ...updates,
            } as QuizSession;
            this.saveProgress(progress);
        }
    }

    // Clear all progress
    clearProgress(): void {
        this.progress = createDefaultProgress();
        localStorage.removeItem(STORAGE_KEY);
    }

    // Get progress statistics
    getProgressStats(): {
        totalQuestions: number;
        answeredQuestions: number;
        overallSuccessRate: number;
        categoryStats: Array<{
            category: TopicCategory;
            progress: CategoryProgress;
        }>;
        typeStats: Array<{ type: QuestionType; progress: TypeProgress }>;
        } {
        const progress = this.loadProgress();

        const totalQuestions = Object.values(progress.categoryProgress).reduce(
            (sum, cat) => sum + cat.totalQuestions,
            0,
        );

        return {
            totalQuestions,
            answeredQuestions: progress.totalQuestionsAnswered,
            overallSuccessRate: progress.overallSuccessRate,
            categoryStats: Object.entries(progress.categoryProgress).map(
                ([category, progress]) => ({
                    category: category as TopicCategory,
                    progress,
                })
            ),
            typeStats: Object.entries(progress.typeProgress).map(
                ([type, progress]) => ({
                    type: type as QuestionType,
                    progress,
                })
            ),
        };
    }
}

export const progressStorage = new ProgressStorage();
