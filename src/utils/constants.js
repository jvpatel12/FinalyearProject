/**
 * Application constants
 */

// API endpoints (for future use)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'authUser',
  CART_ITEMS: 'cartItems',
  IS_LOGGED_IN: 'isLoggedIn',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
  REMEMBERED_EMAIL: 'rememberedEmail'
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

// Order statuses
export const ORDER_STATUSES = {
  PLACED: 'placed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Product categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Health & Beauty',
  'Toys & Games',
  'Automotive'
];

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  CASH_ON_DELIVERY: 'cod',
  BANK_TRANSFER: 'bank_transfer'
};

// Shipping methods
export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight'
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const MAX_PAGES_SHOWN = 5;

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 1000
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5
};

// Toast durations
export const TOAST_DURATION = {
  SUCCESS: 4000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000
};