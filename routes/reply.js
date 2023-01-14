const express = require("express");
const replyRouter = express.Router();
const {
	adminCreateAComplaintReply,
	userCreateAComplaintReply,
	deleteReply,
} = require("../controllers/replyController");
const { admin } = require("../middleware/admin");
const auth = require("../middleware/auth");

replyRouter.post("/admin/:complaintId", admin, adminCreateAComplaintReply);
replyRouter.post("/user/:complaintId", auth, userCreateAComplaintReply);
replyRouter.delete("/:complaintId/:replyId", admin, deleteReply);

module.exports = replyRouter;
