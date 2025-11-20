const database = require('../utils/db.js');

module.exports = class Notification {
    static async fetchNotifications(userId) {
        const rows = await database.query(
            `SELECT titulo, mensaje, fechaCreacion, tipo, idNotificacionesUsuario, fechaLectura, leido
            FROM NotificacionesUsuario nu
            INNER JOIN Notificaciones n ON n.idNotificacion = nu.idNotificacion
            WHERE nu.idUsuario = ?`
            , [userId]);
        return rows;
    }

    static async fetchNewNotifications(userId) {
        const rows = await database.query(
            `SELECT titulo
            FROM NotificacionesUsuario nu
            INNER JOIN Notificaciones n ON n.idNotificacion = nu.idNotificacion
            WHERE nu.idUsuario = ?
            AND nu.leido = 0`
            , [userId]);
        return rows;
    }

    static async readNotification(notificationId) {
        try {
            const result = await database.query(
                `UPDATE NotificacionesUsuario 
                SET leido = 1,
                fechaLectura = current_timestamp()
                WHERE idNotificacionesUsuario = ?`,
                [notificationId]
            );
            return result;
        } catch (err) {
            console.error("Error reading the notification: ", err);
            throw err;
        }
    }
}