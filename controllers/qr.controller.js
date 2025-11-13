const User = require("../models/user.model.js");
const Attendance = require("../models/attendance.model.js");
const QRCode = require("qrcode") 

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createQR = async (req, res) => {
    let creatorID = req.body.userID;
    let workshopID = req.body.workshopID;

    let creator = await User.findById(creatorID);
    if (creator.roleName == "Becario") {
        return res.status(403).json({ message: 'This user cannot create a QR.' });
    }

    let qrRawData = {
        'userID': creator.idUsuario,
        'workshopID': workshopID,
        'time': Date.now() // Al hacer new Date(qrRawData.time); se obtiene devuelta,
    }

    let qrValue = JSON.stringify(qrRawData); // Con parse se obtiene devuelta

    // Encriptar

    const qrImage = await QRCode.toBuffer(qrValue, { type: "png", width: 300 });
    
    //res.setHeader("Content-Type", "image/png");
    //res.status(201).send(qrImage);
    res.json({qrValue, qrRawData});
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.validateQR = async (req, res) => {
    // Descencriptar

    let qrValue = req.body.qrValue;
    let readTime = Number(req.body.readTime); // It must be in miliseconds
    let readerID = req.body.userID;

    let qrRawData = JSON.parse(JSON.parse(qrValue));
    let creationTime = new Date(qrRawData.time);
    let workshopID = qrRawData.workshopID;

    // 15 minutes = 15 * 60 * 1000 = 900000 ms
    const FIFTEEN_MINUTES = 15 * 60 * 1000;

    // If wasn't readed within the first 15 minutes
    if (readTime < creationTime || creationTime + FIFTEEN_MINUTES < readTime) {
        return res.status(406).json({ message: 'The code wasn\'t readed within the 15 first minutes of its creation.' });
    }

    // Checks the one that created the qr is not a collaborator
    let creator = await User.findById(qrRawData.userID);
    if (creator.roleName == "Becario") {
        return res.status(406).json({ message: 'This user cannot create a QR.' });
    }

    let readTimeDate = new Date(readTime);
    let readTimeString = readTimeDate.toISOString().slice(0, 19).replace('T', ' ');

    let currentAttendance = await Attendance.getCurrentAttendance(readerID, readTimeString.split(' ')[0]);

    if (currentAttendance.length === 0) {
        let attendance = new Attendance(readerID, workshopID, readTimeString);
        await attendance.save();
        return res.status(201).json({ message: 'The entrance attendance was registered correctly.' });
    }
    
    if (!(currentAttendance[0].fechaFin === null)) {
        return res.status(406).json({ message: 'The attendance was already registered for the day' });
    }

    // It menas it only has the first halve of the day
    await Attendance.addExitAttendance(currentAttendance[0].idAsistencia, readTimeString);
    return res.status(201).json({ message: 'The exiting attendance was registered correctly.' });
}