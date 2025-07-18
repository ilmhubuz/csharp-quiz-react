import { apiClient } from '../client';
import type {
    CollectionResultSummary,
    SessionCompletionResponse,
    ReviewItem,
    ApiResponse,
} from '../../types/api';
import type { AuthenticatedApiClient } from '../../hooks/useApi';

export class ResultService {
    private baseEndpoint = '/api/csharp/results';

    constructor(private authenticatedApiClient?: AuthenticatedApiClient) {}

    async getCollectionResultSummary(
        collectionId: number,
    ): Promise<CollectionResultSummary | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                ApiResponse<CollectionResultSummary>
            >(`${this.baseEndpoint}/collections/${collectionId}`);
            return response.data || null;
        } catch (error) {
            console.error(
                `Failed to fetch collection result summary for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }

    async getCollectionReview(
        collectionId: number,
        includeUnanswered: boolean = false,
    ): Promise<ReviewItem[] | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<ApiResponse<ReviewItem[]>>(
                `${this.baseEndpoint}/collections/${collectionId}/review?includeUnanswered=${includeUnanswered}`,
            );
            return response.data || null;
        } catch (error) {
            console.error(
                `Failed to fetch collection review for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }

    async completeSession(
        sessionId: string,
        answers: Array<{
            questionId: number;
            answer: string | string[];
            timeSpentSeconds: number;
        }>,
    ): Promise<SessionCompletionResponse> {
        try {
            // Convert answers to the format expected by the backend
            const requestData = {
                answers: answers.map(answer => ({
                    questionId: answer.questionId,
                    answer: Array.isArray(answer.answer)
                        ? JSON.stringify(answer.answer)
                        : answer.answer,
                    timeSpentSeconds: answer.timeSpentSeconds,
                })),
            };

            const response = await apiClient.post<
                ApiResponse<SessionCompletionResponse>
            >(
                `${this.baseEndpoint}/sessions/${sessionId}/complete`,
                requestData
            );
            if (!response.data) {
                throw new Error('No response data received');
            }
            return response.data;
        } catch (error) {
            console.error(`Failed to complete session ${sessionId}:`, error);
            throw error;
        }
    }
}

export const resultService = new ResultService();

// Function to create an authenticated result service
export function createAuthenticatedResultService(authenticatedApiClient: AuthenticatedApiClient) {
    return new ResultService(authenticatedApiClient);
}
