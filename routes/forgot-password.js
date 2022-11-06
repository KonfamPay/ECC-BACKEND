const express = require("express");
const { handleForgotPassword } = require("../controllers/forgot-password");
const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/", handleForgotPassword);

module.exports = forgotPasswordRouter;
