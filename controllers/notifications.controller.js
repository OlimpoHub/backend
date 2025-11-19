const Notifications = require("../models/notifications.model.js");

// GET: Returns a list of the user's notifications
exports.fetchNotifications = async (req, res) => {
    let userId = req.query.userId;

    let notifications = await Notifications.fetchNotifications(userId);

    res.status(200).json(notifications);
}

// GET: Returns the amount of unread notifications
exports.fetchNewNotifications = async (req, res) => {
    let userId = req.query.userId;

    let notifications = await Notifications.fetchNewNotifications(userId);

    res.status(200).json({
        "size": notifications.length
    });
}

// POST: Marks a notifiction as read
exports.readNotification = async (req, res) => {
    let notificationId = req.body.notificationId;

    await Notifications.readNotification(notificationId);

    res.status(202).json({ message: 'The notification was read correctly.' });
}