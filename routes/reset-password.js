const express = require("express");
const {
  renderResetPasswordPage,
  handleResetPassword,
} = require("../controllers/reset-password");

const router = express.Router();

router.get("/:id/:token", renderResetPasswordPage);

router.post("/:id/:token", handleResetPassword);

module.exports = router;
