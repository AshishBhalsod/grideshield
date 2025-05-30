const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Access denied. No token provided.',
            data: {},
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user data (e.g., id, username/email, usertype)
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or expired token.',
            data: {},
        });
    }
};

module.exports = auth;