const database = require("../utils/db");

/**
 * Represents a supply batch record in the inventory.
 * Provides static methods for CRUD and filter operations.
 */
module.exports = class SupplyBatch {
    constructor(
        idInventario,
        idInsumos,
        cantidadActual,
        fechaCaducidad,
        idTipoAdquisicion
    ) {
        this.idInventario = idInventario;
        this.idInsumos = idInsumos;
        this.cantidadActual = cantidadActual;
        this.fechaCaducidad = fechaCaducidad;
        this.idTipoAdquisicion = idTipoAdquisicion;
    }

    /**
     * Fetches all supply batches with their associated supplies.
     */
    static async fetchAll() {
        try {
            const rows = await database.query(
                `SELECT i.nombre, i.imagenInsumo, i.unidadMedida, 
                        i.idInsumo, inv.idInventario, inv.cantidadActual, 
                        inv.fechaCaducidad
                FROM Insumo i
                JOIN InventarioInsumos inv ON i.idInsumo = inv.idInsumo
                GROUP BY i.idInsumo, i.nombre, i.imagenInsumo`
            );
            return rows;
        } catch (err) {
            console.log("Error fetching supply batch ", err);
            throw err;
        }
    }

    /**
     * Fetches one specific supply and its batch details.
     * @param {string} id - The ID of the supply.
     */
    static async fetchOne(id) {
        const status = 1;

        try {
            const [rows] = await database.query(
                `SELECT 
                    i.idInsumo, i.nombre, i.unidadMedida, i.imagenInsumo,
                    inv.FechaCaducidad, SUM(inv.CantidadActual) AS cantidad, 
                    t.nombreTaller, c.Descripcion, i.status, 
                    ta.Descripcion AS adquisicion
                FROM Insumo i
                LEFT JOIN InventarioInsumos inv 
                    ON inv.IdInsumo = i.idInsumo
                JOIN TipoAdquisicion ta
                    ON ta.idTipoAdquisicion = inv.idTipoAdquisicion
                JOIN Taller t
                    ON t.idTaller = i.idTaller
                JOIN Categoria c
                    ON c.idCategoria = i.idCategoria
                WHERE i.idInsumo = ? 
                    AND i.status = ?
                GROUP BY i.idInsumo, inv.FechaCaducidad`,
                [id, status]
            );
            return Array.isArray(rows) ? rows : [rows];
        } catch (err) {
            console.log("Error fetching one supply batch", err);
            throw err;
        }
    }

    /**
     * Inserts a new supply batch record into the database.
     */
    static async addSupply(supplyId, quantity, expirationDate, acquisitionId, boughtDate) {
        try {
            const result = await database.query(
                `INSERT INTO InventarioInsumos (
                    idInsumo, CantidadActual, FechaActualizacion, FechaCaducidad, idTipoAdquisicion
                ) VALUES (?, ?, ?, ?, ?)`,
                [supplyId, quantity, boughtDate, expirationDate, acquisitionId]
            );
            console.log("NEW SUPPLY ADDED: ", result);
            return result;
        } catch (err) {
            console.error("Error adding supply: ", err);
            throw err;
        }
    }

    /**
     * Deletes a supply batch by its inventory ID.
     */
    static async delete(inventoryId) {
        try {
            const result = await database.execute(
                `DELETE FROM InventarioInsumos WHERE idInventario = ?`,
                [inventoryId]
            );

            if (result.affectedRows === 0)
                return {
                    success: false,
                    message: "No supply batch found with that ID.",
                };

            return {
                success: true,
                message: "Supply batch deleted successfully.",
            };
        } catch (error) {
            console.error("Error deleting supply batch:", error);
            throw error;
        }
    }

    /**
     * Filters supply batches either by expiration date or acquisition type.
     */
    static async filterOrder(body = {}) {

        const filters = body.filters || {};

        try {
            let query = `
                SELECT 
                    a.Descripcion AS TipoAdquisicion,
                    ii.FechaCaducidad,
                    SUM(ii.CantidadActual) AS TotalCantidad
                FROM InventarioInsumos AS ii
                INNER JOIN TipoAdquisicion AS a 
                    ON ii.idTipoAdquisicion = a.idTipoAdquisicion
                WHERE 1 = 1
            `;

            const params = [];

            // Acquisition type
            if (filters["Tipo de Adquisición"] && filters["Tipo de Adquisición"].length > 0) {
                query += ` AND a.Descripcion IN (${filters["Tipo de Adquisición"].map(() => '?').join(', ')})`;
                params.push(...filters["Tipo de Adquisición"]);
            }

            // Expiration date
            if (filters["Fecha de caducidad"] && filters["Fecha de caducidad"].length > 0) {
                query += ` AND ii.FechaCaducidad IN (${filters["Fecha de caducidad"].map(() => '?').join(', ')})`;
                params.push(...filters["Fecha de caducidad"]);
            }

            query += `
                GROUP BY a.Descripcion, ii.FechaCaducidad
            `;

            // Order
            if (body.order) {
                query += ` ORDER BY TotalCantidad ${body.order}`;
            }

            const rows = await database.query(query, params);
            console.log("Filtered Supply Batch Rows:", rows);

            return rows;

        } catch (err) {
            console.error("Error filtering supply batch: ", err);
            throw err;
        }
    }

    static async getFiltersData() {
        try {
            // Get all unique acquisition types
            const acquisitionTypes = await database.query(`
                SELECT DISTINCT Descripcion 
                FROM TipoAdquisicion
            `);
            // Get all unique expiration dates
            const expirationDates = await database.query(`
                SELECT DISTINCT FechaCaducidad 
                FROM InventarioInsumos
            `);
            // Return simplified arrays with raw values
            console.log("ENTRO AL GET SUPPLY BATCH FILTERS DATA");

            return {
                acquisitionTypes: acquisitionTypes.map(a => a.Descripcion),
                expirationDates: expirationDates.map(f => f.FechaCaducidad)
            }

        } catch (err) {
            console.error("Error fetching supply batch filter data:", err);
            throw err;
        }
    }
    
    /**
     * Gets all the Acquisition types available
     * @returns acquisitionTypes
     */
    static async fetchAcquisitionTypes() {
        try {
            const acquisitionTypes = database.query(`
                SELECT idTipoAdquisicion, Descripcion 
                FROM TipoAdquisicion
            `);
            return acquisitionTypes;
        } catch (err) {
            console.error("Error fetching acquisition types:", err);
            throw err;
        }
    }
}
