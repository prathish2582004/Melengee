import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { TOKEN_KEY, USER_KEY, DASHBOARD_ROUTES, ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // Validate stored token and fetch latest user info on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const response = await authService.getCurrentUser();
          if (response && response.data) {
            setUser(response.data);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data));
          }
        } catch {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const authData = response.data;
    
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    setToken(authData.token);
    setUser(authData.user);
    
    return authData.user;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    const authData = response.data;
    
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    setToken(authData.token);
    setUser(authData.user);
    
    return authData.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setToken(null);
    }
  }, []);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const getDashboardRoute = useCallback(() => {
    if (!user) return '/login';
    return DASHBOARD_ROUTES[user.role] || '/';
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    hasRole,
    getDashboardRoute,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

