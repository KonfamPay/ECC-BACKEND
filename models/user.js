const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      minlength: 2,
      maxlength: 50,
      required: true,
      type: String,
    },
    lastName: {
      minlength: 2,
      maxlength: 50,
      required: true,
      type: String,
    },
    email: {
      minlength: 5,
      maxlength: 255,
      unique: true,
      required: true,
      type: String,
    },
    password: {
      minlength: 5,
      maxlength: 127,
      required: false,
      type: String,
    },
    oauthId: {
      required: false,
      type: String,
    },
    profilePic: {
      required: false,
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      profilePic: this.profilePic,
      createdAt: this.createdAt,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// Function for validating before persisting anything to the db
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label("First Name"),
    lastName: Joi.string().min(2).max(50).required().label("Last Name"),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .min(3)
      .max(100)
      .label("Email"),
    password: Joi.string().min(8).max(40).required().label("Password"),
  });
  return schema.validate(user);
};

module.exports = { User, validateUser };
