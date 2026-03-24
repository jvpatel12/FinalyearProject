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
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        const token = localStorage.getItem('token');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (token) {
          try {
            // Verify token by fetching latest profile from DB
            const dbUser = await apiService.auth.getProfile();
            if (dbUser) {
              setUser(dbUser);
              localStorage.setItem('authUser', JSON.stringify(dbUser));
            }
          } catch (e) {
            console.error('Failed to validate session from backend', e);
            // Log out if unauthorized (token expired / invalid)
            if (e.response && (e.response.status === 401 || e.response.status === 403)) {
              localStorage.removeItem('authUser');
              localStorage.removeItem('token');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userName');
              setUser(null);
            }
          }
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
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      return {
        success: false,
        message: message
      };
    }
  };

  /**
   * Register function
   * @param {Object} userData - User registration data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const register = async (userData) => {
    try {
      const user = await apiService.auth.register(userData);

      // Auto login after register
      setUser(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);

      return {
        success: true,
        message: 'Registration successful!',
        user: user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
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
   * Update Profile function
   */
  const updateUser = async (updates) => {
    try {
      // If we had a real backend, we would call:
      // const updatedUser = await apiService.auth.updateProfile(user.id, updates);

      // For now, since apiService is just a simulation/local storage mock:
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: error.message };
    }
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
    register,
    logout,
    updateUser,
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
