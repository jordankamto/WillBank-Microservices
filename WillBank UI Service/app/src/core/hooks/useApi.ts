import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les appels API avec états de chargement et d'erreur
 */

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error: any) {
        const errorMessage = error.message || 'Une erreur est survenue';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook pour les opérations CRUD simples
 */
export function useApiMutation<T, P = any>(
  apiFunction: (params: P) => Promise<T>
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (params: P): Promise<T | null> => {
      setState({ loading: true, error: null, success: false });

      try {
        const result = await apiFunction(params);
        setState({ loading: false, error: null, success: true });
        return result;
      } catch (error: any) {
        const errorMessage = error.message || 'Une erreur est survenue';
        setState({ loading: false, error: errorMessage, success: false });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
