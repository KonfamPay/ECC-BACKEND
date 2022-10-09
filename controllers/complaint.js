const { User } = require("../models/user");
const mongoose = require("mongoose");
const { Complaint, validateComplaint } = require("../models/complaint");

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
	if (!userId) return res.status(404).json({ message: "userId is required" });
	if (!mongoose.Types.ObjectId.isValid(userId))
		return res.status(400).json({ message: "This userId is not valid" });

	let user = await User.findById(userId);
	if (!user)
		return res
			.status(404)
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

	if (error) return res.status(400).json({ message: error.details[0].message });

	if (
		!transactionReceipt ||
		!transactionReceipt.url ||
		!transactionReceipt.cloudinaryId
	)
		return res
			.status(400)
			.json({ message: "A transaction receipt is required" });

	if (additionalDocuments && !Array.isArray(additionalDocuments))
		return res
			.status(400)
			.json({ message: "Additional documents must be an array" });

	if (
		additionalDocuments &&
		additionalDocuments.length > 0 &&
		(!additionalDocuments[0].url || !additionalDocuments[0].cloudinaryId)
	)
		return res.status(400).json({
			message: "Each additional document must have a url and a cloudinaryId",
		});

	let complaint = new Complaint(req.body);
	let result = await complaint.save();

	res.status(200).json(result);
};

const getAllComplaintsByAUser = async (req, res) => {
	const { userId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(userId))
		return res.status(400).json({ message: "This userId is not valid" });

	let user = await User.findById(userId);
	if (!user)
		return res
			.status(404)
			.json({ message: "This user does not exist in our database" });

	const complaints = await Complaint.find({ userId });
	return res.status(200).send(complaints);
};

const getComplaintNumbers = async (req, res) => {
	const { userId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(userId))
		return res.status(400).json({ message: "This userId is not valid" });

	let user = await User.findById(userId);

	if (!user)
		return res
			.status(404)
			.json({ message: "This user does not exist in our database" });

	const pendingNumber = await Complaint.find({ status: "pending" }).count();
	const openNumber = await Complaint.find({ status: "open" }).count();
	const resolvedNumber = await Complaint.find({ status: "resolved" }).count();
	const closedNumber = await Complaint.find({ status: "closed" }).count();

	return res.status(200).json({
		pending: pendingNumber,
		open: openNumber,
		resolved: resolvedNumber,
		closed: closedNumber,
	});
};

const getAllComplaints = async (req, res) => {
	const complaints = await Complaint.find({});
	return res.status(200).send(complaints);
};

module.exports = {
	createNewComplaint,
	getAllComplaintsByAUser,
	getComplaintNumbers,
	getAllComplaints,
};
