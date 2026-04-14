const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile, logoutUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
// Could add .put(protect, updateUserProfile) here

module.exports = router;
