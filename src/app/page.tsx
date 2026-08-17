'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/context/auth-context';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { StatCard } from '@/components/dashboard/stat-card';
import { OrderStatusBreakdown } from '@/components/dashboard/order-status-breakdown';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Calculator,
  RefreshCw,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardAnalyticsView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function DashboardAnalyticsView() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboardAnalytics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Welcome back, <span className="text-[#3D2314] font-semibold">{user?.name || 'Owner'}</span>! Here is your shop summary for {currentDateFormatted}.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching || isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] hover:border-[#E8D5C8] transition-all shadow-2xs disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          <span>{isRefetching ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Main Content States */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#3D2314]">Unable to load dashboard data</h3>
            <p className="text-xs text-[#7C685C]">
              Please check your connection to the backend server and try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Row: Daily & Monthly Revenue & Volume */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(data.todayRevenue)}
              subtitle="Total sales recorded today"
              icon={DollarSign}
              iconBgColor="bg-[#FDF0EE]"
              iconTextColor="text-[#E07A5F]"
              trendBadge={{
                label: 'Today',
                type: 'positive',
              }}
            />

            <StatCard
              title="Today's Orders"
              value={data.todayOrderCount}
              subtitle="Orders received today"
              icon={ShoppingBag}
              iconBgColor="bg-[#FDF0EE]"
              iconTextColor="text-[#E07A5F]"
              trendBadge={{
                label: `${data.todayOrderCount} orders`,
                type: 'neutral',
              }}
            />

            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(data.monthlyRevenue)}
              subtitle="Cumulative total for this month"
              icon={TrendingUp}
              iconBgColor="bg-amber-50"
              iconTextColor="text-amber-700"
              trendBadge={{
                label: 'This Month',
                type: 'neutral',
              }}
            />
          </div>

          {/* Second Row: Averages & Order Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatCard
              title="Average Order Value"
              value={formatCurrency(data.averageOrderValue)}
              subtitle="Mean revenue generated per order"
              icon={Calculator}
              iconBgColor="bg-[#FDF0EE]"
              iconTextColor="text-[#E07A5F]"
            />

            <div className="lg:col-span-2">
              <OrderStatusBreakdown
                totalOrders={data.totalOrders}
                pendingOrders={data.pendingOrders}
                completedOrders={data.completedOrders}
                cancelledOrders={data.cancelledOrders}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
