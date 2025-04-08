import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState(null as T | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as Error | null);

  const execute = useCallback(async (url: string, method = 'GET', body?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient({
        url,
        method,
        data: body,
      });
      
      setData(response.data);
      options.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { data, loading, error, execute };
} 