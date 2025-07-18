// API Response Types
export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

export interface PaginatedApiResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    success: boolean;
    message?: string;
}

// Collection Types
export interface CollectionResponse {
    id: number;
    code: string;
    title: string;
    description: string;
    icon: string;
    totalQuestions: number;
    userProgress?: UserProgressResponse;
    createdAt: string;
    updatedAt: string;
}

export interface UserProgressResponse {
    answeredQuestions: number;
    correctAnswers: number;
    successRate: number;
    completionRate: number;
}

// Question Types
export interface QuestionResponse {
    id: number;
    type: string;
    metadata: QuestionMetadata;
    content: QuestionContent;
    options?: MCQOptionResponse[];
    hints?: string[];
    explanation?: string;
    previousAnswer?: PreviousAnswerResponse;
}

export interface QuestionMetadata {
    collectionId: number;
    collectionCode: string;
    subcategory: string;
    difficulty: string;
    estimatedTime: number;
}

export interface QuestionContent {
    prompt: string;
    codeBefore?: string;
    codeAfter?: string;
    codeWithBlank?: string;
    codeWithError?: string;
    snippet?: string;
    examples?: string[];
    testCases?: TestCaseResponse[];
}

export interface MCQOptionResponse {
    id: string;
    option: string;
}

export interface TestCaseResponse {
    input: string;
    expectedOutput: string;
}

export interface PreviousAnswerResponse {
    answer: string | string[];
    submittedAt: string;
    isCorrect: boolean;
}

// Answer Types
export interface SubmitAnswerRequest {
    questionId: number;
    answer: string | string[];
    timeSpentSeconds: number;
}

export interface AnswerSubmissionResponse {
    success: boolean;
    isCorrect: boolean;
    message?: string;
}

// Review/Result Types
export interface CollectionResultSummary {
    collectionId: number;
    collectionName: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    totalTimeSpent: string;
    completedAt: string;
}

export interface UserAnswer {
    answer: string | string[];
    isCorrect: boolean;
    submittedAt: string;
    timeSpentSeconds: number;
}

export interface CorrectAnswer {
    options?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
    booleanAnswer?: boolean;
    textAnswer?: string;
    sampleSolution?: string;
    testCaseResults?: Array<{
        input: string;
        expectedOutput: string;
        userOutput?: string;
        passed: boolean;
    }>;
}

export interface ReviewItem {
    questionId: number;
    questionType: string;
    prompt: string;
    content: QuestionContent;
    userAnswer: UserAnswer;
    correctAnswer: CorrectAnswer;
    explanation: string;
    hints?: string[];
}

export interface SessionCompletionResponse {
    sessionId: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    reviewItems: ReviewItem[];
}

export interface CompleteSessionRequest {
  answers: Array<{
    questionId: number;
    answer: string;
    timeSpentSeconds: number;
  }>;
}
