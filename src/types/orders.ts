export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pick_up'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid';

export interface OrderFilterParams {
  status?: OrderStatus;
  date?: string;
}

export interface SelectedOptionValue {
  id: number;
  name: string;
  priceDelta?: number;
  option?: {
    id?: number;
    name: string;
  };
}

export interface OrderItemCake {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  cake?: OrderItemCake;
  cakeId?: number;
  cakeName?: string;
  quantity: number;
  price: number;
  notes?: string;
  selectedValues?: SelectedOptionValue[];
}

export interface OrderCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  user: OrderCustomer;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
