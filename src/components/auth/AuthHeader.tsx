import { Box } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import { UserInfo } from './UserInfo';
import { LogoutLink } from './LogoutLink';
import { LoginButton } from './LoginButton';

export function AuthHeader() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return null;
    }

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
                    <UserInfo />
                    <LogoutLink />
                </>
            ) : (
                <LoginButton />
            )}
        </Box>
    );
}
