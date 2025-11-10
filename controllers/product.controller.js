const Product = require('../models/product.model');

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

exports.getOneProduct = async (request, response) => {
    try {
        const id = request.params.idProduct;
        // Success
        const product = await Product.fetchOne(id);
        response.status(200).json(product);
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to consult products", err });
    }
}