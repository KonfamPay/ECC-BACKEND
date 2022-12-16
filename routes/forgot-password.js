const express = require("express");
const { handleForgotPassword } = require("../controllers/forgotPasswordController");
const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/", handleForgotPassword);

module.exports = forgotPasswordRouter;
