const Joi = require("joi");
const mongoose = require("mongoose");

const scammerSchema = new mongoose.Schema(
	{
		name: [{ type: String, minlength: 2, maxlength: 50 }],
		bankDetails: [{ type: String, minlength: 2, maxlength: 11 }],
		phoneNumber: [{ type: String, minlength: 2, maxlength: 11 }],
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
		userId: Joi.required(),
		title: Joi.string().required(),
		message: Joi.string().required(),
		type: Joi.string().required(),
		//   .valid("open", "resolved", "pending", "closed", "account"),
	});
	return schema.validate(payload);
};

const Scammer = mongoose.model("Scammer", scammerSchema);

module.exports = { Scammer, validateScammer };
