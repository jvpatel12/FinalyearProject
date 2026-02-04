
import storageService from './storageService';

/**
 * API Service
 * Simulates Backend API endpoints
 * Contains business logic and validation
 */

export const apiService = {
    // --- AUTH SERVICES ---
    auth: {
        login: async (email, password) => {
            const users = storageService.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        },

        register: async (userData) => {
            const users = storageService.getUsers();

            if (users.find(u => u.email === userData.email)) {
                throw new Error('User already exists');
            }

            const newUser = {
                id: users.length + 1,
                ...userData,
                role: 'customer', // Default role
                joinDate: new Date().toISOString().split('T')[0],
                status: 'active',
                avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`
            };

            users.push(newUser);
            storageService.saveUsers(users);

            const { password: _, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        },

        updateProfile: async (userId, updates) => {
            const users = storageService.getUsers();
            const index = users.findIndex(u => u.id === userId);

            if (index === -1) throw new Error('User not found');

            users[index] = { ...users[index], ...updates };
            storageService.saveUsers(users);

            const { password: _, ...userWithoutPassword } = users[index];
            return userWithoutPassword;
        }
    },

    // --- PRODUCT SERVICES ---
    products: {
        getAll: async () => {
            return storageService.getProducts();
        },

        getById: async (id) => {
            const products = storageService.getProducts();
            return products.find(p => p.id === parseInt(id));
        },

        create: async (productData) => {
            const products = storageService.getProducts();
            const newProduct = {
                id: products.length + 1,
                ...productData,
                reviews: 0,
                rating: 0
            };

            products.push(newProduct);
            storageService.saveProducts(products);
            return newProduct;
        },

        update: async (id, updates) => {
            const products = storageService.getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));

            if (index === -1) throw new Error('Product not found');

            products[index] = { ...products[index], ...updates };
            storageService.saveProducts(products);
            return products[index];
        },

        delete: async (id) => {
            const products = storageService.getProducts();
            const filtered = products.filter(p => p.id !== parseInt(id));
            storageService.saveProducts(filtered);
            return true;
        },

        getBySeller: async (sellerId) => {
            const products = storageService.getProducts();
            // sellerId in products is a number, ensure type match
            return products.filter(p => p.sellerId === parseInt(sellerId));
        }
    },

    // --- ORDER SERVICES ---
    orders: {
        getAll: async () => {
            return storageService.getOrders();
        },

        getUserOrders: async (userId) => {
            const orders = storageService.getOrders();
            return orders.filter(o => o.userId === parseInt(userId));
        },

        getSellerOrders: async (sellerId) => {
            // Find orders containing items from this seller
            const allOrders = storageService.getOrders();
            // Return full orders, or just the specific items? 
            // Typically seller dashboard wants 'orders' relevant to them.
            // We will return orders that contain at least one item from this seller.
            return allOrders.filter(order =>
                order.items.some(item => item.sellerId === parseInt(sellerId))
            );
        },

        placeOrder: async (orderData) => {
            const orders = storageService.getOrders(); // Use raw getOrders from storage
            const newOrder = {
                id: `ORD-${Date.now()}`, // Unique ID
                date: new Date().toISOString(),
                status: 'processing', // Default status
                ...orderData
            };

            orders.unshift(newOrder); // Add to top
            storageService.saveOrders(orders); // Use raw saveOrders
            return newOrder;
        },

        updateStatus: async (orderId, status) => {
            const orders = storageService.getOrders();
            const index = orders.findIndex(o => o.id === orderId);

            if (index === -1) throw new Error('Order not found');

            orders[index].status = status;
            storageService.saveOrders(orders);
            return orders[index];
        }
    }
};
