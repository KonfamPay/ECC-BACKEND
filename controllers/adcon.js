const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { sendMail } = require("../utils/node-mailer-transport");
const { EmailCode, validateEmailCode } = require("../models/emailCode");

const resendVerifyEmailCode = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This adminId is not valid!" });

	let admin = await Admin.findOne({ _id: id });
	if (!admin)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This admin does not exist!" });
	// console.log(admin._id);
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

module.exports = {
	resendVerifyEmailCode,
};
