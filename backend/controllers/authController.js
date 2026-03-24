const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("Incoming email:", email);
        console.log("Incoming password:", password);

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        console.log("User found:", user);

        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }
        console.log("Stored password:", user.password);
        const isMatch = await user.matchPassword(password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        generateRefreshToken(res, user._id);

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        next(error);
    }
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer',
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        });

        if (user) {
            generateRefreshToken(res, user._id);

            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    avatar: user.avatar
                },
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    address: user.address || {}
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
    loginUser,
    registerUser,
    getUserProfile,
    logoutUser
};
