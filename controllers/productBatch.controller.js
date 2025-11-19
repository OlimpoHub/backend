const ProductBatch = require('../models/productBatch.model');

// GET /productBatch
async function getAllPb(req, res) {
    try {
        const productBatches = await ProductBatch.fetchAll();
        res.status(200).json(productBatches);
    } catch (err) {
        console.log('Failure in getAll, error:', err);
        res.status(500).json({ error: 'Failed to fetch product batches' });
    }
}

// GET /productBatch/:id
async function getPbById(req, res) {
    try {
        const id = req.params.idProductBatch;
        const productBatch = await ProductBatch.fetchById(id);
        if (!productBatch || productBatch.length === 0) {
            res.status(404).json({ error: 'Product batch not found' });
            return;
        }
        res.json(productBatch);
    } catch (err) {
        console.error('Failure in getById, error:', err);
        res.status(500).json({ error: 'Failed to fetch product batch' });
    }
}

// POST /productBatch
async function addPb(req, res) {
    try {
        const content = req.body;
        const created = await ProductBatch.add(content);
        res.status(201).json(created);
    } catch (err) {
        console.error('Failure in addPb, error:', err);
        res.status(500).json({ error: 'Failed to add product batch' });
    }
}

// PUT /productBatch/:id
async function updatePb(req, res) {
    try {
        const id = req.params.idProductBatch;
        const content = req.body;
        const updated = await ProductBatch.update(id, content);
        if (!updated) {
            res.status(404).json({ error: 'Product batch not found' });
            return;
        }
        res.json(updated);
    } catch (err) {
        console.error('Failure in updatePb, error:', err);
        res.status(500).json({ error: 'Failed to update product batch' });
    }
}

// DELETE /productBatch/:id
async function removePb(req, res) {
    try {
        const id = req.params.idProductBatch;
        const deleted = await ProductBatch.remove(id); // or .delete
        if (!deleted) {
            res.status(404).json({ error: 'Product batch not found' });
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.error('Failure in removePb, error:', err);
        res.status(500).json({ error: 'Failed to delete product batch' });
    }
}

// SEARCH /productBatch/search?q=term
async function searchPb(req, res) {
    try {
        const term = req.query.q;
        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }
        const results = await ProductBatch.search(term);
        res.status(200).json(results);
    } catch (err) {
        console.error("Failure in searchPb, error:", err);
        res.status(500).json({ error: "Failed to search product batches" });
    }
}

// GET /productBatch/order?orderBy=PrecioVenta&direction=DESC
async function getOrderedPb(req, res) {
    try {
        const { orderBy, direction } = req.query;
        const results = await ProductBatch.fetchAllWithOrder(orderBy, direction);
        res.status(200).json(results);
    } catch (err) {
        console.error("Failure in getOrderedPb, error:", err);
        res.status(500).json({ error: "Failed to fetch ordered product batches" });
    }
}

async function filterPricePb(req, res) {
    try {
        const { minPrecio, maxPrecio } = req.query;
        const result = await ProductBatch.filterPrice({ minPrecio, maxPrecio });
        res.status(200).json(result);
    } catch (err) {
        console.error("Failure in filterPricePb:", err);
        res.status(500).json({ error: "Failed to filter by price" });
    }
}

async function filterDisponiblePb(req, res) {
    try {
        const { disponible } = req.query;
        const result = await ProductBatch.filterDisponible({ disponible });
        res.status(200).json(result);
    } catch (err) {
        console.error("Failure in filterDisponiblePb:", err);
        res.status(500).json({ error: "Failed to filter by availability" });
    }
}

async function filterDatePb(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const result = await ProductBatch.filterDate({ startDate, endDate });
        res.status(200).json(result);
    } catch (err) {
        console.error("Failure in filterDatePb:", err);
        res.status(500).json({ error: "Failed to filter by date" });
    }
}

async function filterPb(req, res) {
  try {
    // Espera un body con { filters: {...}, order: "ASC" | "DESC" }
    const { filters = {}, order = "ASC" } = req.body;

    // Validación simple de order
    const dir = (order || "ASC").toUpperCase();
    const safeOrder = dir === "DESC" ? "DESC" : "ASC";

    const result = await ProductBatch.filterMultiple(filters, safeOrder);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failure in filterPb:", err);
    res.status(500).json({ error: "Failed to filter product batches" });
  }
}

module.exports = {
    getAllPb,
    getPbById,
    addPb,
    updatePb,
    removePb,
    searchPb,
    getOrderedPb,
    filterPricePb,
    filterDisponiblePb,
    filterDatePb,
    filterPb,
};
