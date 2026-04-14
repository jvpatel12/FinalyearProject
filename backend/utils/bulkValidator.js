/**
 * Validate product data
 * @param {Object} product - Product object to validate
 * @param {string} sellerId - Seller ID (to check ownership)
 * @param {Array} existingProducts - Array of existing products for duplicate check
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
const validateProduct = (product, sellerId, existingProducts = []) => {
    const errors = [];
    
    // Convert values to appropriate types
    const normalizedProduct = normalizeProduct(product);
    
    // Required fields validation
    if (!normalizedProduct.name || normalizedProduct.name.toString().trim() === '') {
        errors.push('Product name is required');
    }
    
    if (!normalizedProduct.description || normalizedProduct.description.toString().trim() === '') {
        errors.push('Product description is required');
    }
    
    if (normalizedProduct.price === null || normalizedProduct.price === undefined || isNaN(normalizedProduct.price)) {
        errors.push('Product price is required and must be a number');
    } else if (normalizedProduct.price < 0) {
        errors.push('Product price cannot be negative');
    }
    
    if (!normalizedProduct.category || normalizedProduct.category.toString().trim() === '') {
        errors.push('Product category is required');
    }
    
    if (normalizedProduct.stock_quantity === null || normalizedProduct.stock_quantity === undefined || isNaN(normalizedProduct.stock_quantity)) {
        errors.push('Stock quantity is required and must be a number');
    } else if (normalizedProduct.stock_quantity < 0) {
        errors.push('Stock quantity cannot be negative');
    }
    
    // Category validation
    const validCategories = [
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
    ];
    
    if (normalizedProduct.category && !validCategories.includes(normalizedProduct.category)) {
        errors.push(`Invalid category: ${normalizedProduct.category}. Must be one of: ${validCategories.join(', ')}`);
    }
    
    // Price validations
    if (normalizedProduct.originalPrice !== null && normalizedProduct.originalPrice !== undefined) {
        if (isNaN(normalizedProduct.originalPrice)) {
            errors.push('Original price must be a number');
        } else if (normalizedProduct.originalPrice < 0) {
            errors.push('Original price cannot be negative');
        }
    }
    
    if (normalizedProduct.discount !== null && normalizedProduct.discount !== undefined) {
        if (isNaN(normalizedProduct.discount)) {
            errors.push('Discount must be a number');
        } else if (normalizedProduct.discount < 0 || normalizedProduct.discount > 100) {
            errors.push('Discount must be between 0 and 100');
        }
    }
    
    // Duplicate check by name
    if (normalizedProduct.name) {
        const duplicateByName = existingProducts.some(p => 
            p.name.toLowerCase() === normalizedProduct.name.toLowerCase()
        );
        if (duplicateByName) {
            errors.push(`Product with name "${normalizedProduct.name}" already exists`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        product: errors.length === 0 ? normalizedProduct : null
    };
};

/**
 * Normalize product data types
 * @param {Object} product - Product object
 * @returns {Object} Normalized product object
 */
const normalizeProduct = (product) => {
    const normalized = {};
    
    // String fields
    const stringFields = ['name', 'description', 'category'];
    stringFields.forEach(field => {
        normalized[field] = product[field] ? String(product[field]).trim() : '';
    });
    
    // Number fields
    const numberFields = ['price', 'originalPrice', 'discount', 'stock_quantity'];
    numberFields.forEach(field => {
        const value = product[field];
        normalized[field] = value !== null && value !== undefined && value !== '' ? Number(value) : null;
    });
    
    // Array fields (images)
    if (product.images) {
        if (Array.isArray(product.images)) {
            normalized.images = product.images.map(img => String(img).trim()).filter(img => img);
        } else {
            const images = String(product.images).split('|').map(img => img.trim()).filter(img => img);
            normalized.images = images.length > 0 ? images : ['/images/sample.jpg'];
        }
    } else {
        normalized.images = ['/images/sample.jpg'];
    }
    
    // Optional fields
    const optionalFields = ['brand', 'sku'];
    optionalFields.forEach(field => {
        if (product[field]) {
            normalized[field] = String(product[field]).trim();
        }
    });
    
    return normalized;
};

/**
 * Validate and prepare bulk product data
 * @param {Array} products - Array of product objects
 * @param {string} sellerId - Seller ID
 * @returns {Object} { validProducts: Array, invalidProducts: Array, summary: Object }
 */
const validateBulkProducts = (products, sellerId) => {
    if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
    }
    
    const validProducts = [];
    const invalidProducts = [];
    
    // First pass: collect all valid product names for duplicate checking
    const validNames = [];
    
    // Second pass: validate and prepare
    products.forEach((product, index) => {
        const validation = validateProduct(product, sellerId, validProducts);
        
        if (validation.isValid) {
            validProducts.push({
                ...validation.product,
                seller: sellerId,
                rowNumber: index + 1
            });
            validNames.push(validation.product.name.toLowerCase());
        } else {
            invalidProducts.push({
                rowNumber: index + 1,
                errors: validation.errors,
                product: product
            });
        }
    });
    
    return {
        validProducts,
        invalidProducts,
        summary: {
            total: products.length,
            valid: validProducts.length,
            invalid: invalidProducts.length,
            successRate: products.length > 0 ? Math.round((validProducts.length / products.length) * 100) : 0
        }
    };
};

module.exports = {
    validateProduct,
    normalizeProduct,
    validateBulkProducts
};
