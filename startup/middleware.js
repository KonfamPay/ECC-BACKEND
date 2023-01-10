const passport = require("passport");
const express = require("express");
const cors = require("cors");
const session = require("cookie-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const trimmer = (req, res, next) => {
	if (req.method === "POST") {
		for (const [key, value] of Object.entries(req.body)) {
			if (typeof value === "string") req.body[key] = value.trim();
		}
	}
	next();
};

module.exports = (app) => {
	app.use(cookieParser());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(logger("dev"));
	app.use(session({ secret: process.env.SESSION_SECRET }));
	app.use(passport.initialize());
	app.use(express.static("public"));
	app.set("view engine", "ejs");
	app.use(cors());
	app.use(helmet());
	app.use(trimmer);
	app.use(
		fileUpload({
			useTempFiles: true,
			limits: { fileSize: 50 * 1024 * 1024 },
		})
	);
};
