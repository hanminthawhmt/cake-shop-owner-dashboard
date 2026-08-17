'use client';

import React from 'react';
import { useBestSellers } from '@/hooks/use-analytics';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Award, Cake as CakeIcon, Loader2, DollarSign, Package } from 'lucide-react';

export function BestSellersCard() {
  const { data: bestSellers, isLoading, isError } = useBestSellers(5);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const chartData = (bestSellers || []).map((item) => ({
    name: item.cakeName,
    quantity: item.totalQuantity,
    revenue: typeof item.totalRevenue === 'string' ? parseFloat(item.totalRevenue) : item.totalRevenue,
  }));

  const barColors = ['#E07A5F', '#F4B4BA', '#3D2314', '#7C685C', '#9C8A7E'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-[#F2E8DF]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#3D2314]">Best-Selling Cakes</h3>
            <p className="text-xs text-[#7C685C] font-medium">Top products by quantity sold</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center gap-2 text-xs text-[#7C685C]">
          <Loader2 className="w-4 h-4 animate-spin text-[#E07A5F]" />
          <span>Loading best-seller data...</span>
        </div>
      ) : isError ? (
        <div className="h-64 flex items-center justify-center text-xs text-rose-600 font-semibold">
          Failed to load best-selling products.
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-center text-[#9C8A7E]">
          <CakeIcon className="w-8 h-8 text-[#E6D7CC]" />
          <p className="text-xs font-semibold">No sales data recorded yet</p>
          <p className="text-[11px] text-[#B5A599]">
            Best sellers will populate as customers place orders.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Horizontal BarChart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#3D2314', fontWeight: 600 }}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBestSellerTooltip />} />
                <Bar dataKey="quantity" radius={[0, 8, 8, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked Leaderboard List */}
          <div className="space-y-2.5 pt-2 border-t border-[#F2E8DF]">
            {bestSellers?.map((item, idx) => (
              <div
                key={item.cakeId || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0]/60 border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white font-bold text-xs text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40 shrink-0 shadow-2xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#3D2314] line-clamp-1">
                      {item.cakeName}
                    </h4>
                    <p className="text-[11px] text-[#7C685C]">
                      {item.totalQuantity} {item.totalQuantity === 1 ? 'unit' : 'units'} sold
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#E07A5F] bg-white px-2.5 py-1 rounded-lg border border-[#F4B4BA]/40 shadow-2xs">
                  {formatCurrency(item.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomBestSellerTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 rounded-xl border border-[#F2E8DF] shadow-md space-y-1 text-xs">
        <p className="font-bold text-[#3D2314]">{data.name}</p>
        <div className="flex items-center gap-2 text-[#3D2314]">
          <Package className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Quantity Sold: <strong>{data.quantity}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[#E07A5F]">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Total Revenue: <strong>${data.revenue}</strong></span>
        </div>
      </div>
    );
  }
  return null;
}
