const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require("jsonwebtoken");

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
