const { User } = require("../models/user");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Complaint, validateComplaint } = require("../models/complaint");
const { ActivityService } = require("./activityController");

const createNewComplaint = async (req, res) => {
	const {
		userId,
		title,
		complaintLocation,
		brandName,
		brandContact,
		productCategory,
		brandBankAccountNumber,
		brandBankAccountName,
		brandBank,
		brandSocialMediaHandle,
		additionalDocuments,
		complaintAmount,
		transactionReceipt,
		details,
		resolution,
	} = req.body;
	if (!userId)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "userId is required" });
	if (!mongoose.Types.ObjectId.isValid(userId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This userId is not valid" });

	let user = await User.findById(userId);
	if (!user)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "This user does not exist in our database" });

	const { error } = validateComplaint({
		title,
		complaintLocation,
		brandName,
		brandContact,
		productCategory,
		brandBankAccountName,
		brandBankAccountNumber,
		brandBank,
		brandSocialMediaHandle,
		complaintAmount,
		details,
		resolution,
	});

	if (error)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: error.details[0].message });

	if (
		!transactionReceipt ||
		!transactionReceipt.url ||
		!transactionReceipt.cloudinaryId
	)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "A transaction receipt is required" });

	if (additionalDocuments && !Array.isArray(additionalDocuments))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Additional documents must be an array" });

	if (
		additionalDocuments &&
		additionalDocuments.length > 0 &&
		(!additionalDocuments[0].url || !additionalDocuments[0].cloudinaryId)
	)
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "Each additional document must have a url and a cloudinaryId",
		});

	let complaint = new Complaint({
		userId,
		title,
		complaintLocation,
		brandName,
		brandContact,
		productCategory,
		brandBankAccountNumber,
		brandBankAccountName,
		brandBank,
		brandSocialMediaHandle,
		additionalDocuments,
		complaintAmount,
		transactionReceipt,
		details,
		resolution,
	});
	let result = await complaint.save();
	await ActivityService.addActivity({
		actionType: "complaint",
		actionDone: "created_complaint",
		complaintId: result._id,
		userId,
	});

	res.status(StatusCodes.OK).json(result);
};

const getAllComplaintsByAUser = async (req, res) => {
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

	const complaints = await Complaint.find({ userId });
	return res.status(StatusCodes.OK).json({ complaints });
};

const getComplaintNumbers = async (req, res) => {
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

	const pendingNumber = await Complaint.find({ status: "pending" }).count();
	const openNumber = await Complaint.find({ status: "open" }).count();
	const resolvedNumber = await Complaint.find({ status: "resolved" }).count();
	const closedNumber = await Complaint.find({ status: "closed" }).count();

	return res.status(StatusCodes.OK).json({
		status: "success",
		data: {
			pending: pendingNumber,
			open: openNumber,
			resolved: resolvedNumber,
			closed: closedNumber,
		},
	});
};

const updateComplaintStatus = async (req, res) => {
	const { complaintId, status, isScam = false } = req.body;

	if (!mongoose.Types.ObjectId.isValid(complaintId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This complaintId is not valid" });
			
	const complaint = await Complaint.findOneAndUpdate(
		{ complaintId },
		{ status, isScam }
	);
	
	await ActivityService.addActivity({
		adminId: req.admin.adminId,
		actionType: "complaint",
		actionDone: "updated_complaint_status",
		complaintId,
	});
	
	return res.status(StatusCodes.OK).json({
		message: `Complaint with id ${complaintId} has its status to be updated as ${status}`,
	});
};

const getAllComplaints = async (req, res) => {
	const complaints = await Complaint.find();
	if (complaints) {
		return res.status(StatusCodes.OK).json({
			status: "success",
			data: complaints,
		});
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({
			status: "fail",
			message: "Complaint not found",
		});
	}
};

const deleteComplaint = async (req, res) => {
	const { id: complaintId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(complaintId))
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "This complaintId is not valid" });

	const complaint = await Complaint.findOneAndDelete({ complaintId });

	await ActivityService.addActivity({
		adminId: req.admin.adminId,
		actionType: "complaint",
		actionDone: "deleted_complaint",
		complaintId,
	});
	return res.status(StatusCodes.OK).json({
		status: "success",
		message: `Complaint with id ${complaintId} has been deleted`,
	});
};

module.exports = {
	createNewComplaint,
	getAllComplaintsByAUser,
	getComplaintNumbers,
	getAllComplaints,
	deleteComplaint,
	updateComplaintStatus,
};
