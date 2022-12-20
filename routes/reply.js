const express = require("express");
const replyRouter = express.Router();
const {
	createAComplaintReply,
	deleteReply,
} = require("../controllers/replyController");
const { admin } = require("../middleware/admin");

replyRouter.post("/", admin, createAComplaintReply);
replyRouter.delete("/:complaintId/:replyId", admin, deleteReply);

module.exports = replyRouter;
