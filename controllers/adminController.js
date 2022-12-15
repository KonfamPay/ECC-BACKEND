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

		return res.status(StatusCodes.CREATED).json({
			status: StatusCodes.CREATED,
			name: admin.name,
			email: admin.email,
			phoneNumber: admin.phoneNumber,
			role: admin.role,
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
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		console.log(req.body.password, password);
		const { email, name, phoneNumber, role } = req.body;
		admin = new Admin({ email, name, phoneNumber, role, password });
		await admin.save();

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
		name: admin.name,
		phoneNumber: admin.phoneNumber,
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
	const emailCode = new EmailCode({ code, userId: admin._id });
	const result = await emailCode.save();
	console.log(emailCode);
	const link = `${process.env.HOST}/api/admin/login/verify/${admin._id}/${code}`;
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
	return res.status(StatusCodes.OK).json({
		status: "success",
		code,
		data,
	});
};

const veifyAdminLogin = async (req, res) => {
	const adminId = req.params.adminId;
	const otp = req.params.otp;

	if (!mongoose.Types.ObjectId.isValid(adminId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	let emailCode = await EmailCode.findOne({ otp, userId: adminId });
	if (!emailCode)
		return res.status(StatusCodes.NOT_FOUND).json({
			message: "This otp is wrong kindly request another one",
		});
	let admin = await Admin.findById(adminId);
	if (!admin)
		return res.status(StatusCodes.NOT_FOUND).json({
			message: "This admin does not exist",
		});
	const token = admin.generateAuthToken();
	const deleteEmailCode = await EmailCode.findByIdAnd(emailCode._id);
	res.status(200).json({ status: "success", adminId, token });
};

module.exports = { createAdmin, getAdminDetails, adminLogin, veifyAdminLogin };
