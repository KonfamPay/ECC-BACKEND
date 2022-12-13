const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/user");

const handleForgotPassword = async (req, res) => {
	console.log(req.body);
	// Check if the email is a valid email address
	const { error } = validate(req.body);
	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	// Check if the email exists in the database
	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(404).json({
			message:
				"This email is not registered with any account. If you do not have an account, you should create one.",
		});

	// Create a unique secret key for each user
	const secret = process.env.JWT_PRIVATE_KEY + user.password;
	const token = await Jwt.sign(
		{
			id: user._id,
			email: user.email,
		},
		secret,
		{ expiresIn: "15m" }
	);

	// Generate the link
	const link = `${process.env.HOST}/api/reset-password/${user._id}/${token}`;

	// Send the mail
	const from = "ECC";
	const to = user.email;
	const subject = "RESET YOUR PASSWORD";
	const message = `Click on this <a href="${link}">link</a> to reset your password`;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});
	const mailOptions = {
		from,
		to,
		subject,
		text: message,
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ message: "Something went wrong on the server" });
		} else {
			return res.status(200).send("Email Sent " + info.response);
		}
	});
};

const validate = (user) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: false } })
			.min(3)
			.max(100)
			.required()
			.label("Email"),
	});
	return schema.validate(user);
};

module.exports = { handleForgotPassword };
