const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("express-async-errors");
// require("./passport-config");
require("dotenv").config();
require("./startup/config")();
require("./startup/middleware")(app);
require("./startup/routes")(app);
require("./startup/db")();

console.clear();
const server = app.listen(port, () =>
  console.log(`The app is now listening on port ${port}...`)
);

