const bcrypt = require("bcrypt");
const {
	Admin,
	validateAdmin,
	validateVerifyInputs,
} = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { sendMail } = require("../utils/node-mailer-transport");
const { EmailCode, validateEmailCode } = require("../models/emailCode");
const { ActivityService } = require("./activityController");
const dayjs = require("dayjs");

const createAdmin = async (req, res) => {
	try {
		const { error } = validateVerifyInputs(req.body);
		if (error)
			return res.status(StatusCodes.PARTIAL_CONTENT).json({
				status: StatusCodes.PARTIAL_CONTENT,
				message: error.details[0].message,
			});

		let admin = await Admin.findOne({ email: req.body.email });
		if (admin)
			return res.status(StatusCodes.OK).json({
				message:
					"This email is already registered to an account, kindly Login.",
			});
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		console.log(req.body.password, password);
		const { email, name, phoneNumber, role } = req.body;
		admin = new Admin({ email, name, phoneNumber, role, password });
		await admin.save();
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "admin",
			actionDone: "created_admin",
		});
		return res.status(StatusCodes.CREATED).json({
			status: "success",
			data: {
				name: admin.name,
				email: admin.email,
				phoneNumber: admin.phoneNumber,
				role: admin.role,
			},
		});
	} catch (error) {
		throw new Error("Failed to create the new admin");
	}
};

const getAdminDetails = async (req, res) => {
	try {
		let admin = await Admin.findOne({ email: req.admin.id });
		if (admin)
			return res.status(StatusCodes.OK).json({
				status: "fail",
				message: "This email does not exist",
			});
		return res.status(StatusCodes.OK).json({
			status: "success",
		});
	} catch (error) {
		throw new Error("Failed to create the new admin");
	}
};

const adminLogin = async (req, res) => {
	const { error } = validateAdmin(req.body);
	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	let admin = await Admin.findOne({ email: req.body.email });
	if (!admin)
		return res.status(StatusCodes.NOT_FOUND).json({
			message:
				"This email is not registered with any account. Please check the email and try again",
		});
	const data = {
		id: admin._id,
		email: admin.email,
		role: admin.role,
	};
	const validPassword = await bcrypt.compare(req.body.password, admin.password);
	if (!validPassword)
		return res.status(StatusCodes.BAD_REQUEST).json({
			message:
				"This password does not match the password associated with admin. Kindly check the password and try again",
		});

	// Generate code to send to email
	const code = Math.floor(1000 + Math.random() * 9000).toString();
	await EmailCode.deleteMany({ userId: admin._id });
	const emailCode = new EmailCode({ code, userId: admin._id });
	const result = await emailCode.save();
	console.log(emailCode);
	const link = `${process.env.HOST}/api/admi,n/login/verify/${admin._id}/${code}`;
	try {
		sendMail(
			admin.email,
			(subject = "OTP To Login to your Konfampay Admin Account"),
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

const veifyAdminLogin = async (req, res) => {
	const adminId = req.params.adminId;
	const code = req.params.otp;

	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	let admin = await Admin.findById(adminId);
	if (!admin)
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "This admin does not exist",
		});

	let emailCode = await EmailCode.findOne({ code, userId: adminId });
	if (!emailCode)
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "This otp is wrong kindly request another one",
		});

	await EmailCode.deleteMany({ userId: admin._id });

	const token = "Bearer " + admin.generateAuthToken();

	res.cookie("api-auth", token, {
		secure: false,
		httpOnly: true,
		expires: dayjs().add(7, "days").toDate(),
	});
	res.status(StatusCodes.OK).json({ status: "success", adminId });
};

const resendVerifyEmailCode = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This adminId is not valid!" });

	const admin = await Admin.findById(id);
	if (!admin)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This admin does not exist!" });

	const code = Math.floor(1000 + Math.random() * 9000).toString();
	await EmailCode.deleteMany({ userId: admin._id });
	const emailCode = new EmailCode({ code, userId: admin._id });
	const result = await emailCode.save();
	console.log(emailCode);
	const link = `${process.env.HOST}/api/admiin/login/verify/${admin._id}/${code}`;
	try {
		sendMail(
			admin.email,
			(subject = "OTP To Login to your Konfampay Admin Account"),
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

const deleteAdmin = async (req, res) => {
	const adminId = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This adminID is not valid" });
	const admin = await Admin.findById(adminId);
	if (admin) {
		await Admin.findByIdAndDelete(adminId);
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "admin",
			actionDone: "deleted_admin",
			userId: adminId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This admin with the id ${adminId} has been deleted`,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This admin does not exist!" });
	}
};

module.exports = {
	createAdmin,
	getAdminDetails,
	adminLogin,
	veifyAdminLogin,
	deleteAdmin,
	resendVerifyEmailCode,
};
