const express = require("express");
const scammerRouter = express.Router();
const {
	createNewScammer,
	getScammer,
	getAllScammers,
	updateScammer,
	deleteScammer,
} = require("../controllers/scammerController");
const { admin, leadAdmin } = require("../middleware/admin");

scammerRouter.post("/", admin, createNewScammer);
scammerRouter.put("/:scammerId", admin, updateScammer);
scammerRouter.get("/", admin, getAllScammers);
scammerRouter.get("/:scammerId", admin, getScammer);
scammerRouter.delete("/:scammerId", leadAdmin, deleteScammer);

module.exports = scammerRouter;
