const database = require('../utils/db');
module.exports = class User {
    constructor(
        _idUsuario, 
        _idRol, 
        _nombre, 
        _apellidoPaterno, 
        _apellidoMaterno, 
        _fechaNacimiento, 
        _carrera, 
        _correoElectronico, 
        _contrasena, 
        _telefono, 
        _estatus, 
        _reglamentoInterno, 
        _copiaINE, 
        _avisoConfidencialidad, 
        _foto
    ) {
       this.idUsuario = _idUsuario;
       this.idRol = _idRol;
       this.nombre = _nombre; 
       this.apellidoPaterno = _apellidoPaterno;
       this.apellidoMaterno = _apellidoMaterno; 
       this.fechaNacimiento = _fechaNacimiento; 
       this.carrera = _carrera; 
       this.correoElectronico = _correoElectronico;
       this.contrasena = _contrasena; 
       this.telefono = _telefono;
       this.estatus = _estatus;
       this.reglamentoInterno = _reglamentoInterno; 
       this.copiaINE = _copiaINE;
       this.avisoConfidencialidad = _avisoConfidencialidad;
       this.foto = _foto;
    }

    /**
     * fetchAllUser
     * --------------------------------------------------------
     * Retrieves all users stored in the database. Returns the
     * full list of records or null if no users exist.
     * 
     * @returns {Array|null} List of users or null if empty
     */
    static async fetchAllUser() {
        const result = await database.query(
            `SELECT *
            FROM Usuarios
            `
        );
        return result.length > 0 ? result : null;
    }

    /**
     * findByEmail
     * --------------------------------------------------------
     * Retrieves a single user using their email. Includes the
     * user's role name by joining with the Roles table.
     * 
     * @param {string} email - User email to search
     * 
     * @returns {Object|null} User record or null if not found
     */
    static async findByEmail(email) {
        const rows = await database.query(
            `SELECT u.*, r.nombreRol AS roleName
            FROM Usuarios u
            INNER JOIN Roles r ON u.idRol = r.idRol
            WHERE u.correoElectronico = ?
            LIMIT 1`
            , [email]);
       return rows.length > 0 ? rows[0] : null;
    }

    /**
     * findById
     * --------------------------------------------------------
     * Retrieves a single user using their numeric ID. Includes
     * the user's role name by joining with the Roles table.
     * 
     * @param {number} id - User ID to search
     * 
     * @returns {Object|null} User record or null if not found
     */
    static async findById(id) {
        const rows = await database.query(
            `SELECT u.*, r.nombreRol AS roleName
            FROM Usuarios u
            INNER JOIN Roles r ON u.idRol = r.idRol
            WHERE u.idUsuario = ?
            LIMIT 1`
            , [id]);
       return rows.length > 0 ? rows[0] : null;
    }

    /**
     * existsByEmail
     * --------------------------------------------------------
     * Checks whether a user is already registered under the
     * given email. Returns true if the email exists, otherwise false.
     *
     * @param {string} email - Email to validate
     * 
     * @returns {boolean} True if email exists, false otherwise
     */
    static async existsByEmail(email) {
        const result = await database.query(`
            SELECT COUNT(*) AS count
            FROM Usuarios
            WHERE correoElectronico = ?`
        , [email]);

        if (!result || result.length === 0) return false;

        return result[0].count > 0;
    };

    /**
     * updatePassword
     * --------------------------------------------------------
     * Updates the password of a user identified by their email.
     * Returns true if the update was successful.
     * 
     * @param {string} email - Email of the user to update
     * @param {string} password - New hashed password
     * 
     * @returns {boolean} True if the password was updated
     */
    static async updatePassword(email, password) {
        const result = await database.query(`
            UPDATE Usuarios
            SET contrasena = ?
            WHERE correoElectronico = ?`
        , [password, email]);

        return result.affectedRows > 0;
    };
}
