const express = require("express");
const { handleForgotPassword } = require("../controllers/forgot-password");
const router = express.Router();

router.post("/", handleForgotPassword);

module.exports = router;
