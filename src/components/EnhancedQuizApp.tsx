import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  LinearProgress, 
  Typography, 
  Paper,
  Fab,
  Zoom,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  ArrowForward, 
  ArrowBack, 
  CheckCircle, 
  Home as HomeIcon,
  ExpandMore,
  ExpandLess,
  Info,
  Lightbulb,
  Category,
  Quiz
} from '@mui/icons-material';
import type { 
  Question, 
  FillQuestion, 
  ErrorSpotQuestion, 
  TopicCategory, 
  QuestionType, 
  ViewMode 
} from '../types';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { HomePage } from './HomePage';
import { progressStorage } from '../services/progressStorage';
import { answerStorage } from '../services/answerStorage';
import { CATEGORY_INFO, TYPE_INFO, DIFFICULTY_INFO } from '../constants/categories';
import questionsData from '../assets/questions.json';

interface QuizState {
  [questionId: number]: string[] | string;
}

interface QuizConfig {
  mode: 'category' | 'type';
  categories?: TopicCategory[];
  types?: QuestionType[];
}

export const EnhancedQuizApp: React.FC = () => {
  const [allQuestions] = useState<Question[]>(questionsData as Question[]);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<QuizState>({});
  const [showMetadata, setShowMetadata] = useState(false);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  // Initialize progress on mount
  useEffect(() => {
    progressStorage.initializeProgress(allQuestions);
    progressStorage.updateAggregateProgress(allQuestions);
  }, [allQuestions]);

  // Filter questions based on quiz config and load saved answers
  useEffect(() => {
    if (!quizConfig) {
      setFilteredQuestions([]);
      return;
    }

    let filtered = allQuestions;

    if (quizConfig.mode === 'category' && quizConfig.categories) {
      filtered = allQuestions.filter(q => 
        quizConfig.categories!.includes(q.metadata.category)
      );
    } else if (quizConfig.mode === 'type' && quizConfig.types) {
      filtered = allQuestions.filter(q => 
        quizConfig.types!.includes(q.type)
      );
    }

    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    
    // Load saved answers for the filtered questions
    const questionIds = filtered.map(q => q.id);
    const savedAnswers = answerStorage.getAnswersForQuestions(questionIds);
    setAnswers(savedAnswers);
  }, [quizConfig, allQuestions]);

  // Enhanced answer checking logic
  const isAnswered = currentQuestion && (() => {
    const answer = answers[currentQuestion.id];
    if (answer === undefined) return false;
    
    if (currentQuestion.type === 'fill') {
      const fillQuestion = currentQuestion as FillQuestion;
      return answer !== fillQuestion.codeWithBlank && (answer as string).trim() !== '';
    } else if (currentQuestion.type === 'error_spotting') {
      const errorSpotQuestion = currentQuestion as ErrorSpotQuestion;
      return answer !== errorSpotQuestion.codeWithError && (answer as string).trim() !== '';
    } else if (currentQuestion.type === 'output_prediction') {
      return typeof answer === 'string' && answer.trim() !== '';
    } else if (currentQuestion.type === 'code_writing') {
      return typeof answer === 'string' && answer.trim() !== '';
    } else if (currentQuestion.type === 'mcq') {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      return typeof answer === 'string' && answer !== '';
    }
  })();
  
  const progress = filteredQuestions.length > 0 ? ((currentQuestionIndex + 1) / filteredQuestions.length) * 100 : 0;

  const handleStartQuiz = (config: { mode: 'category' | 'type'; categories?: TopicCategory[]; types?: QuestionType[] }) => {
    setQuizConfig(config);
    setViewMode('quiz');
  };

  const handleGoHome = () => {
    setViewMode('home');
    setQuizConfig(null);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    // Trigger HomePage refresh to show updated progress
    setHomeRefreshKey(prev => prev + 1);
  };

  const handleAnswerChange = (questionId: number, answer: string[] | string) => {
    // Update local state
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Save to localStorage
    answerStorage.saveAnswer(questionId, answer);
    
    // Trigger HomePage refresh to show updated progress
    setHomeRefreshKey(prev => prev + 1);
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
      const question = allQuestions.find(q => q.id === questionId);
      if (question) {
        // This is a simplified correctness check - in a real app you'd have proper answer validation
        const isCorrect = false; // Placeholder - implement proper answer checking
        progressStorage.updateQuestionProgress(questionId, userAnswer, isCorrect);
      }
    });
    
    progressStorage.updateAggregateProgress(allQuestions);
  };

  const handleRetryQuiz = () => {
    setShowResults(false);
    setViewMode('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  // Get current quiz title
  const quizTitle = useMemo(() => {
    if (!quizConfig) return '';
    
    if (quizConfig.mode === 'category' && quizConfig.categories) {
      const categoryNames = quizConfig.categories.map(cat => CATEGORY_INFO[cat].nameUz);
      return categoryNames.join(', ');
    } else if (quizConfig.mode === 'type' && quizConfig.types) {
      const typeNames = quizConfig.types.map(type => TYPE_INFO[type].nameUz);
      return typeNames.join(', ');
    }
    
    return 'Quiz';
  }, [quizConfig]);

  // Show home page
  if (viewMode === 'home') {
    return <HomePage key={homeRefreshKey} questions={allQuestions} onStartQuiz={handleStartQuiz} />;
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
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
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
              {quizTitle}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </Typography>
          </Box>
          <Tooltip title="Show question metadata">
            <IconButton
              color="inherit"
              onClick={() => setShowMetadata(!showMetadata)}
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Question Metadata Card */}
        <Collapse in={showMetadata}>
          <Card elevation={2} sx={{ mb: 3, backgroundColor: 'background.default' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" color="primary" display="flex" alignItems="center" gap={1}>
                  <Info />
                  Question Information
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowMetadata(false)}
                >
                  <ExpandLess />
                </IconButton>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                <Chip
                  icon={<Category />}
                  label={CATEGORY_INFO[currentQuestion.metadata.category].nameUz}
                  color="primary"
                  size="small"
                />
                <Chip
                  icon={<Quiz />}
                  label={TYPE_INFO[currentQuestion.type].nameUz}
                  color="secondary"
                  size="small"
                />
                <Chip
                  label={DIFFICULTY_INFO[currentQuestion.metadata.difficulty].nameUz}
                  size="small"
                  sx={{
                    backgroundColor: DIFFICULTY_INFO[currentQuestion.metadata.difficulty].color,
                    color: 'white'
                  }}
                />
                <Chip
                  label={`C# ${currentQuestion.metadata.csharpVersion}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${Math.ceil(currentQuestion.metadata.estimatedTimeSeconds / 60)} min`}
                  variant="outlined"
                  size="small"
                />
              </Box>

              {currentQuestion.metadata.learningObjectives && currentQuestion.metadata.learningObjectives.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary" mb={1} display="flex" alignItems="center" gap={1}>
                    <Lightbulb fontSize="small" />
                    Learning Objectives:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {currentQuestion.metadata.learningObjectives.map((objective, index) => (
                      <Typography key={index} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {objective}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {currentQuestion.metadata.commonMistakes && currentQuestion.metadata.commonMistakes.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Common Mistakes:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {currentQuestion.metadata.commonMistakes.map((mistake, index) => (
                      <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                        {mistake}
                      </Typography>
                    ))}
                  </Box>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Collapse>

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

      {/* Metadata Toggle FAB */}
      <Zoom in={!showMetadata}>
        <Fab
          color="info"
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 150,
            right: 24,
          }}
          onClick={() => setShowMetadata(true)}
        >
          <ExpandMore />
        </Fab>
      </Zoom>
    </Box>
  );
}; 