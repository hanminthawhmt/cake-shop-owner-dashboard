'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Category,
  CreateCategoryDto,
  Cake,
  CreateCakeDto,
  CreateCakeOptionDto,
  CreateCakeOptionValueDto,
} from '@/types/catalog';

// --- CATEGORIES HOOKS ---

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryDto) => {
      const response = await apiClient.post<Category>('/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryDto) => {
      const response = await apiClient.patch<Category>(`/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
    },
  });
}

// --- CAKES HOOKS ---

export function useCakesList() {
  return useQuery<Cake[]>({
    queryKey: ['cakes-list'],
    queryFn: async () => {
      const response = await apiClient.get<Cake[]>('/cakes');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCakeDetail(id: number) {
  return useQuery<Cake>({
    queryKey: ['cake-detail', id],
    queryFn: async () => {
      const response = await apiClient.get<Cake>(`/cakes/${id}`);
      return response.data;
    },
    enabled: Boolean(id) && !isNaN(id),
    staleTime: 1000 * 30,
  });
}

export function useCreateCake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCakeDto) => {
      const response = await apiClient.post<Cake>('/cakes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });
}

export function useUpdateCake(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateCakeDto>) => {
      const response = await apiClient.patch<Cake>(`/cakes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
      queryClient.invalidateQueries({ queryKey: ['cake-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });
}

export function useDeleteCake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/cakes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    },
  });
}

// --- CAKE IMAGES HOOKS ---

export function useUploadCakeImage(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post(`/cakes/${cakeId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
    },
  });
}

export function useDeleteCakeImage(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number) => {
      await apiClient.delete(`/cakes/${cakeId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
      queryClient.invalidateQueries({ queryKey: ['cakes-list'] });
    },
  });
}

// --- CAKE OPTIONS & VALUES HOOKS ---

export function useCreateCakeOption(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCakeOptionDto) => {
      const response = await apiClient.post(`/cakes/${cakeId}/options`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}

export function useUpdateCakeOption(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ optionId, data }: { optionId: number; data: CreateCakeOptionDto }) => {
      const response = await apiClient.patch(`/cakes/${cakeId}/options/${optionId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}

export function useDeleteCakeOption(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionId: number) => {
      await apiClient.delete(`/cakes/${cakeId}/options/${optionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}

export function useCreateCakeOptionValue(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ optionId, data }: { optionId: number; data: CreateCakeOptionValueDto }) => {
      const response = await apiClient.post(`/cakes/${cakeId}/options/${optionId}/values`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}

export function useUpdateCakeOptionValue(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      optionId,
      valueId,
      data,
    }: {
      optionId: number;
      valueId: number;
      data: Partial<CreateCakeOptionValueDto>;
    }) => {
      const response = await apiClient.patch(`/cakes/${cakeId}/options/${optionId}/values/${valueId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}

export function useDeleteCakeOptionValue(cakeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ optionId, valueId }: { optionId: number; valueId: number }) => {
      await apiClient.delete(`/cakes/${cakeId}/options/${optionId}/values/${valueId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cake-detail', cakeId] });
    },
  });
}
