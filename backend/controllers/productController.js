const Product = require('../models/Product');

// Custom async handler to avoid dependency on express-async-handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get all products with filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const {
        search,
        keyword,
        category,
        categories,
        brand,
        brands,
        rating,
        minRating,
        availability,
        minPrice,
        maxPrice,
        sortBy,
        sort,
        page = 1,
        pageNumber,
        limit = 12,
        pageSize
    } = req.query;

    const query = {};

    // Determine final values from potential aliases
    const finalSearch = search || keyword;
    const finalCategory = category || categories;
    const finalBrand = brand || brands;
    const finalRating = rating || minRating;
    const finalSort = sortBy || sort;
    const finalPage = pageNumber || page;
    const finalLimit = pageSize || limit;

    console.log('--- DEBUG FILTERING ---');
    console.log('Incoming Query:', req.query);

    // Search Filter
    if (finalSearch && finalSearch.trim() !== '') {
        query.name = { $regex: finalSearch, $options: 'i' };
    }

    // Category Filter (Case-insensitive)
    if (finalCategory && finalCategory !== 'all' && finalCategory !== '') {
        query.category = { $regex: new RegExp('^' + finalCategory + '$', 'i') };
    }

    // Brand Filter (Case-insensitive)
    if (finalBrand && finalBrand !== 'all' && finalBrand !== '') {
        query.brand = { $regex: new RegExp('^' + finalBrand + '$', 'i') };
    }

    // Rating Filter
    if (finalRating && finalRating !== '0' && finalRating !== '') {
        query.averageRating = { $gte: Number(finalRating) };
    }

    // Price Range Filter
    if ((minPrice && minPrice !== '') || (maxPrice && maxPrice !== '')) {
        query.price = {};
        if (minPrice && minPrice !== '') query.price.$gte = Number(minPrice);
        if (maxPrice && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Availability Filter
    if (availability === 'in-stock') {
        query.stock_quantity = { $gt: 0 };
    } else if (availability === 'out-of-stock') {
        query.stock_quantity = { $lte: 0 };
    }

    console.log('Mongoose Query Body:', query);

    // Sort Logic
    let sortObj = {};
    if (finalSort === 'newest' || finalSort === 'createdAt') {
        sortObj = { createdAt: -1 };
    } else if (finalSort === 'price-low' || finalSort === 'priceLow') {
        sortObj = { price: 1 };
    } else if (finalSort === 'price-high' || finalSort === 'priceHigh') {
        sortObj = { price: -1 };
    } else if (finalSort === 'rating') {
        sortObj = { averageRating: -1 };
    } else {
        sortObj = { createdAt: -1 };
    }

    const skip = (Number(finalPage) - 1) * Number(finalLimit);

    const products = await Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(finalLimit));

    const total = await Product.countDocuments(query);

    console.log('Products Found:', products.length);
    console.log('--- END DEBUG ---');

    res.json({
        products,
        page: Number(finalPage),
        pages: Math.ceil(total / Number(finalLimit)),
        total
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller-Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, brand, category, stock_quantity, originalPrice, discount } = req.query; // Fallback to query if needed

    // Typically data comes in req.body
    const productData = req.body;

    const product = new Product({
        name: productData.name || 'Sample Name',
        price: productData.price || 0,
        originalPrice: productData.originalPrice || productData.price || 0,
        discount: productData.discount || 0,
        seller: req.user._id,
        image: productData.image || '/images/sample.jpg',
        images: productData.images && productData.images.length > 0 ? productData.images : ['/images/sample.jpg'],
        brand: productData.brand || 'Sample Brand',
        category: productData.category || 'Sample Category',
        stock_quantity: productData.stock_quantity || 0,
        description: productData.description || 'Sample Description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller-Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, brand, category, stock_quantity, originalPrice, discount, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.originalPrice = originalPrice || product.originalPrice;
        product.discount = discount || product.discount;
        product.description = description || product.description;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.stock_quantity = stock_quantity || product.stock_quantity;
        if (images) product.images = images;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller-Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
