const Beneficiary = require('../models/beneficiary.model');

exports.get_beneficiaries = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.fetchAll();
        res.status(200).json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ message: 'Failed to fetch beneficiaries.' });
    }
};

exports.get_beneficiary = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await Beneficiary.fetchById(id);
        res.status(200).json(data);
    } catch {
        res.status(500).json({ message: 'Failed to fetch beneficiary.' });
    }
};