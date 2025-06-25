import React, { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Box } from '@mui/material';

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  // Extract code from markdown code blocks and determine language
  const { cleanCode, language } = useMemo(() => {
    let cleanCode = code;
    let language = 'csharp';

    // Remove markdown code fences if present
    const codeBlockMatch = code.match(/```(\w+)?\n?([\s\S]*?)```/);
    if (codeBlockMatch) {
      language = codeBlockMatch[1] || 'csharp';
      cleanCode = codeBlockMatch[2]?.trim() || cleanCode;
    }

    return { cleanCode, language };
  }, [code]);

  // Calculate height based on lines of code (minimum 3 lines, maximum 10 lines)
  const lineCount = cleanCode.split('\n').length;
  const height = Math.max(3, Math.min(lineCount, 10)) * 24 + 20; // 24px per line + padding

  return (
    <Box 
      sx={{ 
        height: `${height}px`,
        minHeight: '92px', // Minimum height for 3 lines
        maxHeight: '260px', // Maximum height for 10 lines
        '& .monaco-editor': {
          borderRadius: 0,
        },
        '& .monaco-editor .margin': {
          backgroundColor: 'transparent !important',
        },
        '& .monaco-editor .monaco-editor-background': {
          backgroundColor: 'rgb(18, 18, 18) !important',
        },
        '& .monaco-editor .view-lines': {
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
        }
      }}
    >
      <Editor
        height="100%"
        language={language}
        value={cleanCode}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'none',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'auto',
            verticalScrollbarSize: 0,
            horizontalScrollbarSize: 8,
          },
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderValidationDecorations: 'off',
          fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
          fontSize: 14,
          lineHeight: 24,
          padding: { top: 10, bottom: 10 },
          automaticLayout: true,
          contextmenu: false,
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: 'off',
          tabCompletion: 'off',
          wordBasedSuggestions: 'off',
        }}
      />
    </Box>
  );
}; 