import axios from 'axios';

/**
 * API Service
 * Connects the frontend to the real Node/Express backend endpoints.
 * Handing tokens and mapping `_id` to `id` for frontend compatibility.
 */

// Configure base instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Map MongoDB _id to frontend id for compatibility
const mapId = (doc) => {
    if (!doc) return doc;
    const newDoc = { ...doc };
    if (newDoc._id && !newDoc.id) {
        newDoc.id = newDoc._id.toString();
    }
    // Handle date mappings (Mongoose createdAt -> frontend date/joinDate)
    if (newDoc.createdAt) {
        newDoc.date = newDoc.createdAt;
        newDoc.joinDate = newDoc.createdAt;
    }
    // Handle price/total mappings (Mongoose totalPrice -> frontend total)
    if (newDoc.totalPrice !== undefined && newDoc.total === undefined) {
        newDoc.total = newDoc.totalPrice;
    }
    // Normalize status for consistent filtering
    if (newDoc.status) {
        newDoc.status = newDoc.status.toLowerCase();
    }
    // Handle product specific mappings
    if (newDoc.stock_quantity !== undefined) {
        newDoc.stock = newDoc.stock_quantity;
    }
    if (newDoc.images && newDoc.images.length > 0 && !newDoc.image) {
        newDoc.image = newDoc.images[0];
    }
    // Support backend averageRating field in frontend rating usage
    if (newDoc.averageRating !== undefined && newDoc.rating === undefined) {
        newDoc.rating = newDoc.averageRating;
    }
    if (newDoc.numReviews !== undefined && newDoc.reviews === undefined) {
        newDoc.reviews = newDoc.numReviews;
    }
    return newDoc;
};

const mapIds = (docs) => {
    if (!Array.isArray(docs)) return docs;
    return docs.map(mapId);
};

