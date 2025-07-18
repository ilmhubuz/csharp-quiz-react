export { apiClient, ApiError } from './client';
export { collectionService } from './services/collectionService';
export { questionService } from './services/questionService';
export { answerService } from './services/answerService';
export { resultService } from './services/resultService';

// Re-export types for convenience
export type {
    ApiResponse,
    PaginatedApiResponse,
    CollectionResponse,
    QuestionResponse,
    SubmitAnswerRequest,
    AnswerSubmissionResponse,
    PreviousAnswerResponse,
    CollectionResultSummary,
    CollectionReviewResponse,
    AnswerReview,
    CompletePreviewSessionRequest,
    CompletePreviewSessionResponse,
} from '../types/api';
