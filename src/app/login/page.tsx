'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Cake, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isAuthLoading && token && user) {
      router.replace('/');
    }
  }, [isAuthLoading, token, user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(data);
      router.replace('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage('Invalid email or password. Please check your credentials.');
        } else if (error.response?.data?.message) {
          const msg = error.response.data.message;
          setErrorMessage(Array.isArray(msg) ? msg.join(', ') : msg);
        } else {
          setErrorMessage('Unable to connect to backend server. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAF6F0] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-[#F4B4BA] shadow-xs flex items-center justify-center text-[#E07A5F]">
            <Cake className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3D2314]">
            Petal & Cocoa
          </h1>
          <p className="text-sm font-medium text-[#7C685C]">
            Owner Portal Sign In
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white py-8 px-6 shadow-sm border border-[#F2E8DF] rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Global API Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#FDF0EE] border border-[#F4B4BA] text-xs font-medium text-[#D0694E] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Mail className="h-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="owner@petalandcocoa.com"
                  {...register('email')}
                  className={`block w-full pl-10 pr-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E6D7CC]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Lock className="h-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`block w-full pl-10 pr-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-[#E6D7CC]'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E07A5F] disabled:opacity-60 transition-colors shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#9C8A7E]">
          Petal & Cocoa Cake Shop Management System
        </p>
      </div>
    </div>
  );
}
