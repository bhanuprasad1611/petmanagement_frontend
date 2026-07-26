import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pet_app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pet_app_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('pet_app_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('pet_app_token', jwtToken);
    localStorage.setItem('pet_app_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { token: jwtToken, user: newUser } = res.data;
    localStorage.setItem('pet_app_token', jwtToken);
    localStorage.setItem('pet_app_user', JSON.stringify(newUser));
    setToken(jwtToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('pet_app_token');
    localStorage.removeItem('pet_app_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
