const Joi = require("joi");
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			default: null,
		},
		complaintId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Complaint",
			required: true,
			default: null,
		},
		content: { type: String, required: true, default: null },
		uploadedDocuments: [
			{
				documentName: {
					type: String,
					required: true,
				},
				documentId: {
					type: String,
					required: true,
				},
				documentUrl: {
					type: String,
					required: true,
				},
			},
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);

const validateReply = (payload) => {
	const schema = Joi.object({
		code: Joi.string()
			.length(4)
			.pattern(/^[0-9]+$/)
			.required(),
	});
	return schema.validate(payload);
};

module.exports = { Reply, validateReply };
