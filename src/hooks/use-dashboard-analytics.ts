'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DashboardAnalytics } from '@/types/analytics';

export function useDashboardAnalytics() {
  return useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardAnalytics>('/analytics/dashboard');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // auto refresh every 5 minutes
  });
}
