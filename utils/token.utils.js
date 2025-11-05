const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateAccessToken = (user) =>
    jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, {
        expiresIn: "10s",
    });

const generateRefreshToken = (user) =>
    jwt.sign({ id: user.id }, REFRESH_SECRET, {
        expiresIn: "30s",
    });

module.exports = {
    ACCESS_SECRET,
    REFRESH_SECRET,
    generateAccessToken,
    generateRefreshToken,
};