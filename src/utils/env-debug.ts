// Environment variable debug utility
export function debugEnvironmentVariables() {
    const envVars = {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
        VITE_KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
        VITE_KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE,
    };

    console.log('🔧 Environment Variables:', envVars);
    return envVars;
}

// Call this in development to see what's loaded
if (import.meta.env.DEV) {
    debugEnvironmentVariables();
}
