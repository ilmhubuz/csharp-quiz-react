import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  LinearProgress, 
  Paper, 
  Fab, 
  Zoom, 
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
import type { 
  Question, 
  CategoryFile
} from '../types';

// Remove require.context and use import.meta.glob for Vite

const questionFiles = import.meta.glob('../assets/questions/*.json', { eager: true });

function loadAllCategories() {
  // Returns: Array<{ metadata, questions }>
  return Object.values(questionFiles).map((mod: any) => ({ ...mod }));
}

export const EnhancedQuizApp: React.FC = () => {
  // Load all categories and their questions
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFiles, setCategoryFiles] = useState<CategoryFile[]>([]);
  const [viewMode, setViewMode] = useState<'home' | 'quiz' | 'results'>('home');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<any>({});

  // On mount, load all categories and questions
  useEffect(() => {
    const loadedCategories = loadAllCategories();
    setCategoryFiles(loadedCategories);
    setCategories(loadedCategories.map(cat => cat.metadata));
  }, []);

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
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: number, answer: string[] | string) => {
    // Update local state
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Save to localStorage with category and question ID
    if (currentQuestion) {
      const categoryId = currentQuestion.metadata.category;
      answerStorage.saveAnswer(categoryId, questionId, answer as any);
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
    setShowResults(true);
    setViewMode('results');
    
    // Update progress for all answered questions
    Object.entries(answers).forEach(([questionIdStr, userAnswer]) => {
      const questionId = parseInt(questionIdStr);
      const question = filteredQuestions.find(q => q.id === questionId); // Use filteredQuestions here
      if (question) {
        // This is a simplified correctness check - in a real app you'd have proper answer validation
        const isCorrect = false; // Placeholder - implement proper answer checking
        progressStorage.updateQuestionProgress(questionId, userAnswer as string | string[], isCorrect);
      }
    });
    
    progressStorage.updateAggregateProgress(filteredQuestions); // Use filteredQuestions here
  };

  const handleRetryQuiz = () => {
    setShowResults(false);
    setViewMode('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    const categoryFile = categoryFiles.find(cat => cat.metadata.id === categoryId);
    if (categoryFile) {
      setFilteredQuestions(categoryFile.questions);
      setCurrentQuestionIndex(0);
      
      // Load saved answers for this category's questions
      const questionIds = categoryFile.questions.map(q => q.id);
      const savedAnswers = answerStorage.getAnswersForQuestions(categoryId, questionIds);
      setAnswers(savedAnswers);
      
      setShowResults(false);
      setViewMode('quiz');
    }
  };

  // Show home page
  if (viewMode === 'home') {
    return (
      <HomePage 
        categories={categories} 
        categoryFiles={categoryFiles}
        onSelectCategory={handleSelectCategory} 
      />
    );
  }

  // Show quiz page
  if (viewMode === 'quiz') {
    if (!currentQuestion) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6" color="text.secondary">
              No questions available for this category
            </Typography>
          </Box>
        </Container>
      );
    }

    return (
      <Box sx={{ minHeight: '100vh', pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Question Card */}
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="calc(100vh - 200px)"
          >
            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={filteredQuestions.length}
            />
          </Box>
        </Container>

        {/* Progress Bar */}
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            borderRadius: 0,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              {currentQuestionIndex + 1} of {filteredQuestions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ 
                flexGrow: 1, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
              {Math.round(progress)}%
            </Typography>
            <IconButton
              color="primary"
              onClick={handleGoHome}
              sx={{ ml: 1 }}
            >
              <HomeIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Previous Button */}
        <Zoom in={currentQuestionIndex > 0}>
          <Fab
            color="secondary"
            sx={{
              position: 'fixed',
              bottom: 80,
              left: 24,
            }}
            onClick={handlePrevious}
          >
            <ArrowBack />
          </Fab>
        </Zoom>

        {/* Next Button */}
        <Zoom in={isAnswered && !isLastQuestion}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 24,
            }}
            onClick={handleNext}
          >
            <ArrowForward />
          </Fab>
        </Zoom>

        {/* Completion Button */}
        <Zoom in={isAnswered && isLastQuestion}>
          <Fab
            color="success"
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 24,
            }}
            onClick={handleShowResults}
          >
            <CheckCircle />
          </Fab>
        </Zoom>
      </Box>
    );
  }

  // Show results page
  if (showResults && viewMode === 'results') {
    return (
      <QuizResults 
        questions={filteredQuestions}
        answers={answers}
        onRetry={handleRetryQuiz}
        onGoHome={handleGoHome}
      />
    );
  }

  // Show quiz completion message
  if (!currentQuestion && filteredQuestions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          gap={3}
        >
          <Typography variant="h4" color="primary">
            No questions found for this selection
          </Typography>
          <Box display="flex" gap={2}>
            <Fab
              variant="extended"
              color="primary"
              onClick={handleGoHome}
            >
              <HomeIcon sx={{ mr: 1 }} />
              Go Home
            </Fab>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          gap={3}
        >
          <Typography variant="h4" color="primary">
            Quiz Completed! 🎉
          </Typography>
          <Box display="flex" gap={2}>
            <Fab
              variant="extended"
              color="success"
              onClick={handleShowResults}
            >
              <CheckCircle sx={{ mr: 1 }} />
              View Results
            </Fab>
            <Fab
              variant="extended"
              color="primary"
              onClick={handleGoHome}
            >
              <HomeIcon sx={{ mr: 1 }} />
              Go Home
            </Fab>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      {/* Top App Bar */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoHome}
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold">
              Quiz
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Question Card */}
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="calc(100vh - 300px)"
        >
          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={filteredQuestions.length}
          />
        </Box>
      </Container>

      {/* Progress Bar */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderRadius: 0,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
            {currentQuestionIndex + 1} of {filteredQuestions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ 
              flexGrow: 1, 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Paper>

      {/* Previous Button */}
      <Zoom in={currentQuestionIndex > 0}>
        <Fab
          color="secondary"
          sx={{
            position: 'fixed',
            bottom: 80,
            left: 24,
          }}
          onClick={handlePrevious}
        >
          <ArrowBack />
        </Fab>
      </Zoom>

      {/* Next Button */}
      <Zoom in={isAnswered && !isLastQuestion}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 24,
          }}
          onClick={handleNext}
        >
          <ArrowForward />
        </Fab>
      </Zoom>

      {/* Completion Button */}
      <Zoom in={isAnswered && isLastQuestion}>
        <Fab
          color="success"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 24,
          }}
          onClick={handleShowResults}
        >
          <CheckCircle />
        </Fab>
      </Zoom>
    </Box>
  );
}; 