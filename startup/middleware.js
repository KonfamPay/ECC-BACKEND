const passport = require("passport");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");

module.exports = (app) => {
  app.use(express.json());
  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(session({ secret: process.env.SESSION_SECRET }));
  app.use(passport.initialize());
  app.use(express.static("public"));
  app.set("view engine", "ejs");
  app.use(cors());
};
