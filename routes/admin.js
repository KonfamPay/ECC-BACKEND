const express = require("express");
const adminRouter = express.Router();
const {
	resendVerifyEmailCode,
} = require("../controllers/adminController");
// const { admin, leadAdmin } = require("../middleware/admin");

adminRouter.post("/verify_email/:id/resend_code", resendVerifyEmailCode);
module.exports = adminRouter;
