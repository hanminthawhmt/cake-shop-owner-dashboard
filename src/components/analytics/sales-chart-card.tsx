'use client';

import React, { useState } from 'react';
import { useSalesAnalytics, downloadSalesCsv } from '@/hooks/use-analytics';
import { SalesPeriod } from '@/types/analytics';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, RefreshCw, Loader2, DollarSign, ShoppingBag, Download } from 'lucide-react';

interface SalesChartCardProps {
  activePeriod?: SalesPeriod;
  onPeriodChange?: (period: SalesPeriod) => void;
}

export function SalesChartCard({ activePeriod, onPeriodChange }: SalesChartCardProps) {
  const [internalPeriod, setInternalPeriod] = useState<SalesPeriod>('daily');
  const [isExporting, setIsExporting] = useState(false);

  const currentPeriod = activePeriod || internalPeriod;

  const handlePeriodChange = (newPeriod: SalesPeriod) => {
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    } else {
      setInternalPeriod(newPeriod);
    }
  };

  const { data: salesData, isLoading, isError, refetch, isRefetching } = useSalesAnalytics(currentPeriod);

  const periodsList: { label: string; value: SalesPeriod }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Annual', value: 'annual' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = (salesData || []).map((pt) => {
    const revNum = typeof pt.revenue === 'string' ? parseFloat(pt.revenue) : pt.revenue;
    return {
      period: pt.period,
      revenue: isNaN(revNum) ? 0 : revNum,
      orderCount: pt.orderCount || 0,
    };
  });

  const handleExportSalesCsv = async () => {
    try {
      setIsExporting(true);
      await downloadSalesCsv(currentPeriod);
    } catch (err) {
      alert('Failed to download Sales CSV export');
    } fontFinally: {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#3D2314]">Revenue & Sales Trends</h3>
          </div>
          <p className="text-xs text-[#7C685C] font-medium mt-1">
            Compare earnings and order volume over time ({currentPeriod} view)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Tabs */}
          <div className="bg-[#FAF6F0] p-1 rounded-xl border border-[#F2E8DF] flex items-center gap-1">
            {periodsList.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPeriod === p.value
                    ? 'bg-[#E07A5F] text-white shadow-2xs'
                    : 'text-[#7C685C] hover:text-[#3D2314]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export Sales CSV Button for Current Period */}
          <button
            onClick={handleExportSalesCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#3D2314] bg-[#FAF6F0] hover:bg-[#F2E8DF] border border-[#F2E8DF] transition-colors cursor-pointer disabled:opacity-60"
            title={`Export ${currentPeriod} sales CSV`}
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E07A5F]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#E07A5F]" />
            )}
            <span>Export {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)} Sales CSV</span>
          </button>

          <button
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="p-2 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh sales data"
          >
            <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chart Display */}
      {isLoading ? (
        <div className="h-72 flex items-center justify-center gap-2 text-xs text-[#7C685C]">
          <Loader2 className="w-5 h-5 animate-spin text-[#E07A5F]" />
          <span>Loading sales analytics...</span>
        </div>
      ) : isError ? (
        <div className="h-72 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-xs font-semibold text-rose-600">Failed to load sales data</p>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#E07A5F]"
          >
            Retry
          </button>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center gap-2 text-center text-[#9C8A7E]">
          <TrendingUp className="w-8 h-8 text-[#E6D7CC]" />
          <p className="text-xs font-semibold">No sales recorded for this period</p>
          <p className="text-[11px] text-[#B5A599]">
            Try selecting a different time interval (Weekly, Monthly, or Annual)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E07A5F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2E8DF" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#7C685C', fontWeight: 600 }}
                  axisLine={{ stroke: '#E6D7CC' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 11, fill: '#7C685C', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#3D2314', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomSalesTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E07A5F"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orderCount"
                  stroke="#3D2314"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3D2314' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-2 border-t border-[#F2E8DF]">
            <div className="flex items-center gap-2 text-[#E07A5F]">
              <span className="w-3 h-3 rounded-full bg-[#E07A5F]" />
              <span>Revenue ($)</span>
            </div>
            <div className="flex items-center gap-2 text-[#3D2314]">
              <span className="w-3 h-3 rounded-full bg-[#3D2314]" />
              <span>Orders Count</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSalesTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const revenue = payload.find((p: any) => p.dataKey === 'revenue')?.value || 0;
    const orderCount = payload.find((p: any) => p.dataKey === 'orderCount')?.value || 0;

    const formattedRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(revenue);

    return (
      <div className="bg-white p-3 rounded-xl border border-[#F2E8DF] shadow-md space-y-1 text-xs">
        <p className="font-bold text-[#3D2314]">{label}</p>
        <div className="flex items-center gap-2 text-[#E07A5F]">
          <DollarSign className="w-3.5 h-3.5" />
          <span className="font-bold">{formattedRevenue}</span>
        </div>
        <div className="flex items-center gap-2 text-[#3D2314]">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{orderCount} {orderCount === 1 ? 'order' : 'orders'}</span>
        </div>
      </div>
    );
  }
  return null;
}
