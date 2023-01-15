const { StatusCodes } = require("http-status-codes");
const { Letter, validateLetter } = require("../models/letter");
const { User } = require("../models/user");
const mongoose = require("mongoose");

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

const getALetter = async (req, res) => {
	const { id } = req.params;
	const letter = await Letter.findById(id);
	if (!letter)
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No Letter is in database",
		});
	return res.status(StatusCodes.OK).json({
		status: "success",
		data: letter,
	});
};

const getAllLetters = async (req, res) => {
	const letters = await Letter.find();
	if (!letters)
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No Letter is in database",
		});
	return res.status(StatusCodes.OK).json({
		status: "success",
		data: letters,
	});
};

const getAllLettersByAUser = async (req, res) => {
	const { userId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	let user = await User.findById(userId);
	if (!user)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "This user does not exist in our database" });

	const letters = await Letter.find({ userId });
	return res.status(StatusCodes.OK).json({ status: "success", letters });
};

const deleteLetter = async (req, res) => {
	const { id: letterId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(letterId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This letterId is not valid" });

	const letter = await Letter.findOneAndDelete({ letterId });
	return res.status(StatusCodes.OK).json({
		status: "success",
		message: `Letter with id ${letterId} has been deleted`,
	});
};

module.exports = {
	createComplaintLetter,
	getAllLetters,
	getALetter,
	getAllLettersByAUser,
	deleteLetter,
};
