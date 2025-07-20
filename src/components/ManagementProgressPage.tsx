import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    LinearProgress,
    Pagination,
    CircularProgress,
    Alert,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    IconButton,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    Quiz as QuizIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    AccessTime as AccessTimeIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useApi } from '../hooks/useApi';
import { createAuthenticatedManagementService } from '../api/services/managementService';
import { hasRole } from '../lib/auth-utils';
import type { UserProgressGroupedResponse } from '../types/api';

export const ManagementProgressPage: React.FC = () => {
    const { keycloak } = useKeycloak();
    const authenticatedApiClient = useApi();
    const [users, setUsers] = useState<UserProgressGroupedResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const pageSize = 20;

    // Check if user has admin role
    const hasAdminRole = hasRole(keycloak, 'quiz-admin:read');

    useEffect(() => {
        if (!keycloak.authenticated || !hasAdminRole) {
            return;
        }
        loadUserProgresses();
    }, [page, keycloak.authenticated, hasAdminRole]);

    const loadUserProgresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const managementService = createAuthenticatedManagementService(
                authenticatedApiClient,
            );
            const response = await managementService.getUserProgresses(
                page,
                pageSize,
            );

            if (response.success) {
                setUsers(response.data || []);
                setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
                setTotalUsers(response.totalCount || 0);
            } else {
                setError(response.message || 'Failed to load user progress');
            }
        } catch (err) {
            console.error('Error loading user progress:', err);
            setError('Failed to load user progress data');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSuccessRateColor = (rate: number) => {
        if (rate >= 80) return 'success';
        if (rate >= 60) return 'warning';
        return 'error';
    };

    // Access control
    if (!keycloak.authenticated) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning">
                    Please log in to access the management dashboard.
                </Alert>
            </Container>
        );
    }

    if (!hasAdminRole) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Access denied. You need admin privileges to view this page.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                    gap={2}
                >
                    <CircularProgress size={50} />
                    <Typography variant="body1" color="text.secondary">
                        Loading user progress data...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={loadUserProgresses}
                        >
                            <RefreshIcon />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Progress Management
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Monitor user learning progress across all quiz collections.
                </Typography>

                {/* Summary Stats */}
                <Grid container spacing={3} mb={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {totalUsers}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total Users
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'success.main' }}>
                                        <QuizIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {users
                                                .reduce(
                                                    (sum, user) =>
                                                        sum +
                                                        user.totalQuestionsAnswered,
                                                    0,
                                                )
                                                .toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total Answers
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'info.main' }}>
                                        <CheckCircleIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {users.length > 0
                                                ? (
                                                      users.reduce(
                                                          (sum, user) =>
                                                              sum +
                                                              user.overallSuccessRate,
                                                          0,
                                                      ) / users.length
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Avg Success Rate
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                                        <TrendingUpIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {users
                                                .reduce(
                                                    (sum, user) =>
                                                        sum + user.totalCollections,
                                                    0,
                                                )
                                                .toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Active Collections
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* User Progress List */}
            <Box mb={3}>
                {users.map((user) => (
                    <Accordion key={user.userId} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar>
                                            {user.name
                                                ? user.name
                                                      .split(' ')
                                                      .map((n) => n[0])
                                                      .join('')
                                                      .toUpperCase()
                                                : user.username?.[0]?.toUpperCase() ||
                                                  '?'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1">
                                                {user.name || user.username || 'Unknown User'}
                                            </Typography>
                                            {user.telegramUsername && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {user.telegramUsername}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Success Rate
                                    </Typography>
                                    <Chip
                                        label={`${user.overallSuccessRate.toFixed(1)}%`}
                                        color={getSuccessRateColor(user.overallSuccessRate)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Questions
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.totalQuestionsAnswered}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Activity
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(user.lastActivityAt)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Collection Progress ({user.collectionProgresses.length} collections)
                                </Typography>
                                <Grid container spacing={2}>
                                    {user.collectionProgresses.map((collection) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={collection.collectionId}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {collection.collectionTitle}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        paragraph
                                                    >
                                                        {collection.collectionDescription}
                                                    </Typography>

                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Box
                                                                display="flex"
                                                                justifyContent="space-between"
                                                                mb={1}
                                                            >
                                                                <Typography variant="body2">
                                                                    Completion
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {collection.completionRate.toFixed(1)}%
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={collection.completionRate}
                                                                color="primary"
                                                            />
                                                        </Box>

                                                        <Box display="flex" justifyContent="space-between">
                                                            <Chip
                                                                label={`${collection.successRate.toFixed(1)}% Success`}
                                                                color={getSuccessRateColor(collection.successRate)}
                                                                size="small"
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {collection.answeredQuestions}/{collection.totalQuestions}
                                                            </Typography>
                                                        </Box>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={0.5}
                                                        >
                                                            <AccessTimeIcon fontSize="inherit" />
                                                            Last: {formatDate(collection.lastAnsweredAt)}
                                                        </Typography>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Container>
    );
}; 