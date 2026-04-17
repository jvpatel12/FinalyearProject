const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountAmount, minOrderAmount, expiryDate, usageLimit } = req.body;

        const couponExists = await Coupon.findOne({ code });

        if (couponExists) {
            res.status(400);
            throw new Error('Coupon code already exists');
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountAmount,
            minOrderAmount,
            expiryDate,
            usageLimit
        });

        res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
};

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            res.status(404);
            throw new Error('Invalid or inactive coupon code');
        }

        if (coupon.isExpired()) {
            res.status(400);
            throw new Error('Coupon has expired');
        }

        if (coupon.isLimitReached()) {
            res.status(400);
            throw new Error('Coupon usage limit reached');
        }

        if (orderAmount < coupon.minOrderAmount) {
            res.status(400);
            throw new Error(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
        }

        res.json({
            success: true,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount,
            code: coupon.code
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404);
            throw new Error('Coupon not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCoupons,
    createCoupon,
    validateCoupon,
    deleteCoupon
};
