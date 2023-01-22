const express = require("express");
const scamRouter = express.Router();
const {
	createNewScamReport,
	getAllScams,
	getScam,
	deleteNewScamReport,
} = require("../controllers/scamController");
const { admin, leadAdmin } = require("../middleware/admin");

scamRouter.post("/create/:scammerId", admin, createNewScamReport);
// scamRouter.put("/:scamId", admin, updateScammer);
scamRouter.get("/", getAllScams);
scamRouter.get("/:scamId", admin, getScam);
scamRouter.delete("/:scamId", leadAdmin, deleteNewScamReport);

module.exports = scamRouter;
