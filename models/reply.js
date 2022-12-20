const Joi = require("joi");
const mongoose = require("mongoose");

const replySchema = new Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admi",
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
				},
				documentId: {
					type: String,
				},
				documentUrl: {
					type: String,
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
