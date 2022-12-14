const express = require("express");
const {
  renderResetPasswordPage,
  handleResetPassword,
} = require("../controllers/resetpasswordController");

const resetPasswordRouter = express.Router();

resetPasswordRouter.get("/:id/:token", renderResetPasswordPage);

resetPasswordRouter.post("/:id/:token", handleResetPassword);

module.exports = resetPasswordRouter;
