const express = require("express");
const adminRouter = express.Router();
const { createAdmin, adminLogin } = require("../controllers/adminController");
const { leadAdmin } = require("../middleware/admin");

adminRouter.post("/", createAdmin);
adminRouter.post("/login", adminLogin);
module.exports = adminRouter;
