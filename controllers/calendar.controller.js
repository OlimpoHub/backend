const Calendar = require('../models/calendar.model');

exports.get_calendar = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await Calendar.fetchById(id);
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: 'Failed to fetch calendar Info.' });
    }
};