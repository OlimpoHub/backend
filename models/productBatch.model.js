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
                ORDER BY p.Nombre, inv.FechaRealizacion DESC`
            );
            return rows;
        } catch (err) {
            console.error("Error fetching product batches", err);
            throw err;
        }
    }

    // Fetch one product batch by inventory id
    static async fetchByInventoryId(idInventario) {
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
                WHERE inv.idInventario = ?`, [idInventario]
            );
            return rows;
        } catch (err) {
            console.error("Error fetching product batch by inventory id", err);
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
            const {
                idProducto,
                precioVenta,
                cantidadProducida,
                fechaCaducidad,
                fechaRealizacion
            } = content;
            const result = await database.query(
                `INSERT INTO InventarioProductos (idInventario, idProducto, PrecioVenta, CantidadProducida, FechaCaducidad, FechaRealizacion)
                VALUES (?, ?, ?, ?, ?, ?)`, [
                idInventario,
                idProducto,
                precioVenta,
                cantidadProducida,
                fechaCaducidad || null,
                fechaRealizacion || null
            ]
            );
            return { idInventario, ...content };
        } catch (err) {
            console.error("Error creating product batch", err);
            throw err;
        }
    }

    static async update(id, content) {
        try {
            const allowed = [
                'idProducto',
                'PrecioVenta',
                'CantidadProducida',
                'FechaCaducidad',
                'FechaRealizacion'
            ];
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
                `DELETE FROM InventarioProductos WHERE idInventario = ?`,
                [
                    id
                ]
            );
            return result.affectedRows && result.affectedRows > 0;
        } catch (err) {
            console.error("Error deleting product batch", err);
            throw err;
        }
    }

    static async search(term) {
        try {
            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                        p.idProducto, p.Descripcion, p.Disponible,
                        inv.idInventario, inv.CantidadProducida,
                        inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                 FROM Productos p
                 JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                 WHERE p.Nombre LIKE ? OR p.Descripcion LIKE ?`,
                [
                    `%${term}%`,
                    `%${term}%`
                ]
            );
            return rows;
        } catch (err) {
            console.error("Error searching product batches", err);
            throw err;
        }
    }

    static async fetchAllWithOrder(orderBy = "p.Nombre", direction = "ASC") {
        try {
            const validColumns = [
                "p.Nombre",
                "PrecioVenta",
                "CantidadProducida",
                "FechaCaducidad",
                "FechaRealizacion"
            ];
            if (!validColumns.includes(orderBy)) orderBy = "p.Nombre";
            if (!["ASC", "DESC"].includes(direction.toUpperCase())) direction = "ASC";

            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                        p.idProducto, p.Descripcion, p.Disponible,
                        inv.idInventario, inv.CantidadProducida,
                        inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                 FROM Productos p
                 JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                 ORDER BY ${orderBy} ${direction}`
            );
            return rows;
        } catch (err) {
            console.error("Error fetching ordered product batches", err);
            throw err;
        }
    }

    // Filtrar por precio (rango o valor único)
    static async filterPrice({ minPrecio, maxPrecio }) {
        try {
            let conditions = [];
            let values = [];

            if (minPrecio !== undefined) {
                conditions.push("inv.PrecioVenta >= ?");
                values.push(parseFloat(minPrecio));
            }
            if (maxPrecio !== undefined) {
                conditions.push("inv.PrecioVenta <= ?");
                values.push(parseFloat(maxPrecio));
            }

            const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                        p.idProducto, p.Descripcion, p.Disponible,
                        inv.idInventario, inv.CantidadProducida,
                        inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                ${whereClause}`,
                values
            );
            return rows;
        } catch (err) {
            console.error("Error filtering by price", err);
            throw err;
        }
    }

    // Filtrar por disponibilidad
    static async filterDisponible({ disponible }) {
        try {
            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                        p.idProducto, p.Descripcion, p.Disponible,
                        inv.idInventario, inv.CantidadProducida,
                        inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                WHERE p.Disponible = ?`,
                [
                    disponible
                ]
            );
            return rows;
        } catch (err) {
            console.error("Error filtering by availability", err);
            throw err;
        }
    }

    // Filtrar por rango de fechas
    static async filterDate({ startDate, endDate }) {
        try {
            let conditions = [];
            let values = [];

            if (startDate) {
                conditions.push("inv.FechaRealizacion >= ?");
                values.push(startDate);
            }
            if (endDate) {
                conditions.push("inv.FechaRealizacion <= ?");
                values.push(endDate);
            }

            const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

            const rows = await database.query(
                `SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                        p.idProducto, p.Descripcion, p.Disponible,
                        inv.idInventario, inv.CantidadProducida,
                        inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                ${whereClause}`,
                [
                    values
                ]
            );
            return rows;
        } catch (err) {
            console.error("Error filtering by date", err);
            throw err;
        }
    }

    static async filterMultiple(filters = {}, order = "ASC") {
        try {
            const conditions = [];
            const values = [];

            // Filtrar por nombre del producto
            if (filters.nombre && Array.isArray(filters.nombre) && filters.nombre.length) {
                conditions.push("p.Nombre IN (?)");
                values.push(filters.nombre);
            }

            // Filtrar por precio de venta
            if (filters.precioVenta && Array.isArray(filters.precioVenta) && filters.precioVenta.length) {
                conditions.push("inv.PrecioVenta IN (?)");
                values.push(filters.precioVenta.map(Number)); // asegurar números
            }

            // Filtrar por cantidad producida
            if (filters.cantidadProducida && Array.isArray(filters.cantidadProducida) && filters.cantidadProducida.length) {
                conditions.push("inv.CantidadProducida IN (?)");
                values.push(filters.cantidadProducida.map(Number));
            }

            // Filtrar por fecha de creación
            if (filters.fechaRealizacion && Array.isArray(filters.fechaRealizacion) && filters.fechaRealizacion.length) {
                conditions.push("inv.FechaRealizacion IN (?)");
                values.push(filters.fechaRealizacion);
            }

            // Construcción del WHERE
            const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

            // Ordenamiento por nombre del producto
            const dir = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

            const query = `
                SELECT p.Nombre, p.imagen, p.PrecioUnitario,
                    p.idProducto, p.Descripcion, p.Disponible,
                    inv.idInventario, inv.CantidadProducida,
                    inv.PrecioVenta, inv.FechaCaducidad, inv.FechaRealizacion
                FROM Productos p
                JOIN InventarioProductos inv ON p.idProducto = inv.idProducto
                ${whereClause}
                ORDER BY p.Nombre ${dir}
            `;

            const rows = await database.query(query, values);
            return rows;
        } catch (err) {
            console.error("Error filtering by multiple criteria", err);
            throw err;
        }
    }

}
