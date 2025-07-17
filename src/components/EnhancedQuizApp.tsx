import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  LinearProgress, 
  Paper, 
  Fab, 
  IconButton,
} from '@mui/material';
import { 
  ArrowBack, 
  ArrowForward, 
  CheckCircle,
  Home as HomeIcon,
} from '@mui/icons-material';
import { HomePage } from './HomePage';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { progressStorage } from '../services/progressStorage';
import { answerStorage } from '../services/answerStorage';
import type { Question } from '../types';

export const EnhancedQuizApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<'home' | 'quiz' | 'results'>('home');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);

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
  const handleSelectCollection = (collectionId: number) => {
    setSelectedCollectionId(collectionId);
    // TODO: Load questions from API for this collection
    // For now, we'll use placeholder data
    setFilteredQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setViewMode('quiz');
  };

  // Show home page
  if (viewMode === 'home') {
    return (
      <HomePage onSelectCollection={handleSelectCollection} />
    );
  }

  // Show quiz page
  if (viewMode === 'quiz') {
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