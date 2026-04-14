const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod, orderItems: bodyItems, itemsPrice: bodyItemsPrice, taxPrice: bodyTaxPrice, shippingPrice: bodyShippingPrice, totalPrice: bodyTotalPrice } = req.body;

        let orderItems = [];
        let itemsPrice, taxPrice, shippingPrice, totalPrice;

        if (bodyItems && bodyItems.length > 0) {
            // If items are provided in body (new streamlined way)
            orderItems = bodyItems;
            itemsPrice = bodyItemsPrice || bodyItems.reduce((acc, item) => acc + item.price * (item.qty || item.quantity), 0);
            shippingPrice = bodyShippingPrice !== undefined ? bodyShippingPrice : (itemsPrice > 100 ? 0 : 10);
            taxPrice = bodyTaxPrice !== undefined ? bodyTaxPrice : Number((0.15 * itemsPrice).toFixed(2));
            totalPrice = bodyTotalPrice || (itemsPrice + shippingPrice + taxPrice);
        } else {
            // Fallback to database cart (old way)
            const user = await User.findById(req.user._id).populate('cart.product');

            if (!user.cart || user.cart.length === 0) {
                res.status(400);
                throw new Error('No order items');
            }

            itemsPrice = user.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            shippingPrice = itemsPrice > 100 ? 0 : 10;
            taxPrice = Number((0.15 * itemsPrice).toFixed(2));
            totalPrice = itemsPrice + shippingPrice + taxPrice;

            orderItems = user.cart.map(item => ({
                product: item.product._id,
                name: item.product.name,
                qty: item.quantity,
                image: item.product.images[0] || '/images/sample.jpg',
                price: item.product.price
            }));
            
            // Clear user cart if using database cart
            user.cart = [];
            await user.save();
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        // Decrement Product Stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product || item.productId, {
                $inc: { stock_quantity: -(item.qty || item.quantity) }
            });
        }

        res.status(201).json({ success: true, order: createdOrder });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Verify ownership or Admin role
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to view this order');
            }
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Verify ownership or Admin role
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to update this order');
            }

            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = 'delivered';
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            
            // If they are specifically setting to delivered via this generic route
            if (req.body.status === 'Delivered' && !order.deliveredAt) {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();

            // Emit socket event for real-time tracking
            const io = req.app.get('io');
            if (io) {
                // Emit to user's room
                io.to(`user_${order.user}`).emit('orderStatusUpdated', { orderId: order._id, status: order.status });
            }

            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/:id/pay/razorpay/create
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
    try {
        console.log('Creating Razorpay order for:', req.params.id);
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        
        // Verify ownership
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to access this order');
        }

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            console.error('Razorpay keys are missing from environment variables');
            res.status(500);
            throw new Error('Razorpay keys are missing');
        }

        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        const options = {
            amount: Math.round(order.totalPrice * 100), // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${order._id}`,
        };

        console.log('Razorpay options:', options);
        const razorpayOrder = await instance.orders.create(options);
        console.log('Razorpay order created:', razorpayOrder.id);

        if (!razorpayOrder) {
            res.status(500);
            throw new Error('Some error occured creating Razorpay order');
        }

        res.json(razorpayOrder);
    } catch (error) {
        console.error('Razorpay creation error:', error);
        next(error);
    }
}

// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/pay/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== signature) {
            res.status(400);
            throw new Error("Payment signature verification failed");
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: razorpayPaymentId,
            status: "Completed",
            update_time: Date.now().toString(),
            email_address: req.user.email
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        next(error);
    }
}

// @desc    Get orders for a specific seller
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res, next) => {
    try {
        // Find all products by this seller
        const products = await Product.find({ seller: req.user._id });
        const productIds = products.map(p => p._id);

        // Find orders that contain at least one of these products
        // We filter the items later or return the whole order if it contains seller's product
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        }).populate('user', 'name email');

        // Optional: Filter the orderItems to only show seller's products for that order
        // This is safer to prevent sellers from seeing each other's items in same order
        const customizedOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.orderItems = orderObj.orderItems.filter(item => 
                productIds.some(pid => pid.toString() === item.product.toString())
            );
            return orderObj;
        });

        res.json(customizedOrders);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    getSellerOrders,
    createRazorpayOrder,
    verifyRazorpayPayment
};
