export interface Category {
  id: number;
  name: string;
}

export interface CakeImage {
  id: number;
  url: string;
}

export interface CakeOptionValue {
  id: number;
  cakeOptionId: number;
  label: string;
  priceModifier: number | string;
}

export interface CakeOption {
  id: number;
  cakeId: number;
  name: string;
  values: CakeOptionValue[];
}

export interface Cake {
  id: number;
  name: string;
  description?: string;
  basePrice: number | string;
  isAvailable: boolean;
  categoryId: number;
  category?: Category;
  images?: CakeImage[];
  options?: CakeOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface CreateCakeDto {
  name: string;
  description?: string;
  basePrice: number;
  isAvailable: boolean;
  categoryId: number;
}

export interface CreateCakeOptionDto {
  name: string;
}

export interface CreateCakeOptionValueDto {
  label: string;
  priceModifier: number;
}
