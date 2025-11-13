const { request } = require('http');
const Product = require('../models/product.model');
const Workshops = require('../models/workshops.model');
const Category = require('../models/category.model');
const { response } = require('express');

// GET: Names needed for register a product (categories, workshops)
exports.getRegisterProduct = async (request, response) => {
    try {
        // Success
        const workshops = await Workshops.getName();
        const categories = await Category.getDescriptions();

        response.status(200).json({
            "Categories": categories,
            "Workshops": workshops,
        });
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to consult products", err });
    }
}

// POST /product: register a new product
exports.postRegisterProduct = async (request, response) => {
    try {
        const product = new Product (
            request.body.idTaller,
            request.body.Nombre,
            request.body.PrecioUnitario,
            request.body.idCategoria,
            request.body.Descripcion,
            request.body.imagen,
            request.body.Disponible,
        );

        // Success
        await Product.save();
        response.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to add a product", err });
    }
}

// GET: Consult all products
exports.getProducts = async (request, response) => {
    try {
        // Success
        const products = await Product.fetchAll();
        response.status(200).json(products);
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to consult products", err });
    }
}

// GET: Consult one product
exports.getOneProduct = async (request, response) => {
    try {
        const id = request.params.idProduct;
        // Success
        const product = await Product.fetchOne(id);
        response.status(200).json(product);
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to consult product", err });
    }
}

// PUT: modify an excisting product
exports.updateProduct = async (request, response) => {
    try {        
        const id = request.params.idProduct;
        
        const idTaller = await Workshops.getId(request.body.nombreTaller); 
        const idCategoria = await Category.getId(request.body.Categoria);
        
        const productData = {
            idTaller: idTaller,
            Nombre: request.body.Nombre,
            PrecioUnitario: request.body.PrecioUnitario,
            idCategoria: idCategoria,
            Descripcion: request.body.Descripcion,
            imagen: request.body.imagen,
            Disponible: request.body.Disponible,
        };

        await Product.update(id, productData); 

        // Success
        response.status(200).json({ message: "Product modified successfully" }); 
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to modify a product", err });
    }
}

// DELETE /product/:idProduct
exports.deleteProduct = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const deleted = await Product.remove(idProduct);

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 204 No Content
    return res.status(204).send();
  } catch (err) {
    console.error('Failure in deleteProduct, error:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

// GET /product/search
exports.searchP = async (req, res) => {
  try {
    const term = (req.query.q || '').trim();
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    const results = await Product.search(term);
    return res.status(200).json(results);
  } catch (err) {
    console.error('Failure in searchP, error:', err);
    return res.status(500).json({ error: 'Failed to search product' });
  }
};

// GET /product/order?orderBy=p.Nombre&direction=ASC|DESC
exports.getOrderedP = async (req, res) => {
  try {
    const { orderBy, direction } = req.query;
    const results = await Product.fetchAllWithOrder(orderBy, direction);
    return res.status(200).json(results);
  } catch (err) {
    console.error('Failure in getOrderedP, error:', err);
    return res.status(500).json({ error: 'Failed to fetch ordered products' });
  }
};

// GET /product/filter/price?minPrecio=10&maxPrecio=50
exports.filterPriceP = async (req, res) => {
  try {
    const { minPrecio, maxPrecio } = req.query;
    const result = await Product.filterPrice({ minPrecio, maxPrecio });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Failure in filterPriceP:', err);
    return res.status(500).json({ error: 'Failed to filter by price' });
  }
};

// GET /product/filter/disponible?disponible=1
exports.filterDisponibleP = async (req, res) => {
  try {
    const { disponible } = req.query;
    const result = await Product.filterDisponible({ disponible });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Failure in filterDisponibleP:', err);
    return res.status(500).json({ error: 'Failed to filter by availability' });
  }
};

// GET /product/filter/category?idCategoria=CAT-01
exports.filterCategoriaP = async (req, res) => {
  try {
    const { idCategoria } = req.query;
    if (!idCategoria) return res.status(400).json({ error: 'idCategoria is required' });
    const result = await Product.filterByCategory({ idCategoria });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Failure in filterCategoriaP:', err);
    return res.status(500).json({ error: 'Failed to filter by category' });
  }
};

// GET /product/filter/workshop?idTaller=T-01
exports.filterTallerP = async (req, res) => {
  try {
    const { idTaller } = req.query;
    if (!idTaller) return res.status(400).json({ error: 'idTaller is required' });
    const result = await Product.filterByWorkshop({ idTaller });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Failure in filterTallerP:', err);
    return res.status(500).json({ error: 'Failed to filter by workshop' });
  }
};
