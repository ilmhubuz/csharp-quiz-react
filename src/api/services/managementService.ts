import { apiClient } from '../client';
import type {
    UserProgressManagementResponse,
} from '../../types/api';
import type { AuthenticatedApiClient } from '../../hooks/useApi';

export class ManagementService {
    async getUserProgresses(
        page: number = 1,
        pageSize: number = 20,
    ): Promise<UserProgressManagementResponse> {
        const response = await apiClient.get<UserProgressManagementResponse>(
            `/api/csharp/management/user-progresses?page=${page}&pageSize=${pageSize}`,
        );
        return response;
    }
}

export class AuthenticatedManagementService extends ManagementService {
    constructor(private authenticatedApiClient: AuthenticatedApiClient) {
        super();
    }

    async getUserProgresses(
        page: number = 1,
        pageSize: number = 20,
    ): Promise<UserProgressManagementResponse> {
        const response =
            await this.authenticatedApiClient.get<UserProgressManagementResponse>(
                `/api/csharp/management/user-progresses?page=${page}&pageSize=${pageSize}`,
            );
        return response;
    }
}

export const managementService = new ManagementService();

export function createAuthenticatedManagementService(
    authenticatedApiClient: AuthenticatedApiClient,
) {
    return new AuthenticatedManagementService(authenticatedApiClient);
} 