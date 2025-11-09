const database = require('../utils/db.js');
module.exports = class Beneficiary {
    constructor(beneficiaryId, firstName, paternalLastName, maternalLastName, dateOfBirth, emergencyPhoneNumber, emergencyContactName, emergencyContactRelationship, description, admissionDate, photo) {
        this.beneficiaryId = beneficiaryId;
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

    static async fetchAll() {
        try {
            const rows = await database.query("SELECT * FROM Beneficiarios");
            console.log("ROWS:", rows);
            return rows;
        } catch (err) {
            console.error("Error al obtener beneficiarios:", err);
            throw err; 
        }
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
            beneficiaryData.nombre,
            beneficiaryData.apellidoPaterno,
            beneficiaryData.apellidoMaterno,
            beneficiaryData.fechaNacimiento
        ];

        const [rows] = await database.query(sql, params);
        return rows.length > 0;
    }



    // Function to create new beneficiary BEN-001
    static async registerBeneficiary(data) {
        try {
            console.log()
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

            const result = await database.query(sql, params);
            return {
                success: true,
                insertId: result.insertId,
                message: "Creado con éxito"
            };

        } catch (error) {
            console.error("Error al registrar beneficiario:", error);

            return {
                success: false,
                message: "Error interno del servidor",
                error
            };
        }
    }


    // Mock data for PokedexApp Lab.
    // In production we will use DB data
    static fetchAllPokemons() {
        return new Promise((resolve) => {
            const data = {
                count: 1328,
                next: "https://pokeapi.co/api/v2/pokemon?offset=10&limit=10",
                previous: null,
                results: [
                    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
                    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
                    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
                    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
                    { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
                    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
                    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
                    { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
                    { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
                    { name: "caterpie", url: "https://pokeapi.co/api/v2/pokemon/10/" },
                ]
            };
            resolve(data);
        });
    }

    static async fetchById(id) {
        try {
            const rows = await database.query(`SELECT * 
                                               FROM Beneficiarios 
                                               WHERE idBeneficiario = ?`, [id]);
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
}