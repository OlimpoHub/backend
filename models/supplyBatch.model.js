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
        try {
            const rows = await database.query(
                `SELECT 
                    i.idInsumo, i.nombre, i.unidadMedida, i.imagenInsumo,
                    inv.FechaCaducidad, SUM(inv.CantidadActual) AS cantidad, 
                    t.nombreTaller, c.Descripcion, i.status, 
                    ta.Descripcion AS adquisicion
                FROM Insumo i
                LEFT JOIN InventarioInsumos inv 
                    ON inv.IdInsumo = i.idInsumo
                LEFT JOIN TipoAdquisicion ta
                    ON ta.idTipoAdquisicion = inv.idTipoAdquisicion
                JOIN Taller t
                    ON t.idTaller = i.idTaller
                JOIN Categoria c
                    ON c.idCategoria = i.idCategoria
                WHERE i.idInsumo = ? 
                GROUP BY i.idInsumo, inv.FechaCaducidad`,
                [id]
            );
            console.log("FETCH ONE SUPPLY BATCH: ", rows);
            return Array.isArray(rows) ? rows : [rows];
        } catch (err) {
            console.log("Error fetching one supply batch", err);
            throw err;
        }
    }

    /**
     * Inserts a new supply batch record into the database.
     */
    static async addSupply(
        supplyId,
        quantity,
        expirationDate,
        acquisitionId,
        boughtDate
    ) {
        try {
            const [dayC, monthC, yearC] = boughtDate.split("/");
            const [dayE, monthE, yearE] = expirationDate.split("/");

            const fechaCompraSQL = `${yearC}-${monthC}-${dayC}`;
            const fechaCaducidadSQL = `${yearE}-${monthE}-${dayE}`;
            const result = await database.query(
                `INSERT INTO InventarioInsumos (
                    idInsumo, CantidadActual, FechaActualizacion, FechaCaducidad, idTipoAdquisicion
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    supplyId,
                    quantity,
                    fechaCompraSQL,
                    fechaCaducidadSQL,
                    acquisitionId,
                ]
            );
            console.log("NEW SUPPLY ADDED: ", result);
            return result;
        } catch (err) {
            console.error("Error adding supply: ", err);
            throw err;
        }
    }

    /**
     * Deletes all inventory records for a specific supply and expiration date (batch).
     * @param {string} supplyId - The supply ID
     * @param {string} expirationDate - The expiration date that identifies the batch
     */
    static async delete(supplyId, expirationDate) {
        try {
            const result = await database.execute(
                `DELETE FROM InventarioInsumos 
                WHERE idInsumo = ? AND FechaCaducidad = ?`,
                [supplyId, expirationDate]
            );

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "No supply batch found with that supply ID and expiration date.",
                };
            }

            return {
                success: true,
                message: `Supply batch deleted successfully. ${result.affectedRows} record(s) removed.`,
                deletedCount: result.affectedRows
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
            if (
                filters["Tipo de Adquisición"] &&
                filters["Tipo de Adquisición"].length > 0
            ) {
                query += ` AND a.Descripcion IN (${filters[
                    "Tipo de Adquisición"
                ]
                    .map(() => "?")
                    .join(", ")})`;
                params.push(...filters["Tipo de Adquisición"]);
            }

            // Expiration date
            if (
                filters["Fecha de caducidad"] &&
                filters["Fecha de caducidad"].length > 0
            ) {
                query += ` AND ii.FechaCaducidad IN (${filters[
                    "Fecha de caducidad"
                ]
                    .map(() => "?")
                    .join(", ")})`;
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
                acquisitionTypes: acquisitionTypes.map((a) => a.Descripcion),
                expirationDates: expirationDates.map((f) => f.FechaCaducidad),
            };
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

    static async modifySupplyBatch(
        idSupplyBatch,
        supplyId,
        quantity,
        expirationDate,
        acquisition,
        boughtDate
    ) {
        try {
            const [dayC, monthC, yearC] = boughtDate.split("/");
            const [dayE, monthE, yearE] = expirationDate.split("/");

            const fechaCompraSQL = `${yearC}-${monthC}-${dayC}`;
            const fechaCaducidadSQL = `${yearE}-${monthE}-${dayE}`;
            const result = await database.query(
                `
                UPDATE InventarioInsumos
                SET idInsumo = ?,
                    CantidadActual = ?, 
                    FechaActualizacion = ?,
                    FechaCaducidad = ?,
                    idTipoAdquisicion = ?
                WHERE idInventario = ?
            `,
                [
                    supplyId,
                    quantity,
                    fechaCompraSQL,
                    fechaCaducidadSQL,
                    acquisition,
                    idSupplyBatch,
                ]
            );
            if (result && typeof result.insertId === "bigint") {
                result.insertId = Number(result.insertId);
            }

            console.log("SUPPLY BATCH MODIFIED: ", result);
            return result;
        } catch (error) {
            console.error("Error modifySupplyBatch():", error);
            throw error;
        }
    }

    static async getSupplyBatchOne(idSupplyBatch) {
        try {
            // Only select the fields required by the ModifySupplyBatch screen.
            const rows = await database.query(
                `SELECT
                    inv.idInventario,
                    inv.idInsumo,
                    inv.CantidadActual,
                    inv.FechaActualizacion,
                    inv.FechaCaducidad,
                    inv.idTipoAdquisicion
                FROM InventarioInsumos inv
                WHERE inv.idInventario = ?`,
                [idSupplyBatch]
            );

            if (Array.isArray(rows)) {
                return rows.length > 0 ? rows[0] : null;
            }
            return rows || null;
        } catch (err) {
            console.error("Error getSupplyBatchOne():", err);
            throw err;
        }
    }

    static async getSupplyBatchDates(expirationDate, idInsumo) {
        try {
            // Normalize incoming expirationDate to SQL format yyyy-MM-dd
            let fechaCaducidadSQL = expirationDate;

            if (!fechaCaducidadSQL) {
                throw new Error("expirationDate is required");
            }

            // Handle ISO datetime (2025-11-21T06:00:00.000Z) -> take date part
            if (fechaCaducidadSQL.includes('T')) {
                fechaCaducidadSQL = fechaCaducidadSQL.split('T')[0];
            }

            // If format is dd/MM/yyyy, convert to yyyy-MM-dd
            if (fechaCaducidadSQL.includes('/')) {
                const parts = fechaCaducidadSQL.split('/');
                if (parts.length === 3) {
                    const [d, m, y] = parts;
                    fechaCaducidadSQL = `${y}-${m}-${d}`;
                }
            }

            // If it's already in yyyy-MM-dd keep as is. Basic validation could be added.

            // Select and normalize the fields returned so frontend DTO mapping is straightforward.
            // Aliases: id, quantity, expirationDate (dd/MM/yyyy), adquisitionType, boughtDate (dd/MM/yyyy), measure
            const rows = await database.query(
                `SELECT
                    inv.idInventario AS id,
                    inv.CantidadActual AS quantity,
                    DATE_FORMAT(inv.FechaCaducidad, '%d/%m/%Y') AS expirationDate,
                    ta.Descripcion AS adquisitionType,
                    DATE_FORMAT(inv.FechaActualizacion, '%d/%m/%Y') AS boughtDate,
                    i.unidadMedida AS measure
                FROM InventarioInsumos inv
                LEFT JOIN Insumo i ON inv.idInsumo = i.idInsumo
                LEFT JOIN TipoAdquisicion ta ON inv.idTipoAdquisicion = ta.idTipoAdquisicion
                WHERE inv.FechaCaducidad = ?
                AND inv.idInsumo = ?`,
                [fechaCaducidadSQL, idInsumo]
            );

            return rows;
        } catch (err) {
            console.error("Error getSupplyBatchDates():", err);
            throw err;
        }
    }
};