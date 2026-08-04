import { useState, useCallback } from 'react';

/**
 * Custom hook for API request handling with state management.
 *
 * @param {Function} apiFunc - Async API service function
 * @param {object} options
 * @param {boolean} [options.immediate=false] - Whether to execute immediately
 * @param {Function} [options.onSuccess] - Callback on success
 * @param {Function} [options.onError] - Callback on error
 */
export function useApi(apiFunc, { immediate = false, onSuccess, onError } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFunc(...args);
        const resultData = response?.data !== undefined ? response.data : response;
        setData(resultData);
        if (onSuccess) {
          onSuccess(resultData, response);
        }
        return resultData;
      } catch (err) {
        const errorMessage = err?.message || 'An unexpected error occurred';
        setError(errorMessage);
        if (onError) {
          onError(err);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { data, isLoading, error, execute, reset, setData };
}
