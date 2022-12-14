const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/user");

const renderResetPasswordPage = async (req, res) => {
	const { id, token } = req.params;

	// Check if the object id is valid
	if (!validObjectId(id))
		return res
			.status(StatusCodes.NOT_FOUND)
			.send("User does not exist. Invalid Id");

	// Check if the user id exists in the databse
	const user = await User.findOne({ _id: id });
	if (!user)
		return res.status(StatusCodes.NOT_FOUND).send("User does not exist!");

	const secret = process.env.JWT_PRIVATE_KEY + user.password;

	// Check if the Json web token is still valid
	try {
		const decoded = Jwt.verify(token, secret);
		res.render("reset-password", { email: decoded.email });
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).send("This link has expired!");
	}
};

const handleResetPassword = async (req, res) => {
	const { password } = req.body;
	const { id } = req.params;

	// Validate the password to check for errors
	const { error } = validatePassword(password);
	if (error)
		return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

	// Change the password of the user
	let user = await User.findById(id);
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	user.password = hashedPassword;
	const result = await user.save();
	console.log(result, hashedPassword);

	// Redirect the user to a page that says password reset was successful!
	return res.render("reset-password-successful", {
		email: user.email,
		password,
		loginLink: `${process.env.FRONTEND_BASE_URL}/login`,
	});
};

const validObjectId = (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return false;
	}
	return true;
};
const validatePassword = (password) => {
	const schema = Joi.object({
		password: Joi.string().required().min(8).max(50),
	});
	return schema.validate({ password });
};

module.exports = { renderResetPasswordPage, handleResetPassword };
