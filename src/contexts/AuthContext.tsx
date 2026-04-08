'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL, AUTH_EXPIRED_EVENT } from '@/lib/apiClient';
import {
  clearAllTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/authStorage';

export type UserRole = 'partner' | 'airline' | 'admin' | 'super_admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  status: string;
  name?: string;
  emailVerified: boolean;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, passwordConfirmation: string, name?: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function getAuthErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return fallback;
  const body = await response.json().catch(() => ({}));
  return body?.error?.message || body?.error || fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!getRefreshToken());

  // Restore session on mount
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      const id = requestAnimationFrame(() => setIsLoading(false));
      return () => cancelAnimationFrame(id);
    }

    fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Refresh failed');
      })
      .then((data: { token: string; refresh_token?: string; user: User }) => {
        setAccessToken(data.token);
        if (data.refresh_token) setRefreshToken(data.refresh_token);
        setUser(data.user);
      })
      .catch(() => {
        clearAllTokens();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Auto-refresh every 14 minutes
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;
      fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
        .then(res => { if (res.ok) return res.json(); throw new Error(); })
        .then((data: { token: string; refresh_token?: string }) => {
          setAccessToken(data.token);
          if (data.refresh_token) setRefreshToken(data.refresh_token);
        })
        .catch(() => { /* next API call will trigger 401 → retry logic */ });
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.token);
        setRefreshToken(data.refresh_token);
        setUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: await getAuthErrorMessage(res, 'Login failed') };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const signup = useCallback(async (
    email: string, password: string, passwordConfirmation: string, name?: string
  ): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, password_confirmation: passwordConfirmation, name }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.token);
        setRefreshToken(data.refresh_token);
        setUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: await getAuthErrorMessage(res, 'Registration failed') };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(() => {
    clearAllTokens();
    setUser(null);
  }, []);

  // Listen for 401 auth expiry events
  useEffect(() => {
    const handleAuthExpired = () => {
      clearAllTokens();
      setUser(null);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070612]">
        <div className="w-6 h-6 border-2 border-white/30 border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout,
      isAuthenticated: !!user,
      isLoading,
      isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
