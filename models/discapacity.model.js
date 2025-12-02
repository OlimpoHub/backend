const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Discapacity {
    constructor(idDiscapacidad, nombre, descripcion) {
        // Generate UUID if no ID is provided
        this.idDiscapacidad = idDiscapacidad || uuidv4();
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // Save a new disability into the database
    async save() {
        const query = `
            INSERT INTO ListaDiscapacidades 
            (idDiscapacidad, nombre, descripcion)
            VALUES (?, ?, ?)
        `;

        const values = [
            this.idDiscapacidad,
            this.nombre,
            this.descripcion
        ];

        // Execute INSERT query
        return await db.execute(query, values);
    }

    // Update an existing disability
    static async update(idDiscapacidad, nombre, descripcion) {
        const query = `
            UPDATE ListaDiscapacidades
            SET nombre = ?, caracteristicas = ?
            WHERE idDiscapacidad = ?
        `;

        const params = [nombre, descripcion, idDiscapacidad];

        // Execute UPDATE query
        return await db.execute(query, params);
    }

    // Delete a disability by ID
    static async delete(idDiscapacidad) {
        const query = `
            DELETE FROM ListaDiscapacidades
            WHERE idDiscapacidad = ?
        `;

        // Execute DELETE query
        return await db.execute(query, [idDiscapacidad]);
    }

    // Get all disabilities
    static async getDiscapacities() {
        const query = `
            SELECT idDiscapacidad, nombre as name, caracteristicas as descripcion
            FROM ListaDiscapacidades
            ORDER BY nombre ASC
        `;

        // Execute SELECT query
        const rows = await db.execute(query);
        return rows;
    }

    // Get a single disability by ID
    static async getOneDiscapacity(id) {
        const query = `
            SELECT *
            FROM ListaDiscapacidades
            WHERE idDiscapacidad = ?
        `;

        // Execute SELECT query
        const rows = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Search disabilities by name (partial match)
    static async findByName(nombre) {
        const query = `
            SELECT idDiscapacidad, nombre as name, caracteristicas as descripcion
            FROM ListaDiscapacidades
            WHERE nombre LIKE ?
        `;

        // Execute SELECT query with wildcard search
        const [rows] = await db.execute(query, [`%${nombre}%`]);
        return rows;
    }
};
