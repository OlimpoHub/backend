const Calendar = require('../models/calendar.model');
const jwt = require("jsonwebtoken");
const tokenUtils = require("../utils/token.utils");

exports.getCalendar = async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, tokenUtils.ACCESS_SECRET);
    const userId = decoded.id;
    console.log(userId)

    try {
        const data = await Calendar.fetchById(userId);
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: 'Failed to fetch calendar Info.' });
    }
};