const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Discapacity {
    constructor(idDiscapacidad, nombre, descripcion) {
        this.idDiscapacidad = idDiscapacidad || uuidv4();
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    async save() {
        const query = `
            INSERT INTO ListaDiscapacidades 
            (idDiscapacidad, nombre, caracteristicas)
            VALUES (?, ?, ?)
        `;

        const values = [
            this.idDiscapacidad,
            this.nombre,
            this.descripcion
        ];

        return await db.execute(query, values);
    }

    static async update(idDiscapacidad, nombre, descripcion) {
        const query = `
            UPDATE ListaDiscapacidades
            SET nombre = ?, caracteristicas = ?
            WHERE idDiscapacidad = ?
        `;

        const params = [nombre, descripcion, idDiscapacidad];
        return await db.execute(query, params);
    }

    static async delete(idDiscapacidad) {
        const query = `
            DELETE FROM ListaDiscapacidades
            WHERE idDiscapacidad = ?
        `;

        return await db.execute(query, [idDiscapacidad]);
    }

    static async getDiscapacities() {
        const query = `
            SELECT idDiscapacidad, nombre as name, caracteristicas as descripcion
            FROM ListaDiscapacidades
            ORDER BY nombre ASC
        `;

        const rows = await db.execute(query);
        return rows;
    }

    static async getOneDiscapacity(id) {
        const query = `
            SELECT idDiscapacidad, nombre, caracteristicas
            FROM ListaDiscapacidades
            WHERE idDiscapacidad = ?
        `;

        const [rows] = await db.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findByName(nombre) {
        const query = `
            SELECT idDiscapacidad, nombre, caracteristicas
            FROM ListaDiscapacidades
            WHERE nombre LIKE ?
        `;

        const [rows] = await db.execute(query, [`%${nombre}%`]);
        return rows;
    }
};


