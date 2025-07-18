import { apiClient } from '../client';
import type {
    QuestionResponse,
    ApiResponse,
    PaginatedApiResponse,
} from '../../types/api';
import type { AuthenticatedApiClient } from '../../hooks/useApi';

export class QuestionService {
    private baseEndpoint = '/api/csharp/questions';

    constructor(private authenticatedApiClient?: AuthenticatedApiClient) {}

    async getQuestionsByCollection(
        collectionId: number,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<PaginatedApiResponse<QuestionResponse>> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                PaginatedApiResponse<QuestionResponse>
            >(
                `${this.baseEndpoint}?collectionId=${collectionId}&page=${page}&pageSize=${pageSize}`,
            );
            return response;
        } catch (error) {
            console.error(
                `Failed to fetch questions for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }

    async getQuestionsByCollectionCode(
        collectionCode: string,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<PaginatedApiResponse<QuestionResponse>> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                PaginatedApiResponse<QuestionResponse>
            >(
                `${this.baseEndpoint}?collectionCode=${collectionCode}&page=${page}&pageSize=${pageSize}`,
            );
            return response;
        } catch (error) {
            console.error(
                `Failed to fetch questions for collection code ${collectionCode}:`,
                error,
            );
            throw error;
        }
    }

    async getPreviewQuestions(
        collectionId: number,
    ): Promise<QuestionResponse[]> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                ApiResponse<QuestionResponse[]>
            >(`${this.baseEndpoint}/preview?collectionId=${collectionId}`);
            return response.data || [];
        } catch (error) {
            console.error(
                `Failed to fetch preview questions for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }

    async getQuestionById(
        questionId: number,
    ): Promise<QuestionResponse | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<ApiResponse<QuestionResponse>>(
                `${this.baseEndpoint}/${questionId}`,
            );
            return response.data || null;
        } catch (error) {
            console.error(`Failed to fetch question ${questionId}:`, error);
            throw error;
        }
    }
}

export const questionService = new QuestionService();

// Function to create an authenticated question service
export function createAuthenticatedQuestionService(authenticatedApiClient: any) {
    return new QuestionService(authenticatedApiClient);
}
