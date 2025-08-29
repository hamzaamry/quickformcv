import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api/auth';

export const useUser = (options = {}) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: options.enabled !== undefined ? options.enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a 401 error (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('User fetch error:', error);
      // Don't automatically clear tokens here - let the AuthProvider handle it
    },
    ...options
  });
};