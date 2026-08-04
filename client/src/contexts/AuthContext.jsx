import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@constants';
import { authService as authApi } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Helper to persist auth tokens & user
  const handleAuthSuccess = (data) => {
    if (data.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    }
  };

  // Helper to clear tokens & user
  const handleAuthClear = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Fetch current user on app start if token exists
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!token && !refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      if (response?.data) {
        setUser(response.data);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      }
    } catch (err) {
      // If token expired, try session refresh
      if (refreshToken && err?.statusCode === 401) {
        try {
          const refreshRes = await authApi.refreshSession(refreshToken);
          if (refreshRes?.data) {
            handleAuthSuccess(refreshRes.data);
          }
        } catch {
          handleAuthClear();
        }
      } else {
        handleAuthClear();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login
  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res?.data) {
      handleAuthSuccess(res.data);
    }
    return res;
  };

  // Register
  const register = async (data) => {
    const res = await authApi.register(data);
    if (res?.data) {
      handleAuthSuccess(res.data);
    }
    return res;
  };

  // Logout (Current Device)
  const logout = async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      handleAuthClear();
    }
  };

  // Logout All Devices
  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } catch {
      // Ignore errors on logout
    } finally {
      handleAuthClear();
    }
  };

  // Verify Email
  const verifyEmail = async (token) => {
    const res = await authApi.verifyEmail(token);
    if (res?.data && user) {
      const updatedUser = { ...user, isEmailVerified: true };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
    return res;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    return await authApi.forgotPassword(email);
  };

  // Reset Password
  const resetPassword = async (data) => {
    const res = await authApi.resetPassword(data);
    handleAuthClear();
    return res;
  };

  // Change Password
  const changePassword = async (data) => {
    const res = await authApi.changePassword(data);
    handleAuthClear();
    return res;
  };

  // Update Profile
  const updateProfile = async (data) => {
    const res = await authApi.updateProfile(data);
    if (res?.data) {
      setUser(res.data);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
    }
    return res;
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    logoutAll,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
