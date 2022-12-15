const express = require("express");
const adminRouter = express.Router();
const {
	createAdmin,
  getAdminDetails,
	adminLogin,
	veifyAdminLogin,
} = require("../controllers/adminController");
const { leadAdmin } = require("../middleware/admin");

adminRouter.post("/", leadAdmin, createAdmin);
adminRouter.get("/dashboard", getAdminDetails);
adminRouter.post("/login", adminLogin);
adminRouter.post("/login/verify/:adminId/:otp", veifyAdminLogin);
module.exports = adminRouter;
