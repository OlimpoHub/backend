const database = require("../utils/db");

module.exports = class Supplies {
    constructor(
        idTaller,
        nombre,
        unidadMedida,
        idCategoria,
        imagenInsumo,
        status
    ) {
        this.idTaller = idTaller;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.idCategoria = idCategoria;
        this.imagenInsumo = imagenInsumo;
        this.status = status;
    }

    static async fetchAll() {
        try {
            const rows = await database.query(
                "SELECT nombre, imagenInsumo FROM Insumo"
            );
            return rows;
        } catch (err) {
            console.error("Error al obtener catalogo de insumos:", err);
            throw err;
        }
    }

    // Search supplies by name
    static async searchSupplies(value) {
        try {
            const rows = await database.query(
                "SELECT idInsumo, nombre, imagenInsumo FROM Insumo WHERE nombre LIKE ?",
                [`%${value}%`]
            );
            return rows;
        } catch (err) {
            console.error("Error al buscar insumos: ", err);
            throw err;
        }
    }

    // Filter supplies by category, measure, or workshop
    static async filter(type, value) {
        try {
            if (type == "category") {
                const rows = await database.query(
                    "SELECT i.idInsumo, i.nombre, i.imagenInsumo FROM Insumo i, Categoria c WHERE i.idCategoria = c.idCategoria AND c.descripcion = ?",
                    [value]
                );
                return rows;
            } else if (type == "measure") {
                const rows = await database.query(
                    "SELECT idInsumo, nombre, imagenInsumo FROM Insumo WHERE unidadMedida = ?",
                    [value]
                );
                return rows;
            } else if (type == "workshop") {
                const rows = await database.query(
                    "SELECT i.idInsumo, i.nombre, i.imagenInsumo FROM Insumo i, Taller t WHERE i.idTaller = t.idTaller AND t.nombreTaller = ?",
                    [value]
                );
                return rows;
            }
        } catch (err) {
            console.error("Error al buscar insumos: ", err);
            throw err;
        }
    }

    // Order supplies by name (asc or desc)
    static async orderSupplies(value) {
        try {
            if (value == "asc") {
                const rows = await database.query(
                    "SELECT idInsumo, nombre, imagenInsumo FROM Insumo ORDER BY nombre ASC"
                );
                return rows;
            } else if (value == "desc") {
                const rows = await database.query(
                    "SELECT idInsumo, nombre, imagenInsumo FROM Insumo ORDER BY nombre DESC"
                );
                return rows;
            }
        } catch (err) {
            console.error("Error al ordenar insumos: ", err);
            throw err;
        }
    }
};
