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
                    nombre, 
                    precioUnidario, 
                    idCategoría, 
                    descripcion, 
                    imagen, 
                    disponible
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

};
