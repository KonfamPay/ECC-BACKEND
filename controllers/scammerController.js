const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");
const { ActivityService } = require("./activityController");
const { Scammer } = require("../models/scammer");

const createNewScammer = async (req, res) => {
	const { adminId } = req.admin;
	const {
		name,
		bankDetails,
		phoneNumber,
		emailAddresses,
		website,
		socialMediaHandles,
	} = req.body;

	if (!req.body) {
		return res.status(StatusCodes.NO_CONTENT).json({
			message: "Fields cannot be empty",
		});
	}
	
	let findScammer;

	if (name) {
		findScammer = await Scammer.findOne({
			name: { $all: name },
		});
	} else if (bankDetails) {
		findScammer = await Scammer.findOne({ bankDetails: { $all: bankDetails } });
	} else if (phoneNumber) {
		findScammer = await Scammer.findOne({ phoneNumber: { $all: phoneNumber } });
	} else if (emailAddresses) {
		findScammer = await Scammer.findOne({
			emailAddresses: { $all: emailAddresses },
		});
	} else if (website) {
		findScammer = await Scammer.findOne({ website: { $all: website } });
	} else if (socialMediaHandles) {
		findScammer = await Scammer.findOne({
			socialMediaHandles: { $all: socialMediaHandles },
		});
	}

	let scammer = new Scammer({
		name,
		bankDetails,
		phoneNumber,
		emailAddresses,
		website,
		socialMediaHandles,
		adminId,
	});
	let result = await scammer.save();
	if (findScammer) {
		return res.status(StatusCodes.OK).json({
			message: `This scammer already exists in our database kindly up it to the scammer with the id '${findScammer._id}'`,
		});
	} else {
		await ActivityService.addActivity({
			actionType: "scammer",
			actionDone: "created_scammer",
			adminId,
			scammerId: result.id,
		});
		return res.status(StatusCodes.CREATED).json({
			status: "success",
			message: "Scammer was created successfully ",
			data: result,
		});
	}
};

const deleteScammer = async (req, res) => {
	const { scammerId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(scammerId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This scammerId is not valid!" });
	const scammer = await Scammer.findById(scammerId);
	if (scammer) {
		await Reply.findByIdAndDelete(scammerId);
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "scammer",
			actionDone: "deleted_scammer",
			scammerId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This scammer with the id ${scammerId} has been deleted`,
			data: scammer,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This scammer does not exist!" });
	}
};

const getAllScammers = async (req, res) => {
	const scammers = await Scammer.find();
	if (scammers) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: scammers,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "No scammer is in the database",
		});
	}
};

const updateScammer = async (req, res) => {
	const {
		name,
		bankDetails,
		phoneNumber,
		emailAddresses,
		website,
		socialMediaHandles,
	} = req.body;
	const { adminId } = req.admin;
	const { scammerId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(scammerId)) {
		throw new BadRequestError("Invalid scammer id");
	}

	if (!req.body) {
		return res.status(StatusCodes.NO_CONTENT).json({
			status: "fail",
			message: "Fields cannot be empty",
		});
	}
	let updateScammer = await Scammer.findByIdAndUpdate(
		scammerId,
		{
			name,
			bankDetails,
			phoneNumber,
			emailAddresses,
			website,
			socialMediaHandles,
		},
		{ new: true, useFindAndModify: false }
	);
	await ActivityService.addActivity({
		adminId,
		actionType: "scammer",
		actionDone: "updated_scammer",
		scammerId,
	});
	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Scammer was updated successfully ",
		data: updateScammer,
	});
};

module.exports = {
	createNewScammer,
	getAllScammers,
	updateScammer,
	deleteScammer,
};
