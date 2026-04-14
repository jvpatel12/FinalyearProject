const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole, updateUserStatus, getOrders, getAdminStats, getSellersWithStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin); // Apply admin + protect middleware to all routes below

router.route('/users')
    .get(getUsers);

router.route('/sellers/stats')
    .get(getSellersWithStats);

router.route('/user/:id')
    .delete(deleteUser);

router.route('/user/:id/role')
    .put(updateUserRole);

router.route('/user/:id/status')
    .put(updateUserStatus);

router.route('/orders')
    .get(getOrders);

router.route('/stats')
    .get(getAdminStats);

module.exports = router;
