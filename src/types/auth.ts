export type Role = 'owner' | 'customer';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LogInUserDto {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  user: User;
  token: string;
}
