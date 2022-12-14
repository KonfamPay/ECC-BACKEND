const express = require("express");
const activityRouter = express.Router();
const {
	createNewActivity,
	getAllActivity,
} = require("../controllers/activityController");

activityRouter.post("/", createNewActivity);
activityRouter.get("/", getAllActivity);

module.exports = activityRouter;
