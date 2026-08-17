'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useOrderDetail } from '@/hooks/use-orders';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Cake,
  FileText,
  AlertCircle,
  Receipt,
  Printer,
} from 'lucide-react';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = parseInt(resolvedParams.id, 10);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <OrderDetailView orderId={orderId} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function OrderDetailView({ orderId }: { orderId: number }) {
  const { data: order, isLoading, isError } = useOrderDetail(orderId);

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
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C685C] hover:text-[#3D2314] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
        <div className="bg-white rounded-2xl p-10 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Order Not Found</h3>
          <p className="text-xs text-[#7C685C]">
            The order you are looking for does not exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const bakingSlipUrl = `${API_BASE_URL}/orders/${order.id}/baking-slip`;

  return (
    <div className="space-y-8">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 rounded-xl bg-white border border-[#F2E8DF] text-[#7C685C] hover:text-[#3D2314] hover:bg-[#FAF6F0] transition-colors shadow-2xs"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#3D2314]">
                Order #ORD-{order.id}
              </h1>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs text-[#9C8A7E] font-medium mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* Printable Baking Slip Action */}
        <a
          href={bakingSlipUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-[#E07A5F]" />
          <span>View Baking Slip</span>
        </a>
      </div>

      {/* Grid: Order Metadata (Customer & Pickup Info) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2E8DF]">
            <UserIcon className="w-4 h-4 text-[#E07A5F]" />
            <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
              Customer Details
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#7C685C] shrink-0">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-[#9C8A7E] font-medium">Name</p>
                <p className="font-semibold text-[#3D2314]">{order.user?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#7C685C] shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-[#9C8A7E] font-medium">Email</p>
                <p className="font-semibold text-[#3D2314]">{order.user?.email || 'N/A'}</p>
              </div>
            </div>

            {order.user?.phone && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#7C685C] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9C8A7E] font-medium">Phone</p>
                  <p className="font-semibold text-[#3D2314]">{order.user.phone}</p>
                </div>
              </div>
            )}

            {order.user?.address && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#7C685C] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#9C8A7E] font-medium">Address</p>
                  <p className="font-semibold text-[#3D2314]">{order.user.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pickup Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2E8DF]">
            <Calendar className="w-4 h-4 text-[#E07A5F]" />
            <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
              Pickup Information
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-[#9C8A7E] font-medium">Pickup Date</p>
                <p className="font-semibold text-[#3D2314]">{formatDate(order.pickupDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-[#9C8A7E] font-medium">Pickup Time</p>
                <p className="font-semibold text-[#3D2314]">{order.pickupTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Card */}
      <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F2E8DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 text-[#E07A5F]" />
            <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
              Ordered Items ({order.items?.length || 0})
            </h3>
          </div>
        </div>

        <div className="divide-y divide-[#F2E8DF]">
          {order.items?.map((item) => {
            const cakeName = item.cake?.name || item.cakeName || 'Cake Item';
            return (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#F2E8DF] flex items-center justify-center text-[#E07A5F] shrink-0 font-bold">
                    <Cake className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-[#3D2314]">{cakeName}</h4>

                    {/* Selected Options / Choices */}
                    {item.selectedValues && item.selectedValues.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.selectedValues.map((val) => (
                          <span
                            key={val.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF6F0] text-[#7C685C] border border-[#F2E8DF]"
                          >
                            {val.option?.name ? `${val.option.name}: ` : ''}
                            {val.name}
                            {val.priceDelta ? ` (+${formatCurrency(val.priceDelta)})` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Customization Notes */}
                    {item.notes && (
                      <div className="flex items-start gap-1.5 text-xs text-[#7C685C] bg-[#FFFDF9] p-2 rounded-lg border border-[#F2E8DF] mt-1">
                        <FileText className="w-3.5 h-3.5 text-[#E07A5F] shrink-0 mt-0.5" />
                        <span><strong className="font-semibold text-[#3D2314]">Note:</strong> {item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2E8DF]">
                  <div>
                    <p className="text-xs text-[#9C8A7E]">Quantity</p>
                    <p className="text-sm font-bold text-[#3D2314]">x{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9C8A7E]">Item Price</p>
                    <p className="text-sm font-bold text-[#3D2314]">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Footer */}
        <div className="bg-[#FAF6F0] p-6 border-t border-[#F2E8DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#7C685C]">
            <Receipt className="w-4 h-4 text-[#E07A5F]" />
            <span>Total amount due / charged for this order</span>
          </div>
          <div className="text-right self-end sm:self-auto">
            <span className="text-xs text-[#9C8A7E] font-medium block">Total Price</span>
            <span className="text-2xl font-bold text-[#3D2314]">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-[#F2E8DF] rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-white rounded-2xl border border-[#F2E8DF]" />
        <div className="h-40 bg-white rounded-2xl border border-[#F2E8DF]" />
      </div>
      <div className="h-64 bg-white rounded-2xl border border-[#F2E8DF]" />
    </div>
  );
}
