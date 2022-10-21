const express = require("express");
const usersRouter = express.Router();
const {
  createNewUser,
  verifyAccount,
  verifyUserEmail,
} = require("../controllers/users");

usersRouter.post("/", createNewUser);
usersRouter.post("/verify/:id", verifyAccount);
usersRouter.post("/verify_email/:id", verifyUserEmail);

module.exports = usersRouter;
