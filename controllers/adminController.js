const bcrypt = require("bcrypt");
const { Admin, validateAdmin: validate } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const createAdmin = async (req, res) => {
	try {
		const { error } = validate(req.body);
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

const adminLogin = async (req, res) => {
	const { error } = validate(req.body);
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

	const token = admin.generateAuthToken();
	return res.status(StatusCodes.OK).json({
		status: "success",
		token,
		data,
	});
};

module.exports = { createAdmin, adminLogin };
