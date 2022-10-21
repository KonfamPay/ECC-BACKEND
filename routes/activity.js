const express = require("express");
const activitiesRouter = express.Router();
const {
	createNewActivity,
	getAllActivities,
} = require("../controllers/activity");

activitiesRouter.post("/", createNewActivity);
activitiesRouter.get("/", getAllActivities);

module.exports = activitiesRouter;
