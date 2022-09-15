const express = require("express");
const {
  createNewComplaint,
  getAllComplaintsByAUser,
} = require("../controllers/complaint");
const complaintRouter = express.Router();

complaintRouter.post("/", createNewComplaint);
complaintRouter.get("/:userId", getAllComplaintsByAUser);

module.exports = complaintRouter;
