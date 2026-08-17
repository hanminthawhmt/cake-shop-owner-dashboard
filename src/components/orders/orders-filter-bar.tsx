'use client';

import React from 'react';
import { OrderStatus, OrderFilterParams } from '@/types/orders';
import { Filter, Calendar, X } from 'lucide-react';

interface OrdersFilterBarProps {
  filters: OrderFilterParams;
  onFilterChange: (filters: OrderFilterParams) => void;
}

export function OrdersFilterBar({ filters, onFilterChange }: OrdersFilterBarProps) {
  const hasActiveFilters = Boolean(filters.status || filters.date);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as OrderStatus | '';
    onFilterChange({
      ...filters,
      status: value ? value : undefined,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      date: value ? value : undefined,
    });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#F2E8DF] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Select */}
        <div className="relative min-w-[180px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pick_up">Ready for Pickup</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9C8A7E]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Date Input */}
        <div className="relative min-w-[170px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <input
            type="date"
            value={filters.date || ''}
            onChange={handleDateChange}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] border border-[#F2E8DF] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
