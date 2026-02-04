import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

/**
 * Authentication Context
 * Manages user authentication state and role-based access
 */

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Provides authentication state and methods to the entire app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify user still exists in "DB" (Optional but good practice)
          // const dbUser = apiService.auth.getUser(parsedUser.id);
          // if (dbUser) setUser(dbUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('authUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const login = async (email, password) => {
    try {
      const user = await apiService.auth.login(email, password);

      // Save to state and localStorage
      setUser(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);

      return {
        success: true,
        message: 'Login successful!',
        user: user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Invalid email or password'
      };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return user !== null;
  };

  /**
   * Check if user has specific role
   * @param {string} role - Role to check (customer, admin, seller)
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Get redirect path based on user role
   */
  const getRedirectPath = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller';
      case 'customer':
        return '/customer';
      default:
        return '/';
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getRedirectPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export const useAuth = () => React.useContext(AuthContext);
export default AuthContext;
