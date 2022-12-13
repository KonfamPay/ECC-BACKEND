const { StatusCodes } = require("http-status-codes");
const auth = require("../routes/auth");
const users = require("../routes/users");
const activity = require("../routes/activity");
const forgotPassword = require("../routes/forgot-password");
const resetPassword = require("../routes/reset-password");
const error = require("../middleware/error");
const image = require("../routes/image");
const notifications = require("../routes/notifications");
const complaints = require("../routes/complaint");

module.exports = (app) => {
	app.use("/api/users", users);
	app.use("/api/activity", activity);
	app.use("/api/auth", auth);
	app.use("/api/forgot-password", forgotPassword);
	app.use("/api/reset-password", resetPassword);
	app.use("/api/image", image);
	app.use("/api/complaints", complaints);
	app.use("/api/notifications", notifications);
	app.get("*", (req, res) => {
		res.sendStatus(StatusCodes.NOT_FOUND);
	});
	app.use(error);
};
