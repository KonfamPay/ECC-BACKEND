const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { ActivityService } = require("./activityController");
const { Scam } = require("../models/scam");

const createNewScamReport = async (req, res) => {
	const { adminId } = req.admin;
	const { scammerId } = req.params;
	const { reportContent, complaintId } = req.body;

	if (
		!mongoose.Types.ObjectId.isValid(scammerId) ||
		!mongoose.Types.ObjectId.isValid(complaintId)
	) {
		throw new Error("Invalid complain or scammer Id");
	}

	let scam = new Scam({
		adminId,
		complaintId,
		scammerId,
		reportContent,
	});

	await scam.save();

	await ActivityService.addActivity({
		actionType: "scam",
		actionDone: "created_scam",
		adminId,
		complaintId,
		scamId: scam.id,
		scammerId,
	});

	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Scam report was created successfully",
	});
};

const getAllScams = async (req, res) => {
	const scam = await Scam.find();
	if (scam) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: scam,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No scammer is in the database",
		});
	}
};

const getScam = async (req, res) => {
	const { scamId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(scamId)) {
		throw new Error("Invalid scam request Id");
	}
	const scam = await Scam.findById(scamId);
	if (scam) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: scam,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No scam with this id is in the database",
		});
	}
};

const deleteNewScamReport = async (req, res) => {
	const { adminId } = req.admin;
	const { scamId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(scamId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This scamId is not valid!" });
	const scam = await Scam.findById(scamId);
	if (scamId) {
		await Scam.findByIdAndDelete(scamId);
		await ActivityService.addActivity({
			adminId,
			actionType: "scam",
			actionDone: "deleted_scam",
			scamId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This scam with the id ${scamId} has been deleted`,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This scam does not exist!" });
	}
};

module.exports = {
	createNewScamReport,
	getAllScams,
	getScam,
	deleteNewScamReport,
};
