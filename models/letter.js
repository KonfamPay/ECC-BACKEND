const Joi = require("joi");
const mongoose = require("mongoose");

const letterScehma = new mongoose.Schema(
	{
    content:{
      type: String,
			minlength: 5,
			maxlength: 1000,
      required: true,
    },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true }
);

const Letter = mongoose.model("Letter", letterScehma);

const validateLetter = (payload) => {
	const schema = Joi.object({
		content: Joi.string()
			.length(1000)
			.required(),
	});
	return schema.validate(payload);
};

module.exports = { Letter, validateLetter };
