const express = require("express");
const scamRouter = express.Router();
const {
	createNewScam,
	deleteNewScam,
} = require("../controllers/scamController");
const { admin, leadAdmin } = require("../middleware/admin");

scamRouter.post("/", admin, createNewScam);
scamRouter.delete("/", leadAdmin, deleteNewScam);

module.exports = scamRouter;
