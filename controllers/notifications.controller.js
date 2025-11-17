const Notifications = require("../models/notifications.model.js");

exports.fetchNotifications = async (req, res) => {
    let userId = req.body.userId;

    let notifications = await Notifications.fetchNotifications(userId);

    res.status(200).json(notifications);
}

exports.fetchNewNotifications = async (req, res) => {
    let userId = req.body.userId;

    let notifications = await Notifications.fetchNewNotifications(userId);

    res.status(200).json({
        "size": notifications.length
    });
}

exports.readNotification = async (req, res) => {
    let notificationId = req.body.notificationId;

    await Notifications.readNotification(notificationId);

    res.status(202).json({ message: 'The notification was read correctly.' });
}