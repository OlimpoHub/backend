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
        console.log("userId desde token:", userId);

        const rawData = await Calendar.fetchById(userId);

        const rows = Array.isArray(rawData[0]) ? rawData[0] : rawData;
        console.log("Talleres base recibidos:", rows.length);

        const expanded = [];

        for (const row of rows) {
            const start = new Date(row.Fecha);
            if (isNaN(start)) {
                console.warn("Fecha inválida en fila:", row);
                continue;
            }

            // Start + 3 months
            const end = new Date(start);
            end.setMonth(end.getMonth() + 3);

            let current = new Date(start);
            current.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            // Monday to Friday
            while (current <= end) {
                const dow = current.getDay();
                if (dow !== 0 && dow !== 6) {
                    expanded.push({
                        ...row,
                        Fecha: current.toISOString(),
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        }

        console.log("Ocurrencias generadas (L–V, 3 meses):", expanded.length);
        return res.status(200).json(expanded);
    } catch (err) {
        console.error("Error en getCalendar:", err);
        return res.status(500).json({ message: 'Failed to fetch calendar Info.' });
    }
};
