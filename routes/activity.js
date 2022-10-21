const express = require("express");
const activityRouter = express.Router();
const {
	createNewActivity,
	getAllActivity,
} = require("../controllers/activity");

activityRouter.post("/", createNewActivity);
activityRouter.get("/", getAllActivity);

module.exports = activityRouter;
