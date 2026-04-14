const express = require('express');
const router = express.Router();
const { replyToReview, getSellerReviews } = require('../controllers/reviewController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');

router.route('/seller')
    .get(protect, sellerOrAdmin, getSellerReviews);

router.route('/:id/reply')
    .post(protect, sellerOrAdmin, replyToReview);

module.exports = router;
