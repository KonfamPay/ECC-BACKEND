const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const activitySchema = new mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		actionType: {
			type: String,
			enum: ["user", "complaint"],
			minlength: 5,
			maxlength: 30,
			required: true,
		},
		action_done: {
			type: Date,
			enum: [
				"addeed_user",
				"edited_user",
				"deleted_user",
				"verified_user",
				"approved_complaint",
				"deleted_complaint",
				"replied_comment",
			],
			minlength: 5,
			maxlength: 50,
			required: true,
		},
		username: {
			type: String,
			minlength: 5,
			maxlength: 50,
			required: false,
		},
		grevianceId: {
			type: String,
			minlength: 5,
			maxlength: 100,
			required: false,
		},
	},
	{ timestamps: true }
);

// Function for validating before persisting anything to the db
const validateActivity = (activity) => {
	const schema = Joi.object({
		actionType: Joi.string()
			.min(5)
			.max(30)
			.valid("user", "complaint")
			.required(),
		actionType: Joi.string()
			.min(5)
			.max(30)
			.valid(
				"addeed_user",
				"edited_user",
				"deleted_user",
				"verified_user",
				"approved_complaint",
				"deleted_complaint",
				"replied_comment"
			)
			.required(),
	});
	return schema.validate(activity);
};

const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Activity, validateActivity };
