const express = require("express");
const scammerRouter = express.Router();
const {
	createNewScammer,
	deleteScammer,
} = require("../controllers/scammerController");
const { admin, leadAdmin } = require("../middleware/admin");

scammerRouter.post("/", admin, createNewScammer);
scammerRouter.delete("/", leadAdmin, deleteScammer);

module.exports = scammerRouter;
