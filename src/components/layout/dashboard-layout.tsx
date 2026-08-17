'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Cake as CakeIcon,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Home,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      isActive: pathname === '/',
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      isActive: pathname.startsWith('/analytics'),
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/orders'),
    },
    {
      label: 'Cakes',
      href: '/cakes',
      icon: CakeIcon,
      isActive: pathname.startsWith('/cakes'),
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: Tag,
      isActive: pathname.startsWith('/categories'),
    },
    {
      label: 'Rooms',
      href: '/rooms',
      icon: Home,
      isActive: pathname.startsWith('/rooms'),
    },
    {
      label: 'Reservations',
      href: '/reservations',
      icon: Calendar,
      isActive: pathname.startsWith('/reservations'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#F2E8DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand (Single-line lockup) */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] border border-[#F4B4BA] flex items-center justify-center text-[#E07A5F] group-hover:bg-[#E07A5F] group-hover:text-white transition-colors shrink-0">
                <CakeIcon className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-[#3D2314] tracking-tight whitespace-nowrap">
                Petal & Cocoa
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Single-line, non-wrapping pills) */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    item.isActive
                      ? 'bg-[#FDF0EE] text-[#E07A5F] border border-[#F4B4BA]/80 shadow-2xs'
                      : 'text-[#7C685C] hover:bg-[#FAF6F0] hover:text-[#3D2314]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Badge & Logout */}
          {user && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F2E8DF]">
                <UserIcon className="w-3.5 h-3.5 text-[#7C685C]" />
                <span className="text-xs font-bold text-[#3D2314] truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] uppercase font-extrabold text-[#E07A5F] bg-[#FDF0EE] px-1.5 py-0.5 rounded-md border border-[#F4B4BA]/40">
                  Owner
                </span>
              </div>

              <button
                onClick={logout}
                title="Log out of owner dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] hover:text-[#3D2314] transition-colors border border-[#F2E8DF] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Medium & Mobile Horizontal Scroll Sub-bar */}
        <div className="lg:hidden border-t border-[#F2E8DF] px-4 py-2 flex items-center gap-1.5 overflow-x-auto bg-[#FAF6F0]/60 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  item.isActive
                    ? 'bg-[#E07A5F] text-white shadow-2xs'
                    : 'text-[#7C685C] bg-white border border-[#F2E8DF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
