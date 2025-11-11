const { request } = require('http');
const Product = require('../models/product.model');
const Workshops = require('../models/workshops.model');
const Category = require('../models/category.model');
const { response } = require('express');

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