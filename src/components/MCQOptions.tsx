import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  Grid
} from '@mui/material';
import type { MCQQuestion } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MCQOptionsProps {
  question: MCQQuestion;
  selectedAnswers: string[];
  onAnswerChange: (selectedOptions: string[]) => void;
}

export const MCQOptions: React.FC<MCQOptionsProps> = ({
  question,
  selectedAnswers,
  onAnswerChange
}) => {
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onAnswerChange([...selectedAnswers, optionId]);
    } else {
      onAnswerChange(selectedAnswers.filter(id => id !== optionId));
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3,
        backgroundColor: 'background.default',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
          Select your answer(s)
        </Typography>
        {selectedAnswers.length > 0 && (
          <Chip
            size="small"
            label={`${selectedAnswers.length} selected`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <FormControl component="fieldset" fullWidth>
        <Grid container spacing={2}>
          {question.options.map((option) => (
            <Grid size={{ xs: 12, sm: 6 }} key={option.id}>
              <Paper
                elevation={selectedAnswers.includes(option.id) ? 3 : 1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: selectedAnswers.includes(option.id) 
                    ? 'primary.dark' 
                    : 'background.paper',
                  border: 2,
                  borderColor: selectedAnswers.includes(option.id) 
                    ? 'primary.main' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: selectedAnswers.includes(option.id) 
                      ? 'primary.dark' 
                      : 'action.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleOptionChange(option.id, !selectedAnswers.includes(option.id))}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAnswers.includes(option.id)}
                      onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                      color="primary"
                      sx={{ 
                        mr: 1,
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ width: '100%' }}>
                      <Typography 
                        variant="body1" 
                        component="span"
                        fontWeight="bold"
                        color={selectedAnswers.includes(option.id) ? 'primary.contrastText' : 'text.primary'}
                        sx={{ mr: 1 }}
                      >
                        {option.id}.
                      </Typography>
                      <Box 
                        component="span"
                        sx={{
                          '& *': {
                            color: selectedAnswers.includes(option.id) 
                              ? 'primary.contrastText !important' 
                              : 'inherit !important',
                          }
                        }}
                      >
                        <MarkdownRenderer content={option.option} />
                      </Box>
                    </Box>
                  }
                  sx={{ 
                    margin: 0,
                    width: '100%',
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      width: '100%',
                      paddingTop: '2px',
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </FormControl>
    </Paper>
  );
}; 