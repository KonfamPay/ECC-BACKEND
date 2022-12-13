const express = require("express");
const {
  getAllNotifications,
  markAllNotificationsByaUserAsRead,
} = require("../controllers/notification");
const notificationsRouter = express.Router();

notificationsRouter.get("/:userId", getAllNotifications);
notificationsRouter.post(
  "/:userId/markAllAsRead",
  markAllNotificationsByaUserAsRead
);

module.exports = notificationsRouter;
