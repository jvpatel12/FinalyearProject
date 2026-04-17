const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot delete an admin user');
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/user/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.role = req.body.role || user.role;
            const pudatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user status (block/unblock)
// @route   PUT /api/admin/user/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot change status of an admin user');
            }
            user.status = req.body.status || user.status;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        // Sum total revenue
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        res.json({
            users: userCount,
            products: productCount,
            orders: orderCount,
            revenue: totalRevenue
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all sellers with their performance stats
// @route   GET /api/admin/sellers/stats
// @access  Private/Admin
const getSellersWithStats = async (req, res, next) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-password');
        
        const sellersWithStats = await Promise.all(sellers.map(async (seller) => {
            // Get all products by this seller
            const products = await Product.find({ seller: seller._id });
            const productIds = products.map(p => p._id);
            
            // Calculate total sales from orders
            const orders = await Order.find({ 
                'orderItems.product': { $in: productIds },
                isPaid: true 
            });
            
            const totalSales = orders.reduce((acc, order) => {
                const sellerItems = order.orderItems.filter(item => productIds.some(id => id.equals(item.product)));
                return acc + sellerItems.reduce((itemAcc, item) => itemAcc + (item.price * item.qty), 0);
            }, 0);

            const totalOrders = orders.length;

            // Calculate average rating
            const avgRating = products.length > 0 
                ? (products.reduce((acc, p) => acc + (p.averageRating || 0), 0) / products.length).toFixed(1)
                : 0;

            return {
                ...seller._doc,
                id: seller._id,
                totalSales,
                totalOrders,
                averageRating: parseFloat(avgRating),
                productCount: products.length
            };
        }));

        res.json(sellersWithStats);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    deleteUser,
    updateUserRole,
    updateUserStatus,
    getOrders,
    getAdminStats,
    getSellersWithStats
};
