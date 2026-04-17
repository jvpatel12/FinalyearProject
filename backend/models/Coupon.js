const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please add a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountAmount: {
        type: Number,
        required: [true, 'Please add a discount amount']
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please add an expiry date']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to check if expired
couponSchema.methods.isExpired = function() {
    return new Date() > this.expiryDate;
};

// Middleware to check if usage limit reached
couponSchema.methods.isLimitReached = function() {
    if (this.usageLimit === null) return false;
    return this.usedCount >= this.usageLimit;
};

module.exports = mongoose.model('Coupon', couponSchema);
