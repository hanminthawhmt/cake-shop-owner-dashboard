'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Order, OrderFilterParams, OrderStatus, PaymentStatus } from '@/types/orders';

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

export function useUpdateOrderStatus(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: OrderStatus) => {
      const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['orders-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });
}

export function useUpdatePaymentStatus(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentStatus: PaymentStatus) => {
      const response = await apiClient.patch<Order>(`/orders/${id}/payment`, { paymentStatus });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['orders-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });
}

export async function fetchBakingSlipHtml(id: number): Promise<string> {
  const response = await apiClient.get<string>(`/orders/${id}/baking-slip`, {
    responseType: 'text',
  });
  return response.data;
}
