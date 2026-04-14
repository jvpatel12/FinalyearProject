const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    reply: {
        type: String
    }
}, {
    timestamps: true
});

// Calculate average rating after save/remove
reviewSchema.statics.calcAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj.length > 0) {
            await this.model('Product').findByIdAndUpdate(productId, {
                averageRating: Math.ceil(obj[0].averageRating * 10) / 10,
                numReviews: obj[0].numReviews
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                averageRating: 0,
                numReviews: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Call calcAverageRating after review is saved
reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.product);
});

// Call calcAverageRating before review is removed
reviewSchema.pre('remove', function () {
    this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
