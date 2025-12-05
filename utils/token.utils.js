const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * generateAccessToken
 * --------------------------------------------------------
 * Creates a short-lived JWT access token (15 minutes)
 * containing the user's ID and role. This token is used
 * for authenticating protected API routes.
 * 
 * @param {Object} user - User payload for the token
 * @param {number|string} user.id - User identifier
 * @param {string} user.role - User role for authorization
 * 
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: "15m",
    });

/**
 * generateRefreshToken
 * --------------------------------------------------------
 * Creates a long-lived JWT refresh token (30 days) that
 * stores only the user ID. This token is used to issue
 * new access tokens without requiring the user to log in
 * again, as long as the refresh token remains valid.
 * 
 * @param {Object} user - User payload for the token
 * @param {number|string} user.id - User identifier
 * 
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (user) =>
    jwt.sign({ id: user.id }, REFRESH_SECRET, {
        expiresIn: "30d",
    });

module.exports = {
    ACCESS_SECRET,
    REFRESH_SECRET,
    generateAccessToken,
    generateRefreshToken,
};