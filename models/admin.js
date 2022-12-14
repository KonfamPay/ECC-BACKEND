const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
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
			enum: ["admin", "leadAdmin"],
			default: "admin",
		},
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
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

const User = mongoose.model("User", userSchema);

// Function for validating before persisting anything to the db
const validateAdmin = (admin) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: false } })
			.min(3)
			.max(100)
			.label("Email"),
		password: Joi.string().min(8).max(40).required().label("Password"),
	});
	return schema.validate(admin);
};

// const validateVerifyInputs = (payload) => {
// 	const schema = Joi.object({
// 		phoneNumber: Joi.string()
// 			.regex(/^[0-9]{11}$/)
// 			.length(11)
// 			.label("Phone Number")
// 			.required(),
// 		NIN: Joi.string()
// 			.regex(/^[0-9]{11}$/)
// 			.length(11)
// 			.label("National Identification Number")
// 			.required(),
// 		firstName: Joi.string().min(2).max(50).required().label("First Name"),
// 		lastName: Joi.string().min(2).max(50).required().label("Last Name"),
// 	});
// 	return schema.validate(payload);
// };

module.exports = { User, validateAdmin };
