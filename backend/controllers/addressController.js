const User = require('../models/User');

// @desc    Get all user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.addresses);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res, next) => {
    try {
        const { name, street, city, state, zipCode, country, phone, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        const newAddress = {
            name,
            street,
            city,
            state,
            zipCode,
            country: country || 'India',
            phone,
            isDefault: isDefault || user.addresses.length === 0
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json(user.addresses);
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
    try {
        const { name, street, city, state, zipCode, country, phone, isDefault } = req.body;
        const user = await User.findById(req.user._id);

        const address = user.addresses.id(req.params.id);

        if (!address) {
            res.status(404);
            throw new Error('Address not found');
        }

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        address.name = name || address.name;
        address.street = street || address.street;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.country = country || address.country;
        address.phone = phone || address.phone;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        
        // If we deleted the default address, make another one default if available
        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        next(error);
    }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === req.params.id;
        });

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
