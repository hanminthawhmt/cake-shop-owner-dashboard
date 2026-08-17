export interface RoomImage {
  id: number;
  url: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  price: number | string;
  isAvailable?: boolean;
  images?: RoomImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  capacity: number;
  price: number;
  isAvailable?: boolean;
}
