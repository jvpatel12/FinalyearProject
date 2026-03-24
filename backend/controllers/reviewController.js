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

module.exports = {
    createProductReview,
    getProductReviews
};
