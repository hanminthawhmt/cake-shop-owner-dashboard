'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useRoomDetail, useUpdateRoom, useDeleteRoom } from '@/hooks/use-rooms';
import { RoomImagesManager } from '@/components/rooms/room-images-manager';
import { RoomAvailabilityChecker } from '@/components/rooms/room-availability-checker';
import { DeleteConfirmModal, getApiErrorMessage } from '@/components/common/delete-confirm-modal';
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Check,
  Users,
  DollarSign,
} from 'lucide-react';

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const resolvedParams = use(params);
  const roomId = parseInt(resolvedParams.id, 10);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RoomDetailView roomId={roomId} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function RoomDetailView({ roomId }: { roomId: number }) {
  const router = useRouter();
  const { data: room, isLoading, isError } = useRoomDetail(roomId);

  const updateRoomMutation = useUpdateRoom(roomId);
  const deleteRoomMutation = useDeleteRoom();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Basic room form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState<number>(6);
  const [price, setPrice] = useState<string>('150');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (room) {
      setName(room.name);
      setDescription(room.description || '');
      setCapacity(room.capacity || 6);
      setPrice(
        typeof room.price === 'number'
          ? room.price.toString()
          : room.price
      );
      setIsAvailable(room.isAvailable ?? true);
    }
  }, [room]);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const handleSaveBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateRoomMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        capacity,
        price: parseFloat(price) || 0,
        isAvailable,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteRoomMutation.mutate(roomId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.push('/rooms');
      },
    });
  };

  if (isLoading) {
    return <RoomDetailSkeleton />;
  }

  if (isError || !room) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#3D2314]">Birthday Room Not Found</h3>
        <p className="text-xs text-[#7C685C]">
          The requested room ID does not exist or was deleted.
        </p>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Room List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/rooms"
            className="p-2.5 rounded-xl bg-white text-[#7C685C] border border-[#F2E8DF] hover:bg-[#FAF6F0] hover:text-[#3D2314] transition-colors shadow-2xs"
            title="Back to Birthday Rooms List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
                {room.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  room.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {room.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Unavailable</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-[#7C685C] font-medium mt-1">
              Room ID #{room.id} • Up to {room.capacity} Guests • {formatCurrency(room.price)} / reservation
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            deleteRoomMutation.reset();
            setIsDeleteModalOpen(true);
          }}
          disabled={deleteRoomMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          {deleteRoomMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span>Delete Room</span>
        </button>
      </div>

      {/* Section 1: Basic Information Form */}
      <form
        onSubmit={handleSaveBasicInfo}
        className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#F2E8DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
                Basic Room Details
              </h3>
              <p className="text-xs text-[#9C8A7E]">Party suite name, capacity, and pricing</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateRoomMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {updateRoomMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : null}
            <span>{isSaved ? 'Saved Successfully!' : 'Save Room Details'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Room Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Max Capacity (Guests) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
                className="w-full pl-8 pr-3 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Reservation Price ($) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <input
              id="roomDetailIsAvailable"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-[#E07A5F] rounded border-[#E6D7CC] focus:ring-[#E07A5F] cursor-pointer"
            />
            <label
              htmlFor="roomDetailIsAvailable"
              className="text-xs font-semibold text-[#3D2314] cursor-pointer"
            >
              Available for Online Reservations
            </label>
          </div>
        </div>
      </form>

      {/* Section 2: Time Slot Availability Checker */}
      <RoomAvailabilityChecker roomId={roomId} />

      {/* Section 3: Room Photo Management */}
      <RoomImagesManager roomId={roomId} images={room.images || []} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          deleteRoomMutation.reset();
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Birthday Room"
        description="Are you sure you want to delete this birthday room? Any existing reservation records will remain unaffected."
        itemName={room.name}
        isPending={deleteRoomMutation.isPending}
        errorMessage={deleteRoomMutation.isError ? getApiErrorMessage(deleteRoomMutation.error) : null}
      />
    </div>
  );
}

function RoomDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-[#F2E8DF] rounded-xl" />
      <div className="h-64 bg-white rounded-2xl border border-[#F2E8DF]" />
      <div className="h-48 bg-white rounded-2xl border border-[#F2E8DF]" />
    </div>
  );
}
