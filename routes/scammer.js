const express = require("express");
const scammerRouter = express.Router();
const {
	createNewScammer,
	deleteNewScammer,
} = require("../controllers/scammerController");
const { admin, leadAdmin } = require("../middleware/admin");

scammerRouter.post("/", admin, createNewScammer);
scammerRouter.delete("/", leadAdmin, deleteNewScammer);

module.exports = scammerRouter;
