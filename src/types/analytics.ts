export type SalesPeriod = 'daily' | 'weekly' | 'monthly' | 'annual';

export interface DashboardAnalytics {
  todayRevenue: number;
  todayOrderCount: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export interface SalesDataPoint {
  period: string;
  revenue: number | string;
  orderCount: number;
}

export interface BestSellerCake {
  cakeId: number;
  cakeName: string;
  totalQuantity: number;
  totalRevenue: number | string;
}

export interface ReservationStatusStat {
  status: string;
  count: number;
}

export interface ReservationRoomStat {
  roomId: number;
  roomName?: string;
  count: number;
}

export interface ReservationStats {
  totalReservations: number;
  byStatus: ReservationStatusStat[];
  byRoom: ReservationRoomStat[];
}
