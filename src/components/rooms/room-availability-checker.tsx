'use client';

import React, { useState } from 'react';
import { useRoomAvailability } from '@/hooks/use-reservations';
import { Calendar, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface RoomAvailabilityCheckerProps {
  roomId: number;
}

export function RoomAvailabilityChecker({ roomId }: RoomAvailabilityCheckerProps) {
  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const { data: slots, isLoading, isError, refetch, isRefetching } = useRoomAvailability(
    roomId,
    selectedDate
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2E8DF]">
        <div>
          <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
            Time Slot Availability Checker
          </h3>
          <p className="text-xs text-[#9C8A7E]">
            Check open vs. booked fixed time slots for any selected date
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Date Picker */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
            />
          </div>

          <button
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="p-2 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh availability"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Slots Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-xs text-[#7C685C]">
          <Loader2 className="w-4 h-4 animate-spin text-[#E07A5F]" />
          <span>Checking slot availability for {selectedDate}...</span>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Failed to fetch availability for this date. Please check backend connection.</span>
        </div>
      ) : !slots || slots.length === 0 ? (
        <p className="text-xs text-[#9C8A7E] italic text-center py-4">
          No time slots defined for this room on {selectedDate}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.timeSlot}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                slot.isAvailable
                  ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300'
                  : 'bg-rose-50/50 border-rose-200/80 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                      slot.isAvailable
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-[#3D2314]">{slot.timeSlot} Slot</span>
                </div>

                {slot.isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Open
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    Booked
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#7C685C] font-medium">
                {slot.isAvailable
                  ? 'Ready for new customer bookings'
                  : 'Already reserved by a customer'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
