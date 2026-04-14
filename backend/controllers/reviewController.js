const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = new Review({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            product: productId
        });

        await review.save();

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.id })
            .populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private/Seller
const replyToReview = async (req, res, next) => {
    try {
        const { reply } = req.body;
        const review = await Review.findById(req.params.id).populate('product');

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        // Check if the current user is the seller of the product being reviewed
        const product = await Product.findById(review.product);
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to reply to this review');
        }

        review.reply = reply;
        await review.save();

        res.json({ success: true, message: 'Reply added', review });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews for a seller's products
// @route   GET /api/reviews/seller
// @access  Private/Seller
const getSellerReviews = async (req, res, next) => {
    try {
        // 1. Find all products by this seller
        const products = await Product.find({ seller: req.user._id });
        const productIds = products.map(p => p._id);

        // 2. Find all reviews for those products
        const reviews = await Review.find({ product: { $in: productIds } })
            .populate('product', 'name images')
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProductReview,
    getProductReviews,
    getSellerReviews,
    replyToReview
};
