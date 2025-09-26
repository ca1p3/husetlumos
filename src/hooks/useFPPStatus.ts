import { useQuery } from '@tanstack/react-query';
import { fppApi, type FPPStatus } from '@/services/fppApi';

export const useFPPStatus = () => {
  return useQuery({
    queryKey: ['fpp-status'],
    queryFn: () => fppApi.getStatus(),
    refetchInterval: 30000, // Poll every 30 seconds to reduce errors
    retry: 1, // Only retry once
    retryDelay: 5000,
    staleTime: 25000, // Consider data stale after 25 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount after first load
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