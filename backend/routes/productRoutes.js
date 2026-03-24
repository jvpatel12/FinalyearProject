const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { createProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.route('/')
    .get(getProducts)
    .post(protect, sellerOrAdmin, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, sellerOrAdmin, upload.single('image'), updateProduct)
    .delete(protect, sellerOrAdmin, deleteProduct);

router.route('/:id/reviews')
    .get(getProductReviews)
    .post(protect, createProductReview);

module.exports = router;
