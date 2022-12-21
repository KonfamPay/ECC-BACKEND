const Joi = require("joi");
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
		complaintId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Complaint",
			required: true,
		},
		content: { type: String, required: true },
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
