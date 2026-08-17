'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Cake, LogOut, User as UserIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#F2E8DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF0EE] border border-[#F4B4BA] flex items-center justify-center text-[#E07A5F]">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#3D2314] tracking-tight block">
                Petal & Cocoa
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#E07A5F] uppercase block">
                Owner Dashboard
              </span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
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
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
