const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Generate a short-lived access token (15 minutes) including user ID and role
const generateAccessToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: "15m",
    });

// Generate a long-lived refresh token (30 days) including only user ID
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