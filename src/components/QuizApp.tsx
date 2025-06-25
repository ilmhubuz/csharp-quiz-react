import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  LinearProgress, 
  Typography, 
  Paper,
  Fab,
  Zoom
} from '@mui/material';
import { ArrowForward, ArrowBack, CheckCircle } from '@mui/icons-material';
import type { Question, FillQuestion, ErrorSpotQuestion, OutputPredictionQuestion } from '../types';
import { QuestionCard } from './QuestionCard';
import questionsData from '../assets/questions.json';

interface QuizState {
  [questionId: number]: string[] | string;
}

export const QuizApp: React.FC = () => {
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizState>(() => {
    const saved = localStorage.getItem('quiz-answers');
    return saved ? JSON.parse(saved) : {};
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Enhanced answer checking logic
  const isAnswered = currentQuestion && (() => {
    const answer = answers[currentQuestion.id];
    if (answer === undefined) return false;
    
    if (currentQuestion.type === 'fill') {
      const fillQuestion = currentQuestion as FillQuestion;
      // For fill questions, consider answered if the code has been modified from original
      return answer !== fillQuestion.codeWithBlank && (answer as string).trim() !== '';
    } else if (currentQuestion.type === 'error_spotting') {
      const errorSpotQuestion = currentQuestion as ErrorSpotQuestion;
      // For error spotting questions, consider answered if the code has been modified from original
      return answer !== errorSpotQuestion.codeWithError && (answer as string).trim() !== '';
    } else if (currentQuestion.type === 'output_prediction') {
      // For output prediction questions, consider answered if any output has been entered
      return typeof answer === 'string' && answer.trim() !== '';
    } else if (currentQuestion.type === 'mcq') {
      // For MCQ, check if at least one option is selected
      return Array.isArray(answer) && answer.length > 0;
    } else {
      // For true/false, check if an option is selected
      return typeof answer === 'string' && answer !== '';
    }
  })();
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    localStorage.setItem('quiz-answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (questionId: number, answer: string[] | string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (!currentQuestion) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
        >
          <Typography variant="h4" color="primary">
            Quiz Completed! 🎉
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
            totalQuestions={questions.length}
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
            {currentQuestionIndex + 1} of {questions.length}
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

      {/* Completion Indicator */}
      <Zoom in={isAnswered && isLastQuestion}>
        <Fab
          color="success"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 24,
          }}
        >
          <CheckCircle />
        </Fab>
      </Zoom>
    </Box>
  );
}; 