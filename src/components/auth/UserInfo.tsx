import {
    Avatar,
    Typography,
    ButtonBase,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    Box,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Security,
    School,
    AccountCircle,
} from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useState } from 'react';
import {
    getUserDisplayName,
    getUserAvatar,
    getUserEmail,
    getUserPhones,
    getUserRoles,
    getUserMemberships,
} from '../../lib/auth-utils';

export function UserInfo() {
    const theme = useTheme();
    const { keycloak } = useKeycloak();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const displayName = getUserDisplayName(keycloak);
    const avatar = getUserAvatar(keycloak);
    const email = getUserEmail(keycloak);
    const phones = getUserPhones(keycloak);
    const roles = getUserRoles(keycloak);
    const memberships = getUserMemberships(keycloak);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAccountManagement = () => {
        handleClose();
        keycloak.accountManagement();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <ButtonBase
                onClick={handleClick}
                sx={{
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.5,
                    transition: 'background-color 0.2s',
                    '&:hover, &:focus': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '1rem',
                        bgcolor: theme.palette.primary.main,
                    }}
                    src={avatar}
                >
                    <Person fontSize="small" />
                </Avatar>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        ml: 1.25,
                        maxWidth: 120,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {displayName}
                </Typography>
            </ButtonBase>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        minWidth: 280,
                        maxWidth: 350,
                        mt: 1,
                    },
                }}
            >
                <MenuItem sx={{ py: 2 }}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText
                        primary={displayName}
                        secondary={email}
                        primaryTypographyProps={{ fontWeight: 600 }}
                    />
                </MenuItem>

                {phones.length > 0 && (
                    <MenuItem>
                        <ListItemIcon>
                            <Phone fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Phone"
                            secondary={phones.join(', ')}
                        />
                    </MenuItem>
                )}

                <Divider />

                {memberships.length > 0 && (
                    <MenuItem>
                        <ListItemIcon>
                            <School fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Memberships"
                            secondary={
                                <Box sx={{ mt: 0.5 }}>
                                    {memberships.map(membership => (
                                        <Chip
                                            key={membership}
                                            label={membership}
                                            size="small"
                                            color={
                                                membership === 'csharp-quiz'
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            }
                        />
                    </MenuItem>
                )}

                {roles.length > 0 && (
                    <MenuItem>
                        <ListItemIcon>
                            <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Roles"
                            secondary={
                                <Box sx={{ mt: 0.5 }}>
                                    {roles.map(role => (
                                        <Chip
                                            key={role}
                                            label={role}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            }
                        />
                    </MenuItem>
                )}

                <Divider />

                <MenuItem onClick={handleAccountManagement}>
                    <ListItemIcon>
                        <Email fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                </MenuItem>
            </Menu>
        </>
    );
}
