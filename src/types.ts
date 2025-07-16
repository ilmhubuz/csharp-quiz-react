export type QuestionType = 'mcq' | 'true_false' | 'fill' | 'error_spotting' | 'output_prediction' | 'code_writing';

export type CSharpVersion = '6.0' | '7.0' | '7.1' | '7.2' | '7.3' | '8.0' | '9.0' | '10.0' | '11.0' | '12.0' | '13.0';

export type TopicCategory = 
  | 'asosiy-til-xususiyatlari'
  | 'tip-tizimi-oop' 
  | 'metod-xususiyatlari'
  | 'kolleksiyalar-ma\'lumot-tuzilmalari'
  | 'linq-funksional-dasturlash'
  | 'ilg\'or-mavzular'
  | 'exception-handling';

export interface QuestionMetadata {
  category: TopicCategory;
  subcategory: string;
}

export interface MCQOption {
	id: string;
	option: string;
}

export interface MCQQuestion {
	id: number;
	type: 'mcq';
	metadata: QuestionMetadata;
	codeBefore?: string;
	codeAfter?: string;
	prompt: string;
	options: MCQOption[];
	answer: string[];
	explanation?: string;
}

export interface TrueFalseQuestion {
	id: number;
	type: 'true_false';
	metadata: QuestionMetadata;
	codeBefore?: string;
	codeAfter?: string;
	prompt: string;
	answer: 'true' | 'false';
	explanation?: string;
}

export interface FillQuestion {
	id: number;
	type: 'fill';
	metadata: QuestionMetadata;
	codeWithBlank: string;
	prompt: string;
	answer: string;
	explanation?: string;
	hints?: string[];
}

export interface ErrorSpotQuestion {
	id: number;
	type: 'error_spotting';
	metadata: QuestionMetadata;
	codeWithError: string;
	prompt: string;
	answer: string;
	explanation?: string;
}

export interface OutputPredictionQuestion {
	id: number;
	type: 'output_prediction';
	metadata: QuestionMetadata;
	snippet: string;
	prompt: string;
	answer: string;
	explanation?: string;
}

export interface CodeWritingQuestion {
	id: number;
	type: 'code_writing';
	metadata: QuestionMetadata;
	prompt: string;
	codeAfter?: string;
	examples: string[];
	solution?: string;
	testCases?: Array<{
		input: string;
		expectedOutput: string;
	}>;
	rubric?: string[];
}

export type Question = MCQQuestion | TrueFalseQuestion | FillQuestion | ErrorSpotQuestion | OutputPredictionQuestion | CodeWritingQuestion;

// Helper interfaces for organizing questions
export interface TopicGroup {
	category: TopicCategory;
	subcategory: string;
	questions: Question[];
	totalQuestions: number;
}

export interface StudySession {
	id: string;
	name: string;
	description: string;
	questions: number[];
	estimatedDurationMinutes: number;
}

export interface QuizSettings {
	questionCount?: number;
	categories?: TopicCategory[];
	excludeIds?: number[];
	randomizeOrder?: boolean;
	timeLimit?: number;
}

// Progress Tracking Types
export interface QuestionProgress {
  questionId: number;
  isAnswered: boolean;
  isCorrect?: boolean;
  attempts: number;
  timeSpent?: number; // in seconds
  userAnswer: string[] | string;
  answeredAt?: string; // ISO string
}

export interface CategoryProgress {
  category: TopicCategory;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  averageTimePerQuestion?: number;
  lastAnsweredAt?: string;
  successRate: number; // percentage
}

export interface TypeProgress {
  questionType: QuestionType;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  averageTimePerQuestion?: number;
  lastAnsweredAt?: string;
  successRate: number; // percentage
}

export interface QuizSession {
  id: string;
  name: string;
  mode: 'category' | 'type' | 'mixed';
  filter: {
    categories?: TopicCategory[];
    types?: QuestionType[];
  };
  questions: number[];
  currentQuestionIndex: number;
  answers: Record<number, string[] | string>;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface UserProgress {
  totalQuestionsAnswered: number;
  overallSuccessRate: number;
  categoryProgress: Record<TopicCategory, CategoryProgress>;
  typeProgress: Record<QuestionType, TypeProgress>;
  questionProgress: Record<number, QuestionProgress>;
  sessions: QuizSession[];
  lastActivityAt: string;
  stats: {
    totalTimeSpent: number; // in seconds
    averageSessionDuration: number;
    longestStreak: number;
    currentStreak: number;
  };
}

// Navigation and UI Types
export type ViewMode = 'home' | 'quiz' | 'results';

export interface FilterOptions {
  categories: TopicCategory[];
  types: QuestionType[];
}

export interface QuizConfig {
  mode: 'category' | 'type' | 'mixed';
  selectedCategories?: TopicCategory[];
  selectedTypes?: QuestionType[];
  randomizeOrder?: boolean;
  questionLimit?: number;
}

// Category and Type Display Information
export interface CategoryInfo {
  id: TopicCategory;
  name: string;
  nameUz: string;
  description: string;
  icon: string;
  color: string;
}

export interface TypeInfo {
  id: QuestionType;
  name: string;
  nameUz: string;
  description: string;
  icon: string;
  color: string;
}

export type CategoryMetadata = {
  categoryId: number;
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

export type CategoryFile = {
  metadata: CategoryMetadata;
  questions: Question[];
};
