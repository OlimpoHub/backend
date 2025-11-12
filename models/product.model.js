const database = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

module.exports = class Products {
    constructor(
        miIdTaller,
        miNombre,
        miPrecioUnitario,
        miIdCategoria,
        miDescripcion,
        miImagen,
        miDisponible,
    ) {
        this.idProducto = uuidv4();
        this.idTaller = miIdTaller;
        this.nombre = miNombre;
        this.precioUnitario = miPrecioUnitario;
        this.idCategoria = miIdCategoria;
        this.descripcion = miDescripcion;
        this.imagen = miImagen;
        this.disponible = miDisponible;
    }

    // Add a new product
    async save() {
        try {
            const result = await database.query (
                `INSERT INTO Productos 
                (
                    idProducto, 
                    idTaller, 
                    Nombre, 
                    PrecioUnitario, 
                    idCategoria, 
                    Descripcion, 
                    imagen, 
                    Disponible
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.idProducto,
                    this.idTaller,
                    this.nombre,
                    this.precioUnitario,
                    this.idCategoria,
                    this.descripcion,
                    this.imagen,
                    this.disponible,
                ]
            );
            return result;
        } catch (err) {
            console.log("Error adding a new product", err);
            throw err;
        }
    }

    // Consult all products
    static async fetchAll() {
        try {
            const rows = await database.query
            (
                `SELECT p.Nombre, p.PrecioUnitario, t.nombreTaller 
                 FROM Productos as p, Taller as t 
                 WHERE p.idTaller = t.idTaller`
            );
            console.log("ROWS:", rows);
            return rows; // Return the result 
        } catch (err) {
            console.error("Error fetching products:", err);
            throw err;
        }
    }

    // Consult one product
    static async fetchOne(id) {
        try{
            const rows = await database.query
            (
                `SELECT p.Nombre, p.PrecioUnitario, t.nombreTaller, 
                        c.Descripcion AS Categoria, p.Disponible, 
                        p.Descripcion, p.imagen 
                 FROM Productos as p, Taller as t, Categoria as c 
                 WHERE p.idTaller = t.idTaller 
                   and p.idCategoria = c.idCategoria 
                   and p.idProducto = ?`, [id]
            );

            return rows.length > 0 ? rows[0] : null;
        } catch(err) {
            console.log("Error fetching one product", err);
            throw err;
        }
    }

    // Update a product
    static async update(id, product) {
        try {

            const result = await database.query (
                `UPDATE Productos 
                 SET nombre = ?, imagen = ?, PrecioUnitario = ?, 
                     idTaller = ?, idCategoria = ?, Disponible = ?, 
                     Descripcion = ? 
                 WHERE idProducto = ?`,
                [
                    product.Nombre,
                    product.imagen,
                    product.PrecioUnitario,
                    product.idTaller,
                    product.idCategoria,
                    product.Disponible,
                    product.Descripcion,
                    id
                ]
            );
            return result;
        } catch (err) {
            console.log("Error adding a new product", err);
            throw err;
        }
    }

};
