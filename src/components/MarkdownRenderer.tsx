import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, styled, useTheme } from '@mui/material';

interface MarkdownRendererProps {
  content: string;
}

const StyledMarkdownContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '1rem',
  lineHeight: 1.6,
  '& p': {
    margin: '0 0 1rem 0',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: '1.5rem 0 1rem 0',
    fontWeight: 600,
    color: theme.palette.primary.main,
    '&:first-child': {
      marginTop: 0,
    },
  },
  '& h1': { fontSize: '2rem' },
  '& h2': { fontSize: '1.75rem' },
  '& h3': { fontSize: '1.5rem' },
  '& h4': { fontSize: '1.25rem' },
  '& h5': { fontSize: '1.125rem' },
  '& h6': { fontSize: '1rem' },
  '& strong, & b': {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '& em, & i': {
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  '& code': {
    fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    fontSize: '0.875rem',
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.light,
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    display: 'inline',
    whiteSpace: 'pre',
    verticalAlign: 'baseline',
  },
  '& pre': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    padding: '1rem',
    borderRadius: '8px',
    overflow: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    '& code': {
      backgroundColor: 'transparent',
      color: 'inherit',
      padding: 0,
      border: 'none',
      fontSize: '0.875rem',
    },
  },
  '& blockquote': {
    margin: '1rem 0',
    padding: '0.5rem 1rem',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    '& p': {
      margin: 0,
    },
  },
  '& ul, & ol': {
    margin: '1rem 0',
    paddingLeft: '2rem',
    '& li': {
      margin: '0.5rem 0',
      color: theme.palette.text.primary,
      '& p': {
        margin: 0,
      },
    },
  },
  '& ul': {
    listStyleType: 'disc',
    '& ul': {
      listStyleType: 'circle',
      '& ul': {
        listStyleType: 'square',
      },
    },
  },
  '& ol': {
    listStyleType: 'decimal',
  },
  '& a': {
    color: theme.palette.primary.light,
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
  '& hr': {
    border: 'none',
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: '2rem 0',
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1rem 0',
    border: `1px solid ${theme.palette.divider}`,
    '& th, & td': {
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& th': {
      backgroundColor: theme.palette.action.hover,
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    '& td': {
      color: theme.palette.text.primary,
    },
  },
}));

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const theme = useTheme();
  
  return (
    <StyledMarkdownContainer>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Prevent rendering of code blocks as we handle them separately
          pre: ({ children }) => <div>{children}</div>,
          code: ({ children }) => {
            // Force all code to be inline
            return (
              <span 
                style={{ 
                  fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  fontSize: '0.875rem',
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.light,
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'inline',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'baseline',
                }}
              >
                {children}
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </StyledMarkdownContainer>
  );
}; 