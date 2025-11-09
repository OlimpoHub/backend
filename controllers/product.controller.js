const Product = require('../models/product.model');

// POST /product
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

        console.log(product);

        await product.save();
        response.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        response.status(500).json({ message: "Failed to add a product", err });
    }
}