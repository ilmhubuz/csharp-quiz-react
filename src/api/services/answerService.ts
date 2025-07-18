import { apiClient } from '../client';
import type {
    SubmitAnswerRequest,
    AnswerSubmissionResponse,
    PreviousAnswerResponse,
    ApiResponse,
} from '../../types/api';
import type { AuthenticatedApiClient } from '../../hooks/useApi';

export class AnswerService {
    private baseEndpoint = '/api/csharp/answers';

    constructor(private authenticatedApiClient?: AuthenticatedApiClient) {}

    async submitAnswer(
        questionId: number,
        answer: string | string[],
        timeSpentSeconds: number
    ): Promise<AnswerSubmissionResponse> {
        try {
            const requestData: SubmitAnswerRequest = {
                questionId,
                answer,
                timeSpentSeconds,
            };

            const client = this.authenticatedApiClient || apiClient;
            const response = await client.post<
                ApiResponse<AnswerSubmissionResponse>
            >(this.baseEndpoint, requestData);

            if (!response.data) {
                throw new Error('No response data received');
            }

            return response.data;
        } catch (error) {
            console.error(
                `Failed to submit answer for question ${questionId}:`,
                error
            );
            throw error;
        }
    }

    async getLatestAnswer(
        questionId: number
    ): Promise<PreviousAnswerResponse | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                ApiResponse<PreviousAnswerResponse>
            >(`${this.baseEndpoint}/${questionId}/latest`);

            return response.data || null;
        } catch (error) {
            console.error(
                `Failed to fetch latest answer for question ${questionId}:`,
                error
            );
            throw error;
        }
    }

    async getAnswerHistory(
        questionId: number
    ): Promise<PreviousAnswerResponse[]> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                ApiResponse<PreviousAnswerResponse[]>
            >(`${this.baseEndpoint}/${questionId}`);
            return response.data || [];
        } catch (error) {
            console.error(
                `Failed to fetch answer history for question ${questionId}:`,
                error
            );
            throw error;
        }
    }
}

export const answerService = new AnswerService();

// Function to create an authenticated answer service
export function createAuthenticatedAnswerService(
    authenticatedApiClient: AuthenticatedApiClient
) {
    return new AnswerService(authenticatedApiClient);
}
