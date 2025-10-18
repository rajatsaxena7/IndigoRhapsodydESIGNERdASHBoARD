import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  getUserId, 
  getDesignerId, 
  getAccessToken,
  clearAuthCookies 
} from '../service/cookieService';

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
    // Check authentication status on app load
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          setUser({
            userId: getUserId(),
            designerId: getDesignerId(),
            accessToken: getAccessToken(),
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser({
      userId: userData.userId,
      designerId: userData.designerId,
      accessToken: userData.accessToken,
      user: userData.user,
      designer: userData.designer,
      is_approved: userData.is_approved,
    });
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
