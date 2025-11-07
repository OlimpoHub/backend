const Product = require('../models/product.model');

// GET /product
async function getAllPb(req, res) {
    try {
        const productes = await Product.fetchAll();
        res.status(200).json(productes);
    } catch (err) {
        console.log('Failure in getAllProducts, error:', err);
        res.status(500).json({ error: 'Failed to fetch all products' });
    }
}

// POST /product
async function addPb(req, res) {
    try {
        const content = req.body;
        const created = await Product.add(content);
        res.status(201).json(created);
    } catch (err) {
        console.error('Failure in addProducts, error:', err);
        res.status(500).json({ error: 'Failed to add product ' });
    }
}

module.exports = {
    getAllPb,
    getPbById,
    addPb,
    updatePb,
    removePb
};