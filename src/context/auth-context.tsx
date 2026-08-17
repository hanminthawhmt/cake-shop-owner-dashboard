'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LogInUserDto, User, SignInResponse } from '@/types/auth';
import { apiClient } from '@/lib/api-client';
import { authStorage } from '@/lib/auth-storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LogInUserDto) => Promise<User>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = authStorage.getToken();
    if (!storedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    try {
      setTokenState(storedToken);
      const response = await apiClient.get<User>('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      authStorage.removeToken();
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: LogInUserDto): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<SignInResponse>('/auth/signin', credentials);
      const { token: jwtToken, user: loggedInUser } = response.data;

      authStorage.setToken(jwtToken);
      setTokenState(jwtToken);

      // Verify or fetch user info to make sure role is up to date
      try {
        const profileRes = await apiClient.get<User>('/users/me');
        setUser(profileRes.data);
        return profileRes.data;
      } catch {
        setUser(loggedInUser);
        return loggedInUser;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    authStorage.removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
