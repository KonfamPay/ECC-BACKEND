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

	let findScammer =
		(await Scammer.findOne({ emailAddresses })) ||
		(await Scammer.findOne({ name }));
	console.log(findScammer);
	if (findScammer) {
		// let getScammerDetails = await Scammer.findById(findScammer._id);
		return res.status(StatusCodes.NOT_FOUND).json({
			message: `This scammer already exists in our database kindly add it to the scammer with the name `,
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
	await scammer.save();
	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Scammer was created successfully ",
		// data: scammer,
	});
};

const deleteNewScammer = async (req, res) => {
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
	deleteNewScammer,
};