export const apiService = {
    // --- AUTH SERVICES ---
    auth: {
        login: async (email, password) => {
            try {
                const { data } = await api.post('/auth/login', { email, password });
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return mapId(data.user);
            }
            catch (error) {
                console.error("Login error:", error.response?.data || error.message);
                throw error;
            }
        },
        register: async (userData) => {
            const { data } = await api.post('/auth/register', userData);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return mapId(data.user);
        },
        logout: async () => {
            try {
                await api.post('/auth/logout');
            } catch (e) {
                console.error("Logout error", e);
            }
            localStorage.removeItem('token');
            return true;
        },
        getProfile: async () => {
            const { data } = await api.get('/auth/profile');
            return mapId(data.user);
        },
        updateProfile: async (userId, updates) => {
            // Placeholder: The backend currently lacks a general PUT /api/auth/profile for standard users
            // Returning the updates for now to avoid breaking the frontend entirely
            console.warn('updateProfile endpoint might not be fully supported by the backend auth router yet.');
            return updates;
        }
    },

    // --- USER SERVICES ---
    users: {
        getAll: async () => {
            const { data } = await api.get('/admin/users');
            return mapIds(data);
        },
        delete: async (id) => {
            const { data } = await api.delete(`/admin/user/${id}`);
            return data;
        },
        update: async (id, updates) => {
            // Use admin routes if it pertains to role/status updates
            if (updates.role) {
                await api.put(`/admin/user/${id}/role`, { role: updates.role });
            }
            if (updates.status) {
                await api.put(`/admin/user/${id}/status`, { status: updates.status });
            }
            return { id, ...updates };
        }
    },

    // --- PRODUCT SERVICES ---
    products: {
        getAll: async () => {
            const { data } = await api.get('/products');
            return mapIds(data.products || data);
        },
        getById: async (id) => {
            const { data } = await api.get(`/products/${id}`);
            return mapId(data);
        },
        create: async (productData) => {
            let payload;
            
            if (productData instanceof FormData) {
                payload = productData;
            } else {
                // Normalize image URL and avoid local filesystem path (unsupported in browser)
                const rawImage = (productData.image || '').trim();
                const normalizedImage = /^(https?:)?\/\//i.test(rawImage) || rawImage.startsWith('/images/')
                    ? rawImage
                    : '/images/sample.jpg';

                payload = {
                    name: productData.name,
                    description: productData.description,
                    price: Number(productData.price) || 0,
                    originalPrice: Number(productData.originalPrice) || 0,
                    discount: Number(productData.discount) || 0,
                    category: productData.category,
                    stock_quantity: Number(productData.stock) || 0,
                    images: [normalizedImage]
                };
            }

            const { data } = await api.post('/products', payload);
            return mapId(data);
        },
        update: async (id, updates) => {
            let payload;

            if (updates instanceof FormData) {
                payload = updates;
            } else {
                // Normalize image URL and avoid local filesystem path (unsupported in browser)
                const rawImage = (updates.image || '').trim();
                const normalizedImage = /^(https?:)?\/\//i.test(rawImage) || rawImage.startsWith('/images/')
                    ? rawImage
                    : '/images/sample.jpg';

                payload = {
                    ...updates,
                    stock_quantity: updates.stock !== undefined ? Number(updates.stock) : undefined,
                    images: updates.image ? [normalizedImage] : updates.images
                };
                delete payload.stock;
                delete payload.image;
            }

            const { data } = await api.put(`/products/${id}`, payload);
            return mapId(data);
        },
        delete: async (id) => {
            const { data } = await api.delete(`/products/${id}`);
            return data;
        },
        getBySeller: async (sellerId) => {
            const { data } = await api.get('/products');
            const products = mapIds(data.products || data);

            return products.filter(p => {
                if (!p.seller) return false;
                const pSellerId = typeof p.seller === 'object' ? p.seller._id : p.seller;
                return pSellerId.toString() === sellerId.toString();
            });
        },
        getReviews: async (productId) => {
            const { data } = await api.get(`/products/${productId}/reviews`);
            return data; // Array of reviews
        },
        submitReview: async (productId, reviewData) => {
            const { data } = await api.post(`/products/${productId}/reviews`, reviewData);
            return data;
        }
    },


    // --- ORDER SERVICES ---
    orders: {
        getAll: async () => {
            const { data } = await api.get('/admin/orders');
            return mapIds(data);
        },
        getUserOrders: async () => {
            // The backend endpoint explicitly fetches orders for the logged-in user
            const { data } = await api.get('/orders/myorders');
            return mapIds(data);
        },
        getSellerOrders: async (sellerId) => {
            // Using admin endpoint as a workaround since no specific seller order endpoint exists
            try {
                const { data } = await api.get('/admin/orders');
                const orders = mapIds(data);
                return orders.filter(order =>
                    order.orderItems && order.orderItems.some(item => {
                        // Assuming product population includes seller data or we just compare id if populated
                        const itemSeller = typeof item.product === 'object' ? item.product.seller : null;
                        return itemSeller && itemSeller.toString() === sellerId.toString();
                    })
                );
            } catch (error) {
                console.error("Seller orders requires admin access on this backend", error);
                return [];
            }
        },
        placeOrder: async (orderData) => {
            // The exact format CheckoutPage.jsx passes has `items` arrays
            // Backend orderController requires cart to be populated
            if (orderData.items && Array.isArray(orderData.items)) {
                // Clear existing cart on backend
                try {
                    await api.delete('/cart');
                } catch (e) {
                    console.warn('Could not clear remote cart', e);
                }

                // Populate the backend cart
                for (const item of orderData.items) {
                    try {
                        await api.post('/cart', {
                            productId: item.productId,
                            quantity: item.quantity
                        });
                    } catch (e) {
                        console.error('Failed to add item to remote cart:', item, e.response?.data || e.message);
                        throw new Error(`Failed to sync item "${item.name}" to cart. If this is a test product, please clear your cart and add a new product from the shop.`);
                    }
                }
            }

            // Finally, checkout. Backend reads values directly from req.body
            const { data } = await api.post('/orders', {
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod || 'card'
            });

            return mapId(data.order || data);
        },
        updateStatus: async (orderId, status) => {
            const { data } = await api.put(`/orders/${orderId}/status`, { status });
            return mapId(data);
        },
        delete: async (orderId) => {
            const { data } = await api.delete(`/orders/${orderId}`);
            return data;
        }
    }
};

export default apiService;
