
import { products as initialProducts, categories as initialCategories, users as initialUsers, orders as initialOrders } from '../products/productsData';
import { userCredentials } from '../auth/authService';

const KEYS = {
    USERS: 'logimart_users',
    PRODUCTS: 'logimart_products',
    ORDERS: 'logimart_orders',
    CATEGORIES: 'logimart_categories', // New: Categories persistence
    CURRENT_USER: 'logimart_current_user',
    CART: 'logimart_cart'
};

/**
 * Storage Service
 * Handles all direct interactions with localStorage
 * Acts as the "Database Layer"
 */
const storageService = {
    // Initialize DB with seed data if empty
    initialize: () => {
        let users = localStorage.getItem(KEYS.USERS);
        let parsedUsers = users ? JSON.parse(users) : null;

        // Check if initialization is needed OR if data is broken (missing passwords)
        const needsInit = !parsedUsers || (parsedUsers.length > 0 && !parsedUsers[0].password);

        if (needsInit) {
            console.log("Initializing or repairing user data in localStorage...");
            // Merge rich user profiles with auth credentials for a complete active user list
            // Map initialUsers (profile data) and add passwords from userCredentials
            const mergedUsers = initialUsers.map(user => {
                const creds = userCredentials.find(c => c.userId === user.id || c.email === user.email);
                return {
                    ...user,
                    password: creds ? creds.password : 'password123', // Fallback password
                    role: creds ? creds.role : user.role // Ensure role consistency
                };
            });

            // Also add any admin/extra users from credentials that might not be in initialUsers
            userCredentials.forEach(cred => {
                const exists = mergedUsers.find(u => u.email === cred.email);
                if (!exists) {
                    mergedUsers.push({
                        id: cred.userId || mergedUsers.length + 1,
                        name: cred.name,
                        email: cred.email,
                        password: cred.password,
                        role: cred.role,
                        avatar: cred.avatar,
                        joinDate: new Date().toISOString().split('T')[0],
                        status: 'active'
                    });
                }
            });

            localStorage.setItem(KEYS.USERS, JSON.stringify(mergedUsers));
        }

        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initialProducts));
        }

        if (!localStorage.getItem(KEYS.ORDERS)) {
            localStorage.setItem(KEYS.ORDERS, JSON.stringify(initialOrders));
        }

        if (!localStorage.getItem(KEYS.CATEGORIES)) {
            localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories));
        }
    },

    // Generic Getters
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Generic Setters
    set: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Clear specific key
    remove: (key) => {
        localStorage.removeItem(key);
    },

    // Database Accessors
    getUsers: () => storageService.get(KEYS.USERS) || [],
    saveUsers: (users) => storageService.set(KEYS.USERS, users),

    getProducts: () => storageService.get(KEYS.PRODUCTS) || [],
    saveProducts: (products) => storageService.set(KEYS.PRODUCTS, products),

    getOrders: () => storageService.get(KEYS.ORDERS) || [],
    saveOrders: (orders) => storageService.set(KEYS.ORDERS, orders),

    getKeys: () => KEYS
};

// Auto-initialize on import
storageService.initialize();

export default storageService;
