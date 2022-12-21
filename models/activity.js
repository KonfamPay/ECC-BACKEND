const mongoose = require("mongoose");
const Joi = require("joi");

const activitySchema = new mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
			required: false,
		},
		actionType: {
			type: String,
			enum: ["user", "complaint", "admin"],
			minlength: 4,
			maxlength: 9,
			required: true,
		},
		actionDone: {
			type: String,
			enum: [
				"added_user",
				"edited_user",
				"activated_user",
				"deactivated_user",
				"verified_user",
				"created_complaint",
				"approved_complaint",
				"deleted_complaint",
				"replied_complaint",
				"updated_complaint_status",
				"created_admin",
				"deleted_admin",
				"created_reply",
				"deleted_reply",
			],
			minlength: 5,
			maxlength: 50,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			minlength: 5,
			maxlength: 24,
			ref: "User",
			required: false,
			default: null,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			minlength: 5,
			maxlength: 24,
			ref: "Admin",
			required: false,
			default: null,
		},
		complaintId: {
			type: String,
			minlength: 5,
			maxlength: 100,
			required: false,
			default: null,
		},
	},
	{ timestamps: true }
);

// Function for validating before persisting anything to the db
const validateActivity = (activity) => {
	const schema = Joi.object({
		adminId: Joi.string().min(5).max(301).required(),
		actionType: Joi.string().min(5).max(30).valid("user", "complaint", "admin"),
		actionDone: Joi.string()
			.min(5)
			.max(25)
			.valid(
				"added_user",
				"edited_user",
				"activated_user",
				"deactivated_user",
				"verified_user",
				"created_complaint",
				"approved_complaint",
				"deleted_complaint",
				"replied_complaint",
				"updated_complaint_status",
				"created_admin",
				"deleted_admin",
				"created_reply",
				"deleted_reply"
			),
		userId: Joi.string().min(5).max(24),
		adminId: Joi.string().min(5).max(24),
		complaintId: Joi.string().min(5).max(24),
	});
	return schema.validate(activity);
};

const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Activity, validateActivity };
