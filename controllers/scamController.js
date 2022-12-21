const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");
const { Complaint } = require("../models/complaint");
const { ActivityService } = require("./activityController");

const createNewScam = async (req, res) => {
	const { adminId } = req.adminId;
	const { content } = req.body;
	const { id: complaintId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(complaintId)) {
		throw new BadRequestError("Invalid complaint request Id");
	}

	if (!content) {
		return res.status(StatusCodes.NO_CONTENT).json({
			message: "All Fields are required",
		});
	}

	const reply = new Reply({
		complaintId,
		adminId,
		content,
	});

	const createdReply = await reply.save();
	// update the replies for the comment schema

	await Complaint.findByIdAndUpdate(
		complaintId,
		{
			$push: { replies: createdReply.id },
		},
		{ new: true, useFindAndModify: false }
	);

	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Reply was created successfully ",
		data: createdReply,
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
	createNewScam,
	deleteNewScam,
};
