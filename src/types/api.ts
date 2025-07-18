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
    collectionCode: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    successRate: number;
    completionRate: number;
    totalTimeSpent: number;
    averageTimePerQuestion: number;
}

export interface AnswerReview {
    questionId: number;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation: string;
    timeSpentSeconds: number;
    submittedAt: string;
}

export interface CollectionReviewResponse {
    collectionId: number;
    collectionCode: string;
    summary: CollectionResultSummary;
    answerReviews: AnswerReview[];
}

export interface CompletePreviewSessionRequest {
    collectionId: number;
    answers: {
        questionId: number;
        answer: string | string[];
        timeSpentSeconds: number;
    }[];
}

export interface CompletePreviewSessionResponse {
    success: boolean;
    review: CollectionReviewResponse;
}
