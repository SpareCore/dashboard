import { useState, useCallback } from 'react';
import { apiService } from '../api/api';

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

export function useApi<T, P extends any[]>(
  apiMethod: ApiFunction<T, P>,
  defaultData?: T
) {
  const [data, setData] = useState<T | undefined>(defaultData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args: P) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiMethod(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiMethod]
  );

  return {
    data,
    error,
    loading,
    execute,
  };
}

// Pre-configured hooks for common API calls
export function useNodes() {
  return useApi(apiService.getNodes.bind(apiService), []);
}

export function useNode(id: string) {
  return useApi((id: string) => apiService.getNode(id), undefined);
}

export function useJobs(status?: Parameters<typeof apiService.getJobs>[0]) {
  return useApi((status) => apiService.getJobs(status), []);
}

export function useJob(id: string) {
  return useApi((id: string) => apiService.getJob(id), undefined);
}

export function useSystemMetrics() {
  return useApi(apiService.getSystemMetrics.bind(apiService));
}

export function useHistoricalMetrics() {
  return useApi(apiService.getHistoricalMetrics.bind(apiService));
}