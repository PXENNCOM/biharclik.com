import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklenince user'ı kontrol et
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const response = await authService.login(identifier, password);
    const { user, access_token, refresh_token } = response.data;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    setUser(user);
    return user;
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {
        // Hata olsa bile devam et
      });
    }

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isSender: user?.role === 'sender',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
