const Attendance = require("../models/attendance.model");

// Asistencias por usuario
exports.getAttendance = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    const attendances = await Attendance.fetchAttendancesByUser(userId);

    return res.status(200).json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

