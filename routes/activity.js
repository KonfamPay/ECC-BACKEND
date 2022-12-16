const express = require("express");
const activityRouter = express.Router();
const {
	getAllActivity,
} = require("../controllers/activityController");
const { admin } = require("../middleware/admin");

activityRouter.get("/", admin, getAllActivity);

module.exports = activityRouter;
