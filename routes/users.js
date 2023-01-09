const express = require("express");
const usersRouter = express.Router();
const {
	createNewUser,
	getAllUsers,
	getUser,
	verifyAccount,
	verifyUserEmail,
	resendVerifyEmailCode,
	deactivateUser,
	activateUser,
} = require("../controllers/usersController");
const { admin } = require("../middleware/admin");
const auth = require("../middleware/auth");

usersRouter.post("/", createNewUser);
usersRouter.get("/", admin, getAllUsers);
usersRouter.get("/:userId", auth, getUser);
usersRouter.post("/verify/:id", verifyAccount);
usersRouter.post("/verify_email/:id", verifyUserEmail);
usersRouter.post("/verify_email/:id/resend_code", resendVerifyEmailCode);
usersRouter.post("/deactivate/:id", admin, deactivateUser);
usersRouter.post("/activate/:id", admin, activateUser);

module.exports = usersRouter;
