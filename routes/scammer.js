const express = require("express");
const scammerRouter = express.Router();
const {
	createNewScammer,
	getAllScammers,
	updateScammer,
	deleteScammer,
} = require("../controllers/scammerController");
const { admin, leadAdmin } = require("../middleware/admin");

scammerRouter.post("/", admin, createNewScammer);
scammerRouter.put("/:scammerId", admin, updateScammer);
scammerRouter.get("/", admin, getAllScammers);
scammerRouter.delete("/:scammerId", leadAdmin, deleteScammer);

module.exports = scammerRouter;
