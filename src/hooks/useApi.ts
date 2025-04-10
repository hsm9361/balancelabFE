import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

interface UseApiOptions<T> {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (options?: Partial<UseApiOptions<T>>) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(options.immediate !== false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (overrideOptions?: Partial<UseApiOptions<T>>): Promise<T> => {
    const config = { ...options, ...overrideOptions };
    const { url, method = 'GET', body, params, headers, onSuccess, onError } = config;
    
    if (!url) {
      const err = new Error('URL is required');
      setError(err);
      throw err;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient({
        url,
        method,
        data: body,
        params,
        headers,
      });
      
      const responseData = response.data as T;
      setData(responseData);
      onSuccess?.(responseData);
      return responseData;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(errorObj);
      onError?.(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // Execute the request immediately if immediate is true
  useEffect(() => {
    if (options.immediate !== false && options.url) {
      execute().catch((err) => {
        // Error already handled in execute function
        console.debug('Initial API call failed:', err.message);
      });
    }
    // Only run this effect when dependencies change that would affect the request
  }, [options.url, options.immediate]);

  return { data, loading, error, execute, reset };
}

export default useApi;