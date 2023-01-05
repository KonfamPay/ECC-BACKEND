const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");
const { Complaint } = require("../models/complaint");
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

const deleteNewScam = async (req, res) => {
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
	createNewScamReport,
	deleteNewScam,
};
