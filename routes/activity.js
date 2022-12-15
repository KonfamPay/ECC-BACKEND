const express = require("express");
const activityRouter = express.Router();
const {
	createNewActivity,
	getAllActivity,
} = require("../controllers/activityController");
const { admin } = require("../middleware/admin");

activityRouter.post("/", admin, createNewActivity);
activityRouter.get("/", admin, getAllActivity);

module.exports = activityRouter;
