'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useOrdersList } from '@/hooks/use-orders';
import { OrderFilterParams } from '@/types/orders';
import { OrdersFilterBar } from '@/components/orders/orders-filter-bar';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { ShoppingBag, ChevronRight, Calendar, Clock, User as UserIcon, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <OrdersListView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function OrdersListView() {
  const [filters, setFilters] = useState<OrderFilterParams>({});
  const { data: orders, isLoading, isError, refetch, isRefetching } = useOrdersList(filters);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Scan, filter, and track customer cake orders.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching || isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-all shadow-2xs cursor-pointer disabled:opacity-60 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Bar */}
      <OrdersFilterBar filters={filters} onFilterChange={setFilters} />

      {/* Main Content Area */}
      {isLoading ? (
        <OrdersTableSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Failed to load orders</h3>
          <p className="text-xs text-[#7C685C]">Please check your network connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#F2E8DF] text-center space-y-3 shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] text-[#9C8A7E] flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#3D2314]">No Orders Found</h3>
          <p className="text-xs text-[#7C685C] max-w-sm mx-auto">
            {filters.status || filters.date
              ? 'No orders match your selected status or date filters.'
              : 'There are currently no orders in the system.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#F2E8DF] text-[11px] font-semibold text-[#7C685C] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Customer</th>
                  <th className="py-3.5 px-4 sm:px-6">Pickup Date & Time</th>
                  <th className="py-3.5 px-4 sm:px-6">Total Price</th>
                  <th className="py-3.5 px-4 sm:px-6">Payment</th>
                  <th className="py-3.5 px-4 sm:px-6">Order Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E8DF] text-sm">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF6F0]/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#3D2314] whitespace-nowrap">
                      #ORD-{order.id}
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] flex items-center justify-center text-[#7C685C] shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#3D2314] leading-tight">
                            {order.user?.name || 'Customer'}
                          </p>
                          <p className="text-xs text-[#9C8A7E] leading-tight truncate max-w-[160px]">
                            {order.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3D2314]">
                          <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
                          <span>{formatDate(order.pickupDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#7C685C]">
                          <Clock className="w-3 h-3 text-[#9C8A7E]" />
                          <span>{order.pickupTime}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-bold text-[#3D2314] whitespace-nowrap">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#E07A5F] bg-[#FDF0EE] hover:bg-[#E07A5F] hover:text-white transition-colors border border-[#F4B4BA]"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden animate-pulse">
      <div className="p-4 bg-[#FAF6F0] border-b border-[#F2E8DF]">
        <div className="h-4 w-48 bg-[#F2E8DF] rounded" />
      </div>
      <div className="divide-y divide-[#F2E8DF]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="h-4 w-20 bg-[#F2E8DF] rounded" />
            <div className="h-4 w-32 bg-[#F2E8DF] rounded" />
            <div className="h-4 w-28 bg-[#F2E8DF] rounded" />
            <div className="h-4 w-16 bg-[#F2E8DF] rounded" />
            <div className="h-6 w-20 bg-[#F2E8DF] rounded-full" />
            <div className="h-6 w-24 bg-[#F2E8DF] rounded-full" />
            <div className="h-7 w-20 bg-[#F2E8DF] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
