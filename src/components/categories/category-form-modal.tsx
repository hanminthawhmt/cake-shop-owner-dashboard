'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/types/catalog';
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-catalog';
import { X, Loader2, Tag } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  categoryToEdit,
}: CategoryFormModalProps) {
  const isEditing = Boolean(categoryToEdit);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(categoryToEdit?.id || 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      reset({ name: categoryToEdit.name });
    } else {
      reset({ name: '' });
    }
  }, [categoryToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditing && categoryToEdit) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#F2E8DF] shadow-lg p-6 space-y-6 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#3D2314]">
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9C8A7E] hover:text-[#3D2314] hover:bg-[#FAF6F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Birthday Cakes, Pastries"
              {...register('name')}
              className={`block w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent ${
                errors.name ? 'border-red-400' : 'border-[#E6D7CC]'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F2E8DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] border border-[#F2E8DF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
