const express = require("express");
const usersRouter = express.Router();
const {
	createNewUser,
	verifyAccount,
	verifyUserEmail,
	resendVerifyEmailCode,
	deleteUser,
} = require("../controllers/usersController");
const { admin } = require("../middleware/admin");

usersRouter.post("/", createNewUser);
usersRouter.post("/verify/:id", verifyAccount);
usersRouter.post("/verify_email/:id", verifyUserEmail);
usersRouter.post("/verify_email/:id/resend_code", resendVerifyEmailCode);
usersRouter.post("/delete/:id", admin, deleteUser);

module.exports = usersRouter;
