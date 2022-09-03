const auth = require("../routes/auth");
const users = require("../routes/users");
const forgotPassword = require("../routes/forgot-password");
const resetPassword = require("../routes/reset-password");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/forgot-password", forgotPassword);
  app.use("/api/reset-password", resetPassword);
  app.use(error);
};
