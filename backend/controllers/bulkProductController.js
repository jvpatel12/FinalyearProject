const Product = require('../models/Product');
const { parseFile } = require('../utils/bulkParser');
const { validateBulkProducts } = require('../utils/bulkValidator');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Validate bulk products from file
 * @route   POST /api/products/bulk/validate
 * @access  Private/Seller or Admin
 */
const validateBulkProducts_Controller = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a file');
        }

        const fileExtension = path.extname(req.file.originalname).substring(1).toLowerCase();
        
        // Validate file extension
        const allowedExtensions = ['json', 'csv', 'xlsx', 'xls', 'zip'];
        if (!allowedExtensions.includes(fileExtension)) {
            res.status(400);
            throw new Error(`Unsupported file format: ${fileExtension}. Allowed: ${allowedExtensions.join(', ')}`);
        }

        // Parse file
        let parsedProducts = [];
        try {
            parsedProducts = await parseFile(req.file.buffer, fileExtension);
        } catch (error) {
            res.status(400);
            throw new Error(`File parsing error: ${error.message}`);
        }

        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            res.status(400);
            throw new Error('No valid product data found in file');
        }

        // Get existing products for duplicate check
        const existingProducts = await Product.find({ seller: req.user._id });

        // Validate products
        const validation = validateBulkProducts(parsedProducts, req.user._id);

        // Clean up uploaded file
        if (req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }

        res.json({
            success: true,
            data: validation,
            message: `Validation complete: ${validation.summary.valid} valid, ${validation.summary.invalid} invalid records`
        });
    } catch (error) {
        // Clean up uploaded file
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }
        next(error);
    }
};

/**
 * @desc    Insert validated bulk products
 * @route   POST /api/products/bulk/insert
 * @access  Private/Seller or Admin
 */
const insertBulkProducts = async (req, res, next) => {
    try {
        const { validProducts } = req.body;

        if (!Array.isArray(validProducts) || validProducts.length === 0) {
            res.status(400);
            throw new Error('No valid products provided');
        }

        // Ensure all products belong to current user
        const productsToInsert = validProducts.map(product => ({
            ...product,
            seller: req.user._id
        }));

        // Insert products
        const insertedProducts = await Product.insertMany(productsToInsert);

        res.status(201).json({
            success: true,
            data: {
                inserted: insertedProducts.length,
                products: insertedProducts
            },
            message: `Successfully inserted ${insertedProducts.length} products`
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get bulk upload template
 * @route   GET /api/products/bulk/template
 * @access  Public
 */
const getBulkTemplate = async (req, res, next) => {
    try {
        const template = {
            json: {
                format: 'Array of objects',
                example: [
                    {
                        name: 'Product Name',
                        description: 'Product description',
                        price: 999.99,
                        originalPrice: 1299.99,
                        discount: 10,
                        stock_quantity: 50,
                        category: 'Electronics',
                        images: ['/path/to/image1.jpg', '/path/to/image2.jpg']
                    }
                ]
            },
            csv: {
                format: 'Headers: name, description, price, originalPrice, discount, stock_quantity, category, images',
                example: 'name,description,price,originalPrice,discount,stock_quantity,category,images\nLaptop,High-performance laptop,999.99,1299.99,10,50,Laptops,|image1.jpg|image2.jpg'
            },
            excel: {
                format: 'Column headers: name, description, price, originalPrice, discount, stock_quantity, category, images',
                example: 'First row: headers, followed by data rows'
            },
            zip: {
                format: 'Archive containing multiple JSON, CSV, or Excel files',
                example: 'products.json, products.csv, products.xlsx'
            }
        };

        res.json({
            success: true,
            data: template,
            validCategories: [
                'Electronics',
                'Clothing',
                'Sports',
                'Smartphones',
                'Laptops',
                'Headphones',
                'Tablets',
                'Accessories',
                'Cameras',
                'Gaming',
                'Wearables',
                'Other'
            ],
            requiredFields: ['name', 'description', 'price', 'stock_quantity', 'category'],
            optionalFields: ['originalPrice', 'discount', 'images', 'brand', 'sku']
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateBulkProducts_Controller,
    insertBulkProducts,
    getBulkTemplate
};
