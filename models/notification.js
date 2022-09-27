const Joi = require("joi");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["read", "unread"],
      default: "unread",
    },
    type: {
      type: String,
      required: true,
      enum: ["open", "resolved", "pending", "closed", "account"],
    },
  },
  { timestamps: true }
);

const validateNotification = (payload) => {
  const schema = Joi.object({
    userId: Joi.required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required(),
    //   .valid("open", "resolved", "pending", "closed", "account"),
  });
  return schema.validate(payload);
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification, validateNotification };
