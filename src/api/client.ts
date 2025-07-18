import { API_CONFIG } from '../config/environment';

class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        token?: string,
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authorization header if token is provided or exists in storage
        const authToken = token || this.getAuthToken();
        if (authToken) {
            defaultOptions.headers = {
                ...defaultOptions.headers,
                Authorization: `Bearer ${authToken}`,
            };
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(
                () => controller.abort(),
                this.timeout,
            );

            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message ||
                        `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData.errors,
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            if (error instanceof Error && error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408);
            }
            throw new ApiError(
                error instanceof Error ? error.message : 'Network error',
                0
            );
        }
    }

    private getAuthToken(): string | null {
        // Try to get token from Keycloak if available
        if (typeof window !== 'undefined' && window.keycloak) {
            return window.keycloak.token || null;
        }
        // Fallback to localStorage
        return localStorage.getItem('auth_token');
    }

    // GET request
    async get<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, token);
    }

    // POST request
    async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            },
            token
        );
    }

    // PUT request
    async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined,
            },
            token
        );
    }

    // DELETE request
    async delete<T>(endpoint: string, token?: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, token);
    }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Custom error class
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public errors?: string[],
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Extend Window interface to include Keycloak
declare global {
    interface Window {
        keycloak?: any;
    }
}
