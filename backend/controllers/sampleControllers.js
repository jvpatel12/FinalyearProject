const User = require('../models/User'); // Assuming Mongoose Models exist
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. AUTHENTICATION CONTROLLERS
// ==========================================

// Register User
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name, email, password, role: role || 'customer'
        });

        // Generate token and exclude password from response

        const playload = {
            id: user._id, role: user.role
        }
        const token = jwt.sign(playload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

        res.status(201).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        next(error);
    }
};

// Login User
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        // Using method defined inside Mongoose Schema
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            token: accessToken,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 2. PRODUCT CRUD CONTROLLERS (SELLER)
// ==========================================

exports.createProduct = async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ success: false, message: 'Only sellers can create products' });
        }

        const product = new Product({
            seller: req.user._id, // Relational link
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock_quantity: req.body.stock_quantity,
            category: req.body.category,
        });

        const createdProduct = await product.save();
        res.status(201).json({ success: true, product: createdProduct });
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        // Fetch all products, optionally populate the seller's name
        const products = await Product.find({}).populate('seller', 'name email');
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 3. CART MANAGEMENT CONTROLLERS
// ==========================================

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user._id);

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Check if item already exists in embedded cart
        const existingItem = user.cart.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            user.cart.push({ product: productId, quantity: Number(quantity), price: product.price });
        }

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        // Filter out the item
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.id);

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 4. ORDER CONTROLLER
// ==========================================

exports.placeOrder = async (req, res, next) => {
    try {
        const { shippingAddress } = req.body;

        const user = await User.findById(req.user._id).populate('cart.product');

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }

        // 1. Calculate strictly backend-side totals and format order items
        let totalPrice = 0;
        const orderItems = user.cart.map(item => {
            // Price at the time of purchase
            const currentPrice = item.product.price;
            totalPrice += currentPrice * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity,
                price: currentPrice
            };
        });

        // 2. Create the Order document
        const order = new Order({
            user: user._id,
            orderItems,
            totalPrice,
            shippingAddress,
            paymentStatus: 'pending' // Would change after Gateway Webhook
        });
        const createdOrder = await order.save();

        // 3. Deduct Stock Quantity for each product
        for (const item of user.cart) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock_quantity: -item.quantity }
            });
        }

        // 4. Clear the User's cart
        user.cart = [];
        await user.save();

        res.status(201).json({ success: true, order: createdOrder });
    } catch (error) {
        next(error);
    }
};
