import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    LinearProgress,
    Paper,
    Fab,
    IconButton,
    CircularProgress,
    Button,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    CheckCircle,
    Home as HomeIcon,
    Lock as LockIcon,
    Error as ErrorIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { HomePage } from './HomePage';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { answerStorage } from '../services/answerStorage';
import { questionService } from '../api/services/questionService';
import { hasCSharpQuizAccess } from '../lib/auth-utils';
import type {
    Question,
    QuestionType,
    TopicCategory,
    MCQQuestion,
    TrueFalseQuestion,
    FillQuestion,
    ErrorSpotQuestion,
    OutputPredictionQuestion,
    CodeWritingQuestion,
} from '../types';
import type { QuestionResponse } from '../types/api';

export const EnhancedQuizApp: React.FC = () => {
    const { keycloak } = useKeycloak();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [viewMode, setViewMode] = useState<'home' | 'quiz' | 'results'>(
        'home'
    );
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [selectedCollectionId, setSelectedCollectionId] = useState<
        number | null
    >(null);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<'forbidden' | 'error' | null>(
        null,
    );

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isLastQuestion =
        currentQuestionIndex === filteredQuestions.length - 1;

    // Enhanced answer checking logic
    const isAnswered =
        currentQuestion &&
        (() => {
            const answer = answers[currentQuestion.id];
            if (answer === undefined) return false;

            if (currentQuestion.type === 'fill') {
                const fillQuestion = currentQuestion as any;
                return (
                    answer !== fillQuestion.codeWithBlank &&
                    (answer as string).trim() !== ''
                );
            } else if (currentQuestion.type === 'error_spotting') {
                const errorSpotQuestion = currentQuestion as any;
                return (
                    answer !== errorSpotQuestion.codeWithError &&
                    (answer as string).trim() !== ''
                );
            } else if (currentQuestion.type === 'output_prediction') {
                return (answer as string).trim() !== '';
            } else if (currentQuestion.type === 'code_writing') {
                return (answer as string).trim() !== '';
            }

            return Array.isArray(answer) ? answer.length > 0 : answer !== '';
        })();

    // Fix progress calculation to start at 0 and only increase when questions are answered
    const answeredCount = filteredQuestions.filter(q => {
        const answer = answers[q.id];
        if (answer === undefined) return false;
        if (q.type === 'fill') {
            const fillQuestion = q as any;
            return (
                answer !== fillQuestion.codeWithBlank &&
                (answer as string).trim() !== ''
            );
        } else if (q.type === 'error_spotting') {
            const errorSpotQuestion = q as any;
            return (
                answer !== errorSpotQuestion.codeWithError &&
                (answer as string).trim() !== ''
            );
        } else if (q.type === 'output_prediction') {
            return (answer as string).trim() !== '';
        } else if (q.type === 'code_writing') {
            return (answer as string).trim() !== '';
        }
        return Array.isArray(answer) ? answer.length > 0 : answer !== '';
    }).length;

    const progress =
        filteredQuestions.length > 0
            ? (answeredCount / filteredQuestions.length) * 100
            : 0;

    const handleGoHome = () => {
        setViewMode('home');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setSelectedCollectionId(null);
        setQuestionsError(null);
        setErrorType(null);
    };

    const handleAnswerChange = (
        questionId: number,
        answer: string[] | string,
    ) => {
        // Update local state
        setAnswers((prev: any) => ({
            ...prev,
            [questionId]: answer,
        }));

        // Save to localStorage with collection and question ID
        if (currentQuestion && selectedCollectionId) {
            answerStorage.saveAnswer(
                selectedCollectionId.toString(),
                questionId,
                answer as any,
            );
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleShowResults = () => {
        setViewMode('results');
    };

    const handleRetryQuiz = () => {
        setViewMode('quiz');
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleRetryLoad = () => {
        if (selectedCollectionId) {
            handleSelectCollection(selectedCollectionId);
        }
    };

    // Handle collection selection
    const handleSelectCollection = async (collectionId: number) => {
        setSelectedCollectionId(collectionId);
        setQuestionsLoading(true);
        setQuestionsError(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setViewMode('quiz');

        try {
            let questions: QuestionResponse[] = [];

            if (keycloak.authenticated) {
                // Authenticated user - get full questions
                const response = await questionService.getQuestionsByCollection(
                    collectionId,
                    1,
                    100,
                );
                questions = response.data || [];
            } else {
                // Unauthenticated user - get preview questions
                questions =
                    await questionService.getPreviewQuestions(collectionId);
            }

            // Convert QuestionResponse to Question format
            const convertedQuestions: Question[] = questions.map(q => {
                const baseQuestion = {
                    id: q.id,
                    type: q.type as QuestionType,
                    metadata: {
                        category: q.metadata.subcategory as TopicCategory,
                        subcategory: q.metadata.subcategory,
                    },
                    explanation: q.explanation,
                };

                switch (q.type) {
                    case 'MCQ':
                        return {
                            ...baseQuestion,
                            type: 'mcq',
                            codeBefore: q.content.codeBefore,
                            codeAfter: q.content.codeAfter,
                            prompt: q.content.prompt,
                            options: q.options || [],
                            answer: [], // Will be filled by user
                        } as MCQQuestion;

                    case 'TrueFalse':
                        return {
                            ...baseQuestion,
                            type: 'true_false',
                            codeBefore: q.content.codeBefore,
                            codeAfter: q.content.codeAfter,
                            prompt: q.content.prompt,
                            answer: 'true' as const, // Will be filled by user
                        } as TrueFalseQuestion;

                    case 'Fill':
                        return {
                            ...baseQuestion,
                            type: 'fill',
                            codeWithBlank: q.content.codeWithBlank || '',
                            prompt: q.content.prompt,
                            answer: '', // Will be filled by user
                            hints: q.hints,
                        } as FillQuestion;

                    case 'ErrorSpotting':
                        return {
                            ...baseQuestion,
                            type: 'error_spotting',
                            codeWithError: q.content.codeWithError || '',
                            prompt: q.content.prompt,
                            answer: '', // Will be filled by user
                        } as ErrorSpotQuestion;

                    case 'OutputPrediction':
                        return {
                            ...baseQuestion,
                            type: 'output_prediction',
                            snippet: q.content.snippet || '',
                            prompt: q.content.prompt,
                            answer: '', // Will be filled by user
                        } as OutputPredictionQuestion;

                    case 'CodeWriting':
                        return {
                            ...baseQuestion,
                            type: 'code_writing',
                            prompt: q.content.prompt,
                            codeAfter: q.content.codeAfter,
                            examples: q.content.examples || [],
                            testCases: q.content.testCases,
                        } as CodeWritingQuestion;

                    default:
                        throw new Error(`Unsupported question type: ${q.type}`);
                }
            });

            setFilteredQuestions(convertedQuestions);
        } catch (error: any) {
            console.error('Failed to load questions:', error);
            // Determine error type based on status code or error message
            if (error.status === 401) {
                setErrorType('forbidden');
                if (!keycloak.authenticated) {
                    setQuestionsError(
                        'Ushbu kontentni ko\'rish uchun tizimga kirishingiz kerak.'
                    );
                } else {
                    setQuestionsError(
                        'Sizda ushbu kontentni ko\'rish uchun ruxsat yo\'q. Iltimos, administrator bilan bog\'laning.'
                    );
                }
            } else if (error.status === 403) {
                setErrorType('forbidden');
                if (keycloak.authenticated && !hasCSharpQuizAccess(keycloak)) {
                    setQuestionsError(
                        'Sizda C# Quiz dasturiga kirish uchun "Ustoz" a\'zoligi mavjud emas. To\'liq kirish uchun a\'zolikni sotib oling.'
                    );
                } else {
                    setQuestionsError(
                        'Sizda ushbu kontentni ko\'rish uchun ruxsat yo\'q.'
                    );
                }
            } else if (
                error.message?.toLowerCase().includes('unauthorized') ||
                error.message?.toLowerCase().includes('forbidden')
            ) {
                setErrorType('forbidden');
                setQuestionsError(
                    'Sizda ushbu kontentni ko\'rish uchun ruxsat yo\'q.'
                );
            } else {
                setErrorType('error');
                setQuestionsError(
                    error.message ||
                        'Savollarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.'
                );
            }
        } finally {
            setQuestionsLoading(false);
        }
    };

    // Show home page
    if (viewMode === 'home') {
        return <HomePage onSelectCollection={handleSelectCollection} />;
    }

    // Show quiz page
    if (viewMode === 'quiz') {
        if (questionsLoading) {
            return (
                <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        minHeight={{ xs: '70vh', sm: '60vh' }}
                        gap={2}
                    >
                        <CircularProgress size={isMobile ? 40 : 50} />
                        <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            color="text.secondary"
                        >
                            Savollar yuklanmoqda...
                        </Typography>
                    </Box>
                </Container>
            );
        }

        if (questionsError) {
            return (
                <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight={{ xs: '70vh', sm: '60vh' }}
                        textAlign="center"
                        px={{ xs: 2, sm: 3 }}
                    >
                        {/* Error Icon */}
                        <Box
                            sx={{
                                width: { xs: 80, sm: 100, md: 120 },
                                height: { xs: 80, sm: 100, md: 120 },
                                borderRadius: '50%',
                                backgroundColor:
                                    errorType === 'forbidden'
                                        ? 'warning.light'
                                        : 'error.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                                opacity: 0.1,
                            }}
                        >
                            {errorType === 'forbidden' ? (
                                <LockIcon
                                    sx={{
                                        fontSize: { xs: 40, sm: 50, md: 60 },
                                        color: 'warning.dark',
                                    }}
                                />
                            ) : (
                                <ErrorIcon
                                    sx={{
                                        fontSize: { xs: 40, sm: 50, md: 60 },
                                        color: 'error.dark',
                                    }}
                                />
                            )}
                        </Box>

                        {/* Error Title */}
                        <Typography
                            variant={isMobile ? 'h5' : 'h4'}
                            component="h1"
                            gutterBottom
                            fontWeight="600"
                            color={
                                errorType === 'forbidden'
                                    ? 'warning.main'
                                    : 'error.main'
                            }
                        >
                            {errorType === 'forbidden'
                                ? 'Kirish taqiqlangan'
                                : 'Xatolik yuz berdi'}
                        </Typography>

                        {/* Error Message */}
                        <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            color="text.secondary"
                            sx={{ mb: 4, maxWidth: 500 }}
                        >
                            {questionsError}
                        </Typography>

                        {/* Action Buttons */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            {errorType === 'forbidden' &&
                                !keycloak.authenticated && (
                                <Button
                                        variant="contained"
                                        color="primary"
                                        size={isMobile ? 'medium' : 'large'}
                                    onClick={() => keycloak.login()}
                                    fullWidth={isMobile}
                                    >
                                        Tizimga kirish
                                    </Button>
                            )}
                            {errorType === 'forbidden' &&
                                keycloak.authenticated &&
                                !hasCSharpQuizAccess(keycloak) && (
                                <Button
                                        variant="contained"
                                        color="primary"
                                        size={isMobile ? 'medium' : 'large'}
                                    onClick={() =>
                                        window.open(
                                            'https://ilmhub.uz/membership',
                                            '_blank'
                                        )
                                    }
                                    fullWidth={isMobile}
                                >
                                        Ustoz a'zoligini sotib olish
                                    </Button>
                            )}
                            {errorType === 'error' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size={isMobile ? 'medium' : 'large'}
                                    startIcon={<RefreshIcon />}
                                    onClick={handleRetryLoad}
                                    fullWidth={isMobile}
                                >
                                    Qayta urinish
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                color="primary"
                                size={isMobile ? 'medium' : 'large'}
                                startIcon={<HomeIcon />}
                                onClick={handleGoHome}
                                fullWidth={isMobile}
                            >
                                Bosh sahifa
                            </Button>
                        </Stack>

                        {/* Additional Help Text */}
                        {errorType === 'forbidden' &&
                            keycloak.authenticated &&
                            hasCSharpQuizAccess(keycloak) && (
                            <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 3, display: 'block' }}
                            >
                                    Agar sizda kirish huquqi bo'lishi kerak deb
                                    hisoblasangiz, administrator bilan
                                    bog'laning.
                                </Typography>
                        )}
                    </Box>
                </Container>
            );
        }

        if (!currentQuestion) {
            return (
                <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        minHeight={{ xs: '70vh', sm: '60vh' }}
                        textAlign="center"
                        px={{ xs: 2, sm: 3 }}
                    >
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            color="text.secondary"
                            gutterBottom
                        >
                            Savollar mavjud emas
                        </Typography>
                        <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Ushbu to'plamda hali savollar yo'q.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size={isMobile ? 'medium' : 'large'}
                            startIcon={<HomeIcon />}
                            onClick={handleGoHome}
                        >
                            Orqaga qaytish
                        </Button>
                    </Box>
                </Container>
            );
        }

        return (
            <Box sx={{ minHeight: '100vh', pb: 10 }}>
                {/* Progress Bar */}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        height: 4,
                    }}
                />

                {/* Header */}
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6" component="h1">
                            {currentQuestionIndex + 1}-savol /{' '}
                            {filteredQuestions.length} ta
                        </Typography>
                        <IconButton onClick={handleGoHome} color="primary">
                            <HomeIcon />
                        </IconButton>
                    </Box>
                </Container>

                {/* Question Card */}
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <QuestionCard
                        question={currentQuestion}
                        answer={answers[currentQuestion.id]}
                        onAnswerChange={handleAnswerChange}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={filteredQuestions.length}
                    />
                </Container>

                {/* Navigation */}
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <IconButton
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        color="primary"
                    >
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="body2" color="text.secondary">
                        {currentQuestionIndex + 1} / {filteredQuestions.length}
                    </Typography>

                    {isLastQuestion ? (
                        <Fab
                            color="primary"
                            onClick={handleShowResults}
                            disabled={!isAnswered}
                            sx={{ ml: 1 }}
                        >
                            <CheckCircle />
                        </Fab>
                    ) : (
                        <IconButton
                            onClick={handleNext}
                            disabled={!isAnswered}
                            color="primary"
                        >
                            <ArrowForward />
                        </IconButton>
                    )}
                </Paper>
            </Box>
        );
    }

    // Show results page
    if (viewMode === 'results') {
        return (
            <QuizResults
                questions={filteredQuestions}
                answers={answers}
                collectionId={selectedCollectionId!}
                onRetry={handleRetryQuiz}
                onGoHome={handleGoHome}
            />
        );
    }

    return null;
};
