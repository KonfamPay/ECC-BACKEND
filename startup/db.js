const mongoose = require("mongoose");

module.exports = () => {
	// mongoose.connect("mongodb://127.0.0.1:27017/ECC", () => {
	// 	console.log("Connected to the Database...");
	// });
	mongoose.connect("mongodb+srv://itzadetunji:adetunjimay29@ecc.nnqlkbz.mongodb.net/ecc?retryWrites=true&w=majority", () => {
		console.log("Connected to the Database...");
	});
};
