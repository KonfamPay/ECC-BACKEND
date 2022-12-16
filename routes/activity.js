const express = require("express");
const activityRouter = express.Router();
const {
	createNewActivitdy,
	getAllActivity,
} = require("../controllers/activityController");
const { admin } = require("../middleware/admin");

activityRouter.post("/", admin, createNewActivitdy);
activityRouter.get("/", admin, getAllActivity);

module.exports = activityRouter;
