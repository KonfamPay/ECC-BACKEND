const mongoose = require("mongoose");
const Joi = require("joi");

const complaintSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},

		title: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 100,
		},
		complaintLocation: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 100,
		},
		brandName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		brandContact: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 75,
		},
		productCategory: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		brandBankAccountNumber: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 30,
		},
		brandBankAccountName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		brandBank: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		brandSocialMediaHandle: {
			type: String,
			required: false,
			minlength: 3,
			maxlength: 50,
		},
		transactionReceipt: {
			url: {
				type: String,
				required: true,
				maxlength: 255,
				default: "",
			},
			cloudinaryId: {
				type: String,
				required: true,
				maxlength: 255,
				default: "",
			},
		},
		additionalDocuments: {
			type: [
				{
					url: {
						type: String,
						required: false,
						maxlength: 255,
						default: "",
					},
					cloudinaryId: {
						type: String,
						required: false,
						maxlength: 255,
						default: "",
					},
				},
			],
			default: [],
		},
		complaintAmount: {
			type: Number,
			required: true,
			min: [0, "The complaint amount has to be greater than 0"],
		},
		status: {
			type: String,
			enum: ["resolved", "open", "pending", "closed"],
			default: "pending",
		},
		details: {
			type: String,
			max: [2500, "This field has a maximum of 2500 characters"],
		},
		resolution: {
			type: String,
			enum: ["refund", "compensation", "apology", "replacement"],
			required: true,
			maxlength: 60,
		},
		replies: [
			{
				type: mongoose.Types.ObjectId,
			},
		],
		isScam: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const validateComplaint = (payload) => {
	const schema = Joi.object({
		title: Joi.string().min(5).max(100).required(),
		complaintLocation: Joi.string().min(5).max(100).required(),
		brandName: Joi.string().min(3).max(50).required(),
		brandContact: Joi.string().min(3).max(75).required(),
		productCategory: Joi.string().min(3).max(50).required(),
		brandBankAccountNumber: Joi.string().min(3).max(30).required(),
		brandBankAccountName: Joi.string().min(3).max(50).required(),
		brandBank: Joi.string().min(3).max(50).required(),
		brandSocialMediaHandle: Joi.string().min(3).max(50).required(),
		complaintAmount: Joi.number().positive().required(),
		resolution: Joi.string()
			.min(3)
			.max(20)
			.valid("refund", "compensation", "apology", "replacement")
			.required(),
		details: Joi.string().max(2500).required().min(5),
	});
	return schema.validate(payload);
};

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = { Complaint, validateComplaint };
