const express = require("express");
const {
  authenticateUser,
  signInWithGoogle,
  googleCallback,
  googleSignInSuccessful,
  googleSignInFailed,
} = require("../controllers/auth");
const router = express.Router();

router.post("/", authenticateUser);
router.post("/google", signInWithGoogle);
router.get("/google/callback", googleCallback, googleSignInSuccessful);
router.get("/failed", googleSignInFailed);
router.get("/google/start", (req, res) => {
  res.redirect("/api/auth/google");
});
module.exports = router;
