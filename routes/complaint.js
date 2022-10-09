const express = require("express");
const {
	getAllComplaints,
	createNewComplaint,
	getAllComplaintsByAUser,
	getComplaintNumbers,
} = require("../controllers/complaint");
const complaintRouter = express.Router();

complaintRouter.get("/", getAllComplaints);
complaintRouter.post("/", createNewComplaint);
complaintRouter.get("/:userId", getAllComplaintsByAUser);
complaintRouter.get("/numbers/:userId", getComplaintNumbers);

module.exports = complaintRouter;
