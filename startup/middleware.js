const passport = require("passport");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");

const trimmer = (req, res, next) => {
	if (req.method === "POST") {
		for (const [key, value] of Object.entries(req.body)) {
			if (typeof value === "string") req.body[key] = value.trim();
		}
	}
	next();
}

module.exports = (app) => {
	app.use(express.json());
	app.use(logger("dev"));
	app.use(express.urlencoded({ extended: false }));
	app.use(session({ secret: process.env.SESSION_SECRET }));
	app.use(passport.initialize());
	app.use(express.static("public"));
	app.set("view engine", "ejs");
	app.use(cors());
	app.use(bodyParser.json());
	app.use(trimmer);
};
