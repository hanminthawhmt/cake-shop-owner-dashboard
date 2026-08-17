'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCakesList, useCategories, useUpdateCake, useDeleteCake } from '@/hooks/use-catalog';
import { Cake, Category } from '@/types/catalog';
import { CakeFormModal } from '@/components/cakes/cake-form-modal';
import {
  Cake as CakeIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Tag,
} from 'lucide-react';

export default function CakesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CakesCatalogView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function CakesCatalogView() {
  const { data: cakes, isLoading: isCakesLoading, isError, refetch, isRefetching } = useCakesList();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteCake();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  const filteredCakes = useMemo(() => {
    if (!cakes) return [];
    return cakes.filter((cake) => {
      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cake.name.toLowerCase().includes(query);
        const matchesDesc = cake.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Category Filter
      if (selectedCategoryFilter) {
        if (cake.categoryId !== parseInt(selectedCategoryFilter, 10)) return false;
      }

      // Availability Filter
      if (availabilityFilter === 'available') {
        if (!cake.isAvailable) return false;
      } else if (availabilityFilter === 'unavailable') {
        if (cake.isAvailable) return false;
      }

      return true;
    });
  }, [cakes, searchQuery, selectedCategoryFilter, availabilityFilter]);

  const handleOpenCreate = () => {
    setSelectedCake(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cake: Cake) => {
    setSelectedCake(cake);
    setIsModalOpen(true);
  };

  const handleDelete = (cake: Cake) => {
    if (confirm(`Are you sure you want to delete "${cake.name}" from catalog?`)) {
      deleteMutation.mutate(cake.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Cakes Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Manage bakery product items, base pricing, and availability status.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isRefetching || isCakesLoading}
            className="p-2.5 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh cakes catalog"
          >
            <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cake</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F2E8DF] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8A7E]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search cake by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] placeholder-[#B5A599] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="relative min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="relative min-w-[140px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E6D7CC] bg-[#FFFDF9] text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9C8A7E]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isCakesLoading ? (
        <CakesGridSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Failed to load cake catalog</h3>
          <p className="text-xs text-[#7C685C]">Please check backend connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredCakes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#F2E8DF] text-center space-y-3 shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] text-[#9C8A7E] flex items-center justify-center">
            <CakeIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#3D2314]">No Cakes Found</h3>
          <p className="text-xs text-[#7C685C] max-w-sm mx-auto">
            {searchQuery || selectedCategoryFilter || availabilityFilter
              ? 'No cakes match your active search or filters.'
              : 'Your cake catalog is currently empty. Add your first cake product!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              categoryName={categoryMap.get(cake.categoryId) || cake.category?.name || 'Uncategorized'}
              formatCurrency={formatCurrency}
              onEdit={() => handleOpenEdit(cake)}
              onDelete={() => handleDelete(cake)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CakeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cakeToEdit={selectedCake}
        categories={categories}
      />
    </div>
  );
}

interface CakeCardProps {
  cake: Cake;
  categoryName: string;
  formatCurrency: (amount: number | string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

function CakeCard({ cake, categoryName, formatCurrency, onEdit, onDelete }: CakeCardProps) {
  const updateCakeMutation = useUpdateCake(cake.id);
  const imageUrl = cake.images && cake.images.length > 0 ? cake.images[0].url : null;

  const handleToggleAvailability = () => {
    updateCakeMutation.mutate({ isAvailable: !cake.isAvailable });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs flex flex-col justify-between overflow-hidden hover:border-[#E8D5C8] transition-all group">
      {/* Top Banner / Image Area */}
      <div className="relative h-44 w-full bg-[#FAF6F0] border-b border-[#F2E8DF] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#9C8A7E]">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4B4BA]/40 text-[#E07A5F] flex items-center justify-center">
              <CakeIcon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold">Petal & Cocoa Cake</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#3D2314] border border-[#F2E8DF] shadow-2xs">
          {categoryName}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-2xs border ${
              cake.isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {cake.isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Available</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-stone-500" />
                <span>Unavailable</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-[#3D2314] line-clamp-1 leading-snug">
              {cake.name}
            </h3>
            <span className="text-base font-bold text-[#E07A5F] shrink-0">
              {formatCurrency(cake.basePrice)}
            </span>
          </div>

          <p className="text-xs text-[#7C685C] line-clamp-2 leading-relaxed">
            {cake.description || 'No description provided for this cake.'}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#F2E8DF] flex items-center justify-between gap-2">
          {/* Quick Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            disabled={updateCakeMutation.isPending}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              cake.isAvailable
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            {updateCakeMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>{cake.isAvailable ? 'Mark Unavailable' : 'Mark Available'}</span>
          </button>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-xl text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] hover:text-[#3D2314] transition-colors border border-[#F2E8DF] cursor-pointer"
              title="Edit cake details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
              title="Delete cake item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CakesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#F2E8DF] h-72 space-y-4 p-4">
          <div className="h-32 bg-[#F2E8DF] rounded-xl" />
          <div className="h-5 w-3/4 bg-[#F2E8DF] rounded" />
          <div className="h-4 w-1/2 bg-[#F2E8DF] rounded" />
        </div>
      ))}
    </div>
  );
}
