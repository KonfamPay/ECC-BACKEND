const express = require("express");
const replyRouter = express.Router();
const {
	adminCreateAComplaintReply,
	userCreateAComplaintReply,
	deleteReply,
} = require("../controllers/replyController");
const { admin } = require("../middleware/admin");
const auth = require("../middleware/auth");

replyRouter.post("/admin/:id", admin, adminCreateAComplaintReply);
replyRouter.post("/user/:id", auth, userCreateAComplaintReply);
replyRouter.delete("/:complaintId/:replyId", admin, deleteReply);

module.exports = replyRouter;
