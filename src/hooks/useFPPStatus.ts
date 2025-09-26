import { useQuery } from '@tanstack/react-query';
import { fppApi, type FPPStatus } from '@/services/fppApi';

export const useFPPStatus = () => {
  return useQuery({
    queryKey: ['fpp-status'],
    queryFn: () => fppApi.getStatus(),
    refetchInterval: 5000, // Poll every 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2000, // Consider data stale after 2 seconds
  });
};

export const useFPPCurrentSequence = () => {
  return useQuery({
    queryKey: ['fpp-current-sequence'],
    queryFn: () => fppApi.getCurrentSequence(),
    refetchInterval: 5000,
    retry: 2,
    staleTime: 2000,
  });
};