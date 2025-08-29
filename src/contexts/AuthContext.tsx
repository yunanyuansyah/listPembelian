'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: number;
  nama: string;
  email: string;
  nomor: string;
  status: 'admin' | 'mods' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (userData: User, tokens: AuthTokens) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isAdminOrModerator: boolean;
  isUser: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedTokens = localStorage.getItem('tokens');
        
        if (savedUser && savedTokens) {
          const userData = JSON.parse(savedUser);
          const tokenData = JSON.parse(savedTokens);
          
          // Verify token is still valid
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${tokenData.accessToken}`
            }
          });
          
          if (response.ok) {
            setUser(userData);
            setTokens(tokenData);
          } else {
            // Token is invalid, clear everything for now
            // Token refresh will be handled by the api-client when needed
            localStorage.removeItem('user');
            localStorage.removeItem('tokens');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokens', JSON.stringify(tokenData));
  };

  const logout = useCallback(async () => {
    try {
      // Call logout API to invalidate tokens on server side
      if (tokens?.accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
    }
  }, [tokens]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!tokens?.refreshToken) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = {
          accessToken: data.accessToken,
          refreshToken: tokens.refreshToken // Keep the same refresh token
        };
        
        setTokens(newTokens);
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        return true;
      } else {
        // Refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  }, [tokens, logout]);

  const isAuthenticated = !!user && !!tokens;
  const isAdmin = user?.status === 'admin';
  const isModerator = user?.status === 'mods';
  const isAdminOrModerator = user?.status === 'admin' || user?.status === 'mods';
  const isUser = user?.status === 'user';

    return (
    <AuthContext.Provider value={{ 
      user, 
      tokens, 
      login, 
      logout, 
      refreshToken,
      isAuthenticated,
      isAdmin,
      isModerator,
      isAdminOrModerator,
      isUser,
      isLoading
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
