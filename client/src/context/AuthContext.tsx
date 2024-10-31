import React, { createContext, useContext, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { User } from '../utils/types';

interface AuthContextType {
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (userData && storedToken) {
      setUser(JSON.parse(userData));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, user: User) => {
    setToken(newToken);
    setUser(user);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};