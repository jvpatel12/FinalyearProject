const jwt = require('jsonwebtoken');

// Generate Access Token (Short Expiry)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '7d'
    });
};

// Generate Refresh Token (Long Expiry - Use in HttpOnly Cookie)
const generateRefreshToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refreshsecret123', {
        expiresIn: '15m'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Set to true in prod (HTTPS)
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days in milliseconds
    });
};

module.exports = { generateToken, generateRefreshToken };
