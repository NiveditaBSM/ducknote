require('dotenv').config({ path: '../.env' })
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('request: ', req)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken