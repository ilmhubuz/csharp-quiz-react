import { useKeycloak } from '@react-keycloak/web';
import type { ReactNode } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { hasCSharpQuizAccess } from '../../lib/auth-utils';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  if (!hasCSharpQuizAccess(keycloak)) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <h2>Access Denied</h2>
        <p>You don't have access to the C# Quiz application.</p>
        <p>Please contact your administrator to get the required permissions.</p>
      </Box>
    );
  }

  return <>{children}</>;
} 