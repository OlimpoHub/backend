const Disability = require('../models/disabilities.model');

// Fucnion para BEN-001
exports.fetchAll = async (req, res) => {
    // Llama todas las dispacidades para la vista de BEN-001
    try {
        const disabilities = await Disability.fetchAll();
        res.status(200).json(disabilities);
    } catch (error) {
        console.error('Error fetching disabilities:', error);
        res.status(500).json({ message: 'Failed to fetch disabilities.' });
    }

}