const jwt = require("jsonwebtoken");
const tokenUtils = require("../utils/token.utils");
const users = require("../models/user.model");

exports.post_login = (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const { password: _, ...userResponse } = user;
    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    res.json({
        user: userResponse,
        accessToken,
        refreshToken,
    });
};

exports.post_refresh = (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token required" });

    jwt.verify(token, tokenUtils.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid refresh token" });

        const user = users.find((u) => u.id === decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
};
