'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useRoomsList, useUpdateRoom, useDeleteRoom } from '@/hooks/use-rooms';
import { Room } from '@/types/rooms';
import { RoomFormModal } from '@/components/rooms/room-form-modal';
import { DeleteConfirmModal, getApiErrorMessage } from '@/components/common/delete-confirm-modal';
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  Settings2,
} from 'lucide-react';

export default function RoomsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RoomsView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function RoomsView() {
  const { data: rooms, isLoading: isRoomsLoading, isError, refetch, isRefetching } = useRoomsList();
  const deleteMutation = useDeleteRoom();

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Deletion confirmation modal state
  const [deleteTargetRoom, setDeleteTargetRoom] = useState<Room | null>(null);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => {
      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesDesc = room.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Availability Filter
      if (availabilityFilter === 'available') {
        if (!room.isAvailable) return false;
      } else if (availabilityFilter === 'unavailable') {
        if (room.isAvailable) return false;
      }

      return true;
    });
  }, [rooms, searchQuery, availabilityFilter]);

  const handleOpenCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    deleteMutation.reset();
    setDeleteTargetRoom(room);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetRoom) return;
    deleteMutation.mutate(deleteTargetRoom.id, {
      onSuccess: () => {
        setDeleteTargetRoom(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Birthday Rooms
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Manage bakery party space reservations, guest capacities, and interior photo galleries.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isRefetching || isRoomsLoading}
            className="p-2.5 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh room list"
          >
            <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Birthday Room</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F2E8DF] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8A7E]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search room by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Availability Filter */}
          <div className="relative min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isRoomsLoading ? (
        <RoomsGridSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Failed to load birthday rooms</h3>
          <p className="text-xs text-[#7C685C]">Please check backend connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#F2E8DF] text-center space-y-3 shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] text-[#9C8A7E] flex items-center justify-center">
            <Home className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#3D2314]">No Birthday Rooms Found</h3>
          <p className="text-xs text-[#7C685C] max-w-sm mx-auto">
            {searchQuery || availabilityFilter
              ? 'No rooms match your active search or filters.'
              : 'You have not set up any birthday rooms yet. Add your first party space!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              formatCurrency={formatCurrency}
              onEdit={() => handleOpenEdit(room)}
              onDelete={() => handleDeleteClick(room)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomToEdit={selectedRoom}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTargetRoom)}
        onClose={() => {
          setDeleteTargetRoom(null);
          deleteMutation.reset();
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Birthday Room"
        description="Are you sure you want to delete this room? Any existing reservation records will remain unaffected."
        itemName={deleteTargetRoom?.name}
        isPending={deleteMutation.isPending}
        errorMessage={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
      />
    </div>
  );
}

interface RoomCardProps {
  room: Room;
  formatCurrency: (amount: number | string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

function RoomCard({ room, formatCurrency, onEdit, onDelete }: RoomCardProps) {
  const updateRoomMutation = useUpdateRoom(room.id);
  const imageUrl = room.images && room.images.length > 0 ? room.images[0].url : null;

  const handleToggleAvailability = () => {
    updateRoomMutation.mutate({ isAvailable: !room.isAvailable });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs flex flex-col justify-between overflow-hidden hover:border-[#E8D5C8] transition-all group">
      {/* Top Banner / Image Area */}
      <div className="relative h-44 w-full bg-[#FAF6F0] border-b border-[#F2E8DF] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={room.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#9C8A7E]">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4B4BA]/40 text-[#E07A5F] flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold">Petal & Cocoa Party Suite</span>
          </div>
        )}

        {/* Capacity Pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#3D2314] border border-[#F2E8DF] shadow-2xs flex items-center gap-1.5">
          <Users className="w-3 h-3 text-[#E07A5F]" />
          <span>Up to {room.capacity} guests</span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-2xs border ${
              room.isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {room.isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Available</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-stone-500" />
                <span>Unavailable</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-[#3D2314] line-clamp-1 leading-snug">
              {room.name}
            </h3>
            <span className="text-base font-bold text-[#E07A5F] shrink-0">
              {formatCurrency(room.price)}
            </span>
          </div>

          <p className="text-xs text-[#7C685C] line-clamp-2 leading-relaxed">
            {room.description || 'No description provided for this party room.'}
          </p>
        </div>

        {/* Manage Details Link */}
        <Link
          href={`/rooms/${room.id}`}
          className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#FDF0EE] text-xs font-semibold text-[#E07A5F] border border-[#F4B4BA]/50 transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Photos & Details Manager</span>
        </Link>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#F2E8DF] flex items-center justify-between gap-2">
          {/* Quick Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            disabled={updateRoomMutation.isPending}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              room.isAvailable
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            {updateRoomMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{room.isAvailable ? 'Mark Unavailable' : 'Mark Available'}</span>
          </button>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-xl text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] hover:text-[#3D2314] transition-colors border border-[#F2E8DF] cursor-pointer"
              title="Quick edit room info"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
              title="Delete room"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#F2E8DF] h-72 space-y-4 p-4">
          <div className="h-32 bg-[#F2E8DF] rounded-xl" />
          <div className="h-5 w-3/4 bg-[#F2E8DF] rounded" />
          <div className="h-4 w-1/2 bg-[#F2E8DF] rounded" />
        </div>
      ))}
    </div>
  );
}
