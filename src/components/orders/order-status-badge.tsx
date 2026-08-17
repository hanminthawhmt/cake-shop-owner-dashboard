'use client';

import React from 'react';
import { OrderStatus, PaymentStatus } from '@/types/orders';
import { CheckCircle2, Clock, ChefHat, PackageCheck, XCircle, CreditCard } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const getBadgeConfig = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          icon: CheckCircle2,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'preparing':
        return {
          label: 'Preparing',
          icon: ChefHat,
          className: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'ready_for_pick_up':
        return {
          label: 'Ready for Pickup',
          icon: PackageCheck,
          className: 'bg-[#FDF0EE] text-[#E07A5F] border-[#F4B4BA]',
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className: 'bg-stone-100 text-stone-600 border-stone-200',
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-stone-100 text-stone-600 border-stone-200',
        };
    }
  };

  const config = getBadgeConfig(status);
  const Icon = config.icon;

  const paddingClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.className} ${paddingClasses}`}
    >
      <Icon className={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export function PaymentStatusBadge({ status, size = 'md' }: PaymentStatusBadgeProps) {
  const isPaid = status === 'paid';
  const paddingClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
        isPaid
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      } ${paddingClasses}`}
    >
      <CreditCard className={iconSize} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
