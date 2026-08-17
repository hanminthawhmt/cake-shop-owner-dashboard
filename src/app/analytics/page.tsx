'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SalesChartCard } from '@/components/analytics/sales-chart-card';
import { BestSellersCard } from '@/components/analytics/best-sellers-card';
import { ReservationStatsCard } from '@/components/analytics/reservation-stats-card';
import { downloadSalesCsv, downloadOrdersCsv } from '@/hooks/use-analytics';
import { SalesPeriod } from '@/types/analytics';
import { Download, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnalyticsDashboardView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AnalyticsDashboardView() {
  const [selectedPeriod, setSelectedPeriod] = useState<SalesPeriod>('daily');
  const [isExportingSales, setIsExportingSales] = useState(false);
  const [isExportingOrders, setIsExportingOrders] = useState(false);

  const handleExportSales = async () => {
    try {
      setIsExportingSales(true);
      await downloadSalesCsv(selectedPeriod);
    } catch (err) {
      alert('Failed to download Sales CSV export file');
    } finally {
      setIsExportingSales(false);
    }
  };

  const handleExportOrders = async () => {
    try {
      setIsExportingOrders(true);
      await downloadOrdersCsv();
    } catch (err) {
      alert('Failed to download Orders CSV export file');
    } finally {
      setIsExportingOrders(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Business Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Revenue trends, product sales leaderboards, party room statistics, and CSV exports.
          </p>
        </div>

        {/* CSV Export Header Buttons */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleExportSales}
            disabled={isExportingSales}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-[#3D2314] border border-[#F2E8DF] shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            title={`Export ${selectedPeriod} sales CSV`}
          >
            {isExportingSales ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#E07A5F]" />
            ) : (
              <Download className="w-4 h-4 text-[#E07A5F]" />
            )}
            <span>Export Sales CSV ({selectedPeriod.toUpperCase()})</span>
          </button>

          <button
            onClick={handleExportOrders}
            disabled={isExportingOrders}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isExportingOrders ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* Main Section 1: Sales Chart (Full Width) */}
      <SalesChartCard
        activePeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Main Section 2: Best Sellers & Reservation Stats (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BestSellersCard />
        <ReservationStatsCard />
      </div>
    </div>
  );
}
