const Joi = require("joi");
const mongoose = require("mongoose");

const scammerSchema = new mongoose.Schema(
	{
		name: [{ type: String, minlength: 2, maxlength: 50 }],
		bankDetails: [{ type: String, minlength: 2, maxlength: 11 }],
		phoneNumber: [{ type: String, minlength: 2, maxlength: 15 }],
		emailAddresses: [{ type: String, minlength: 2, maxlength: 50 }],
		website: [{ type: String, minlength: 2, maxlength: 50 }],
		socialMediaHandles: [{ type: String, minlength: 2, maxlength: 50 }],
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

const validateScammer = (payload) => {
	const schema = Joi.object({
		name: Joi.min(2).max(50).required(),
		bankDetails: Joi.array().items(Joi.string().min(2).max(11)).default([]),
		phoneNumber: Joi.array().items(Joi.string().min(2).max(15)).default([]),
		emailAddresses: Joi.array().items(Joi.string().min(2).max(50)).default([]),
		website: Joi.array().items(Joi.string().min(2).max(50)).default([]),
		socialMediaHandles: Joi.array()
			.items(Joi.string().min(2).max(20))
			.default([]),
		adminId: Joi.string().min(2).max(25).required(),
	});
	return schema.validate(payload);
};

const Scammer = mongoose.model("Scammer", scammerSchema);

module.exports = { Scammer, validateScammer };
