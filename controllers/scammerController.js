const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");
const { Complaint } = require("../models/complaint");
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
	// console.log(scammer)
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
	const { complaintId, replyId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(replyId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ status: "fail", message: "This replyId is not valid!" });
	const reply = await Reply.findById(replyId);
	if (reply) {
		await Reply.findByIdAndDelete(replyId);
		await Complaint.findByIdAndUpdate(
			complaintId,
			{
				$pull: {
					replies: replyId,
				},
			},
			{ new: true }
		);
		await ActivityService.addActivity({
			adminId: req.admin.adminId,
			actionType: "complaint",
			actionDone: "deleted_reply",
			complaintId: complaintId,
		});
		return res.status(StatusCodes.OK).json({
			status: "success",
			message: `This reply with the id ${replyId} has been deleted`,
			data: reply,
		});
	} else {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ status: "fail", message: "This reply does not exist!" });
	}
};

module.exports = {
	createNewScammer,
	deleteScammer,
};
