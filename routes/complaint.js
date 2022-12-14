const express = require("express");
const {
	getAllComplaints,
	createNewComplaint,
	getAllComplaintsByAUser,
	getComplaintNumbers,
	updateComplaintStatus,
	deleteComplaint,
} = require("../controllers/complaintController");
const complaintRouter = express.Router();
const auth = require("../middleware/auth");

complaintRouter.get("/", getAllComplaints);
complaintRouter.post("/", createNewComplaint);
complaintRouter.get("/:userId", getAllComplaintsByAUser);
complaintRouter.get("/numbers/:userId", getComplaintNumbers);
complaintRouter.patch("/", updateComplaintStatus);
complaintRouter.delete("/", deleteComplaint);

module.exports = complaintRouter;
