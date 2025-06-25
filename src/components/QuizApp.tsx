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
import { ArrowForward, CheckCircle } from '@mui/icons-material';
import type { Question } from '../types';
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
  const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
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