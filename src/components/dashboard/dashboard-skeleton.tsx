'use client';

import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Row Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-[#F2E8DF] space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-[#F2E8DF] rounded" />
              <div className="w-11 h-11 rounded-xl bg-[#F2E8DF]" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-36 bg-[#F2E8DF] rounded" />
              <div className="h-3 w-20 bg-[#F2E8DF] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Second Row Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 bg-[#F2E8DF] rounded" />
            <div className="w-11 h-11 rounded-xl bg-[#F2E8DF]" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-28 bg-[#F2E8DF] rounded" />
            <div className="h-3 w-40 bg-[#F2E8DF] rounded" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#F2E8DF] space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-[#F2E8DF] rounded" />
            <div className="h-6 w-20 bg-[#F2E8DF] rounded" />
          </div>
          <div className="h-3 w-full bg-[#F2E8DF] rounded-full" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-16 bg-[#F2E8DF] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
