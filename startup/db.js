const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = () => {
	mongoose.connect(process.env.DB_CONN_STRING, () => {
		console.log("Connected to the Database...");
	});
};
