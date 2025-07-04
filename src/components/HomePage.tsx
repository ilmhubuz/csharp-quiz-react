import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Quiz,
  Assessment,
  Home,
  Refresh
} from '@mui/icons-material';
import type { TopicCategory, QuestionType, Question, CategoryProgress, TypeProgress } from '../types';
import { progressStorage } from '../services/progressStorage';
import { calculateOverallStats, calculateCategoryStats, calculateTypeStats } from '../services/answerStorage';
import { CATEGORY_INFO, TYPE_INFO } from '../constants/categories';

interface HomePageProps {
  questions: Question[];
  onStartQuiz: (config: {
    mode: 'category' | 'type';
    categories?: TopicCategory[];
    types?: QuestionType[];
  }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ questions, onStartQuiz }) => {
  const [tabValue, setTabValue] = useState(0);
  const [, setProgress] = useState(progressStorage.loadProgress());
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Initialize progress with current questions
    const initializedProgress = progressStorage.initializeProgress(questions);
    progressStorage.updateAggregateProgress(questions);
    setProgress(initializedProgress);
    
    // Calculate dynamic stats from localStorage answers
    const overallStats = calculateOverallStats(questions);
    const categoryStats = calculateCategoryStats(questions);
    const typeStats = calculateTypeStats(questions);
    
    setStats({
      totalQuestions: overallStats.totalQuestions,
      answeredQuestions: overallStats.answeredQuestions,
      overallSuccessRate: overallStats.overallSuccessRate,
      categoryStats: categoryStats.map(cat => ({
        category: cat.category,
        progress: {
          category: cat.category,
          totalQuestions: cat.totalQuestions,
          answeredQuestions: cat.answeredQuestions,
          correctAnswers: cat.correctAnswers,
          successRate: cat.successRate
        } as CategoryProgress
      })),
      typeStats: typeStats.map(type => ({
        type: type.questionType,
        progress: {
          questionType: type.questionType,
          totalQuestions: type.totalQuestions,
          answeredQuestions: type.answeredQuestions,
          correctAnswers: type.correctAnswers,
          successRate: type.successRate
        } as TypeProgress
      }))
    });
  }, [questions]);

  const handleTabChange = (_: any, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategorySelect = (category: TopicCategory) => {
    onStartQuiz({
      mode: 'category',
      categories: [category]
    });
  };

  const handleTypeSelect = (type: QuestionType) => {
    onStartQuiz({
      mode: 'type',
      types: [type]
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Barcha progress ma\'lumotlarini o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.')) {
      progressStorage.clearProgress();
      // Also clear answers from localStorage for complete reset
      localStorage.removeItem('quiz_answers');
      const newProgress = progressStorage.initializeProgress(questions);
      setProgress(newProgress);
      
      // Recalculate stats after reset
      const overallStats = calculateOverallStats(questions);
      const categoryStats = calculateCategoryStats(questions);
      const typeStats = calculateTypeStats(questions);
      
      setStats({
        totalQuestions: overallStats.totalQuestions,
        answeredQuestions: overallStats.answeredQuestions,
        overallSuccessRate: overallStats.overallSuccessRate,
        categoryStats: categoryStats.map(cat => ({
          category: cat.category,
          progress: {
            category: cat.category,
            totalQuestions: cat.totalQuestions,
            answeredQuestions: cat.answeredQuestions,
            correctAnswers: cat.correctAnswers,
            successRate: cat.successRate
          } as CategoryProgress
        })),
        typeStats: typeStats.map(type => ({
          type: type.questionType,
          progress: {
            questionType: type.questionType,
            totalQuestions: type.totalQuestions,
            answeredQuestions: type.answeredQuestions,
            correctAnswers: type.correctAnswers,
            successRate: type.successRate
          } as TypeProgress
        }))
      });
    }
  };

  // Show loading if stats not ready
  if (!stats) {
    return <LinearProgress />;
  }

  const CategoryCard: React.FC<{ category: TopicCategory; progress: CategoryProgress }> = ({ category, progress }) => {
    const info = CATEGORY_INFO[category];
    const progressPercentage = progress.totalQuestions > 0 ? (progress.answeredQuestions / progress.totalQuestions) * 100 : 0;
    
    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: 2,
          borderColor: 'transparent',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
        onClick={() => handleCategorySelect(category)}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid size="auto">
              <Typography variant="h3">
                {info.icon}
              </Typography>
            </Grid>
            <Grid size="grow">
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {info.nameUz}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {info.description}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size="grow">
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {progress.answeredQuestions}/{progress.totalQuestions}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const TypeCard: React.FC<{ type: QuestionType; progress: TypeProgress }> = ({ type, progress }) => {
    const info = TYPE_INFO[type];
    const progressPercentage = progress.totalQuestions > 0 ? (progress.answeredQuestions / progress.totalQuestions) * 100 : 0;
    
    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: 2,
          borderColor: 'transparent',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
        onClick={() => handleTypeSelect(type)}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid size="auto">
              <Typography variant="h3">
                {info.icon}
              </Typography>
            </Grid>
            <Grid size="grow">
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {info.nameUz}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {info.description}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid size="grow">
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            <Grid size="auto">
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {progress.answeredQuestions}/{progress.totalQuestions}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid size="grow">
          <Grid container spacing={2} alignItems="center">
            <Grid size="auto">
              <Home fontSize="large" color="primary" />
            </Grid>
          </Grid>
        </Grid>
        <Grid size="auto">
          <Tooltip title="Barcha jarayonni qayta boshlash">
            <IconButton onClick={handleResetProgress} color="error">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Overall Stats */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">
              {stats.totalQuestions}
            </Typography>
            <Typography variant="body1">
              Jami Savollar
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">
              {stats.answeredQuestions}
            </Typography>
            <Typography variant="body1">
              Javob Berilgan
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">
              {Math.round(stats.overallSuccessRate)}%
            </Typography>
            <Typography variant="body1">
              Muvaffaqiyat Darajasi
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h3" fontWeight="bold">
              {Math.round(((stats.answeredQuestions / stats.totalQuestions) * 100) || 0)}%
            </Typography>
            <Typography variant="body1">
              Tugallanish
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<Assessment />}
            label="Kategoriyalar"
            iconPosition="start"
          />
          <Tab
            icon={<Quiz />}
            label="Savol Turlari"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Categories Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
              Kategoriyalar bo'yicha
            </Typography>
          </Grid>
          {stats.categoryStats.map(({ category, progress }: { category: TopicCategory; progress: CategoryProgress }) => (
            <Grid key={category} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CategoryCard category={category} progress={progress} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Question Types Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
              Savol turi bo'yicha
            </Typography>
          </Grid>
          {stats.typeStats.map(({ type, progress }: { type: QuestionType; progress: TypeProgress }) => (
            <Grid key={type} size={{ xs: 12, sm: 6, lg: 4 }}>
              <TypeCard type={type} progress={progress} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}; 