'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AccessDenied } from './access-denied';
import { Cake } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6F0] p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FDF0EE] border border-[#F4B4BA] flex items-center justify-center text-[#E07A5F] animate-pulse">
            <Cake className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-[#7C685C] animate-pulse">
            Verifying owner credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return null; // Will redirect in useEffect
  }

  if (user.role !== 'owner') {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
