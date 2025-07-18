import React from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { Box, Paper, Typography } from '@mui/material';

interface DiffEditorProps {
    originalCode: string;
    modifiedCode: string;
    language?: string;
    minLines?: number;
    maxLines?: number;
    title?: string;
}

export const DiffEditor: React.FC<DiffEditorProps> = ({
    originalCode,
    modifiedCode,
    language: propLanguage = 'csharp',
    minLines = 3,
    maxLines = 15,
    title,
}) => {
    // Calculate height based on lines of code
    const lineCount = Math.max(
        originalCode.split('\n').length,
        modifiedCode.split('\n').length,
    );
    const height = Math.max(minLines, Math.min(lineCount, maxLines)) * 24 + 20; // 24px per line + padding

    return (
        <Paper
            elevation={2}
            sx={{
                p: 0,
                backgroundColor: 'grey.900',
                border: 1,
                borderColor: 'divider',
            }}
        >
            {title && (
                <Box
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="bold"
                    >
                        {title}
                    </Typography>
                </Box>
            )}
            <Box
                sx={{
                    height: `${height}px`,
                    minHeight: `${minLines * 24 + 20}px`,
                    maxHeight: `${maxLines * 24 + 20}px`,
                    backgroundColor: 'rgb(18, 18, 18) !important',
                    paddingX: '16px !important',
                    '& .monaco-editor': {
                        borderRadius: 0,
                    },
                    '& .monaco-editor .margin': {
                        backgroundColor: 'transparent !important',
                    },
                    '& .monaco-editor .monaco-editor-background': {
                        backgroundColor: 'rgb(18, 18, 18) !important',
                    },
                }}
            >
                <MonacoDiffEditor
                    height="100%"
                    language={propLanguage}
                    original={originalCode}
                    modified={modifiedCode}
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
                            vertical: 'auto',
                            horizontal: 'auto',
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                        },
                        overviewRulerLanes: 0,
                        overviewRulerBorder: false,
                        hideCursorInOverviewRuler: true,
                        renderValidationDecorations: 'off',
                        fontFamily:
                            '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
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
                        // Diff specific options
                        renderSideBySide: false,
                        ignoreTrimWhitespace: false,
                        renderOverviewRuler: false,
                    }}
                />
            </Box>
        </Paper>
    );
};
