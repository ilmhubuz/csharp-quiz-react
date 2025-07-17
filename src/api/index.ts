export { apiClient, ApiError } from './client';
export { collectionService } from './services/collectionService';
export { questionService } from './services/questionService';
export { answerService } from './services/answerService';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedApiResponse,
  CollectionResponse,
  QuestionResponse,
  SubmitAnswerRequest,
  AnswerSubmissionResponse,
  PreviousAnswerResponse,
} from '../types/api'; 