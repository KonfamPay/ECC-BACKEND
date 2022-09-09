const express = require("express");
const router = express.Router();
const { createNewUser, verifyUser } = require("../controllers/users");

router.post("/", createNewUser);
router.post("/verify/:id", verifyUser);

module.exports = router;
