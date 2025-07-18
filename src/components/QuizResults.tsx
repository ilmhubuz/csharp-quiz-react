import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    RestartAlt,
    Quiz as QuizIcon,
    Home as HomeIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CodeEditor } from './CodeEditor';
import { DiffEditor } from './DiffEditor';
import { resultService } from '../api/services/resultService';
import { sessionStorage } from '../services/sessionStorage';
import { useKeycloak } from '@react-keycloak/web';
import type { Question } from '../types';

interface QuizResultsProps {
    questions: Question[];
    answers: { [questionId: number]: string[] | string };
    collectionId: number;
    onRetry: () => void;
    onGoHome?: () => void;
}

interface QuestionResult {
    question: Question;
    userAnswer: string[] | string | undefined;
    isCorrect: boolean;
    questionNumber: number;
    correctAnswer?: any;
    explanation?: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    questions,
    answers,
    collectionId,
    onRetry,
    onGoHome,
}) => {
    const { keycloak } = useKeycloak();
    const [results, setResults] = useState<QuestionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                if (keycloak.authenticated) {
                    // Authenticated user - use collection review endpoint
                    const reviewItems = await resultService.getCollectionReview(
                        collectionId,
                        false
                    );
                    if (reviewItems) {
                        const mappedResults: QuestionResult[] = questions.map(
                            (question, index) => {
                                const reviewItem = reviewItems.find(
                                    item => item.questionId === question.id
                                );

                                return {
                                    question,
                                    userAnswer: answers[question.id],
                                    isCorrect:
                                        reviewItem?.userAnswer.isCorrect ||
                                        false,
                                    questionNumber: index + 1,
                                    correctAnswer: reviewItem?.correctAnswer,
                                    explanation: reviewItem?.explanation,
                                };
                            }
                        );

                        setResults(mappedResults);
                    } else {
                        throw new Error(
                            'Natijalarni olishda xatolik yuz berdi'
                        );
                    }
                } else {
                    // Anonymous user - use session completion endpoint
                    const sessionId = sessionStorage.getSessionId();
                    if (!sessionId) {
                        throw new Error('Sessiya topilmadi');
                    }

                    // Convert all answers to the format expected by the backend
                    const answerData = Object.entries(answers).map(
                        ([questionIdStr, answer]) => ({
                            questionId: parseInt(questionIdStr),
                            answer: answer as string | string[],
                            timeSpentSeconds: 0, // We don't track time in the current implementation
                        })
                    );

                    const response = await resultService.completeSession(
                        sessionId,
                        answerData
                    );
                    // Map the review data to our results format
                    const mappedResults: QuestionResult[] = questions.map(
                        (question, index) => {
                            const reviewItem = response.reviewItems.find(
                                item => item.questionId === question.id
                            );

                            return {
                                question,
                                userAnswer: answers[question.id],
                                isCorrect:
                                    reviewItem?.userAnswer.isCorrect || false,
                                questionNumber: index + 1,
                                correctAnswer: reviewItem?.correctAnswer,
                                explanation: reviewItem?.explanation,
                            };
                        }
                    );

                    setResults(mappedResults);
                }
            } catch (err: any) {
                console.error('Failed to fetch results:', err);
                setError(
                    err.message || 'Natijalarni yuklashda xatolik yuz berdi'
                );
                // Fallback to local calculation if backend fails
                const fallbackResults: QuestionResult[] = questions.map(
                    (question, index) => ({
                        question,
                        userAnswer: answers[question.id],
                        isCorrect: false, // Default to false since we can't validate without backend
                        questionNumber: index + 1,
                    })
                );
                setResults(fallbackResults);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [questions, answers, collectionId, keycloak.authenticated]);

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
                    <Typography variant="h6" color="text.secondary">
                        Natijalar hisoblanmoqda...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                    gap={2}
                    textAlign="center"
                >
                    <ErrorIcon
                        sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
                    />
                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                        fontWeight="bold"
                    >
                        Xatolik yuz berdi
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            startIcon={<RestartAlt />}
                            onClick={onRetry}
                        >
                            Qayta urinish
                        </Button>
                        {onGoHome && (
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={onGoHome}
                            >
                                Bosh sahifa
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>
        );
    }

    const totalQuestions = questions.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const getQuestionTypeLabel = (type: string) => {
        switch (type) {
            case 'mcq':
                return "Ko'p Tanlovli";
            case 'true_false':
                return "To'g'ri/Noto'g'ri";
            case 'fill':
                return "Bo'shliqni To'ldirish";
            case 'error_spotting':
                return 'Xatolarni Topish';
            case 'output_prediction':
                return 'Natijani Bashorat Qilish';
            case 'code_writing':
                return 'Kod Yozish';
            default:
                return type;
        }
    };

    // Helper functions to determine question types
    const isCodeQuestion = (type: string) => {
        return (
            type === 'fill' ||
            type === 'error_spotting' ||
            type === 'code_writing'
        );
    };

    const isDiffQuestion = (type: string) => {
        return type === 'fill' || type === 'error_spotting';
    };

    const getOriginalCode = (question: Question) => {
        if (question.type === 'fill') {
            return (question as any).codeWithBlank;
        } else if (question.type === 'error_spotting') {
            return (question as any).codeWithError;
        }
        return '';
    };

    const getCorrectAnswerCode = (correctAnswer: any) => {
        if (correctAnswer?.textAnswer) {
            // Remove markdown code blocks if present
            let cleanAnswer = correctAnswer.textAnswer;
            if (cleanAnswer.includes('```')) {
                cleanAnswer = cleanAnswer
                    .replace(/```\w*\n?/g, '')
                    .replace(/```/g, '')
                    .trim();
            }
            return cleanAnswer;
        }
        if (correctAnswer?.sampleSolution) {
            return correctAnswer.sampleSolution;
        }
        return '';
    };

    const formatUserAnswer = (result: QuestionResult) => {
        const { userAnswer } = result;
        if (!userAnswer) return 'Javob berilmagan';

        if (Array.isArray(userAnswer)) {
            return userAnswer.join(', ');
        }
        return userAnswer as string;
    };

    const renderCodeAnswer = (answer: string) => {
        return (
            <Box
                component="pre"
                sx={{
                    backgroundColor: 'grey.900',
                    color: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    overflow: 'auto',
                    maxHeight: '300px',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <code>{answer}</code>
            </Box>
        );
    };

    const renderCorrectAnswer = (correctAnswer: any) => {
        if (!correctAnswer) return null;

        // Handle different answer types based on question type
        if (correctAnswer.options) {
            // MCQ - show correct options
            const correctOptions = correctAnswer.options
                .filter((opt: any) => opt.isCorrect)
                .map((opt: any) => opt.text)
                .join(', ');
            return (
                <Typography variant="body2" color="success.main">
                    {correctOptions}
                </Typography>
            );
        }

        if (correctAnswer.booleanAnswer !== undefined) {
            // True/False
            return (
                <Typography variant="body2" color="success.main">
                    {correctAnswer.booleanAnswer ? "To'g'ri" : "Noto'g'ri"}
                </Typography>
            );
        }
        if (correctAnswer.textAnswer) {
            // Fill, Error Spotting, Output Prediction
            if (
                correctAnswer.textAnswer.includes('```') ||
                correctAnswer.textAnswer.includes('{') ||
                correctAnswer.textAnswer.includes(';')
            ) {
                const cleanAnswer = correctAnswer.textAnswer
                    .replace(/```\w*\n?/g, '')
                    .replace(/```/g, '')
                    .trim();
                return renderCodeAnswer(cleanAnswer);
            }
            return (
                <Typography variant="body2" color="success.main">
                    {correctAnswer.textAnswer}
                </Typography>
            );
        }
        if (correctAnswer.sampleSolution) {
            // Code Writing
            return renderCodeAnswer(correctAnswer.sampleSolution);
        }
        return null;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
                <QuizIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                >
                    Quiz Natijalari
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    C# Quiz bo'yicha sizning natijalaringiz
                </Typography>
            </Box>

            {/* Score Summary */}
            <Paper
                elevation={4}
                sx={{ p: 4, mb: 4, backgroundColor: 'background.paper' }}
            >
                <Grid container spacing={4} alignItems="center">
                    {/* Overall Score */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box textAlign="center">
                            <Typography
                                variant="h2"
                                component="div"
                                color="primary.main"
                                fontWeight="bold"
                            >
                                {percentage}%
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Umumiy Ball
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Progress Bar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box>
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: 'action.hover',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 6,
                                        backgroundColor:
                                            percentage >= 70
                                                ? 'success.main'
                                                : percentage >= 50
                                                  ? 'warning.main'
                                                  : 'error.main',
                                    },
                                }}
                            />
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                mt={1}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    0%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    100%
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Statistics */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CheckCircle color="success" fontSize="small" />
                                <Typography variant="body1">
                                    <strong>{correctAnswers}</strong> To'g'ri
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Cancel color="error" fontSize="small" />
                                <Typography variant="body1">
                                    <strong>{incorrectAnswers}</strong> Noto'g'ri
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <QuizIcon color="primary" fontSize="small" />
                                <Typography variant="body1">
                                    <strong>{totalQuestions}</strong> Jami
                                    Savollar
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Performance Message */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {percentage >= 90
                        ? '🎉 Ajoyib natija!'
                        : percentage >= 80
                          ? "👏 Zo'r ish!"
                          : percentage >= 70
                            ? '👍 Yaxshi natija!'
                            : percentage >= 60
                              ? '📚 Mashq qilishda davom eting!'
                              : "💪 Taslim bo'lmang!"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {percentage >= 90
                        ? "Siz C# kontseptsiyalarini mukammal o'zlashtirdingiz!"
                        : percentage >= 80
                          ? "Sizda C# bo'yicha kuchli tushuncha bor."
                          : percentage >= 70
                            ? 'Asosiy tushunchalarni yaxshi bilasiz.'
                            : percentage >= 60
                              ? "Mavzularni takrorlang va qayta urinib ko'ring."
                              : "Mavzularni chuqurroq o'rganishni tavsiya qilamiz."}
                </Typography>
            </Paper>

            {/* Question-by-Question Results */}
            <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
            >
                Savollar Tafsiloti
            </Typography>

            {results.map(result => (
                <Card key={result.question.id} elevation={2} sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    fontWeight="bold"
                                >
                                    Savol {result.questionNumber}
                                </Typography>
                                <Chip
                                    label={getQuestionTypeLabel(
                                        result.question.type
                                    )}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                {result.isCorrect ? (
                                    <CheckCircle color="success" />
                                ) : (
                                    <Cancel color="error" />
                                )}
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color={
                                        result.isCorrect
                                            ? 'success.main'
                                            : 'error.main'
                                    }
                                >
                                    {result.isCorrect ? "To'g'ri" : "Noto'g'ri"}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                                sx={{ mb: 1 }}
                            >
                                Savol:
                            </Typography>
                            <MarkdownRenderer
                                content={result.question.prompt}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                                sx={{ mb: 1 }}
                            >
                                Sizning Javobingiz:
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                {isCodeQuestion(result.question.type) ? (
                                    result.userAnswer ? (
                                        <Box sx={{ flex: 1 }}>
                                            {isDiffQuestion(
                                                result.question.type
                                            ) ? (
                                                <DiffEditor
                                                    originalCode={getOriginalCode(
                                                        result.question
                                                    )}
                                                    modifiedCode={
                                                        result.userAnswer as string
                                                    }
                                                    language="csharp"
                                                    title="Sizning Javobingiz"
                                                />
                                            ) : (
                                                <Paper
                                                    elevation={2}
                                                    sx={{
                                                        p: 0,
                                                        backgroundColor: 'grey.900',
                                                        border: 1,
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            borderBottom: 1,
                                                            borderColor: 'divider',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="text.secondary"
                                                            fontWeight="bold"
                                                        >
                                                            Sizning Javobingiz
                                                        </Typography>
                                                    </Box>
                                                    <CodeEditor
                                                        code={
                                                            result.userAnswer as string
                                                        }
                                                        editable={false}
                                                        language="csharp"
                                                    />
                                                </Paper>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Javob berilmagan
                                        </Typography>
                                    )
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{ flex: 1 }}
                                    >
                                        {formatUserAnswer(result)}
                                    </Typography>
                                )}
                                {result.isCorrect && (
                                    <CheckCircle
                                        color="success"
                                        fontSize="small"
                                    />
                                )}
                            </Box>
                        </Box>

                        {!result.isCorrect && result.correctAnswer && (
                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="body2"
                                    color="success.main"
                                    fontWeight="bold"
                                    sx={{ mb: 1 }}
                                >
                                    To'g'ri Javob:
                                </Typography>
                                <Box>
                                    {isCodeQuestion(result.question.type) ? (
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 0,
                                                backgroundColor: 'grey.900',
                                                border: 1,
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderBottom: 1,
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    fontWeight="bold"
                                                >
                                                    To'g'ri Javob
                                                </Typography>
                                            </Box>
                                            <CodeEditor
                                                code={getCorrectAnswerCode(
                                                    result.correctAnswer
                                                )}
                                                editable={false}
                                                language="csharp"
                                            />
                                        </Paper>
                                    ) : (
                                        <Box
                                            sx={{
                                                '& pre': {
                                                    backgroundColor:
                                                        'success.dark',
                                                    color: 'success.contrastText',
                                                },
                                            }}
                                        >
                                            {renderCorrectAnswer(
                                                result.correctAnswer
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {result.explanation && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    backgroundColor: 'action.hover',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight="bold"
                                    sx={{ mb: 1 }}
                                >
                                    Tushuntirish:
                                </Typography>
                                <MarkdownRenderer
                                    content={result.explanation}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<RestartAlt />}
                    onClick={onRetry}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                    }}
                >
                    Qayta Urinish
                </Button>
                {onGoHome && (
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={onGoHome}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 2,
                        }}
                    >
                        Bosh Sahifa
                    </Button>
                )}
            </Box>
        </Container>
    );
};
