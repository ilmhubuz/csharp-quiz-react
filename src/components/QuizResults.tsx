import React from 'react';
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
  Divider
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  RestartAlt,
  Quiz as QuizIcon 
} from '@mui/icons-material';
import type { Question, MCQQuestion, TrueFalseQuestion, FillQuestion, ErrorSpotQuestion, OutputPredictionQuestion } from '../types';

interface QuizResultsProps {
  questions: Question[];
  answers: { [questionId: number]: string[] | string };
  onRetry: () => void;
}

interface QuestionResult {
  question: Question;
  userAnswer: string[] | string | undefined;
  isCorrect: boolean;
  questionNumber: number;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  onRetry
}) => {
  // Calculate results
  const results: QuestionResult[] = questions.map((question, index) => {
    const userAnswer = answers[question.id];
    let isCorrect = false;

    if (userAnswer !== undefined) {
      switch (question.type) {
        case 'mcq':
          const mcqQuestion = question as MCQQuestion;
          const userMCQAnswers = userAnswer as string[];
          // Check if arrays have same length and same elements
          isCorrect = mcqQuestion.answer.length === userMCQAnswers.length &&
                     mcqQuestion.answer.every(ans => userMCQAnswers.includes(ans));
          break;
        
        case 'true_false':
          const tfQuestion = question as TrueFalseQuestion;
          isCorrect = tfQuestion.answer === userAnswer;
          break;
        
        case 'fill':
          const fillQuestion = question as FillQuestion;
          // For fill questions, we'll do a simple string comparison (trimmed)
          // In a real app, you might want more sophisticated comparison
          isCorrect = fillQuestion.answer.trim() === (userAnswer as string).trim();
          break;
        
        case 'error_spotting':
          const errorQuestion = question as ErrorSpotQuestion;
          // For error spotting, compare corrected code
          isCorrect = errorQuestion.answer.trim() === (userAnswer as string).trim();
          break;
        
        case 'output_prediction':
          const outputQuestion = question as OutputPredictionQuestion;
          // For output prediction, compare expected output
          isCorrect = outputQuestion.answer.trim() === (userAnswer as string).trim();
          break;
        
        case 'code_writing':
          // For code writing questions, consider it correct if user provided any answer
          // since there's no single correct answer for these open-ended questions
          isCorrect = typeof userAnswer === 'string' && userAnswer.trim() !== '';
          break;
      }
    }

    return {
      question,
      userAnswer,
      isCorrect,
      questionNumber: index + 1
    };
  });

  const totalQuestions = questions.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'true_false': return 'True/False';
      case 'fill': return 'Fill in the Blank';
      case 'error_spotting': return 'Error Spotting';
      case 'output_prediction': return 'Output Prediction';
      case 'code_writing': return 'Code Writing';
      default: return type;
    }
  };

  const formatUserAnswer = (result: QuestionResult) => {
    const { userAnswer, question } = result;
    if (!userAnswer) return 'No answer provided';
    
    if (Array.isArray(userAnswer)) {
      return userAnswer.join(', ');
    }
    
    // For code-based questions, show truncated version
    if (question.type === 'fill' || question.type === 'error_spotting' || question.type === 'output_prediction' || question.type === 'code_writing') {
      const codeAnswer = userAnswer as string;
      return codeAnswer.length > 100 ? codeAnswer.substring(0, 100) + '...' : codeAnswer;
    }
    
    return userAnswer as string;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <QuizIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Quiz Results
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's how you performed on the C# Quiz
        </Typography>
      </Box>

      {/* Score Summary */}
      <Paper elevation={4} sx={{ p: 4, mb: 4, backgroundColor: 'background.paper' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Overall Score */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Typography variant="h2" component="div" color="primary.main" fontWeight="bold">
                {percentage}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Overall Score
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
                    backgroundColor: percentage >= 70 ? 'success.main' : 
                                   percentage >= 50 ? 'warning.main' : 'error.main'
                  }
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  0%
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
                  <strong>{correctAnswers}</strong> Correct
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Cancel color="error" fontSize="small" />
                <Typography variant="body1">
                  <strong>{incorrectAnswers}</strong> Incorrect
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <QuizIcon color="primary" fontSize="small" />
                <Typography variant="body1">
                  <strong>{totalQuestions}</strong> Total Questions
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Performance Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {percentage >= 90 ? '🎉 Excellent work!' :
           percentage >= 80 ? '👏 Great job!' :
           percentage >= 70 ? '👍 Good work!' :
           percentage >= 60 ? '📚 Keep practicing!' :
           '💪 Don\'t give up!'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {percentage >= 90 ? 'You have mastered C# concepts!' :
           percentage >= 80 ? 'You have a strong understanding of C#.' :
           percentage >= 70 ? 'You have a good grasp of the basics.' :
           percentage >= 60 ? 'Review the concepts and try again.' :
           'Consider studying the topics more thoroughly.'}
        </Typography>
      </Paper>

      {/* Question-by-Question Results */}
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Question Details
      </Typography>

      {results.map((result) => (
        <Card key={result.question.id} elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Question {result.questionNumber}
                </Typography>
                <Chip 
                  label={getQuestionTypeLabel(result.question.type)}
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
                <Typography variant="body1" fontWeight="bold" color={result.isCorrect ? 'success.main' : 'error.main'}>
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Question:</strong> {result.question.prompt}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Your Answer:</strong> {formatUserAnswer(result)}
            </Typography>

            {!result.isCorrect && result.question.type !== 'code_writing' && 'answer' in result.question && (
              <Typography variant="body2" color="success.main">
                <strong>Correct Answer:</strong> {
                  Array.isArray(result.question.answer) 
                    ? result.question.answer.join(', ')
                    : result.question.answer
                }
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Retry Button */}
      <Box display="flex" justifyContent="center" mt={4}>
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
            borderRadius: 2
          }}
        >
          Retry Quiz
        </Button>
      </Box>
    </Container>
  );
}; 