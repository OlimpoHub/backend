const Calendar = require('../models/calendar.model');
const jwt = require("jsonwebtoken");
const tokenUtils = require("../utils/token.utils");

exports.getCalendar = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, tokenUtils.ACCESS_SECRET);
        const userId = decoded.id;

        const rawData = await Calendar.fetchById(userId);
        const rows = Array.isArray(rawData[0]) ? rawData[0] : rawData;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ventana móvil: hoy → hoy + 3 meses
        const windowEnd = new Date(today);
        windowEnd.setMonth(windowEnd.getMonth() + 3);
        windowEnd.setHours(0, 0, 0, 0);

        const expanded = [];

        for (const row of rows) {
            const tallerStart = new Date(row.Fecha);
            tallerStart.setHours(0, 0, 0, 0);

            // Si hoy es ANTES de la fecha del taller → no mostrar nada aún
            if (today < tallerStart) {
                continue;
            }

            // inicio real para generar: el mayor entre (inicio taller) y (hoy)
            let current = new Date(Math.max(today, tallerStart));
            current.setHours(0, 0, 0, 0);

            // generar ocurrencias hasta ventanaEnd
            while (current <= windowEnd) {
                const dow = current.getDay(); // 0 domingo, 6 sábado

                if (dow !== 0 && dow !== 6) {
                    expanded.push({
                        ...row,
                        Fecha: current.toISOString(),
                    });
                }

                current.setDate(current.getDate() + 1);
            }
        }

        return res.status(200).json(expanded);

    } catch (err) {
        console.error("Error en getCalendar:", err);
        return res.status(500).json({ message: 'Failed to fetch calendar Info.' });
    }
};
