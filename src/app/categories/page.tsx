'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCategories, useDeleteCategory } from '@/hooks/use-catalog';
import { Category } from '@/types/catalog';
import { CategoryFormModal } from '@/components/categories/category-form-modal';
import { Tag, Plus, Edit2, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CategoriesView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function CategoriesView() {
  const { data: categories, isLoading, isError, refetch, isRefetching } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2314] tracking-tight">
            Cake Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#7C685C] font-medium mt-1">
            Organize catalog cakes into structured categories.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isRefetching || isLoading}
            className="p-2.5 rounded-xl bg-white text-[#3D2314] border border-[#F2E8DF] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Table / List */}
      {isLoading ? (
        <CategoriesSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl p-8 border border-[#F2E8DF] text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#3D2314]">Failed to load categories</h3>
          <p className="text-xs text-[#7C685C]">Please check backend connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#F2E8DF] text-center space-y-3 shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#F2E8DF] text-[#9C8A7E] flex items-center justify-center">
            <Tag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#3D2314]">No Categories Found</h3>
          <p className="text-xs text-[#7C685C] max-w-sm mx-auto">
            Get started by creating your first cake category.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#F2E8DF] text-[11px] font-semibold text-[#7C685C] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Category Name</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E8DF] text-sm">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#9C8A7E]">
                      #{category.id}
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-bold text-[#3D2314]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40 shrink-0">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span>{category.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 rounded-xl text-[#7C685C] bg-[#FAF6F0] hover:bg-[#F2E8DF] hover:text-[#3D2314] transition-colors border border-[#F2E8DF] cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer disabled:opacity-60"
                          title="Delete category"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={selectedCategory}
      />
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#F2E8DF] shadow-xs overflow-hidden animate-pulse">
      <div className="p-4 bg-[#FAF6F0] border-b border-[#F2E8DF]">
        <div className="h-4 w-40 bg-[#F2E8DF] rounded" />
      </div>
      <div className="divide-y divide-[#F2E8DF]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="h-4 w-12 bg-[#F2E8DF] rounded" />
            <div className="h-4 w-48 bg-[#F2E8DF] rounded" />
            <div className="h-8 w-20 bg-[#F2E8DF] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
