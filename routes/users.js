const express = require("express");
const usersRouter = express.Router();
const {
  createNewUser,
  verifyAccount,
  verifyUserEmail,
  resendVerifyEmailCode,
} = require("../controllers/usersController");

usersRouter.post("/", createNewUser);
usersRouter.post("/verify/:id", verifyAccount);
usersRouter.post("/verify_email/:id", verifyUserEmail);
usersRouter.post("/verify_email/:id/resend_code", resendVerifyEmailCode);

module.exports = usersRouter;
