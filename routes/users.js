const express = require("express");
const usersRouter = express.Router();
const {
	createNewUser,
	verifyAccount,
	verifyUserEmail,
	resendVerifyEmailCode,
	deactivateUser,
} = require("../controllers/usersController");
const { admin } = require("../middleware/admin");

usersRouter.post("/", createNewUser);
usersRouter.post("/verify/:id", verifyAccount);
usersRouter.post("/verify_email/:id", verifyUserEmail);
usersRouter.post("/verify_email/:id/resend_code", resendVerifyEmailCode);
usersRouter.post("/deactivate/:id", admin, deactivateUser);

module.exports = usersRouter;
