import React, { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Box } from '@mui/material';

interface CodeEditorProps {
    code: string;
    editable?: boolean;
    onChange?: (value: string) => void;
    language?: string;
    minLines?: number;
    maxLines?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    editable = false,
    onChange,
    language: propLanguage,
    minLines = 3,
    maxLines = 10,
}) => {
    // Extract code from markdown code blocks and determine language
    const { cleanCode, language } = useMemo(() => {
        let cleanCode = code;
        let language = propLanguage || 'csharp';

        // Only process markdown code blocks if no explicit language is provided
        if (!propLanguage) {
            const codeBlockMatch = code.match(/```(\w+)?\n?([\s\S]*?)```/);
            if (codeBlockMatch) {
                language = codeBlockMatch[1] || 'csharp';
                cleanCode = codeBlockMatch[2]?.trim() || cleanCode;
            }
        }

        return { cleanCode, language };
    }, [code, propLanguage]);

    // Calculate height based on lines of code
    const lineCount = cleanCode.split('\n').length;
    const height = Math.max(minLines, Math.min(lineCount, maxLines)) * 24 + 20; // 24px per line + padding

    const handleEditorChange = (value: string | undefined) => {
        if (editable && onChange && value !== undefined) {
            onChange(value);
        }
    };

    return (
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
            <Editor
                height="100%"
                language={language}
                value={cleanCode}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    readOnly: !editable,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'off',
                    lineNumbers: 'off',
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: editable ? 'line' : 'none',
                    scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'auto',
                        verticalScrollbarSize: 0,
                        horizontalScrollbarSize: 2,
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
                    contextmenu: editable,
                    quickSuggestions: editable,
                    parameterHints: { enabled: editable },
                    suggestOnTriggerCharacters: editable,
                    acceptSuggestionOnEnter: editable ? 'on' : 'off',
                    tabCompletion: editable ? 'on' : 'off',
                    wordBasedSuggestions: editable ? 'currentDocument' : 'off',
                }}
            />
        </Box>
    );
};
