export interface Category {
  id: number;
  name: string;
}

export interface CakeImage {
  id: number;
  url: string;
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
