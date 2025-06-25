import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import type { Question, MCQQuestion, TrueFalseQuestion, FillQuestion, ErrorSpotQuestion, OutputPredictionQuestion, CodeWritingQuestion } from '../types';
import { CodeEditor } from './CodeEditor';
import { MCQOptions } from './MCQOptions';
import { TrueFalseOptions } from './TrueFalseOptions';
import { MarkdownRenderer } from './MarkdownRenderer';

interface QuestionCardProps {
  question: Question;
  answer: string[] | string | undefined;
  onAnswerChange: (questionId: number, answer: string[] | string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions
}) => {
  const isMCQ = question.type === 'mcq';
  const isFill = question.type === 'fill';
  const isErrorSpot = question.type === 'error_spotting';
  const isOutputPrediction = question.type === 'output_prediction';
  const isCodeWriting = question.type === 'code_writing';
  
  const mcqQuestion = question as MCQQuestion;
  const trueFalseQuestion = question as TrueFalseQuestion;
  const fillQuestion = question as FillQuestion;
  const errorSpotQuestion = question as ErrorSpotQuestion;
  const outputPredictionQuestion = question as OutputPredictionQuestion;
  const codeWritingQuestion = question as CodeWritingQuestion;

  const handleFillAnswerChange = (code: string) => {
    onAnswerChange(question.id, code);
  };

  const handleErrorSpotAnswerChange = (code: string) => {
    onAnswerChange(question.id, code);
  };

  const handleOutputPredictionAnswerChange = (output: string) => {
    onAnswerChange(question.id, output);
  };

  const handleCodeWritingAnswerChange = (code: string) => {
    onAnswerChange(question.id, code);
  };

  return (
    <Card 
      elevation={4}
      sx={{ 
        width: '100%',
        maxWidth: 1400,
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Question {questionNumber}
          </Typography>
          <Chip 
            label={`${questionNumber}/${totalQuestions}`}
            color="primary"
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Fill Question Layout */}
        {isFill && (
          <>
            {/* First Row: Editable Code and Question Prompt */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Left Column - Editable Code */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Code (Editable)
                    </Typography>
                  </Box>
                  <CodeEditor 
                    code={answer as string || fillQuestion.codeWithBlank}
                    editable={true}
                    onChange={handleFillAnswerChange}
                  />
                </Paper>
              </Grid>

              {/* Right Column - Question Prompt */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" mb={2} fontWeight="bold">
                    Question
                  </Typography>
                  <MarkdownRenderer content={fillQuestion.prompt} />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Error Spotting Question Layout */}
        {isErrorSpot && (
          <>
            {/* First Row: Editable Code and Question Prompt */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Left Column - Editable Code */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Code (Find & Fix Errors)
                    </Typography>
                  </Box>
                  <CodeEditor 
                    code={answer as string || errorSpotQuestion.codeWithError}
                    editable={true}
                    onChange={handleErrorSpotAnswerChange}
                  />
                </Paper>
              </Grid>

              {/* Right Column - Question Prompt */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" mb={2} fontWeight="bold">
                    Question
                  </Typography>
                  <MarkdownRenderer content={errorSpotQuestion.prompt} />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Output Prediction Question Layout */}
        {isOutputPrediction && (
          <>
            {/* First Row: Code Snippet and Question Prompt */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Left Column - Read-only Code Snippet */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Code Snippet
                    </Typography>
                  </Box>
                  <CodeEditor 
                    code={outputPredictionQuestion.snippet}
                    editable={false}
                  />
                </Paper>
              </Grid>

              {/* Right Column - Question Prompt */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" mb={2} fontWeight="bold">
                    Question
                  </Typography>
                  <MarkdownRenderer content={outputPredictionQuestion.prompt} />
                </Paper>
              </Grid>
            </Grid>

            {/* Second Row: Console Output Input */}
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Console Output (Your Answer)
                    </Typography>
                  </Box>
                  <CodeEditor 
                    code={answer as string || ''}
                    editable={true}
                    onChange={handleOutputPredictionAnswerChange}
                    language="plaintext"
                  />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Code Writing Question Layout */}
        {isCodeWriting && (
          <>
            {/* First Row: Question Prompt */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'background.default',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" mb={2} fontWeight="bold">
                    Question
                  </Typography>
                  <MarkdownRenderer content={codeWritingQuestion.prompt} />
                </Paper>
              </Grid>
            </Grid>

            {/* Examples Row */}
            {codeWritingQuestion.examples && codeWritingQuestion.examples.length > 0 && (
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" color="text.primary" mb={2} fontWeight="bold">
                    Examples
                  </Typography>
                  {codeWritingQuestion.examples.map((example, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 0, 
                          backgroundColor: 'grey.900',
                          border: 1,
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                            Example {index + 1}
                          </Typography>
                        </Box>
                        <CodeEditor 
                          code={example}
                          editable={false}
                          language="bash"
                        />
                      </Paper>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Code Input Row */}
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Your C# Code
                    </Typography>
                  </Box>
                  <CodeEditor 
                    code={answer as string || ''}
                    editable={true}
                    onChange={handleCodeWritingAnswerChange}
                    language="csharp"
                    minLines={10}
                    maxLines={50}
                  />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* MCQ/True-False Question Layout */}
        {!isFill && !isErrorSpot && !isOutputPrediction && !isCodeWriting && (
          <>
            {/* First Row: Code and Question Prompt */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Left Column - Code */}
              {question.codeBefore && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 0, 
                      backgroundColor: 'grey.900',
                      border: 1,
                      borderColor: 'divider',
                      height: 'fit-content'
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        Code
                      </Typography>
                    </Box>
                    <CodeEditor code={question.codeBefore} />
                  </Paper>
                </Grid>
              )}

              {/* Right Column - Question Prompt */}
              <Grid size={{ xs: 12, md: question.codeBefore ? 6 : 12 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                    height: 'fit-content'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" mb={2} fontWeight="bold">
                    Question
                  </Typography>
                  <MarkdownRenderer content={question.prompt} />
                </Paper>
              </Grid>
            </Grid>

            {/* Second Row: Options */}
            <Box>
              {isMCQ ? (
                <MCQOptions
                  question={mcqQuestion}
                  selectedAnswers={answer as string[] || []}
                  onAnswerChange={(selectedOptions: string[]) => 
                    onAnswerChange(question.id, selectedOptions)
                  }
                />
              ) : (
                <TrueFalseOptions
                  question={trueFalseQuestion}
                  selectedAnswer={answer as string}
                  onAnswerChange={(selectedOption: string) => 
                    onAnswerChange(question.id, selectedOption)
                  }
                />
              )}
            </Box>

            {/* Code After (if exists) */}
            {question.codeAfter && (
              <Box mt={4}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    backgroundColor: 'grey.900',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      Additional Code
                    </Typography>
                  </Box>
                  <CodeEditor code={question.codeAfter} />
                </Paper>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}; 