const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(process.env.DB_CONN_STRING, () => {
    console.log("Connected to the Database...");
  });
};
