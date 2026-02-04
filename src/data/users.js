/**
 * Dummy User Credentials for Login
 * This file contains static user data for authentication
 * Format: { email, password, role, userId, name }
 */

export const userCredentials = [
  // Customer users
  {
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    userId: 1,
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
  },
  {
    email: 'jane@example.com',
    password: 'customer123',
    role: 'customer',
    userId: 2,
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80'
  },
  
  // Admin user
  {
    email: 'admin@logimart.com',
    password: 'admin123',
    role: 'admin',
    userId: 5,
    name: 'Jeel Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
  },
  
  // Seller users
  {
    email: 'seller@techstore.com',
    password: 'seller123',
    role: 'seller',
    userId: 1,
    name: 'TechStore Pro',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'
  },
  {
    email: 'seller@gadgethub.com',
    password: 'seller123',
    role: 'seller',
    userId: 2,
    name: 'GadgetHub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  },
  {
    email: 'seller@dell.com',
    password: 'seller123',
    role: 'seller',
    userId: 3,
    name: 'Dell Store',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  },
  {
    email: 'seller@google.com',
    password: 'seller123',
    role: 'seller',
    userId: 4,
    name: 'Google Store',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
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
