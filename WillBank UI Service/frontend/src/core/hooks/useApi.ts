import { useState, useCallback } from 'react';
import { AsyncState } from '../../types/common.types';
import { getErrorMessage, logError } from '../utils/errorHandler';

/**
 * Hook générique pour les appels API
 * Gère automatiquement les états de chargement et d'erreur
 */

export function useApi<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState({ data: null, loading: false, error: errorMessage });
        logError(error, apiFunction.name);
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}