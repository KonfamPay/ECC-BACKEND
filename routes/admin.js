const express = require("express");
const adminRouter = express.Router();
const { createAdmin } = require("../controllers/adminController");
const { leadAdmin } = require("../middleware/admin");

adminRouter.post("/", createAdmin);
module.exports = adminRouter;
