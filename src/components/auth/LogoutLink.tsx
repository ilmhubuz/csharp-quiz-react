import { Link } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import { Logout } from '@mui/icons-material';

export function LogoutLink() {
    const { keycloak } = useKeycloak();

    const handleLogout = () => {
        keycloak.logout();
    };

    return (
        <Link
            component="button"
            onClick={handleLogout}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                    color: 'primary.main',
                },
            }}
        >
            <Logout fontSize="small" />
            Chiqish
        </Link>
    );
}
