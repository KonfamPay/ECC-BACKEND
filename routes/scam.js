const express = require("express");
const scamRouter = express.Router();
const {
	createNewScamReport,
	deleteNewScamReport,
} = require("../controllers/scamController");
const { admin, leadAdmin } = require("../middleware/admin");

scamRouter.post("/create/:scammerId", admin, createNewScamReport);
// scamRouter.put("/:scammerId", admin, updateScammer);
// scamRouter.get("/", admin, getAllScammers);
// scamRouter.get("/:scammerId", admin, getScammer);
scamRouter.delete("/:scamId", leadAdmin, deleteNewScamReport);

module.exports = scamRouter;
