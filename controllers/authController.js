const Joi = require("joi");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/user");
const passport = require("passport");
const mongoose = require("mongoose");

const authenticateUser = async (req, res) => {
	const { error } = validate(req.body);
	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	let user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(StatusCodes.NOT_FOUND).json({
			message:
				"This email is not registered with any account. Please check the email and try again",
		});

	const data = { id: user._id, email: user.email };

	if (user && !user.password)
		return res.status(StatusCodes.BAD_REQUEST).json({
			message:
				"This account was created using a social option. Kindly sign in with Google or Twitter.",
		});
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword)
		return res.status(StatusCodes.BAD_REQUEST).json({
			message:
				"This password does not match the password associated with this account. Kindly check the password and try again",
		});
	if (!isUserVerifiedFunc(req, res, user)) {
		return res.status(StatusCodes.OK).json({ status: "success", data });
	}
};

const signInWithGoogle = async (req, res) => {
	let user = await User.findOne({ email: req.body.email });

	if (user && user.oauthId) {
		const token = user.generateAuthToken();
		return res.status(StatusCodes.OK).send({ token });
	} else if (user && !user.oauthId) {
		user.oauthId = req.body.oauthId;
		user.profilePic = req.body.profilePic;
		await user.save();
		return res.status(StatusCodes.OK).send({ token });
	}

	// Create a new user if there is no user
	else if (!user) {
		user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			oauthId: req.body.oauthId,
			profilePic: req.body.profilePic,
		});
		console.log(user);
		try {
			const result = await user.save();
			console.log(result);
		} catch (err) {
			console.log(err);
		}
		const token = user.generateAuthToken();
		return res.status(StatusCodes.OK).send({ token });
	}
};

const googleCallback = passport.authenticate("google", {
	failureRedirect: "/api/auth/failed",
});

const googleSignInSuccessful = async (req, res) => {
	const user = await User.findOne({ oauthId: req.user.id });
	const token = user.generateAuthToken();
	res.status(StatusCodes.OK).json({ token });
};

const googleSignInFailed = async (req, res) => {
	res
		.send(StatusCodes.BAD_REQUEST)
		.json({ message: "Could not log in with google" });
};

const isUserVerified = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This UserId is not valid!" });
	let user = await User.findById(id);
	if (!user)
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message:
				"This email is not registered with any account. Please check the email and try again",
		});

	message = "This user's account and email have been verified 🎉";

	if (!isUserVerifiedFunc(req, res, user)) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			userId: user._id,
			emailVerified: user.emailVerified,
			accountVerified: user.accountVerified,
			message,
		});
	}
};

const isUserVerifiedFunc = (req, res, user) => {
	if (!user.accountVerified || !user.emailVerified) {
		!user.accountVerified &&
			(message = "This user's account has not been verified. Kindly verify!");
		!user.emailVerified &&
			(message = "This user's email has not been verified. Kindly verify! ");
		!user.accountVerified === !user.emailVerified &&
			(message =
				"This user's account and email has not been verified. Kindly verify!");
		return res.status(StatusCodes.OK).json({
			status: "fail",
			userId: user._id,
			emailVerified: user.emailVerified,
			accountVerified: user.accountVerified,
			message,
		});
	}
};

const validate = (user) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: false } })
			.min(3)
			.max(100)
			.required()
			.label("Email"),
		password: Joi.string().min(8).max(40).required().label("Password"),
	});
	return schema.validate(user);
};

module.exports = {
	authenticateUser,
	signInWithGoogle,
	googleCallback,
	googleSignInSuccessful,
	googleSignInFailed,
	isUserVerified,
};
