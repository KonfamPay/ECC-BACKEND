const Joi = require("joi");
const mongoose = require("mongoose");

const emailCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    length: 4,
  },
  userId: mongoose.Schema.Types.ObjectId,
});

const EmailCode = mongoose.model("EmailCode", emailCodeSchema);

const validateEmailCode = (payload) => {
  const schema = Joi.object({
    code: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(payload);
};

module.exports = { EmailCode, validateEmailCode };
