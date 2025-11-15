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

    static async fetchAllUser() {
        const result = await database.query(
            `SELECT *
            FROM Usuarios
            `
        );
        return result.length > 0 ? result : null;
    }

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

    static async existsByEmail(email) {
        const result = await database.query(`
            SELECT COUNT(*) AS count
            FROM Usuarios
            WHERE correoElectronico = ?`
        , [email]);

        if (!result || result.length === 0) return false;

        return result[0].count > 0;
    };

    static async updatePassword(email, password) {
        const result = await database.query(`
            UPDATE Usuarios
            SET contrasena = ?
            WHERE correoElectronico = ?`
        , [password, email]);

        return result.affectedRows > 0;
    };
}
