/**
 * User roles constants
 */
export const ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

/**
 * Check if user has required role
 * @param {string} userRole - User's current role
 * @param {string} requiredRole - Required role to check
 * @returns {boolean} Whether user has the required role
 */
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.CUSTOMER]: 'Customer',
    [ROLES.SELLER]: 'Seller',
    [ROLES.ADMIN]: 'Administrator'
  };
  return displayNames[role] || 'Unknown';
};

/**
 * Get role color for UI
 * @param {string} role - Role key
 * @returns {string} Tailwind CSS color class
 */
export const getRoleColor = (role) => {
  const colors = {
    [ROLES.CUSTOMER]: 'bg-blue-100 text-blue-800',
    [ROLES.SELLER]: 'bg-green-100 text-green-800',
    [ROLES.ADMIN]: 'bg-purple-100 text-purple-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};