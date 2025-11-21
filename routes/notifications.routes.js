const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notifications.controller.js");

router.get("/fetch", notificationsController.fetchNotifications);

router.get("/fetch/new", notificationsController.fetchNewNotifications);

router.post("/read", notificationsController.readNotification);

module.exports = router;