'use client';

import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface OrderStatusBreakdownProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export function OrderStatusBreakdown({
  totalOrders,
  pendingOrders,
  completedOrders,
  cancelledOrders,
}: OrderStatusBreakdownProps) {
  const getPercentage = (count: number) => {
    if (totalOrders === 0) return 0;
    return Math.round((count / totalOrders) * 100);
  };

  const pendingPct = getPercentage(pendingOrders);
  const completedPct = getPercentage(completedOrders);
  const cancelledPct = getPercentage(cancelledOrders);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center shrink-0 border border-[#F4B4BA]/40">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3D2314] uppercase tracking-wider">
              Order Status Overview
            </h3>
            <p className="text-xs text-[#9C8A7E]">Lifetime order distribution</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#3D2314]">{totalOrders}</span>
          <span className="text-xs text-[#7C685C] block">Total Orders</span>
        </div>
      </div>

      {/* Distribution Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-[#FAF6F0] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${completedPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Completed: ${completedOrders} (${completedPct}%)`}
          />
          <div
            style={{ width: `${pendingPct}%` }}
            className="bg-amber-400 transition-all duration-500"
            title={`Pending: ${pendingOrders} (${pendingPct}%)`}
          />
          <div
            style={{ width: `${cancelledPct}%` }}
            className="bg-rose-400 transition-all duration-500"
            title={`Cancelled: ${cancelledOrders} (${cancelledPct}%)`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#9C8A7E] font-medium px-0.5">
          <span>{completedPct}% Completed</span>
          <span>{pendingPct}% Pending</span>
          <span>{cancelledPct}% Cancelled</span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* Completed */}
        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#F2E8DF] space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </div>
          <p className="text-lg font-bold text-[#3D2314]">{completedOrders}</p>
        </div>

        {/* Pending */}
        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#F2E8DF] space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <p className="text-lg font-bold text-[#3D2314]">{pendingOrders}</p>
        </div>

        {/* Cancelled */}
        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#F2E8DF] space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </div>
          <p className="text-lg font-bold text-[#3D2314]">{cancelledOrders}</p>
        </div>
      </div>
    </div>
  );
}
