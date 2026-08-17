'use client';

import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isPending: boolean;
  errorMessage?: string | null;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isPending,
  errorMessage,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#F2E8DF] shadow-lg p-6 space-y-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F2E8DF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#3D2314]">{title}</h3>
              <p className="text-xs text-[#7C685C]">Confirm deletion request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-[#9C8A7E] hover:text-[#3D2314] hover:bg-[#FAF6F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          <p className="text-xs text-[#7C685C] leading-relaxed">
            {description}
          </p>

          {itemName && (
            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#F2E8DF] font-bold text-xs text-[#3D2314] truncate">
              "{itemName}"
            </div>
          )}

          {/* Surfaced Error Banner (e.g. 409 Conflict) */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl space-y-1 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-rose-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Deletion Blocked</span>
              </div>
              <p className="font-medium text-rose-800 leading-normal pl-6">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F2E8DF]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] border border-[#F2E8DF] transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isPending ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function getApiErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosErr = error as { response?: { data?: { message?: string | string[]; error?: string } } };
    const msg = axiosErr.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
