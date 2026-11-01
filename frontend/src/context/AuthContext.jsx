import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aura_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      if (token) {
        try {
          const res = await authApi.getMe();
          setCustomer(res.customer);
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadCustomer();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('aura_token', res.token);
    setToken(res.token);
    setCustomer(res.customer);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem('aura_token', res.token);
    setToken(res.token);
    setCustomer(res.customer);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setToken(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        loading,
        isAuthenticated: !!token && !!customer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

