export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface RoomSlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  roomId: number;
  userId: number;
  date: string;
  timeSlot: string;
  guestCount: number;
  birthdayRequirements?: string;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateReservationStatusDto {
  status: ReservationStatus;
}
