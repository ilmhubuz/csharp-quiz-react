import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh,
} from '@mui/icons-material';
import { calculateCategoryStats } from '../services/answerStorage';
import type { CategoryFile } from '../types';

interface CategoryStats {
  category: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  successRate: number;
  completionRate: number;
}

interface HomePageProps {
  categories: Array<{ 
    categoryId: number;
    id: string; 
    title: string; 
    description?: string; 
    icon?: string;
  }>;
  categoryFiles: CategoryFile[];
  onSelectCategory: (categoryId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  categories, 
  categoryFiles, 
  onSelectCategory 
}) => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Calculate stats for each category
    const stats: CategoryStats[] = categories
      .sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0)) // Sort by categoryId
      .map(category => {
        const categoryFile = categoryFiles.find(cf => cf.metadata.id === category.id);
        if (!categoryFile) {
          return {
            category: category.id,
            totalQuestions: 0,
            answeredQuestions: 0,
            correctAnswers: 0,
            successRate: 0,
            completionRate: 0,
          };
        }

        const allQuestions = categoryFile.questions;
        const categoryStatsFromService = calculateCategoryStats(allQuestions);
        const thisCategoryStats = categoryStatsFromService.find(cs => cs.category === category.id);

        if (!thisCategoryStats) {
          return {
            category: category.id,
            totalQuestions: allQuestions.length,
            answeredQuestions: 0,
            correctAnswers: 0,
            successRate: 0,
            completionRate: 0,
          };
        }

        return {
          category: category.id,
          totalQuestions: thisCategoryStats.totalQuestions,
          answeredQuestions: thisCategoryStats.answeredQuestions,
          correctAnswers: thisCategoryStats.correctAnswers,
          successRate: thisCategoryStats.successRate,
          completionRate: (thisCategoryStats.answeredQuestions / thisCategoryStats.totalQuestions) * 100,
        };
      });

    setCategoryStats(stats);
  }, [categories, categoryFiles, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            C# dasturlash tilida bilimingizni mustahkamlang
          </Typography>
          <Typography variant="body1" color="text.secondary">
            C# dasturlash tilini o'rganish va bilimingizni sinash uchun turli xil savollar bilan mashq qiling. Har bir kategoriyada o'z darajangizni aniqlang va ko'nikmalaringizni rivojlantiring.
          </Typography>
        </Box>
        <Tooltip title="Refresh Progress">
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Categories Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {categories
          .sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0)) // Sort by categoryId
          .map((category) => {
            const stats = categoryStats.find(s => s.category === category.id) || {
              category: category.id,
              totalQuestions: 0,
              answeredQuestions: 0,
              correctAnswers: 0,
              successRate: 0,
              completionRate: 0,
            };

            return (
              <Card
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  '&:active': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Category Header */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      {category.icon || '📝'}
                    </Typography>
                    <Typography variant="h6" component="h2" fontWeight="600">
                      {category.title}
                    </Typography>
                  </Box>

                  {/* Description */}
                  {category.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 3, minHeight: 40 }}
                    >
                      {category.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {stats.answeredQuestions}/{stats.totalQuestions} questions
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                      color={getProgressColor(stats.completionRate)}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
      </Box>

      {/* Empty State */}
      {categories.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={8}
        >
          <Typography variant="h1" sx={{ fontSize: 64, mb: 2 }}>
            📝
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Categories will appear here when question files are loaded
          </Typography>
        </Box>
      )}
    </Container>
  );
}; 