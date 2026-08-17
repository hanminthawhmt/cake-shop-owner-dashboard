'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Order, OrderFilterParams } from '@/types/orders';

export function useOrdersList(filters?: OrderFilterParams) {
  return useQuery<Order[]>({
    queryKey: ['orders-list', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.date) params.date = filters.date;

      const response = await apiClient.get<Order[]>('/orders', { params });
      return response.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useOrderDetail(id: number) {
  return useQuery<Order>({
    queryKey: ['order-detail', id],
    queryFn: async () => {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    },
    enabled: Boolean(id) && !isNaN(id),
    staleTime: 1000 * 60, // 1 minute
  });
}
