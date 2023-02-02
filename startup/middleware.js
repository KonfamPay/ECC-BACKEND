const passport = require("passport");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const MemoryStore = require("memorystore")(session);

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
	app.use(
		session({
			cookie: { maxAge: 86400000 },
			store: new MemoryStore({
				checkPeriod: 86400000, // prune expired entries every 24h
			}),
			secret: process.env.SESSION_SECRET,
		})
	);
	app.use(passport.initialize());
	app.use(express.static("public"));
	app.set("view engine", "ejs");
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "Cookie");
		next();
	});
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "*");
		next();
	});
	app.use(cors({ credentials: true, origin: true }));
	app.use(helmet());
	app.use(trimmer);
	app.use(
		fileUpload({
			useTempFiles: true,
			tempFileDir: "./tmp/",
			limits: {
				fileSize: 0.5 * 1024 * 1024, //500kb
			},
			abortOnLimit: true,
		})
	);
};
