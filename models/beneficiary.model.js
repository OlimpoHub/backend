const database = require('../utils/db.js');
module.exports = class Beneficiary {
    constructor(beneficiaryId, firstName, paternalLastName, maternalLastName, dateOfBirth, emergencyPhoneNumber, emergencyContactName, emergencyContactRelationship, description, admissionDate, photo) {
        this.beneficiaryId = beneficiaryId || uuidv4();
        this.firstName = firstName; 
        this.paternalLastName = paternalLastName; 
        this.maternalLastName = maternalLastName; 
        this.dateOfBirth = dateOfBirth; 
        this.emergencyPhoneNumber = emergencyPhoneNumber;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactRelationship = emergencyContactRelationship;
        this.description = description;
        this.admissionDate = admissionDate;
        this.photo = photo;
        // NOTA: La tabla tambien tiene 'estatus', pero no esta en este constructor
        // No hay problema para BEN-04 pero hay que tenerlo en cuenta para el 'create' o 'update'.
    }

    // Revisar si el beneficiario existe BEN-001
    static async exists(data) {
        const sql = `
            SELECT * FROM Beneficiarios
            WHERE nombre = ?
            AND apellidoPaterno = ?
            AND apellidoMaterno = ?
            AND fechaNacimiento = ?
        `;

        const params = [
            data.nombre,
            data.apellidoPaterno,
            data.apellidoMaterno,
            data.fechaNacimiento
        ];

        const rows = await database.query(sql, params);
        return rows.length > 0;
    }



    // Function to create new beneficiary BEN-001
    static async registerBeneficiary(data) {
        try {
            console.log(data);

            if (await this.exists(data)) {
                return {
                success: false,
                message: "El Beneficiario ya existe",
            };
            }

            const sql = `
                INSERT INTO Beneficiarios
                (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroEmergencia, nombreContactoEmergencia,
                relacionContactoEmergencia, descripcion, fechaIngreso, foto, estatus)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;


            const params = [
                data.nombre,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.fechaNacimiento,
                data.numeroEmergencia,
                data.nombreContactoEmergencia,
                data.relacionContactoEmergencia,
                data.descripcion,
                data.fechaIngreso,
                data.foto,
                1
            ];

            const sql2 = `
                INSERT INTO BeneficiarioDiscapacidades (idDiscapacidad, idBeneficiario)
                SELECT ?, idBeneficiario
                FROM Beneficiarios
                WHERE nombre = ? AND apellidoPaterno = ? AND apellidoMaterno = ? AND fechaNacimiento = ?;
            `;


            const params2 = [
                data.discapacidad,
                data.nombre,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.fechaNacimiento
            ];

            const result = await database.query(sql, params);
            const result2 = await database.query(sql2, params2);
            return {
                success: true,
                message: "Creado con éxito",
            };
        } catch (error) {
            console.error("Error al registrar beneficiario:", error);

            return {
                success: false,
                message: "Error interno del servidor",
            };
        }
    }

    static async fetchById(id) {
        try {
            const rows = await database.query(`SELECT Ben.*, LD.nombre AS discapacidad
                                               FROM Beneficiarios Ben
                                               LEFT JOIN BeneficiarioDiscapacidades BD ON Ben.idBeneficiario = BD.idBeneficiario
                                               LEFT JOIN ListaDiscapacidades LD ON LD.idDiscapacidad = BD.idDiscapacidad
                                               WHERE Ben.idBeneficiario = ?`, [id]);
            return rows[0];
        } catch (err) {
            console.error(`Error al obtener beneficiario con id ${id}:`, err);
            throw err;
        }
    }

    // Nueva Funcion
    static async deactivate(id) {
        try {
            const result = await database.query(`UPDATE Beneficiarios 
                                                 SET estatus = 0 
                                                 WHERE idBeneficiario = ?`, [id]);
            return result;
        } catch (err) {
            console.error(`Error al desactivar a beneficiario con id ${id}:`, err);
            throw err;
        }
    }

    // Model para BEN-02:
    // Lista de beneficiarios + discapacidad ordenado por nombre de beneficiario
    static async beneficiariesList() {
        try {
            const rows = await database.query(
                `SELECT Ben.*, LD.nombre AS discapacidad
                FROM Beneficiarios Ben
                LEFT JOIN BeneficiarioDiscapacidades BD ON Ben.idBeneficiario = BD.idBeneficiario
                LEFT JOIN ListaDiscapacidades LD ON LD.idDiscapacidad = BD.idDiscapacidad
                WHERE estatus = 1
                ORDER BY Ben.nombre`);
            console.log("ROWS:", rows);
            return rows;
        } catch (err) {
            console.error("Error al obtener beneficiarios:", err);
            throw err; 
        }
    }

    // Model para BEN-003
    static async update(idBeneficiario, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroEmergencia, nombreContactoEmergencia, relacionContactoEmergencia, descripcion, fechaIngreso, foto, estatus, idDiscapacidad) {
        try {
            const query = `UPDATE Beneficiarios
                           SET nombre = ?,
                           apellidoPaterno = ?,
                           apellidoMaterno = ?,
                           fechaNacimiento = ?,
                           numeroEmergencia = ?,
                           nombreContactoEmergencia = ?,
                           relacionContactoEmergencia = ?,
                           descripcion = ?,
                           fechaIngreso = ?,
                           foto = ?,
                           estatus  = ?
                           WHERE idBeneficiario = ?`;

                           const params = [nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroEmergencia, nombreContactoEmergencia, relacionContactoEmergencia, descripcion, fechaIngreso, foto, estatus, idBeneficiario];
            const query2 = `UPDATE BeneficiarioDiscapacidades
                            SET idDiscapacidad = ?
                            WHERE idBeneficiario = ?`;
                            const params2 = [idDiscapacidad, idBeneficiario]
                           const result = await database.execute(query, params);
                           const result2 = await database.execute(query2, params2);
                           return (result && result2);
        } catch (err) {
            console.error(`Error al actualizar beneficiario con id ${idBeneficiario}:`, err);
            throw err;
        }
    }

    // Filter beneficiaries by disability (list ordered by name)
    static async filter(body = {}) {
    console.log("Filter body:", body);

    const filters = body.filters || {};  // <-- antes body.filter
    const discapacidad = filters["Discapacidades"] || []; // <-- antes discapacidad

    try {
        let query = `
        SELECT Ben.*, LD.nombre AS discapacidad
        FROM Beneficiarios Ben
        LEFT JOIN BeneficiarioDiscapacidades BD ON Ben.idBeneficiario = BD.idBeneficiario
        LEFT JOIN ListaDiscapacidades LD ON LD.idDiscapacidad = BD.idDiscapacidad
        WHERE estatus = 1
        `;

        const params = [];

        if (discapacidad.length > 0) {
            query += ` AND LD.nombre IN (${discapacidad.map(() => '?').join(', ')})`;
            params.push(...discapacidad);
        }

        if (body.order) {
            query += ` ORDER BY Ben.nombre ${body.order}`;
        }

        const rows = await database.query(query, params);
        return rows;
    } catch (error) {
        console.log("Error al obtener lista de beneficiarios", error);
        throw error;
    }
}


    // Get categories on the disabilities for filtering
    static async getCategories(){
        try{
            const discapacidad = await database.query(
                `
                SELECT DISTINCT nombre as discapacidad
                FROM ListaDiscapacidades
                ORDER BY nombre ASC
                `
            );

            console.log("Discapacidades:", discapacidad);

            return {
                    discapacidad: discapacidad.map(e => e.discapacidad),
                };
        } catch(error){
            console.error("Error al obtener datos de filtrado:", error);
            throw error;
        }
    }

    // --- Nuevo para BEN-007
    static async searchByName(searchTerm) {
        try {
            const query = `
                SELECT Ben.*, LD.nombre AS discapacidad
                FROM Beneficiarios Ben
                LEFT JOIN BeneficiarioDiscapacidades BD ON Ben.idBeneficiario = BD.idBeneficiario
                LEFT JOIN ListaDiscapacidades LD ON LD.idDiscapacidad = BD.idDiscapacidad
                WHERE CONCAT(Ben.nombre, ' ', apellidoPaterno, ' ', apellidoMaterno) LIKE ?
                AND estatus = 1
            `;
            const params = [`%${searchTerm}%`];

            const rows = await database.query(query, params);

            return rows;
        } catch (err) {
            console.error(`Error al buscar beneficiarios con termino "${searchTerm}":`, err);
            throw err;
        }
    }
}