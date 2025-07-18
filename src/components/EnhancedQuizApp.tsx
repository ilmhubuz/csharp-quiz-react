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
  Alert,
} from '@mui/material';
import { 
  ArrowBack, 
  ArrowForward, 
  CheckCircle,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { HomePage } from './HomePage';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { progressStorage } from '../services/progressStorage';
import { answerStorage } from '../services/answerStorage';
import { questionService } from '../api/services/questionService';
import type { 
  Question, 
  QuestionType, 
  TopicCategory, 
  MCQQuestion, 
  TrueFalseQuestion, 
  FillQuestion, 
  ErrorSpotQuestion, 
  OutputPredictionQuestion, 
  CodeWritingQuestion 
} from '../types';
import type { QuestionResponse } from '../types/api';

export const EnhancedQuizApp: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [viewMode, setViewMode] = useState<'home' | 'quiz' | 'results'>('home');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  // Enhanced answer checking logic
  const isAnswered = currentQuestion && (() => {
    const answer = answers[currentQuestion.id];
    if (answer === undefined) return false;
    
    if (currentQuestion.type === 'fill') {
      const fillQuestion = currentQuestion as any;
      return answer !== fillQuestion.codeWithBlank && (answer as string).trim() !== '';
    } else if (currentQuestion.type === 'error_spotting') {
      const errorSpotQuestion = currentQuestion as any;
      return answer !== errorSpotQuestion.codeWithError && (answer as string).trim() !== '';
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
      return answer !== fillQuestion.codeWithBlank && (answer as string).trim() !== '';
    } else if (q.type === 'error_spotting') {
      const errorSpotQuestion = q as any;
      return answer !== errorSpotQuestion.codeWithError && (answer as string).trim() !== '';
    } else if (q.type === 'output_prediction') {
      return (answer as string).trim() !== '';
    } else if (q.type === 'code_writing') {
      return (answer as string).trim() !== '';
    }
    
    return Array.isArray(answer) ? answer.length > 0 : answer !== '';
  }).length;
  
  const progress = filteredQuestions.length > 0 ? (answeredCount / filteredQuestions.length) * 100 : 0;

  const handleGoHome = () => {
    setViewMode('home');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedCollectionId(null);
    setQuestionsError(null);
  };

  const handleAnswerChange = (questionId: number, answer: string[] | string) => {
    // Update local state
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Save to localStorage with collection and question ID
    if (currentQuestion && selectedCollectionId) {
      answerStorage.saveAnswer(selectedCollectionId.toString(), questionId, answer as any);
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
    
    // Update progress for all answered questions
    Object.entries(answers).forEach(([questionIdStr, userAnswer]) => {
      const questionId = parseInt(questionIdStr);
      const question = filteredQuestions.find(q => q.id === questionId);
      if (question) {
        // This is a simplified correctness check - in a real app you'd have proper answer validation
        const isCorrect = false; // Placeholder - implement proper answer checking
        progressStorage.updateQuestionProgress(questionId, userAnswer as string | string[], isCorrect);
      }
    });
    
    progressStorage.updateAggregateProgress(filteredQuestions);
  };

  const handleRetryQuiz = () => {
    setViewMode('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({});
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
        const response = await questionService.getQuestionsByCollection(collectionId, 1, 100);
        questions = response.data || [];
      } else {
        // Unauthenticated user - get preview questions
        questions = await questionService.getPreviewQuestions(collectionId);
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
    } catch (error) {
      console.error('Failed to load questions:', error);
      setQuestionsError(error instanceof Error ? error.message : 'Failed to load questions');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Show home page
  if (viewMode === 'home') {
    return (
      <HomePage onSelectCollection={handleSelectCollection} />
    );
  }

  // Show quiz page
  if (viewMode === 'quiz') {
    if (questionsLoading) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      );
    }

    if (questionsError) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {questionsError}
          </Alert>
          <Box display="flex" justifyContent="center">
            <IconButton onClick={handleGoHome} color="primary">
              <HomeIcon />
            </IconButton>
          </Box>
        </Container>
      );
    }

    if (!currentQuestion) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6" color="text.secondary">
              No questions available for this collection
            </Typography>
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h1">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
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
        onRetry={handleRetryQuiz}
        onGoHome={handleGoHome}
      />
    );
  }

  return null;
}; 