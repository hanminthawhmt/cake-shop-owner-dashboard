'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  trendBadge?: {
    label: string;
    type?: 'neutral' | 'positive' | 'warning' | 'info';
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-[#FDF0EE]',
  iconTextColor = 'text-[#E07A5F]',
  trendBadge,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#E8D5C8] transition-all">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#7C685C] uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 border border-[#F4B4BA]/40`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            {value}
          </p>
          {trendBadge && (
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                trendBadge.type === 'positive'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : trendBadge.type === 'warning'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-[#FAF6F0] text-[#7C685C] border border-[#F2E8DF]'
              }`}
            >
              {trendBadge.label}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-[#9C8A7E] font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
