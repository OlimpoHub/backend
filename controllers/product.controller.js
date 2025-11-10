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
        const id = request.params.idProducto;
        // Success
        const product = await Product.fetchOne(id);

        if (!product) {
            return response.status(404).json({ message: "Product not found" });
        }
        
        // 2. Desestructurar los campos del objeto único 'product'
        // NOTA: Los nombres de campo deben coincidir con los alias de tu SELECT en product.model.js (e.g., CategoriaDescripcion)
        const { 
            Nombre, 
            PrecioUnitario, 
            nombreTaller, 
            CategoriaDescripcion, 
            Descripcion, 
            Disponible, 
            imagen 
        } = product;
        
        // 3. Construir la respuesta JSON estructurada
        // Adaptamos la estructura según tus necesidades, extrayendo los campos principales
        response.status(200).json({ 
            Nombre: Nombre,
            PrecioUnitario: PrecioUnitario,
            Disponible: Disponible,
            // Agrupamos el resto de detalles si quieres una estructura anidada, o los dejamos planos:
            Detalles: {
                Taller: nombreTaller,
                Categoria: CategoriaDescripcion,
                DescripcionProducto: Descripcion,
                ImagenURL: imagen
            }
        });
    } catch (err) {
        // Error
        response.status(500).json({ message: "Failed to consult products", err });
    }
}