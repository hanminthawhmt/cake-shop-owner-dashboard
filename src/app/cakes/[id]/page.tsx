'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCakeDetail, useCategories, useUpdateCake, useDeleteCake } from '@/hooks/use-catalog';
import { CakeImagesManager } from '@/components/cakes/cake-images-manager';
import { CakeOptionsManager } from '@/components/cakes/cake-options-manager';
import { DeleteConfirmModal, getApiErrorMessage } from '@/components/common/delete-confirm-modal';
import {
  ArrowLeft,
  Cake as CakeIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Check,
} from 'lucide-react';

interface CakeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CakeDetailPage({ params }: CakeDetailPageProps) {
  const resolvedParams = use(params);
  const cakeId = parseInt(resolvedParams.id, 10);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CakeDetailView cakeId={cakeId} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function CakeDetailView({ cakeId }: { cakeId: number }) {
  const router = useRouter();
  const { data: cake, isLoading, isError } = useCakeDetail(cakeId);
  const { data: categories = [] } = useCategories();

  const updateCakeMutation = useUpdateCake(cakeId);
  const deleteCakeMutation = useDeleteCake();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Basic info form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<string>('0');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (cake) {
      setName(cake.name);
      setDescription(cake.description || '');
      setBasePrice(
        typeof cake.basePrice === 'number'
          ? cake.basePrice.toString()
          : cake.basePrice
      );
      setCategoryId(cake.categoryId);
      setIsAvailable(cake.isAvailable ?? true);
    }
  }, [cake]);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const handleSaveBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCakeMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        basePrice: parseFloat(basePrice) || 0,
        categoryId,
        isAvailable,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteCakeMutation.mutate(cakeId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.push('/cakes');
      },
    });
  };

  if (isLoading) {
    return <CakeDetailSkeleton />;
  }

  if (isError || !cake) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#3D2314]">Cake Product Not Found</h3>
        <p className="text-xs text-[#7C685C]">
          The requested cake ID does not exist or was removed.
        </p>
        <Link
          href="/cakes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/cakes"
            className="p-2.5 rounded-xl bg-white text-[#7C685C] border border-[#F2E8DF] hover:bg-[#FAF6F0] hover:text-[#3D2314] transition-colors shadow-2xs"
            title="Back to Cakes Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
                {cake.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  cake.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {cake.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Unavailable</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-[#7C685C] font-medium mt-1">
              Cake ID #{cake.id} • Base Price {formatCurrency(cake.basePrice)}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            deleteCakeMutation.reset();
            setIsDeleteModalOpen(true);
          }}
          disabled={deleteCakeMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          {deleteCakeMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span>Delete Cake</span>
        </button>
      </div>

      {/* Section 1: Basic Information Form */}
      <form
        onSubmit={handleSaveBasicInfo}
        className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#F2E8DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
              <CakeIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
                Basic Product Details
              </h3>
              <p className="text-xs text-[#9C8A7E]">Cake title, pricing, and category</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateCakeMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {updateCakeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : null}
            <span>{isSaved ? 'Saved Successfully!' : 'Save Basic Info'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Cake Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Base Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#3D2314] uppercase tracking-wider">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 border text-sm rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <input
              id="detailIsAvailable"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-[#E07A5F] rounded border-[#E6D7CC] focus:ring-[#E07A5F] cursor-pointer"
            />
            <label
              htmlFor="detailIsAvailable"
              className="text-xs font-semibold text-[#3D2314] cursor-pointer"
            >
              Available for Ordering (In Storefront Catalog)
            </label>
          </div>
        </div>
      </form>

      {/* Section 2: Image Management */}
      <CakeImagesManager cakeId={cakeId} images={cake.images || []} />

      {/* Section 3: Customization Options & Values Manager */}
      <CakeOptionsManager cakeId={cakeId} options={cake.options || []} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          deleteCakeMutation.reset();
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Cake Product"
        description="Are you sure you want to delete this cake product? It will be permanently removed from the store catalog."
        itemName={cake.name}
        isPending={deleteCakeMutation.isPending}
        errorMessage={deleteCakeMutation.isError ? getApiErrorMessage(deleteCakeMutation.error) : null}
      />
    </div>
  );
}

function CakeDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-[#F2E8DF] rounded-xl" />
      <div className="h-64 bg-white rounded-2xl border border-[#F2E8DF]" />
      <div className="h-48 bg-white rounded-2xl border border-[#F2E8DF]" />
    </div>
  );
}
