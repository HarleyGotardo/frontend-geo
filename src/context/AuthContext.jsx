import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        setUser(storedUser);
        
        // Verify token is still valid
        const result = await authService.getCurrentUser();
        if (!result.success) {
          // Token invalid, clear storage
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(result.user);
    }
    
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
