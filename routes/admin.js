const express = require("express");
const adminRouter = express.Router();
const {
	createAdmin,
	getAdminDetails,
	adminLogin,
	veifyAdminLogin,
	deleteAdmin,
	resendVerifyEmailCode,
} = require("../controllers/adminController");
const { admin, leadAdmin } = require("../middleware/admin");

adminRouter.post("/", leadAdmin, createAdmin);
adminRouter.get("/dashboard", admin, getAdminDetails);
adminRouter.post("/login", adminLogin);
adminRouter.post("/login/verify/:adminId/:otp", veifyAdminLogin);
adminRouter.delete("/:id", leadAdmin, deleteAdmin);
adminRouter.post("/verify_email/resend_code/:id", resendVerifyEmailCode);
module.exports = adminRouter;
