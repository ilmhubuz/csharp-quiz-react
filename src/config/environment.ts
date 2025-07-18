export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5138',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

export const AUTH_CONFIG = {
    KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL || '',
    REALM: import.meta.env.VITE_KEYCLOAK_REALM || '',
    CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || '',
} as const;
