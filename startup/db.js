const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = () => {
	//   mongoose.connect(process.env.DB_CONN_STRING, () => {
	//     console.log("Connected to the Database...");
	//   });
	// mongoose.connect("mongodb://127.0.0.1:27017/ECC", () => {
	// 	console.log("Connected to the Database...");
	// });
	mongoose.connect("mongodb+srv://itzadetunji:adetunjimay29@ecc.nnqlkbz.mongodb.net/ecc?retryWrites=true&w=majority", () => {
		console.log("Connected to the Database...");
	});
};
