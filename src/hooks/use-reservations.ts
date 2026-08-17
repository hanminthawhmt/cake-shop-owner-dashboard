'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Reservation,
  RoomSlotAvailability,
  ReservationStatus,
} from '@/types/reservations';

export function useRoomAvailability(roomId: number, date: string) {
  return useQuery<RoomSlotAvailability[]>({
    queryKey: ['room-availability', roomId, date],
    queryFn: async () => {
      const response = await apiClient.get<RoomSlotAvailability[]>(
        `/rooms/${roomId}/availability`,
        { params: { date } }
      );
      return response.data;
    },
    enabled: Boolean(roomId) && Boolean(date),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useReservationsList() {
  return useQuery<Reservation[]>({
    queryKey: ['reservations-list'],
    queryFn: async () => {
      const response = await apiClient.get<Reservation[]>('/reservations');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useReservationDetail(id: number) {
  return useQuery<Reservation>({
    queryKey: ['reservation-detail', id],
    queryFn: async () => {
      const response = await apiClient.get<Reservation>(`/reservations/${id}`);
      return response.data;
    },
    enabled: Boolean(id) && !isNaN(id),
  });
}

export function useUpdateReservationStatus(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: ReservationStatus) => {
      const response = await apiClient.patch<Reservation>(
        `/reservations/${id}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservations-list'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-detail', id] });
      if (data?.roomId && data?.date) {
        queryClient.invalidateQueries({
          queryKey: ['room-availability', data.roomId, data.date],
        });
      }
    },
  });
}

export function useCancelReservation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch<Reservation>(
        `/reservations/${id}/cancel`
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservations-list'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-detail', id] });
      if (data?.roomId && data?.date) {
        queryClient.invalidateQueries({
          queryKey: ['room-availability', data.roomId, data.date],
        });
      }
    },
  });
}
