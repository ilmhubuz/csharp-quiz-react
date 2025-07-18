import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';
import { apiClient } from '../api/client';

export interface AuthenticatedApiClient {
    get: <T>(endpoint: string) => Promise<T>;
    post: <T>(endpoint: string, data?: any) => Promise<T>;
    put: <T>(endpoint: string, data?: any) => Promise<T>;
    delete: <T>(endpoint: string) => Promise<T>;
}

export function useApi(): AuthenticatedApiClient {
    const { keycloak } = useKeycloak();

    const authenticatedApiClient = useMemo(() => {
        return {
            get: <T>(endpoint: string) =>
                apiClient.get<T>(endpoint, keycloak?.token),
            post: <T>(endpoint: string, data?: any) =>
                apiClient.post<T>(endpoint, data, keycloak?.token),
            put: <T>(endpoint: string, data?: any) =>
                apiClient.put<T>(endpoint, data, keycloak?.token),
            delete: <T>(endpoint: string) =>
                apiClient.delete<T>(endpoint, keycloak?.token),
        };
    }, [keycloak?.token]);

    return authenticatedApiClient;
}
