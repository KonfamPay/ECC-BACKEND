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

	let scammer = new Scammer({
		name,
		bankDetails,
		phoneNumber,
		emailAddresses,
		website,
		socialMediaHandles,
		adminId,
	});

	if (name) {
		findScammer = await Scammer.find({
			name: { $all: name },
		});
		// console.log(findScammer);
	} else if (bankDetails) {
		findScammer = await Scammer.find({ bankDetails: { $all: bankDetails } });
	} else if (phoneNumber) {
		findScammer = await Scammer.find({ phoneNumber: { $all: phoneNumber } });
	} else if (emailAddresses) {
		findScammer = await Scammer.find({
			emailAddresses: { $all: emailAddresses },
		});
	} else if (website) {
		findScammer = await Scammer.find({ website: { $all: website } });
	} else if (socialMediaHandles) {
		findScammer = await Scammer.find({
			socialMediaHandles: { $all: socialMediaHandles },
		});
	}

	// let findScammer =
	// 	(await Scammer.find({ emailAddresses: { $all: emailAddresses } })) ||
	// 	(await Scammer.find({ name: { $all: name } }));
	console.log(findScammer);
	// if (findScammer) {
	// 	// let getScammerDetails = await Scammer.findById(findScammer._id);
	// 	return res.status(StatusCodes.NOT_FOUND).json({
	// 		message: `This scammer already exists in our database kindly add it to the scammer with the name `,
	// 		// message: `This scammer already exists in our database kindly add it to the scammer with the name ${getScammerDetails.name}`,
	// 	});
	// }

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
