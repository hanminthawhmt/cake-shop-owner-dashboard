'use client';

import React, { useState, useMemo } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useReservationsList } from '@/hooks/use-reservations';
import { useRoomsList } from '@/hooks/use-rooms';
import { Reservation, ReservationStatus } from '@/types/reservations';
import { ReservationStatusBadge } from '@/components/reservations/reservation-status-badge';
import { ReservationDetailModal } from '@/components/reservations/reservation-detail-modal';
import {
  Calendar,
  Clock,
  Users,
  Filter,
  Eye,
  AlertCircle,
  RefreshCw,
  Home,
  User as UserIcon,
} from 'lucide-react';

export default function ReservationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ReservationsView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function ReservationsView() {
  const { data: reservations, isLoading, isError, refetch, isRefetching } = useReservationsList();
  const { data: rooms = [] } = useRoomsList();

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  const roomMap = useMemo(() => {
    const map = new Map<number, string>();
    rooms.forEach((r) => map.set(r.id, r.name));
    return map;
  }, [rooms]);

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    return reservations.filter((res) => {
      // Status filter
      if (statusFilter && res.status !== statusFilter) {
        return false;
      }
      // Date filter
      if (dateFilter && res.date !== dateFilter) {
        return false;
      }
      return true;
    });
  }, [reservations, statusFilter, dateFilter]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Room Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Monitor and manage customer birthday room bookings across all party suites.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="p-2.5 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh reservations"
          >
            <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F2E8DF] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs font-semibold text-[#E07A5F] hover:underline"
            >
              Clear Date Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Table / List */}
      {isLoading ? (
        <ReservationsSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Failed to load room reservations</h3>
          <p className="text-xs text-[#7C685C]">Please check backend connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#F2E8DF] text-center space-y-3 shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] text-[#9C8A7E] flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#3D2314]">No Reservations Found</h3>
          <p className="text-xs text-[#7C685C] max-w-sm mx-auto">
            {statusFilter || dateFilter
              ? 'No room reservations match your active filters.'
              : 'There are currently no room reservations on record.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#F2E8DF] text-[11px] font-semibold text-[#7C685C] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Room Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Customer</th>
                  <th className="py-3.5 px-4 sm:px-6">Date & Slot</th>
                  <th className="py-3.5 px-4 sm:px-6">Guests</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E8DF] text-sm">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#9C8A7E]">
                      #{res.id}
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-bold text-[#3D2314]">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#E07A5F] shrink-0" />
                        <span>{roomMap.get(res.roomId) || `Room #${res.roomId}`}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-semibold text-[#7C685C]">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-[#9C8A7E]" />
                        <span>User #{res.userId}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-bold text-[#3D2314] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
                        <span>{res.date} @ {res.timeSlot}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-semibold text-[#7C685C]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#9C8A7E]" />
                        <span>{res.guestCount}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <ReservationStatusBadge status={res.status} />
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedReservationId(res.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#E07A5F] bg-[#FDF0EE] hover:bg-[#E07A5F] hover:text-white border border-[#F4B4BA]/60 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Detail Modal */}
      <ReservationDetailModal
        reservationId={selectedReservationId}
        isOpen={Boolean(selectedReservationId)}
        onClose={() => setSelectedReservationId(null)}
        rooms={rooms}
      />
    </div>
  );
}

function ReservationsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden animate-pulse">
      <div className="p-4 bg-[#FAF6F0] border-b border-[#F2E8DF]">
        <div className="h-4 w-40 bg-[#F2E8DF] rounded" />
      </div>
      <div className="divide-y divide-[#F2E8DF]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="h-4 w-12 bg-[#F2E8DF] rounded" />
            <div className="h-4 w-48 bg-[#F2E8DF] rounded" />
            <div className="h-8 w-24 bg-[#F2E8DF] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
