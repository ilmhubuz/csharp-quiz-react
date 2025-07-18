const ANSWER_STORAGE_KEY = 'quiz_answers';

export interface CategoryAnswerData {
    [categoryId: string]: {
        [questionId: number]: string[] | string;
    };
}

class AnswerStorage {
    // Load all saved answers from localStorage
    loadAnswers(): CategoryAnswerData {
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

    // Save answer for a specific question in a category
    saveAnswer(
        categoryId: string,
        questionId: number,
        answer: string[] | string
    ): void {
        try {
            const currentAnswers = this.loadAnswers();
            if (!currentAnswers[categoryId]) {
                currentAnswers[categoryId] = {};
            }
            currentAnswers[categoryId][questionId] = answer;
            localStorage.setItem(
                ANSWER_STORAGE_KEY,
                JSON.stringify(currentAnswers)
            );
        } catch (error) {
            console.error('Error saving answer to localStorage:', error);
        }
    }

    // Get answer for a specific question in a category
    getAnswer(
        categoryId: string,
        questionId: number
    ): string[] | string | undefined {
        const answers = this.loadAnswers();
        return answers[categoryId]?.[questionId];
    }

    // Clear all saved answers
    clearAnswers(): void {
        try {
            localStorage.removeItem(ANSWER_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing answers from localStorage:', error);
        }
    }

    // Clear answer for a specific question in a category
    clearAnswer(categoryId: string, questionId: number): void {
        try {
            const currentAnswers = this.loadAnswers();
            if (currentAnswers[categoryId]) {
                delete currentAnswers[categoryId][questionId];
                localStorage.setItem(
                    ANSWER_STORAGE_KEY,
                    JSON.stringify(currentAnswers)
                );
            }
        } catch (error) {
            console.error(
                'Error clearing specific answer from localStorage:',
                error
            );
        }
    }

    // Clear all answers for a category
    clearCategoryAnswers(categoryId: string): void {
        try {
            const currentAnswers = this.loadAnswers();
            delete currentAnswers[categoryId];
            localStorage.setItem(
                ANSWER_STORAGE_KEY,
                JSON.stringify(currentAnswers)
            );
        } catch (error) {
            console.error(
                'Error clearing category answers from localStorage:',
                error
            );
        }
    }

    // Get answers for a specific category
    getCategoryAnswers(categoryId: string): {
        [questionId: number]: string[] | string;
    } {
        const allAnswers = this.loadAnswers();
        return allAnswers[categoryId] || {};
    }

    // Get answers for a list of questions in a category (for compatibility)
    getAnswersForQuestions(
        categoryId: string,
        questionIds: number[]
    ): { [questionId: number]: string[] | string } {
        const categoryAnswers = this.getCategoryAnswers(categoryId);
        const filteredAnswers: { [questionId: number]: string[] | string } = {};

        questionIds.forEach(id => {
            if (categoryAnswers[id] !== undefined) {
                filteredAnswers[id] = categoryAnswers[id];
            }
        });

        return filteredAnswers;
    }
}

// Export singleton instance
export const answerStorage = new AnswerStorage();

// Answer validation and scoring functionality
export function validateAnswer(
    questionId: number,
    userAnswer: any,
    questions: any[]
): boolean {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;

    const correctAnswer = question.answer;
    // Handle different question types
    switch (question.type) {
        case 'mcq':
            // MCQ answers are arrays of option IDs
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                return (
                    JSON.stringify(userAnswer.sort()) ===
                    JSON.stringify(correctAnswer.sort())
                );
            }
            return false;

        case 'true_false':
            // True/false answers are strings
            return userAnswer === correctAnswer;

        case 'error_spotting':
        case 'code_writing':
        case 'fill':
            // Code-based answers - normalize by removing markdown formatting
            if (
                typeof userAnswer === 'string' &&
                typeof correctAnswer === 'string'
            ) {
                const normalizeCode = (code: string) => {
                    return code
                        .replace(/```\w*\n?/g, '')
                        .replace(/```/g, '')
                        .trim();
                };
                return (
                    normalizeCode(userAnswer) === normalizeCode(correctAnswer)
                );
            }
            return false;

        case 'output_prediction':
            // Text-based answers - exact match (case-insensitive, trimmed)
            if (
                typeof userAnswer === 'string' &&
                typeof correctAnswer === 'string'
            ) {
                return (
                    userAnswer.trim().toLowerCase() ===
                    correctAnswer.trim().toLowerCase()
                );
            }
            return false;

        default:
            return false;
    }
}
