const { Admin } = require("../models/admin");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { Reply } = require("../models/reply");

const createAComplaintReply = async (req, res) => {
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

	await Blog.findByIdAndUpdate(
		complaintId,
		{
			$push: { replies: createdReply.id },
		},
		{ new: true, useFindAndModify: false }
	);

	return res.status(StatusCodes.CREATED).json({
		message: "Reply was created successfully ",
		data: createdReply,
	});
};
