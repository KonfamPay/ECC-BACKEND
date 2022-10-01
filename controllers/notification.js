const { response } = require("express");
const mongoose = require("mongoose");
const {
  Notification,
  validateNotification,
} = require("../models/Notification");
const { User } = require("../models/user");

const getAllNotifications = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(404).json({ message: "This id is not valid!" });

  const user = await User.findOne({ _id: userId });
  if (!user)
    return res
      .status(404)
      .json({ message: "This user does not exist in the database!" });

  const notifications = await Notification.find({ userId });
  return res.status(200).json({ notifications });
};

class NotificationService {
  static async sendNotification(notificationPayload) {
    const { error } = validateNotification(notificationPayload);
    if (error) throw new Error(error.details[0].message);
    const notification = new Notification(notificationPayload);
    return await notification.save();
  }

  static async markAsRead(notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error("This notification does not exist!");
    notification.status = "read";
    await notification.save();
  }
}

module.exports = { getAllNotifications, NotificationService };
