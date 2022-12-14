const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminSchema = new mongoose.Schema(
	{
		email: {
			minlength: 5,
			maxlength: 50,
			unique: true,
			required: true,
			type: String,
		},
		name: {
			minlength: 5,
			maxlength: 50,
			required: true,
			type: String,
		},
		phoneNumber: {
			required: true,
			unique: true,
			length: 11,
			type: String,
		},
		role: {
			enum: ["admin", "Lead-admin"],
			default: "admin",
			required: true,
			type: String,
		},
		password: {
			minlength: 5,
			maxlength: 127,
			required: false,
			type: String,
		},
	},
	{ timestamps: true }
);

adminSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			userId: this._id,
			name: this.name,
			phoneNumber: this.phoneNumber,
			email: this.email,
			role: this.role,
		},
		process.env.JWT_PRIVATE_KEY,
		{
			expiresIn: "1h",
		}
	);
	return token;
};

const Admin = mongoose.model("Admin", adminSchema);

// Function for validating before persisting anything to the db
const validateAdmin = (admin) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(5).required.label("Name"),
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: false } })
			.min(3)
			.max(100)
			.label("Email"),
		phoneNumber: Joi.string()
			.regex(/^[0-9]{11}$/)
			.length(11)
			.label("Phone Number")
			.required(),
		role: Joi.string().min(4).max(10).valid("admin", "Lead-admin"),
		password: Joi.string().min(8).max(40).required().label("Password"),
	});
	return schema.validate(admin);
};

// const validateVerifyInputs = (payload) => {
// 	const schema = Joi.object({
// phoneNumber: Joi.string()
// 	.regex(/^[0-9]{11}$/)
// 	.length(11)
// 	.label("Phone Number")
// 	.required(),
// NIN: Joi.string()
// 			.regex(/^[0-9]{11}$/)
// 			.length(11)
// 			.label("National Identification Number")
// 			.required(),
// 		firstName: Joi.string().min(2).max(50).required().label("First Name"),
// 		lastName: Joi.string().min(2).max(50).required().label("Last Name"),
// 	});
// 	return schema.validate(payload);
// };

module.exports = { Admin, validateAdmin };
