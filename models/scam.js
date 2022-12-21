const Joi = require("joi");
const mongoose = require("mongoose");

const scamSchema = new mongoose.Schema(
	{
		complaintId: {
			type: mongoose.Schema.Types.ObjectId,
			minlength: 1,
			maxlength: 24,
			required: true,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			minlength: 1,
			maxlength: 24,
			required: true,
		},
		scammerId: {
			type: mongoose.Schema.Types.ObjectId,
			minlength: 1,
			maxlength: 24,
			required: true,
		},
		reportContent: {
			type: String,
			minlength: 1,
			maxlength: 500,
			required: true,
		},
		reportDocuments: [
			{
				documentName: {
					type: String,
					minlength: 1,
					maxlength: 50,
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

const validateScam = (payload) => {
	const schema = Joi.object({
		complaintId: Joi.string().min(1).max(24).required(),
		adminId: Joi.string().min(1).max(24).required(),
		scammerId: Joi.string().min(1).max(24).required(),
		reportContent: Joi.string().min(1).max(500).required(),
		reportDocuments: Joi.array()
			.items(Joi.string().min(1).max(50))
			.default([]),
	});
	return schema.validate(payload);
};

const Scam = mongoose.model("Scam", scamSchema);

module.exports = { Scam, validateScam };
