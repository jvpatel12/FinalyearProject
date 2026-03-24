const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product', 'name price images stock_quantity category seller');
        res.json({ success: true, cart: user.cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        const user = await User.findById(req.user._id);

        // Check if product already in cart
        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity
            user.cart[itemIndex].quantity += Number(quantity);
            user.cart[itemIndex].price = product.price; // Update price to latest
        } else {
            // Add new item
            user.cart.push({
                product: productId,
                quantity: Number(quantity),
                price: product.price
            });
        }

        await user.save();

        // Populate to return full data
        const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name price images stock_quantity');

        res.status(200).json({ success: true, cart: updatedUser.cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);

        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('cart.product', 'name price images stock_quantity');
        res.status(200).json({ success: true, cart: updatedUser.cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getCart, addToCart, removeFromCart, clearCart };
