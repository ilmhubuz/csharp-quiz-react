import { apiClient } from '../client';
import type { CollectionResponse, ApiResponse } from '../../types/api';
import type { AuthenticatedApiClient } from '../../hooks/useApi';

export class CollectionService {
    private baseEndpoint = '/api/csharp/collections';

    constructor(private authenticatedApiClient?: AuthenticatedApiClient) {}

    async getCollections(): Promise<CollectionResponse[]> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<
                ApiResponse<CollectionResponse[]>
            >(this.baseEndpoint);
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            throw error;
        }
    }

    async getCollectionById(id: number): Promise<CollectionResponse | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<ApiResponse<CollectionResponse>>(
                `${this.baseEndpoint}/${id}`
            );
            return response.data || null;
        } catch (error) {
            console.error(`Failed to fetch collection ${id}:`, error);
            throw error;
        }
    }

    async getCollectionByCode(
        code: string
    ): Promise<CollectionResponse | null> {
        try {
            const client = this.authenticatedApiClient || apiClient;
            const response = await client.get<ApiResponse<CollectionResponse>>(
                `${this.baseEndpoint}/code/${code}`
            );
            return response.data || null;
        } catch (error) {
            console.error(`Failed to fetch collection by code ${code}:`, error);
            throw error;
        }
    }
}

export const collectionService = new CollectionService();

// Function to create an authenticated collection service
export function createAuthenticatedCollectionService(
    authenticatedApiClient: AuthenticatedApiClient
) {
    return new CollectionService(authenticatedApiClient);
}
