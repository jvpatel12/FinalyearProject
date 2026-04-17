const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a product description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    stock_quantity: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    category: {
        type: String,
        required: [true, 'Please select a category']
    },
    subCategory: {
        type: String,
        default: ''
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
