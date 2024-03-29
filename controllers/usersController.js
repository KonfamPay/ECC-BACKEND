const bcrypt = require("bcrypt");
const {
	User,
	validateUser: validate,
	validateVerifyInputs,
} = require("../models/user");
const mongoose = require("mongoose");
const { sendMail } = require("../utils/node-mailer-transport");
const { EmailCode, validateEmailCode } = require("../models/emailCode");
const { NotificationService } = require("./notificationController");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createNewUser = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res.status(StatusCodes.BAD_REQUEST).json({
				message:
					"This email is already registered to an account, kindly Login.",
			});

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		console.log(req.body.password, password);
		const { email } = req.body;
		user = new User({ email, password });
		await user.save();

		// Generate code to send to email
		const code = Math.floor(1000 + Math.random() * 9000).toString();
		await EmailCode.deleteMany({ userId: user._id });
		const emailCode = new EmailCode({ code, userId: user._id });
		const result = await emailCode.save();
		const link = `${process.env.HOST}/api/user/login/verify/${user._id}/${code}`;
		try {
			sendMail(
				user.email,
				(subject = "OTP To Login to your Konfampay User Account"),
				(message = `<p>Use this code to verify your email address:</p> <h1>${code}</h1><p>Or Login using this link: <br>${link}</p>`),
				(res) => {
					return (err, info) => {
						if (err) throw new Error("Email failed to send");
						res
							.status(StatusCodes.OK)
							.json({ status: "success", message: "Email has been sent" });
					};
				},
				res
			);
		} catch (err) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ status: "fail", message: "Email failed to send" });
		}
		return res.status(StatusCodes.CREATED).json({ code, user });
	} catch (error) {
		throw new Error("Failed to create the new user");
	}
};

const getAllUsers = async (req, res) => {
	const users = await User.find();
	if (users) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: users,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No users is in the database",
		});
	}
};

const getUser = async (req, res) => {
	const id = req.params.userId;
	const users = await User.findById(id);
	if (users) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: users,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No user with this id is in the database",
		});
	}
};

const verifyAccount = async (req, res) => {
	const { id } = req.params;
	if (!id)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "The id is required in the body of the request!" });

	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This is not a valid mongoose id" });

	const user = await User.findById(id);

	if (!user)
		return res
			.status(StatusCodes.NOT_FOUND)
			.send({ message: "This user does not exist" });

	if (user.accountVerified)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This user has already been verified!" });

	const {
		firstName,
		lastName,
		middleName,
		dob,
		phoneNumber,
		address,
		state,
		NIN,
	} = req.body;

	const { error } = validateVerifyInputs({
		firstName,
		lastName,
		dob,
		phoneNumber,
		address,
		state,
		NIN,
		middleName,
	});

	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	user.firstName = firstName;
	user.lastName = lastName;
	user.dob = dob;
	user.phoneNumber = phoneNumber;
	user.address = address;
	user.NIN = NIN;
	user.state = state;
	user.middleName = middleName;

	user.accountVerified = true;
	await user.save();

	const newToken = await user.generateAuthToken();

	res.status(StatusCodes.OK).json({ token: newToken });
};

const verifyUserEmail = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This Id is not valid!" });

	const user = await User.findById(id);
	if (!user)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "This user does not exist!" });

	if (user.emailVerified)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This email has already been verified" });

	let emailCode = await EmailCode.findOne({ userId: id });

	if (!emailCode)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Please request for another code!" });

	const { code } = req.body;

	const { error } = validateEmailCode({ code });

	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	if (emailCode.code !== code)
		return res.status(422).json({ message: "You have entered a wrong code" });

	await NotificationService.sendNotification({
		userId: user._id,
		title: "Email Verified Successfully",
		message:
			"You have successfully verified your email. File a complaint and let's help you resolve it!",
		type: "account",
	});
	user.emailVerified = true;
	await user.save();

	await EmailCode.deleteOne({ userId: id, code });
	const token = user.generateAuthToken();

	return res
		.status(StatusCodes.OK)
		.json({ message: "Email verified successfully!", token });
};

const resendVerifyEmailCode = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This userId is not valid!" });

	const user = await User.findById(id);
	if (!user)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This user does not exist!" });

	// Generate the code to send to the user
	const code = Math.floor(1000 + Math.random() * 9000).toString();
	await EmailCode.deleteMany({ userId: user._id });
	const emailCode = new EmailCode({ code, userId: user._id });
	const result = await emailCode.save();
	const link = `${process.env.HOST}/api/user/login/verify/${user._id}/${code}`;
	try {
		sendMail(
			user.email,
			(subject = "OTP To Login to your Konfampay User Account"),
			(message = `<p>Use this code to verify your email address:</p> <h1>${code}</h1><p>Or Login using this link: <br>${link}</p>`),
			(res) => {
				return (err, info) => {
					if (err) throw new Error("Email failed to send");
					res
						.status(StatusCodes.OK)
						.json({ status: "success", message: "Email has been sent" });
				};
			},
			res
		);
	} catch (err) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ status: "fail", message: "Email failed to send" });
	}
};

const updateUserDetails = async (req, res) => {
	const { firstName, lastName, middleName, email, dob, address, state } =
		req.body;
	const data = { firstName, lastName, middleName, email, dob, address, state };
	const userId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	if (!(req.user.userId === userId)) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "You are not allowed to update this user's details" });
	}

	await User.findOneAndUpdate({ userId }, data);

	return res.status(StatusCodes.OK).json({
		status: "success",
		message: "Your details have been updated successfully",
	});
};

const updateUserProfilePic = async (req, res) => {
	const userId = req.params.id;
	const { public_id: profilePicCloudinaryId, url: profilePicUrl } = req.upload;

	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	if (!(req.user.userId === userId)) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "You cannot update this user's profile icon" });
	}

	await User.findOneAndUpdate(
		{ userId },
		{ profilePicUrl, profilePicCloudinaryId }
	);

	return res.status(StatusCodes.OK).json({
		status: "success",
		message: "Your profile picture have been updated successfully",
		data: { profilePicUrl, profilePicCloudinaryId },
	});
};

const deactivateUser = async (req, res) => {
	const userId = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This UserId is not valid!" });
	const user = await User.findById(userId);
	if (user) {
		await User.findByIdAndUpdate(
			userId,
			{ isDeactivated: true },
			{ new: false }
		);
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "user",
			actionDone: "deactivated_user",
			userId: userId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This user with the id ${userId} has been deactivated`,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This user does not exist!" });
	}
};

const activateUser = async (req, res) => {
	const userId = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This UserId is not valid!" });
	const user = await User.findById(userId);
	if (user) {
		await User.findByIdAndUpdate(
			userId,
			{ isDeactivated: false },
			{ new: false }
		);
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "user",
			actionDone: "activated_user",
			userId: userId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This user with the id ${userId} has been activated`,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This user does not exist!" });
	}
};

module.exports = {
	createNewUser,
	getAllUsers,
	getUser,
	verifyAccount,
	verifyUserEmail,
	resendVerifyEmailCode,
	updateUserDetails,
	updateUserProfilePic,
	deactivateUser,
	activateUser,
};
