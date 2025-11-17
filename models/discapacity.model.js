const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');


module.exports = class Discapacity {
    constructor(idDiscapacidad, nombre, descripcion, estatus) {
        this.idDiscapacidad = idDiscapacidad || uuidv4();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estatus = estatus;
    }

    async save() {
        try {
            const query = `
                INSERT INTO Discapacidades 
                (idDiscapacidad, nombre, descripcion, estatus)
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                this.idDiscapacidad,
                this.nombre,
                this.descripcion,
                this.estatus
            ];

            return await db.execute(query, values);

        } catch (error) {
            console.error('Error en save():', error);
            throw error;
        }
    }

    static async add(data) {
        try {
            const camposValidos = [
                'idDiscapacidad',
                'nombre',
                'descripcion',
                'estatus'
            ];

            const campos = Object.keys(data).filter(c => camposValidos.includes(c));
            const placeholders = campos.map(() => '?').join(', ');
            const valores = campos.map(campo => data[campo]);

            const query = `INSERT INTO Discapacidades (${campos.join(', ')}) VALUES (${placeholders})`;
            return await db.query(query, valores);

        } catch (error) {
            console.error("Error en add()", error);
            throw error;
        }
    }

    static async update(idDiscapacidad, nombre, descripcion, estatus) {
        try {
            const query = `
                UPDATE Discapacidades
                SET nombre = ?,
                    descripcion = ?,
                    estatus = ?
                WHERE idDiscapacidad = ?
            `;

            const params = [nombre, descripcion, estatus, idDiscapacidad];
            return await db.execute(query, params);

        } catch (error) {
            console.error("Error en update()", error);
            throw error;
        }
    }

    static async changestatus(idDiscapacidad) {
        try {
            const query = `
                UPDATE Discapacidades
                SET estatus = 0
                WHERE idDiscapacidad = ?
            `;

            return await db.execute(query, [idDiscapacidad]);

        } catch (error) {
            console.error("Error en changestatus()", error);
            throw error;
        }
    }

    static async getAll() {
        try {
            return await db.query(
                `SELECT idDiscapacidad, nombre, descripcion
                 FROM Discapacidades
                 WHERE estatus = 1`
            );

        } catch (error) {
            console.error("Error fetching disabilities", error);
            throw error;
        }
    }

    static async getOne(id) {
        try {
            const rows = await db.query(
                `
                SELECT idDiscapacidad, nombre, descripcion
                FROM Discapacidades
                WHERE estatus = 1 AND idDiscapacidad = ?
                `,
                [id]
            );

            return rows.length > 0 ? rows[0] : null;

        } catch (error) {
            console.error("Error fetching one disability", error);
            throw error;
        }
    }

    static async findByName(nombre) {
        try {
            const [rows] = await db.execute(
                `
                SELECT idDiscapacidad, nombre, descripcion
                FROM Discapacidades
                WHERE estatus = 1 AND nombre LIKE ?
                `,
                [`%${nombre}%`]
            );

            return rows;

        } catch (error) {
            console.error("Error findByName()", error);
            throw error;
        }
    }
};
