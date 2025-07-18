export const authConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'https://auth.ilmhub.uz',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ilmhub',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'csharp-quiz-spa',
    confidentialPort: Number(import.meta.env.VITE_AUTH_CONFIDENTIAL_PORT || 0),
} as const;

export type AuthConfig = typeof authConfig;
