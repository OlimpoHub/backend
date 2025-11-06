const database = require("../utils/db");

module.exports = class ProductBatch {
    constructor(
        idProducto,
        precioVenta,
        cantidadProducida,
        fechaCaducidad,
        fechaRealizacion
    ) {
        this.idProducto = idProducto;
        this.precioVenta = precioVenta;
        this.cantidadProducida = cantidadProducida;
        this.fechaCaducidad = fechaCaducidad;
        this.fechaRealizacion = fechaRealizacion;
    }

    // Fetch a list of products with their inventory batches (grouped by product)
    static async fetchAll() {
        try {
            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                    p.idProducto, p.Descripcion, p.Disponible,
                    inv.idInventario, inv.CantidadProducida,
                    inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv
                    ON p.idProducto = inv.idProducto
                GROUP BY p.idProducto, p.Nombre, p.imagen`
            );
            return rows;
        } catch (err) {
            console.error("Error fetching product batches", err);
            throw err;
        }
    }

    // Fetch for a single product id
    static async fetchById(id) {
        try {
            const rows = await database.query(
                `SELECT p.idProducto, p.Nombre, p.PrecioUnitario,
                    p.Descripcion, p.imagen, p.Disponible,
                    inv.idInventario, inv.PrecioVenta,
                    inv.CantidadProducida, inv.FechaCaducidad,
                    inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv
                    ON inv.idProducto = p.idProducto
                WHERE p.idProducto = ?`, [id]
            );
            return rows;
        } catch (err) {
            console.error("Error fetching one product batch", err);
            throw err;
        }
    }

    static async add(content) {
        try {
            const idInventario = content.idInventario || require('crypto').randomUUID();
            const { idProducto, precioVenta, cantidadProducida, fechaCaducidad, fechaRealizacion } = content;
            const result = await database.query(
                `INSERT INTO InventarioProductos (idInventario, idProducto, PrecioVenta, CantidadProducida, FechaCaducidad, FechaRealizacion)
                VALUES (?, ?, ?, ?, ?, ?)`, [idInventario, idProducto, precioVenta, cantidadProducida, fechaCaducidad || null, fechaRealizacion || null]
            );
            return { idInventario, ...content };
        } catch (err) {
            console.error("Error creating product batch", err);
            throw err;
        }
    }

    static async update(id, content) {
        try {
            const allowed = ['idProducto', 'PrecioVenta', 'CantidadProducida', 'FechaCaducidad', 'FechaRealizacion'];
            // Safe keys filtering
            const keys = Object.keys(content).filter(k => allowed.includes(k));
            if (keys.length === 0) return null;
            const setClause = keys.map(k => `${k} = ?`).join(', ');
            const values = keys.map(k => content[k]);
            const result = await database.query(
                `UPDATE InventarioProductos SET ${setClause} WHERE idInventario = ?`, [...values, id]
            );
            if (result.affectedRows && result.affectedRows > 0) {
                return { id, ...content };
            }
            return null;
        } catch (err) {
            console.error("Error updating product batch", err);
            throw err;
        }
    }

    static async remove(id) {
        try {
            const result = await database.query(
                `DELETE FROM InventarioProductos WHERE idInventario = ?`, [id]
            );
            return result.affectedRows && result.affectedRows > 0;
        } catch (err) {
            console.error("Error deleting product batch", err);
            throw err;
        }
    }
}
