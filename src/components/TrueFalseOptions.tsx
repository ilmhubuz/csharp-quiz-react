import React from 'react';
import { Paper, Typography, Button, Box, Grid } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import type { TrueFalseQuestion } from '../types';

interface TrueFalseOptionsProps {
    question: TrueFalseQuestion;
    selectedAnswer: string;
    onAnswerChange: (selectedOption: string) => void;
}

export const TrueFalseOptions: React.FC<TrueFalseOptionsProps> = ({
    selectedAnswer,
    onAnswerChange,
}) => {
    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                backgroundColor: 'background.default',
                border: 1,
                borderColor: 'divider',
            }}
        >
            <Typography
                variant="subtitle2"
                color="text.secondary"
                mb={3}
                fontWeight="bold"
            >
                Select your answer
            </Typography>

            <Grid container spacing={3}>
                {/* True Option */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        fullWidth
                        size="large"
                        variant={
                            selectedAnswer === 'true' ? 'contained' : 'outlined'
                        }
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => onAnswerChange('true')}
                        sx={{
                            py: 3,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderWidth: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                                borderWidth: 2,
                            },
                            '&.MuiButton-contained': {
                                backgroundColor: 'success.main',
                                color: 'success.contrastText',
                                '&:hover': {
                                    backgroundColor: 'success.dark',
                                },
                            },
                            '&.MuiButton-outlined': {
                                borderColor: 'success.main',
                                color: 'success.main',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'success.main',
                                    color: 'success.contrastText',
                                    borderColor: 'success.main',
                                },
                            },
                        }}
                    >
                        True
                    </Button>
                </Grid>

                {/* False Option */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        fullWidth
                        size="large"
                        variant={
                            selectedAnswer === 'false'
                                ? 'contained'
                                : 'outlined'
                        }
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => onAnswerChange('false')}
                        sx={{
                            py: 3,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderWidth: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                                borderWidth: 2,
                            },
                            '&.MuiButton-contained': {
                                backgroundColor: 'error.main',
                                color: 'error.contrastText',
                                '&:hover': {
                                    backgroundColor: 'error.dark',
                                },
                            },
                            '&.MuiButton-outlined': {
                                borderColor: 'error.main',
                                color: 'error.main',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'error.contrastText',
                                    borderColor: 'error.main',
                                },
                            },
                        }}
                    >
                        False
                    </Button>
                </Grid>
            </Grid>

            {/* Selected Answer Indicator */}
            {selectedAnswer && (
                <Box mt={3} display="flex" justifyContent="center">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        You selected:
                        <Typography
                            component="span"
                            color={
                                selectedAnswer === 'true'
                                    ? 'success.main'
                                    : 'error.main'
                            }
                            fontWeight="bold"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {selectedAnswer === 'true' ? (
                                <>
                                    <CheckCircle
                                        sx={{ fontSize: 16, mr: 0.5 }}
                                    />
                                    True
                                </>
                            ) : (
                                <>
                                    <Cancel sx={{ fontSize: 16, mr: 0.5 }} />
                                    False
                                </>
                            )}
                        </Typography>
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};
