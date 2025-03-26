const jwt = require('jsonwebtoken');
const config = require('./config.json');
const { users, products } = require('./db');

// UTILS

const getProduct = async (productId) => {
    try {
        return await products.findById(productId);
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

const verifyAuth = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization header must start with Bearer"
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);
            if (!decoded.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format"
                });
            }

            // Find user
            const user = await users.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Set user in request object
            req.user = user;
            next();
        } catch (jwtError) {
            console.error("JWT verification error:", jwtError);
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired"
                });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error("Auth error:", error);
        return handleError(res, error);
    }
};

const handleError = (res, err) => {
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = {
    handleError,
    verifyAuth,
    getProduct
};
