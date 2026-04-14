const express = require('express');
const router = express.Router();
const { 
    validateBulkProducts_Controller, 
    insertBulkProducts, 
    getBulkTemplate 
} = require('../controllers/bulkProductController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get bulk upload template
router.get('/template', getBulkTemplate);

// Validate bulk products from file
router.post('/validate', protect, sellerOrAdmin, upload.single('file'), validateBulkProducts_Controller);

// Insert validated bulk products
router.post('/insert', protect, sellerOrAdmin, insertBulkProducts);

module.exports = router;
