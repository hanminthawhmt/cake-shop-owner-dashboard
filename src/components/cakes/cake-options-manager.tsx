'use client';

import React, { useState } from 'react';
import { CakeOption, CakeOptionValue } from '@/types/catalog';
import {
  useCreateCakeOption,
  useUpdateCakeOption,
  useDeleteCakeOption,
  useCreateCakeOptionValue,
  useUpdateCakeOptionValue,
  useDeleteCakeOptionValue,
} from '@/hooks/use-catalog';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Layers,
  Check,
  X,
  DollarSign,
} from 'lucide-react';

interface CakeOptionsManagerProps {
  cakeId: number;
  options: CakeOption[];
}

export function CakeOptionsManager({ cakeId, options }: CakeOptionsManagerProps) {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');

  const createOptionMutation = useCreateCakeOption(cakeId);

  const handleCreateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    createOptionMutation.mutate(
      { name: newOptionName.trim() },
      {
        onSuccess: () => {
          setNewOptionName('');
          setIsAddingOption(false);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2E8DF]">
        <div>
          <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
            Customization Options & Add-ons ({options.length})
          </h3>
          <p className="text-xs text-[#9C8A7E]">
            Configure option groups (Size, Flavor) and choice values with price adjustments
          </p>
        </div>

        {!isAddingOption && (
          <button
            onClick={() => setIsAddingOption(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Option Group</span>
          </button>
        )}
      </div>

      {/* Inline Form to Add New Option Group */}
      {isAddingOption && (
        <form
          onSubmit={handleCreateOption}
          className="bg-[#FFFDF9] p-4 rounded-xl border border-[#F4B4BA]/60 space-y-3"
        >
          <h4 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
            New Option Group Name
          </h4>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g. Size, Sponge Flavor, Frosting"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              className="flex-1 px-3.5 py-2 border text-xs font-semibold rounded-xl text-[#3D2314] bg-white border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              autoFocus
            />
            <button
              type="submit"
              disabled={createOptionMutation.isPending || !newOptionName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] cursor-pointer disabled:opacity-60"
            >
              {createOptionMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Create Group</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddingOption(false)}
              className="p-2 rounded-xl text-[#7C685C] bg-white border border-[#F2E8DF] hover:bg-[#FAF6F0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Option Cards Tree */}
      {options.length === 0 ? (
        <div className="border-2 border-dashed border-[#E6D7CC] rounded-2xl p-10 text-center space-y-3 bg-[#FFFDF9]">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#3D2314]">No customization options yet</p>
          <p className="text-xs text-[#7C685C]">
            Add options like "Size" or "Flavor" to let customers customize this cake.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {options.map((option) => (
            <OptionGroupCard key={option.id} cakeId={cakeId} option={option} />
          ))}
        </div>
      )}
    </div>
  );
}

interface OptionGroupCardProps {
  cakeId: number;
  option: CakeOption;
}

function OptionGroupCard({ cakeId, option }: OptionGroupCardProps) {
  const [isEditingOption, setIsEditingOption] = useState(false);
  const [optionName, setOptionName] = useState(option.name);

  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValueLabel, setNewValueLabel] = useState('');
  const [newValuePrice, setNewValuePrice] = useState<string>('0');

  const updateOptionMutation = useUpdateCakeOption(cakeId);
  const deleteOptionMutation = useDeleteCakeOption(cakeId);
  const createValueMutation = useCreateCakeOptionValue(cakeId);

  const handleUpdateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionName.trim()) return;

    updateOptionMutation.mutate(
      { optionId: option.id, data: { name: optionName.trim() } },
      {
        onSuccess: () => {
          setIsEditingOption(false);
        },
      }
    );
  };

  const handleDeleteOption = () => {
    if (confirm(`Delete option group "${option.name}" and all its choice values?`)) {
      deleteOptionMutation.mutate(option.id);
    }
  };

  const handleCreateValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueLabel.trim()) return;

    const priceNum = parseFloat(newValuePrice) || 0;
    createValueMutation.mutate(
      {
        optionId: option.id,
        data: { label: newValueLabel.trim(), priceModifier: priceNum },
      },
      {
        onSuccess: () => {
          setNewValueLabel('');
          setNewValuePrice('0');
          setIsAddingValue(false);
        },
      }
    );
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(isNaN(num) ? 0 : num);
  };

  return (
    <div className="bg-[#FAF6F0]/60 rounded-2xl border border-[#F2E8DF] p-5 space-y-4">
      {/* Option Group Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2E8DF]">
        {isEditingOption ? (
          <form onSubmit={handleUpdateOption} className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              className="px-3 py-1.5 border text-xs font-bold rounded-xl text-[#3D2314] bg-white border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
              autoFocus
            />
            <button
              type="submit"
              disabled={updateOptionMutation.isPending}
              className="p-1.5 rounded-lg text-white bg-[#E07A5F] hover:bg-[#D0694E]"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingOption(false)}
              className="p-1.5 rounded-lg text-[#7C685C] bg-white border border-[#F2E8DF]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#F2E8DF] text-[#E07A5F] flex items-center justify-center font-bold text-xs shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#3D2314]">{option.name}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF0EE] text-[#E07A5F] border border-[#F4B4BA]">
                  {option.values?.length || 0} choices
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!isEditingOption && (
            <button
              onClick={() => setIsEditingOption(true)}
              className="p-1.5 rounded-lg text-[#7C685C] bg-white hover:bg-[#FAF6F0] border border-[#F2E8DF] transition-colors"
              title="Edit option name"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleDeleteOption}
            disabled={deleteOptionMutation.isPending}
            className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            title="Delete option group"
          >
            {deleteOptionMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>

          {!isAddingValue && (
            <button
              onClick={() => setIsAddingValue(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#E07A5F] bg-white hover:bg-[#FDF0EE] border border-[#F4B4BA] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Choice Value</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Form to Add Choice Value */}
      {isAddingValue && (
        <form
          onSubmit={handleCreateValue}
          className="bg-white p-4 rounded-xl border border-[#F4B4BA] space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#3D2314] uppercase">
                Choice Label *
              </label>
              <input
                type="text"
                placeholder="e.g. 8 inch, Extra Chocolate"
                value={newValueLabel}
                onChange={(e) => setNewValueLabel(e.target.value)}
                className="w-full px-3 py-2 border text-xs font-semibold rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#3D2314] uppercase">
                Price Modifier ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newValuePrice}
                  onChange={(e) => setNewValuePrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border text-xs font-semibold rounded-xl text-[#3D2314] bg-[#FFFDF9] border-[#E6D7CC] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingValue(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#7C685C] bg-[#FAF6F0] border border-[#F2E8DF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createValueMutation.isPending || !newValueLabel.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#E07A5F] hover:bg-[#D0694E] disabled:opacity-60"
            >
              {createValueMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Value</span>
            </button>
          </div>
        </form>
      )}

      {/* Values List */}
      {!option.values || option.values.length === 0 ? (
        <p className="text-xs text-[#9C8A7E] italic text-center py-2">
          No choice values added yet for this option group.
        </p>
      ) : (
        <div className="bg-white rounded-xl border border-[#F2E8DF] divide-y divide-[#F2E8DF]">
          {option.values.map((val) => (
            <OptionValueRow
              key={val.id}
              cakeId={cakeId}
              optionId={option.id}
              val={val}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OptionValueRowProps {
  cakeId: number;
  optionId: number;
  val: CakeOptionValue;
  formatCurrency: (amount: number | string) => string;
}

function OptionValueRow({ cakeId, optionId, val, formatCurrency }: OptionValueRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(val.label);
  const [priceModifier, setPriceModifier] = useState<string>(
    typeof val.priceModifier === 'number' ? val.priceModifier.toString() : val.priceModifier
  );

  const updateValueMutation = useUpdateCakeOptionValue(cakeId);
  const deleteValueMutation = useDeleteCakeOptionValue(cakeId);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    updateValueMutation.mutate(
      {
        optionId,
        valueId: val.id,
        data: { label: label.trim(), priceModifier: parseFloat(priceModifier) || 0 },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm(`Remove choice "${val.label}"?`)) {
      deleteValueMutation.mutate({ optionId, valueId: val.id });
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="p-3 flex items-center justify-between gap-3 bg-[#FFFDF9]">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 px-3 py-1.5 border text-xs font-semibold rounded-lg text-[#3D2314] bg-white border-[#E6D7CC]"
          autoFocus
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={priceModifier}
          onChange={(e) => setPriceModifier(e.target.value)}
          className="w-24 px-3 py-1.5 border text-xs font-semibold rounded-lg text-[#3D2314] bg-white border-[#E6D7CC]"
        />
        <div className="flex items-center gap-1">
          <button
            type="submit"
            disabled={updateValueMutation.isPending}
            className="p-1.5 rounded-lg text-white bg-[#E07A5F]"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-1.5 rounded-lg text-[#7C685C] bg-white border border-[#F2E8DF]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF6F0]/40 transition-colors">
      <span className="text-xs font-bold text-[#3D2314]">{val.label}</span>

      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-[#E07A5F] bg-[#FDF0EE] px-2.5 py-0.5 rounded-md border border-[#F4B4BA]/40">
          +{formatCurrency(val.priceModifier)}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-lg text-[#7C685C] hover:text-[#3D2314] hover:bg-[#FAF6F0]"
            title="Edit value"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteValueMutation.isPending}
            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
            title="Delete value"
          >
            {deleteValueMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
