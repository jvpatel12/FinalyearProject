const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .populate('seller', 'name email storeName')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res, next) => {
    try {
        const { name, price, originalPrice, discount, description, category, stock_quantity, stock } = req.body;
        const actualStock = stock_quantity !== undefined ? stock_quantity : (stock !== undefined ? stock : 0);

        let imageUrls = [];

        // Handle image upload to local storage if file exists
        if (req.file) {
            imageUrls.push(`/images/uploads/${req.file.filename}`);
        } else if (req.body.images) {
            imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        } else {
            imageUrls = ['/images/sample.jpg'];
        }

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            originalPrice: originalPrice || 0,
            discount: discount || 0,
            seller: req.user._id,
            images: imageUrls,
            category: category || 'Other',
            stock_quantity: actualStock,
            numReviews: 0,
            description: description || 'Sample description'
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller or Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, originalPrice, discount, description, category, stock_quantity, stock } = req.body;
        const actualStockUpdate = stock_quantity !== undefined ? stock_quantity : stock;

        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check ownership if not admin
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this product');
        }

        // Handle image update to local storage
        if (req.file) {
            product.images = [`/images/uploads/${req.file.filename}`];
        } else if (req.body.images) {
            product.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
        product.discount = discount !== undefined ? discount : product.discount;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stock_quantity = actualStockUpdate !== undefined ? actualStockUpdate : product.stock_quantity;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller or Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this product');
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
