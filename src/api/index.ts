export { apiClient, ApiError } from './client';
export { collectionService } from './services/collectionService';
export { questionService } from './services/questionService';
export { answerService } from './services/answerService';
export { resultService } from './services/resultService';
export { managementService } from './services/managementService';

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
    SessionCompletionResponse,
    ReviewItem,
    UserAnswer,
    CorrectAnswer,
    CompleteSessionRequest,
    UserProgressGroupedResponse,
    CollectionProgressResponse,
    UserProgressManagementResponse,
} from '../types/api';
