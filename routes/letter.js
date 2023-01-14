const express = require("express");
const {
	createComplaintLetter,
	getAllLetters,
	getAllLettersByAUser,
	deleteLetter,
} = require("../controllers/letterController");
const { admin, leadAdmin } = require("../middleware/admin");
const auth = require("../middleware/auth");
const letterRouter = express.Router();

letterRouter.post("/", auth, createComplaintLetter);
letterRouter.get("/", getAllLetters);
letterRouter.get("/:userId", auth, getAllLettersByAUser);
letterRouter.delete("/:id", admin, deleteLetter);

module.exports = letterRouter;
