const express = require("express");
const scamRouter = express.Router();
const {
	createNewScamReport,
	deleteNewScam,
} = require("../controllers/scamController");
const { admin, leadAdmin } = require("../middleware/admin");

scamRouter.post("/create/:scammerId", admin, createNewScamReport);
// scamRouter.put("/:scammerId", admin, updateScammer);
// scamRouter.get("/", admin, getAllScammers);
// scamRouter.get("/:scammerId", admin, getScammer);
scamRouter.delete("/:scammerId", leadAdmin, deleteNewScam);

module.exports = scamRouter;
