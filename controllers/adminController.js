const bcrypt = require("bcrypt");
const { Admin, validateAdmin: validate } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const createAdmin = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: error.details[0].message });

		let admin = await Admin.findOne({ email: req.body.email });
		if (admin)
			return res.status(StatusCodes.BAD_REQUEST).json({
				message:
					"This email is already registered to an account, kindly Login.",
			});

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		console.log(req.body.password, password);
		const { email, name, phoneNumber, role } = req.body;
		admin = new Admin({ email, name, phoneNumber, role, password });
		await admin.save();

		return res.status(StatusCodes.CREATED).json({ admin });
	} catch (error) {
		throw new Error("Failed to create the new user");
	}
};

module.exports = { createAdmin };
