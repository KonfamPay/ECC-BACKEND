const express = require("express");
const {
	authenticateUser,
	signInWithGoogle,
	googleCallback,
	googleSignInSuccessful,
	googleSignInFailed,
	isUserVerified,
} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/", authenticateUser);
authRouter.post("/google", signInWithGoogle);
authRouter.get("/google/callback", googleCallback, googleSignInSuccessful);
authRouter.get("/failed", googleSignInFailed);
authRouter.get("/google/start", (req, res) => {
	res.redirect("/api/auth/google");
});
authRouter.post("/is_verified/:id", isUserVerified);
module.exports = authRouter;
