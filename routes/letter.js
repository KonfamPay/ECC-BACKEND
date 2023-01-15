const express = require("express");
const {
	createComplaintLetter,
	getAllLetters,
	getALetter,
	getAllLettersByAUser,
	deleteLetter,
} = require("../controllers/letterController");
const { admin, leadAdmin } = require("../middleware/admin");
const auth = require("../middleware/auth");
const letterRouter = express.Router();

letterRouter.post("/", auth, createComplaintLetter);
letterRouter.get("/", auth, getAllLetters);
letterRouter.get("/:id", auth, getALetter);
letterRouter.get("/user/:userId", auth, getAllLettersByAUser);
letterRouter.delete("/:id", admin, deleteLetter);

module.exports = letterRouter;
