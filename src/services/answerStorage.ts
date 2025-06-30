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