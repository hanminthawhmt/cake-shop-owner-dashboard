'use client';

import React from 'react';
import { useReservationStats } from '@/hooks/use-analytics';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Calendar, Home, Loader2, Clock, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

export function ReservationStatsCard() {
  const { data: stats, isLoading, isError } = useReservationStats();

  const statusColors: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#0284C7',
    completed: '#059669',
    cancelled: '#6B7280',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const pieData = (stats?.byStatus || []).map((st) => ({
    name: statusLabels[st.status] || st.status,
    value: st.count,
    statusKey: st.status,
  }));

  const totalReservations = stats?.totalReservations || 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-[#F2E8DF]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3D2314]">Birthday Room Stats</h3>
            <p className="text-xs text-[#7C685C] font-medium">
              Total Reservations: <strong>{totalReservations}</strong>
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center gap-2 text-xs text-[#7C685C]">
          <Loader2 className="w-4 h-4 animate-spin text-[#E07A5F]" />
          <span>Loading reservation stats...</span>
        </div>
      ) : isError ? (
        <div className="h-64 flex items-center justify-center text-xs text-rose-600 font-semibold">
          Failed to load reservation statistics.
        </div>
      ) : totalReservations === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-center text-[#9C8A7E]">
          <Calendar className="w-8 h-8 text-[#E6D7CC]" />
          <p className="text-xs font-semibold">No room reservations recorded yet</p>
          <p className="text-[11px] text-[#B5A599]">
            Reservation metrics will populate when customers reserve party suites.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Breakdown: Donut Chart + Legend Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Donut Chart */}
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={statusColors[entry.statusKey] || '#9C8A7E'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-[#3D2314]">{totalReservations}</span>
                <span className="text-[10px] font-semibold text-[#9C8A7E] uppercase">Total</span>
              </div>
            </div>

            {/* Status Pills */}
            <div className="space-y-2">
              {stats?.byStatus?.map((st) => (
                <div
                  key={st.status}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0]/60 border border-[#F2E8DF] text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon status={st.status} />
                    <span className="capitalize text-[#3D2314]">{st.status}</span>
                  </div>
                  <span className="font-bold text-[#E07A5F]">{st.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Room Booking Distribution */}
          <div className="space-y-2 pt-4 border-t border-[#F2E8DF]">
            <h4 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
              Bookings Per Room
            </h4>
            {stats?.byRoom?.length === 0 ? (
              <p className="text-xs text-[#9C8A7E] italic">No room specific stats available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stats?.byRoom?.map((rm) => (
                  <div
                    key={rm.roomId}
                    className="p-3 rounded-xl bg-[#FAF6F0] border border-[#F2E8DF] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span className="text-xs font-bold text-[#3D2314]">
                        {rm.roomName || `Room #${rm.roomId}`}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#E07A5F] bg-white px-2 py-0.5 rounded-md border border-[#F4B4BA]/40">
                      {rm.count} {rm.count === 1 ? 'booking' : 'bookings'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    case 'confirmed':
      return <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />;
    case 'completed':
      return <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />;
    case 'cancelled':
      return <XCircle className="w-3.5 h-3.5 text-stone-500" />;
    default:
      return <Calendar className="w-3.5 h-3.5 text-[#7C685C]" />;
  }
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2.5 rounded-xl border border-[#F2E8DF] shadow-md text-xs font-bold text-[#3D2314]">
        <span>{data.name}: {data.value} reservations</span>
      </div>
    );
  }
  return null;
}
