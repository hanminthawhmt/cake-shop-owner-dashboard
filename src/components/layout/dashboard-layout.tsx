'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Cake as CakeIcon, LogOut, User as UserIcon, LayoutDashboard, ShoppingBag, Tag } from 'lucide-react';

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
      label: 'Orders',
      href: '/orders',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/orders'),
    },
    {
      label: 'Cakes Catalog',
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#F2E8DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FDF0EE] border border-[#F4B4BA] flex items-center justify-center text-[#E07A5F] group-hover:bg-[#E07A5F] group-hover:text-white transition-colors">
                <CakeIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-[#3D2314] tracking-tight block leading-tight">
                  Petal & Cocoa
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#E07A5F] uppercase block leading-tight">
                  Owner Dashboard
                </span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      item.isActive
                        ? 'bg-[#FDF0EE] text-[#E07A5F] border border-[#F4B4BA]'
                        : 'text-[#7C685C] hover:bg-[#FAF6F0] hover:text-[#3D2314]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F2E8DF]">
                <UserIcon className="w-4 h-4 text-[#7C685C]" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#3D2314] leading-none">{user.name}</p>
                  <p className="text-[10px] text-[#9C8A7E] leading-tight truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
                <span className="ml-1 text-[10px] uppercase font-bold text-[#E07A5F] bg-[#FDF0EE] px-1.5 py-0.5 rounded-md">
                  Owner
                </span>
              </div>

              <button
                onClick={logout}
                title="Log out"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] hover:text-[#3D2314] transition-colors border border-[#F2E8DF] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="md:hidden border-t border-[#F2E8DF] px-4 py-2 flex items-center gap-2 overflow-x-auto bg-[#FAF6F0]/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  item.isActive
                    ? 'bg-[#E07A5F] text-white shadow-2xs'
                    : 'text-[#7C685C] bg-white border border-[#F2E8DF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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
