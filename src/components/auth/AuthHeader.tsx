import { Box, Button } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserInfo } from './UserInfo';
import { LogoutLink } from './LogoutLink';
import { LoginButton } from './LoginButton';
import { hasRole } from '../../lib/auth-utils';

export function AuthHeader() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminUser = keycloak.authenticated && hasRole(keycloak, 'quiz-admin:read');
    const isOnManagementPage = location.pathname.startsWith('/management');

    if (!initialized) {
        return null;
    }

    const handleManagementClick = () => {
        if (isOnManagementPage) {
            navigate('/');
        } else {
            navigate('/management/progress');
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                zIndex: 1000,
            }}
        >
            {keycloak.authenticated ? (
                <>
                    {isAdminUser && (
                        <Button
                            variant={isOnManagementPage ? 'contained' : 'outlined'}
                            startIcon={<AdminIcon />}
                            onClick={handleManagementClick}
                            size="small"
                        >
                            {isOnManagementPage ? 'Back to Quiz' : 'Management'}
                        </Button>
                    )}
                    <UserInfo />
                    <LogoutLink />
                </>
            ) : (
                <LoginButton />
            )}
        </Box>
    );
}
