'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Room, CreateRoomDto } from '@/types/rooms';

export function useRoomsList() {
  return useQuery<Room[]>({
    queryKey: ['rooms-list'],
    queryFn: async () => {
      const response = await apiClient.get<Room[]>('/rooms');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useRoomDetail(id: number) {
  return useQuery<Room>({
    queryKey: ['room-detail', id],
    queryFn: async () => {
      const response = await apiClient.get<Room>(`/rooms/${id}`);
      return response.data;
    },
    enabled: Boolean(id) && !isNaN(id),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomDto) => {
      const response = await apiClient.post<Room>('/rooms', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms-list'] });
    },
  });
}

export function useUpdateRoom(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateRoomDto>) => {
      const response = await apiClient.patch<Room>(`/rooms/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms-list'] });
      queryClient.invalidateQueries({ queryKey: ['room-detail', id] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/rooms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms-list'] });
    },
  });
}

// --- ROOM IMAGES HOOKS ---

export function useUploadRoomImage(roomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post(`/rooms/${roomId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-detail', roomId] });
      queryClient.invalidateQueries({ queryKey: ['rooms-list'] });
    },
  });
}

export function useDeleteRoomImage(roomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number) => {
      await apiClient.delete(`/rooms/${roomId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-detail', roomId] });
      queryClient.invalidateQueries({ queryKey: ['rooms-list'] });
    },
  });
}
