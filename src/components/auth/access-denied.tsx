'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { ShieldAlert, LogOut } from 'lucide-react';

export function AccessDenied() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#F2E8DF] p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FDF0EE] flex items-center justify-center text-[#E07A5F]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#3D2314]">
            Access Restricted
          </h1>
          <p className="text-sm text-[#7C685C]">
            This dashboard is exclusively for Petal & Cocoa store owners.
          </p>
        </div>

        {user && (
          <div className="bg-[#FAF6F0] rounded-xl p-4 text-left border border-[#F2E8DF] space-y-1">
            <p className="text-xs text-[#9C8A7E] font-medium uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-[#3D2314] truncate">{user.email}</p>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8D5C8] text-[#5A3825] mt-1 capitalize">
              Role: {user.role}
            </div>
          </div>
        )}

        <p className="text-xs text-[#9C8A7E]">
          If you believe this is an error, please log out and sign in with an owner account.
        </p>

        <button
          onClick={logout}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:ring-offset-2 cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          Log Out & Switch Account
        </button>
      </div>
    </div>
  );
}
