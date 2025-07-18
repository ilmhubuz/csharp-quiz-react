import { useState, useCallback } from 'react';
import { ApiError } from '../api';

export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
}

export function useApi<T>() {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await apiCall();
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const apiError =
                error instanceof ApiError
                    ? error
                    : new ApiError(
                          error instanceof Error
                              ? error.message
                              : 'Unknown error',
                          0
                      );
            setState({ data: null, loading: false, error: apiError });
            throw apiError;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}
