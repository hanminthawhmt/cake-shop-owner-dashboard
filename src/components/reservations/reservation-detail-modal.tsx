'use client';

import React from 'react';
import { Reservation, ReservationStatus } from '@/types/reservations';
import { Room } from '@/types/rooms';
import {
  useUpdateReservationStatus,
  useCancelReservation,
  useReservationDetail,
} from '@/hooks/use-reservations';
import { ReservationStatusBadge } from '@/components/reservations/reservation-status-badge';
import {
  X,
  Calendar,
  Clock,
  Users,
  Gift,
  Home,
  User as UserIcon,
  CheckCircle2,
  CheckCheck,
  XCircle,
  Loader2,
} from 'lucide-react';

interface ReservationDetailModalProps {
  reservationId: number | null;
  isOpen: boolean;
  onClose: () => void;
  rooms?: Room[];
}

export function ReservationDetailModal({
  reservationId,
  isOpen,
  onClose,
  rooms = [],
}: ReservationDetailModalProps) {
  const { data: reservation, isLoading } = useReservationDetail(reservationId || 0);

  const updateStatusMutation = useUpdateReservationStatus(reservationId || 0);
  const cancelMutation = useCancelReservation(reservationId || 0);

  if (!isOpen || !reservationId) return null;

  const isPending = updateStatusMutation.isPending || cancelMutation.isPending;

  const roomMap = new Map<number, Room>();
  rooms.forEach((r) => roomMap.set(r.id, r));
  const currentRoom = reservation ? roomMap.get(reservation.roomId) : null;

  const handleUpdateStatus = (newStatus: ReservationStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this room reservation?')) {
      cancelMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#F2E8DF] shadow-lg p-6 space-y-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3D2314]">
                Reservation #{reservationId}
              </h3>
              <p className="text-xs text-[#9C8A7E]">Birthday Room Booking Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9C8A7E] hover:text-[#3D2314] hover:bg-[#FAF6F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading || !reservation ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-[#7C685C]">
            <Loader2 className="w-5 h-5 animate-spin text-[#E07A5F]" />
            <span>Loading reservation details...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Status Header Bar */}
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#F2E8DF] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#7C685C] uppercase tracking-wider block">
                  Current Status
                </span>
                <div className="mt-1">
                  <ReservationStatusBadge status={reservation.status} />
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#7C685C] uppercase tracking-wider block">
                  Customer
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#3D2314] mt-1">
                  <UserIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>User #{reservation.userId}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Room Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#9C8A7E] uppercase tracking-wider block">
                  Party Room
                </label>
                <div className="flex items-center gap-2 text-xs font-bold text-[#3D2314]">
                  <Home className="w-4 h-4 text-[#E07A5F]" />
                  <span>{currentRoom?.name || `Room #${reservation.roomId}`}</span>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#9C8A7E] uppercase tracking-wider block">
                  Date & Time Slot
                </label>
                <div className="flex items-center gap-2 text-xs font-bold text-[#3D2314]">
                  <Clock className="w-4 h-4 text-[#E07A5F]" />
                  <span>{reservation.date} @ {reservation.timeSlot}</span>
                </div>
              </div>

              {/* Guest Count */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#9C8A7E] uppercase tracking-wider block">
                  Guest Count
                </label>
                <div className="flex items-center gap-2 text-xs font-bold text-[#3D2314]">
                  <Users className="w-4 h-4 text-[#E07A5F]" />
                  <span>{reservation.guestCount} Guests</span>
                </div>
              </div>

              {/* Created Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#9C8A7E] uppercase tracking-wider block">
                  Booked On
                </label>
                <span className="text-xs font-semibold text-[#7C685C]">
                  {reservation.createdAt
                    ? new Date(reservation.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Birthday Requirements */}
            <div className="space-y-1.5 pt-2 border-t border-[#F2E8DF]">
              <label className="text-[11px] font-bold text-[#3D2314] uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Special Birthday Requirements</span>
              </label>
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#E6D7CC] text-xs text-[#3D2314] leading-relaxed">
                {reservation.birthdayRequirements || 'No special requirements specified by customer.'}
              </div>
            </div>

            {/* Owner Actions */}
            <div className="pt-4 border-t border-[#F2E8DF] space-y-3">
              <span className="text-[11px] font-bold text-[#3D2314] uppercase tracking-wider block">
                Manage Reservation Workflow
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {reservation.status !== 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Mark Confirmed</span>
                  </button>
                )}

                {reservation.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Completed</span>
                  </button>
                )}

                {reservation.status !== 'cancelled' && (
                  <button
                    onClick={handleCancel}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-60 ml-auto"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cancel Reservation</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#F2E8DF]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] border border-[#F2E8DF]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
