const database = require('../utils/db');
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

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const mockPokemons = {
                1: {
                    id: 1,
                    name: "bulbasaur",
                    height: 7,
                    weight: 69,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
                    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }]
                },
                2: {
                    id: 2,
                    name: "ivysaur",
                    height: 10,
                    weight: 130,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
                    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }]
                },
                3: {
                    id: 3,
                    name: "venusaur",
                    height: 20,
                    weight: 1000,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
                    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }]
                },
                4: {
                    id: 4,
                    name: "charmander",
                    height: 6,
                    weight: 85,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
                    types: [{ type: { name: "fire" } }]
                },
                5: {
                    id: 5,
                    name: "charmeleon",
                    height: 11,
                    weight: 190,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
                    types: [{ type: { name: "fire" } }]
                },
                6: {
                    id: 6,
                    name: "charizard",
                    height: 17,
                    weight: 905,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
                    types: [{ type: { name: "fire" } }, { type: { name: "flying" } }]
                },
                7: {
                    id: 7,
                    name: "squirtle",
                    height: 5,
                    weight: 90,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
                    types: [{ type: { name: "water" } }]
                },
                8: {
                    id: 8,
                    name: "wartortle",
                    height: 10,
                    weight: 225,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
                    types: [{ type: { name: "water" } }]
                },
                9: {
                    id: 9,
                    name: "blastoise",
                    height: 16,
                    weight: 855,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
                    types: [{ type: { name: "water" } }]
                },
                10: {
                    id: 10,
                    name: "caterpie",
                    height: 3,
                    weight: 29,
                    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png" },
                    types: [{ type: { name: "bug" } }]
                },
            };

            const pokemon = mockPokemons[id];
            if (pokemon) {
                resolve(pokemon);
            } else {
                reject(new Error("Pokémon no encontrado"));
            }
        });
    }
}