const express = require("express");
const activityRouter = express.Router();
const {
	getAllActivity,
	getActivityByAdmin,
} = require("../controllers/activityController");
const { admin, leadAdmin } = require("../middleware/admin");

activityRouter.get("/", admin, getAllActivity);
activityRouter.get("/:id", leadAdmin, getActivityByAdmin);

module.exports = activityRouter;
