/**
 * Dummy User Credentials for Login
 * This file contains static user data for authentication
 * Format: { email, password, role, userId, name }
 */

export const userCredentials = [
  // Customer users
  {
    email: 'jeel@example.com',
    password: 'customer123',
    role: 'customer',
    userId: 1,
    name: 'Jeel Patel',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
  },
  {
    email: 'amit@example.com',
    password: 'customer123',
    role: 'customer',
    userId: 2,
    name: 'Amit Kumar',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80'
  },

  // Seller users
  {
    email: 'seller@ayush.com',
    password: 'seller123',
    role: 'seller',
    userId: 3,
    name: 'Ayush Electronics',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'
  },
  {
    email: 'seller@patel.com',
    password: 'seller123',
    role: 'seller',
    userId: 4,
    name: 'Patel Gadgets',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  },

  // Admin user
  {
    email: 'admin@logimart.com',
    password: 'admin123',
    role: 'admin',
    userId: 5,
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
  },
  {
    email: 'admin',
    password: 'admin',
    role: 'admin',
    userId: 6,
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
  }
];

/**
 * Find user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User object or null if not found
 */
export const findUser = (email, password) => {
  return userCredentials.find(
    user => user.email === email && user.password === password
  ) || null;
};

/**
 * Get user by email only (for checking if user exists)
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
export const getUserByEmail = (email) => {
  return userCredentials.find(user => user.email === email) || null;
};