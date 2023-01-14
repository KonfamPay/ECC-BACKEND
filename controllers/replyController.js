const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");
const { Complaint } = require("../models/complaint");
const { ActivityService } = require("./activityController");
const { NotificationService } = require("./notificationController");

const adminCreateAComplaintReply = async (req, res) => {
	const { adminId } = req.admin;
	const { content } = req.body;
	const { complaintId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(complaintId)) {
		throw new Error("Invalid complaint request Id");
	}

	if (!content) {
		return res.status(StatusCodes.NO_CONTENT).json({
			message: "All Fields are required",
		});
	}

	const reply = new Reply({
		adminId,
		complaintId,
		content,
	});

	const createdReply = await reply.save();

	await Complaint.findByIdAndUpdate(
		complaintId,
		{
			$push: { replies: createdReply._id },
		},
		{ new: true, useFindAndModify: false }
	);

	const complaint = await Complaint.findById(complaintId);

	console.log(complaint.userId)

	await NotificationService.sendNotification({
		userId: complaint.userId,
		title: `Reply: ${complaint.title}`,
		message: `Your complaint with the title "${complaint.title}" just received a new reply from us ${createdReply.content}`,
		type: "pending",
	});

	await ActivityService.addActivity({
		userId: complaint.userId,
		adminId,
		actionType: "complaint",
		actionDone: "replied_complaint",
		complaintId: complaint._id,
	});

	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Reply was created successfully! 🎉",
		data: createdReply,
	});
};

const userCreateAComplaintReply = async (req, res) => {
	const { userId } = req.user;
	const { content } = req.body;
	const { complaintId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(complaintId)) {
		throw new Error("Invalid complaint request Id");
	}

	if (!content) {
		return res.status(StatusCodes.NO_CONTENT).json({
			message: "All Fields are required",
		});
	}

	const reply = new Reply({
		userId,
		complaintId,
		content,
	});

	const createdReply = await reply.save();

	await Complaint.findByIdAndUpdate(
		complaintId,
		{
			$push: { replies: createdReply._id },
		},
		{ new: true, useFindAndModify: false }
	);

	const complaint = await Complaint.findById(complaintId);

	await NotificationService.sendNotification({
		userId: complaint.userId,
		title: `Reply: ${complaint.title}`,
		message: `Your complaint with the title "${complaint.title}" just received a new reply from us ${createdReply.content}`,
		type: "pending",
	});

	await ActivityService.addActivity({
		userId: complaint.userId,
		actionType: "complaint",
		actionDone: "replied_complaint",
		complaintId: complaint._id,
	});

	return res.status(StatusCodes.CREATED).json({
		status: "success",
		message: "Reply was created successfully! 🎉",
		data: createdReply,
	});
};

const deleteReply = async (req, res) => {
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
	adminCreateAComplaintReply,
	userCreateAComplaintReply,
	deleteReply,
};
