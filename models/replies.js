const Joi = require("joi");
const mongoose = require("mongoose");

const repliesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    length: 4,
  },
  userId: mongoose.Schema.Types.ObjectId,
});

const Replies = mongoose.model("Replies", repliesSchema);

const validateReplies = (payload) => {
  const schema = Joi.object({
    code: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(payload);
};

module.exports = { Replies, validateReplies };
