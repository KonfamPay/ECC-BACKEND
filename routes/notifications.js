const express = require("express");
const { getAllNotifications } = require("../controllers/notification");
const notificationsRouter = express.Router();

notificationsRouter.get("/:userId", getAllNotifications);

module.exports = notificationsRouter;
