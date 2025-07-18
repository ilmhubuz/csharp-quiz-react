import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    LinearProgress,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import {
    collectionService,
    createAuthenticatedCollectionService,
} from '../api/services/collectionService';
import { useApi } from '../hooks/useApi';
import { useApiState } from '../hooks/useApiState';
import { useKeycloak } from '@react-keycloak/web';
import { AuthHeader } from './auth/AuthHeader';
import type { CollectionResponse } from '../types/api';

interface HomePageProps {
    onSelectCollection: (collectionId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectCollection }) => {
    const { keycloak } = useKeycloak();
    const authenticatedApiClient = useApi();
    const {
        data: collections,
        loading,
        error,
        execute,
        reset,
    } = useApiState<CollectionResponse[]>();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (keycloak.authenticated) {
            const authenticatedCollectionService =
                createAuthenticatedCollectionService(authenticatedApiClient);
            execute(() => authenticatedCollectionService.getCollections());
        } else {
            execute(() => collectionService.getCollections());
        }
    }, [execute, refreshKey, keycloak.authenticated, authenticatedApiClient]);

    const handleRefresh = () => {
        reset();
        setRefreshKey(prev => prev + 1);
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load collections: {error.message}
                </Alert>
                <Box display="flex" justifyContent="center">
                    <IconButton onClick={handleRefresh} color="primary">
                        <Refresh />
                    </IconButton>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
            {/* Authentication Header */}
            <AuthHeader />

            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        C# bilimingizni sinang!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        C# bilimingizni savollar yechib mustahkamlang va
                        darajangizni oshiring!
                    </Typography>
                </Box>
                <Tooltip title="Refresh Collections">
                    <IconButton onClick={handleRefresh} color="primary">
                        <Refresh />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Collections Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                }}
            >
                {collections?.map(collection => {
                    const userProgress = collection.userProgress;
                    const stats = {
                        collectionId: collection.id,
                        totalQuestions: collection.totalQuestions,
                        answeredQuestions: userProgress?.answeredQuestions || 0,
                        correctAnswers: userProgress?.correctAnswers || 0,
                        successRate: userProgress?.successRate || 0,
                        completionRate: userProgress?.completionRate || 0,
                    };

                    return (
                        <Card
                            key={collection.id}
                            onClick={() => onSelectCollection(collection.id)}
                            sx={{
                                cursor: 'pointer',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                },
                                '&:active': {
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                {/* Collection Header */}
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Typography variant="h4" sx={{ mr: 1 }}>
                                        {collection.icon || '📝'}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        fontWeight="600"
                                    >
                                        {collection.title}
                                    </Typography>
                                </Box>

                                {/* Description */}
                                {collection.description && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 3, minHeight: 40 }}
                                    >
                                        {collection.description}
                                    </Typography>
                                )}

                                {/* Stats */}
                                <Box sx={{ mb: 2 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Progress
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="600"
                                        >
                                            {stats.answeredQuestions}/
                                            {stats.totalQuestions} questions
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={stats.completionRate}
                                        color={getProgressColor(
                                            stats.completionRate,
                                        )}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                        }}
                                    />
                                </Box>

                                {/* Success Rate */}
                                {stats.answeredQuestions > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Success Rate
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="600"
                                            >
                                                {stats.successRate.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {collections && collections.length === 0 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="40vh"
                >
                    <Typography variant="h6" color="text.secondary">
                        No collections available
                    </Typography>
                </Box>
            )}
        </Container>
    );
};
