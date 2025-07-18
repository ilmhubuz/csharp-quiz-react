import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { createAuthenticatedAnswerService } from '../api/services/answerService';
import { useApi } from './useApi';
import type { PreviousAnswerResponse } from '../types/api';

interface UseAnswerSubmissionProps {
    questionId: number;
    onAnswerLoaded?: (answer: string | string[]) => void;
}

export const useAnswerSubmission = ({
    questionId,
    onAnswerLoaded,
}: UseAnswerSubmissionProps) => {
    const { keycloak } = useKeycloak();
    const authenticatedApiClient = useApi();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previousAnswer, setPreviousAnswer] =
        useState<PreviousAnswerResponse | null>(null);
    const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState<
        string | string[] | null
    >(null);
    const [isLatestAnswerFetched, setIsLatestAnswerFetched] = useState(false);
    const startTimeRef = useRef<number>(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);

    // Create authenticated answer service (memoized to prevent infinite loops)
    const answerService = useMemo(
        () => createAuthenticatedAnswerService(authenticatedApiClient),
        [authenticatedApiClient]
    );

    // Reset timer and flags when question changes
    useEffect(() => {
        startTimeRef.current = Date.now();
        setTimeSpent(0);
        setLastSubmittedAnswer(null);
        setPreviousAnswer(null);
        setIsLatestAnswerFetched(false);
    }, [questionId]);

    // Update time spent every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(
                Math.floor((Date.now() - startTimeRef.current) / 1000)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fetch previous answer when question loads (only once per question)
    useEffect(() => {
        const fetchPreviousAnswer = async () => {
            if (
                !keycloak.authenticated ||
                !questionId ||
                questionId === 0 ||
                isLatestAnswerFetched
            )
                return;

            setIsLatestAnswerFetched(true);

            try {
                const latestAnswer =
                    await answerService.getLatestAnswer(questionId);
                setPreviousAnswer(latestAnswer);

                if (latestAnswer && onAnswerLoaded) {
                    // Check if the answer is a JSON string (from MCQ) and parse it back to array
                    let parsedAnswer = latestAnswer.answer;
                    if (
                        typeof parsedAnswer === 'string' &&
                        parsedAnswer.startsWith('[') &&
                        parsedAnswer.endsWith(']')
                    ) {
                        try {
                            parsedAnswer = JSON.parse(parsedAnswer);
                        } catch (e) {
                            // If parsing fails, keep the original string
                            console.warn(
                                'Failed to parse previous answer as JSON:',
                                e
                            );
                        }
                    }
                    onAnswerLoaded(parsedAnswer);
                }
            } catch (error: any) {
                // If 404 is returned, it means user hasn't answered this question before
                if (error.status === 404) {
                    console.log(
                        `No previous answer found for question ${questionId}`
                    );
                    setPreviousAnswer(null);
                } else {
                    console.error('Failed to fetch previous answer:', error);
                }
            }
        };

        fetchPreviousAnswer();
    }, [
        questionId,
        keycloak.authenticated,
        onAnswerLoaded,
        answerService,
        isLatestAnswerFetched,
    ]);

    // Helper function to check if answer has changed from previous
    const hasAnswerChanged = useCallback(
        (currentAnswer: string | string[]): boolean => {
            if (!previousAnswer) return true; // No previous answer, so it's a new answer

            let prevAnswer = previousAnswer.answer;

            // Parse JSON string back to array if needed for comparison
            if (
                typeof prevAnswer === 'string' &&
                prevAnswer.startsWith('[') &&
                prevAnswer.endsWith(']')
            ) {
                try {
                    prevAnswer = JSON.parse(prevAnswer);
                } catch (e) {
                    // If parsing fails, keep as string
                }
            }

            // Compare answers based on their format
            if (Array.isArray(currentAnswer) && Array.isArray(prevAnswer)) {
                // For array answers (MCQ), sort both arrays and compare
                return (
                    JSON.stringify(currentAnswer.sort()) !==
                    JSON.stringify(prevAnswer.sort())
                );
            } else if (
                typeof currentAnswer === 'string' &&
                typeof prevAnswer === 'string'
            ) {
                // For string answers, compare after trimming
                return currentAnswer.trim() !== prevAnswer.trim();
            } else {
                // Different types, consider as changed
                return true;
            }
        },
        [previousAnswer]
    );

    const submitAnswer = useCallback(
        async (answer: string | string[]): Promise<boolean> => {
            if (!keycloak.authenticated || !questionId || questionId === 0) {
                return false;
            }

            // Don't submit if answer hasn't changed from the last submitted answer
            if (
                lastSubmittedAnswer !== null &&
                JSON.stringify(lastSubmittedAnswer) === JSON.stringify(answer)
            ) {
                console.log('Answer unchanged, skipping submission');
                return true;
            }

            setIsSubmitting(true);
            try {
                // Convert MCQ array answers to JSON string for submission
                const submissionAnswer = Array.isArray(answer)
                    ? JSON.stringify(answer)
                    : answer;

                const result = await answerService.submitAnswer(
                    questionId,
                    submissionAnswer,
                    timeSpent
                );

                setLastSubmittedAnswer(answer);
                setPreviousAnswer({
                    id: result.id,
                    questionId: result.questionId,
                    answer: result.answer,
                    isCorrect: result.isCorrect,
                    timeSpentSeconds: result.timeSpentSeconds,
                    submittedAt: result.submittedAt,
                    attemptNumber: result.attemptNumber,
                    explanation: result.explanation,
                });

                return result.isCorrect;
            } catch (error) {
                console.error('Failed to submit answer:', error);
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            questionId,
            keycloak.authenticated,
            timeSpent,
            lastSubmittedAnswer,
            answerService,
        ]
    );

    return {
        submitAnswer,
        isSubmitting,
        previousAnswer,
        timeSpent,
        hasPreviousAnswer: previousAnswer !== null,
        hasAnswerChanged,
    };
};
