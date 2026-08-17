'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Room } from '@/types/rooms';
import { useCreateRoom, useUpdateRoom } from '@/hooks/use-rooms';
import { X, Loader2, Home, DollarSign, Users } from 'lucide-react';

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1 guest'),
  price: z.coerce.number().min(0, 'Price must be >= 0'),
  isAvailable: z.boolean().default(true),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
}

export function RoomFormModal({
  isOpen,
  onClose,
  roomToEdit,
}: RoomFormModalProps) {
  const isEditing = Boolean(roomToEdit);
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom(roomToEdit?.id || 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: 6,
      price: 150,
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (roomToEdit) {
      const priceNum = typeof roomToEdit.price === 'string'
        ? parseFloat(roomToEdit.price)
        : roomToEdit.price;

      reset({
        name: roomToEdit.name,
        description: roomToEdit.description || '',
        capacity: roomToEdit.capacity || 6,
        price: isNaN(priceNum) ? 0 : priceNum,
        isAvailable: roomToEdit.isAvailable ?? true,
      });
    } else {
      reset({
        name: '',
        description: '',
        capacity: 6,
        price: 150,
        isAvailable: true,
      });
    }
  }, [roomToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: RoomFormValues) => {
    if (isEditing && roomToEdit) {
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
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#F2E8DF] shadow-lg p-6 space-y-6 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <Home className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#3D2314]">
              {isEditing ? 'Edit Birthday Room' : 'Add New Birthday Room'}
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
          {/* Room Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Room Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Garden Blossom Suite"
              {...register('name')}
              className={`block w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent ${
                errors.name ? 'border-red-400' : 'border-[#E6D7CC]'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message as string}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Ambiance features, seating arrangements, decoration details..."
              {...register('description')}
              className="block w-full px-3.5 py-2 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent"
            />
          </div>

          {/* Grid: Capacity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capacity */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
                Max Capacity (Guests) *
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  min="1"
                  placeholder="10"
                  {...register('capacity', { valueAsNumber: true })}
                  className={`block w-full pl-8 pr-3 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent ${
                    errors.capacity ? 'border-red-400' : 'border-[#E6D7CC]'
                  }`}
                />
              </div>
              {errors.capacity && (
                <p className="text-xs text-red-500 font-medium">{errors.capacity.message as string}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
                Reservation Price ($) *
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="150.00"
                  {...register('price', { valueAsNumber: true })}
                  className={`block w-full pl-8 pr-3 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent ${
                    errors.price ? 'border-red-400' : 'border-[#E6D7CC]'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 font-medium">{errors.price.message as string}</p>
              )}
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="pt-2 flex items-center gap-3">
            <input
              id="roomIsAvailable"
              type="checkbox"
              {...register('isAvailable')}
              className="w-4 h-4 text-[#E07A5F] rounded border-[#E6D7CC] focus:ring-[#E07A5F] cursor-pointer"
            />
            <label htmlFor="roomIsAvailable" className="text-xs font-semibold text-[#3D2314] cursor-pointer">
              Available for Booking
            </label>
          </div>

          {/* Buttons */}
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
              <span>{isEditing ? 'Save Changes' : 'Create Room'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
