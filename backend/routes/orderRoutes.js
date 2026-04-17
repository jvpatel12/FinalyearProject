const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getOrderById, 
    updateOrderToPaid, 
    updateOrderToDelivered, 
    updateOrderStatus, 
    cancelOrder,
    deleteOrder, 
    getMyOrders,
    getSellerOrders,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require('../controllers/orderController');
const { protect, admin, sellerOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/seller')
    .get(protect, sellerOrAdmin, getSellerOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder);

router.route('/:id/cancel')
    .put(protect, cancelOrder);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/pay/razorpay/create')
    .post(protect, createRazorpayOrder);

router.route('/:id/pay/razorpay/verify')
    .post(protect, verifyRazorpayPayment);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

module.exports = router;
