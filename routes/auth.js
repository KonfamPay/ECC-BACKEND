const express = require("express");
const {
	authenticateUser,
	signInWithGoogle,
	googleCallback,
	googleSignInSuccessful,
	googleSignInFailed,
} = require("../controllers/auth");
const authRouter = express.Router();

authRouter.post("/", authenticateUser);
authRouter.post("/google", signInWithGoogle);
authRouter.get("/google/callback", googleCallback, googleSignInSuccessful);
authRouter.get("/failed", googleSignInFailed);
authRouter.get("/google/start", (req, res) => {
	res.redirect("/api/auth/google");
});
module.exports = authRouter;
