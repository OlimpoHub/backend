const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require("jsonwebtoken");

/**
 * authenticateToken
 * --------------------------------------------------------
 * Middleware that validates the access token sent in the
 * Authorization header. If the JWT is valid, the decoded
 * user data is attached to the request and execution
 * continues. Otherwise, the request is rejected.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.headers.authorization - Header containing "Bearer <token>"
 * @param {Object} res - Express response object
 * @param {Function} next - Moves execution to the next middleware/handler
 * 
 * @returns {void} Sends a 401 response if token is missing or invalid
 */
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "Invalid access token" });

        req.user = user;
        next();
    });
};
