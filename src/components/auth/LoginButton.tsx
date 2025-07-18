import { Button } from '@mui/material';
import { Login } from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';

export function LoginButton() {
    const { keycloak } = useKeycloak();

    const handleLogin = () => {
        keycloak.login();
    };

    return (
        <Button
            variant="outlined"
            startIcon={<Login />}
            onClick={handleLogin}
            sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
            }}
        >
            Kirish
        </Button>
    );
}
