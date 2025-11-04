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
            const rows = await database.query("SELECT * FROM Beneficiarios WHERE idBeneficiario = ?", [id]);
            return rows[0];
        } catch (err) {
            console.error(`Error al obtener beneficiario con id ${id}:`, err);
            throw err;
        }
    }

    // Nueva Funcion
    static async deactivate(id) {
        try {
            const result = await database.query("UPDATE Beneficiarios SET estatus = 0 WHERE idBeneficiario = ?", [id]);
            return result;
        } catch (err) {
            console.error(`Error al desactivar a beneficiario con id ${id}:`, err);
            throw err;
        }
    }
}