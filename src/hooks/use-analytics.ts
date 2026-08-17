'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  SalesPeriod,
  SalesDataPoint,
  BestSellerCake,
  ReservationStats,
} from '@/types/analytics';

export function useSalesAnalytics(period: SalesPeriod = 'daily') {
  return useQuery<SalesDataPoint[]>({
    queryKey: ['analytics-sales', period],
    queryFn: async () => {
      const response = await apiClient.get<SalesDataPoint[]>('/analytics/sales', {
        params: { period },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBestSellers(limit: number = 5) {
  return useQuery<BestSellerCake[]>({
    queryKey: ['analytics-best-sellers', limit],
    queryFn: async () => {
      const response = await apiClient.get<BestSellerCake[]>('/analytics/best-sellers', {
        params: { limit },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useReservationStats() {
  return useQuery<ReservationStats>({
    queryKey: ['analytics-reservation-stats'],
    queryFn: async () => {
      const response = await apiClient.get<ReservationStats>('/analytics/reservations');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Helper function to trigger authenticated CSV blob download with Bearer token
export async function downloadAuthenticatedCsv(url: string, defaultFilename: string) {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  // Extract filename from Content-Disposition if present
  let filename = defaultFilename;
  const contentDisposition = response.headers?.['content-disposition'];
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

export function downloadSalesCsv(period: SalesPeriod) {
  const todayStr = new Date().toISOString().split('T')[0];
  return downloadAuthenticatedCsv(
    `/analytics/export/sales?period=${period}`,
    `sales-export-${period}-${todayStr}.csv`
  );
}

export function downloadOrdersCsv() {
  const todayStr = new Date().toISOString().split('T')[0];
  return downloadAuthenticatedCsv(
    '/analytics/export/orders',
    `orders-export-${todayStr}.csv`
  );
}
