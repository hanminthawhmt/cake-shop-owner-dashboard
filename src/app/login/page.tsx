'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Cake, Lock, Mail, Loader2, AlertCircle, Clock, Copy, Check, Sparkles } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleAutoFillDemo = () => {
    setValue('email', 'owner@cakeshop.com', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText('Email: owner@cakeshop.com\nPassword: password123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          setErrorMessage('Unable to connect to backend server. Render server might still be spinning up, please wait a moment and try again.');
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
      <div className="w-full max-w-md space-y-6">
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

        {/* Render Cold-Start Server Announcement */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Server Cold-Start Notice (Render Free Tier)</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed font-medium">
            The backend NestJS API is hosted on Render free plan. If inactive, the server goes to sleep and may take <strong>up to 1 minute</strong> to wake up on your first login request. Subsequent actions will respond instantly!
          </p>
        </div>

        {/* Public Demo Credentials Card for Interviewers/Recruiters */}
        <div className="bg-white p-4 rounded-2xl border border-[#F4B4BA]/60 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E07A5F]" />
              <h2 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
                  Public Demo Login
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="text-[11px] font-semibold text-[#7C685C] hover:text-[#3D2314] flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy credentials to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF6F0] p-3 rounded-xl border border-[#F2E8DF]">
            <div>
              <span className="text-[10px] font-bold text-[#9C8A7E] uppercase block">Demo Email</span>
              <code className="font-mono font-bold text-[#3D2314] text-[11px]">owner@cakeshop.com</code>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#9C8A7E] uppercase block">Password</span>
              <code className="font-mono font-bold text-[#3D2314] text-[11px]">password123</code>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-[#E07A5F] bg-[#FDF0EE] hover:bg-[#E07A5F] hover:text-white border border-[#F4B4BA]/60 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-fill Demo Credentials</span>
          </button>
        </div>

        {/* Login Card Form */}
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
                  placeholder="owner@cakeshop.com"
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
                  <span>Waking up server & authenticating...</span>
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
