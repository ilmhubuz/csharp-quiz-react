import { apiClient } from '../client';
import type {
    CollectionResultSummary,
    CollectionReviewResponse,
    CompletePreviewSessionRequest,
    CompletePreviewSessionResponse,
    ApiResponse,
} from '../../types/api';

export class ResultService {
    private baseEndpoint = '/api/csharp/reviews';

    async getCollectionResultSummary(
        collectionId: number,
    ): Promise<CollectionResultSummary | null> {
        try {
            const response = await apiClient.get<
                ApiResponse<CollectionResultSummary>
            >(`${this.baseEndpoint}/collections/${collectionId}/summary`);
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
    ): Promise<CollectionReviewResponse | null> {
        try {
            const response = await apiClient.get<
                ApiResponse<CollectionReviewResponse>
            >(`${this.baseEndpoint}/collections/${collectionId}/review`);
            return response.data || null;
        } catch (error) {
            console.error(
                `Failed to fetch collection review for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }

    async completePreviewSession(
        collectionId: number,
        answers: {
            questionId: number;
            answer: string | string[];
            timeSpentSeconds: number;
        }[],
    ): Promise<CompletePreviewSessionResponse> {
        try {
            const requestData: CompletePreviewSessionRequest = {
                collectionId,
                answers,
            };

            const response = await apiClient.post<
                ApiResponse<CompletePreviewSessionResponse>
            >(`${this.baseEndpoint}/preview/complete`, requestData);
            return response.data || { success: false, review: null };
        } catch (error) {
            console.error(
                `Failed to complete preview session for collection ${collectionId}:`,
                error,
            );
            throw error;
        }
    }
}

export const resultService = new ResultService();
