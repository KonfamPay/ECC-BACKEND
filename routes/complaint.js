const express = require("express");
const {
	getAllComplaints,
	createNewComplaint,
	getAllComplaintsByAUser,
	getComplaintNumbers,
	updateComplaintStatus,
	deleteComplaint,
} = require("../controllers/complaintController");
const { admin, leadAdmin } = require("../middleware/admin");
const auth = require("../middleware/auth");
const complaintRouter = express.Router();

complaintRouter.get("/", getAllComplaints);
complaintRouter.post("/", auth, createNewComplaint);
complaintRouter.get("/:userId", auth, getAllComplaintsByAUser);
complaintRouter.get("/numbers/:userId", getComplaintNumbers);
complaintRouter.patch("/", admin, updateComplaintStatus);
complaintRouter.delete("/:id", admin, deleteComplaint);

module.exports = complaintRouter;
