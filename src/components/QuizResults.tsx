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
  Quiz as QuizIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { Question, MCQQuestion, TrueFalseQuestion, FillQuestion, ErrorSpotQuestion, OutputPredictionQuestion } from '../types';

interface QuizResultsProps {
  questions: Question[];
  answers: { [questionId: number]: string[] | string };
  onRetry: () => void;
  onGoHome?: () => void;
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
  onRetry,
  onGoHome
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
          // For fill questions, normalize both answers by removing markdown formatting
          const normalizeCode = (code: string) => {
            return code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
          };
          isCorrect = normalizeCode(fillQuestion.answer) === normalizeCode(userAnswer as string);
          break;
        
        case 'error_spotting':
          const errorQuestion = question as ErrorSpotQuestion;
          // For error spotting, normalize both answers by removing markdown formatting
          const normalizeErrorCode = (code: string) => {
            return code.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
          };
          isCorrect = normalizeErrorCode(errorQuestion.answer) === normalizeErrorCode(userAnswer as string);
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
      case 'mcq': return 'Ko\'p Tanlovli';
      case 'true_false': return 'To\'g\'ri/Noto\'g\'ri';
      case 'fill': return 'Bo\'shliqni To\'ldirish';
      case 'error_spotting': return 'Xatolarni Topish';
      case 'output_prediction': return 'Natijani Bashorat Qilish';
      case 'code_writing': return 'Kod Yozish';
      default: return type;
    }
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
          borderColor: 'divider'
        }}
      >
        <code>{answer}</code>
      </Box>
    );
  };

  const renderCorrectAnswer = (question: any) => {
    const answer = question.answer;
    if (Array.isArray(answer)) {
      return (
        <Typography variant="body2" color="success.main">
          {answer.join(', ')}
        </Typography>
      );
    }
    
    // For code-based questions, remove markdown formatting and render as code
    if (question.type === 'fill' || question.type === 'error_spotting' || question.type === 'code_writing') {
      const cleanAnswer = answer.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
      return renderCodeAnswer(cleanAnswer);
    }
    
    return (
      <Typography variant="body2" color="success.main">
        {answer}
      </Typography>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <QuizIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Quiz Natijalari
        </Typography>
        <Typography variant="h6" color="text.secondary">
          C# Quiz bo'yicha sizning natijalaringiz
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
                  <strong>{totalQuestions}</strong> Jami Savollar
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Performance Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {percentage >= 90 ? '🎉 Ajoyib natija!' :
           percentage >= 80 ? '👏 Zo\'r ish!' :
           percentage >= 70 ? '👍 Yaxshi natija!' :
           percentage >= 60 ? '📚 Mashq qilishda davom eting!' :
           '💪 Taslim bo\'lmang!'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {percentage >= 90 ? 'Siz C# kontseptsiyalarini mukammal o\'zlashtirdingiz!' :
           percentage >= 80 ? 'Sizda C# bo\'yicha kuchli tushuncha bor.' :
           percentage >= 70 ? 'Asosiy tushunchalarni yaxshi bilasiz.' :
           percentage >= 60 ? 'Mavzularni takrorlang va qayta urinib ko\'ring.' :
           'Mavzularni chuqurroq o\'rganishni tavsiya qilamiz.'}
        </Typography>
      </Paper>

      {/* Question-by-Question Results */}
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Savollar Tafsiloti
      </Typography>

      {results.map((result) => (
        <Card key={result.question.id} elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Savol {result.questionNumber}
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
                  {result.isCorrect ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
                Savol:
              </Typography>
              <MarkdownRenderer content={result.question.prompt} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
                Sizning Javobingiz:
              </Typography>
              {result.question.type === 'fill' || result.question.type === 'error_spotting' || result.question.type === 'output_prediction' || result.question.type === 'code_writing' ? (
                result.userAnswer ? renderCodeAnswer(result.userAnswer as string) : (
                                      <Typography variant="body2" color="text.secondary">
                      Javob berilmagan
                    </Typography>
                )
              ) : (
                <Typography variant="body2">
                  {formatUserAnswer(result)}
                </Typography>
              )}
            </Box>

            {!result.isCorrect && result.question.type !== 'code_writing' && 'answer' in result.question && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mb: 1 }}>
                  To'g'ri Javob:
                </Typography>
                <Box sx={{ 
                  '& pre': { 
                    backgroundColor: 'success.dark',
                    color: 'success.contrastText'
                  }
                }}>
                  {renderCorrectAnswer(result.question)}
                </Box>
              </Box>
            )}

            {(result.question as any).explanation && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
                  Tushuntirish:
                </Typography>
                <MarkdownRenderer content={(result.question as any).explanation} />
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
            borderRadius: 2
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
            borderRadius: 2
          }}
        >
          Bosh Sahifa
        </Button>
        )}
      </Box>
    </Container>
  );
}; 