import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useMemo, type ReactNode } from 'react';
import { getKeycloakInstance } from '../../lib/keycloak';
import { debugEnvironmentVariables } from '../../utils/env-debug';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const keycloak = useMemo(() => getKeycloakInstance(), []);

  // Debug environment variables in development
  if (import.meta.env.DEV) {
    debugEnvironmentVariables();
  }

  const handleEvent = (event: string, error?: unknown) => {
    if (error) {
      console.error('❌ Keycloak event error:', event, error);
    } else {
      console.debug('✅ Keycloak event:', event);
    }
  };

  const handleTokens = (tokens: any) => {
    console.debug('🔑 Keycloak tokens updated:', {
      token: tokens.token ? 'present' : 'missing',
      refreshToken: tokens.refreshToken ? 'present' : 'missing',
    });
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        enableLogging: import.meta.env.DEV,
      }}
      onEvent={handleEvent}
      onTokens={handleTokens}
    >
      {children}
    </ReactKeycloakProvider>
  );
} 