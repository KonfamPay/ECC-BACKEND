const { StatusCodes } = require("http-status-codes");
const { Letter, validateLetter } = require("../models/letter");

const createComplaintLetter = async (req, res) => {
	const { content } = req.body;
  const { userId } = req.user;

	if (!content.match(/[a-zA-Z0-9\.\(\)\{\}\[\]\/\\@]/g)) {
		res.status(StatusCodes.NOT_ACCEPTABLE).json({
			status: "fail",
			message: "Complaint Letter format does not match the desired format!",
		});
	}

	let letter = new Letter({
		content,
		userId,
	});
	let result = await letter.save();

	res.status(StatusCodes.OK).json({
		status: "success",
		message: "Complaint Letter has been created successfully",
		result,
	});
};

const getAllLetters = async (req, res) => {};

const getAllLettersByAUser = async (req, res) => {};

const deleteLetter = async (req, res) => {};

module.exports = {
	createComplaintLetter,
	getAllLetters,
	getAllLettersByAUser,
	deleteLetter,
};
