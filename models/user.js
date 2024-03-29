const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
	{
		firstName: {
			minlength: 2,
			maxlength: 50,
			required: false,
			type: String,
		},
		lastName: {
			minlength: 2,
			maxlength: 50,
			required: false,
			type: String,
		},
		middleName: {
			minlength: 2,
			maxlength: 50,
			required: false,
			type: String,
		},
		NIN: {
			minlength: 11,
			maxlength: 11,
			unique: true,
			required: false,
			type: String,
		},
		email: {
			minlength: 5,
			maxlength: 255,
			unique: true,
			required: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
			type: String,
		},
		password: {
			minlength: 5,
			maxlength: 127,
			required: false,
			type: String,
		},
		oauthId: {
			required: false,
			type: String,
		},
		profilePicUrl: {
			type: String,
			required: false,
			maxlength: 255,
			default: null,
		},
		profilePicCloudinaryId: {
			type: String,
			required: false,
			maxlength: 255,
			default: null,
		},
		dob: {
			required: false,
			type: Date,
		},
		phoneNumber: {
			required: false,
			type: String,
			default: "",
			length: 11,
		},
		state: {
			maxlength: 30,
			minlength: 3,
			required: false,
			type: String,
		},
		address: {
			maxlength: 255,
			required: false,
			type: String,
			default: "",
		},
		accountVerified: {
			type: Boolean,
			default: false,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		isDeactivated: {
			type: Boolean,
			maxlength: 4,
			default: false,
		},
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			userId: this._id,
			firstName: this.firstName,
			lastName: this.lastName, 
			profilePic: this.profilePic,
			email: this.email,
		},
		process.env.JWT_PRIVATE_KEY,
		{
			expiresIn: "1d",
		}
	);
	return token;
};

const User = mongoose.model("User", userSchema);

// Function for validating before persisting anything to the db
const validateUser = (user) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: false } })
			.min(3)
			.max(100)
			.label("Email"),
		password: Joi.string().min(8).max(40).required().label("Password"),
	});
	return schema.validate(user);
};

const validateVerifyInputs = (payload) => {
	const schema = Joi.object({
		phoneNumber: Joi.string()
			.regex(/^[0-9]{11}$/)
			.length(11)
			.label("Phone Number")
			.required(),
		NIN: Joi.string()
			.regex(/^[0-9]{11}$/)
			.length(11)
			.label("National Identification Number")
			.required(),
		firstName: Joi.string().min(2).max(50).required().label("First Name"),
		lastName: Joi.string().min(2).max(50).required().label("Last Name"),
		middleName: Joi.string().min(2).max(50).label("Middle Name"),
		dob: Joi.string().required().label("Date of Birth").length(10),
		state: Joi.string().max(30).min(3).required().label("State"),
		address: Joi.string().max(255).min(10).required().label("Address"),
	});
	return schema.validate(payload);
};

module.exports = { User, validateUser, validateVerifyInputs };
