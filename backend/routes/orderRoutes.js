const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, updateOrderStatus, deleteOrder, getMyOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

module.exports = router;
