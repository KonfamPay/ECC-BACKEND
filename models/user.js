const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { string } = require("joi");
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
    dob: {
      required: false,
      type: Date,
    },
    phoneNumber: {
      required: false,
      type: String,
      default: "",
      length: 11,
    },
    state: {
      maxlength: 30,
      required: false,
      type: String,
    },
    lga: {
      maxlength: 50,
      required: false,
      type: String,
      default: "",
    },
    address: {
      maxlength: 255,
      required: false,
      type: String,
      default: "",
    },
    photoId: {
      url: {
        type: String,
        required: false,
        maxlength: 255,
        default: "",
      },
      cloudinaryId: {
        type: String,
        required: false,
        maxlength: 255,
        default: "",
      },
    },
    verified: {
      type: Boolean,
      default: false,
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
      dob: this.dob,
      phoneNumber: this.phoneNumber,
      state: this.state ? this.state : "",
      lga: this.lga,
      address: this.address,
      photoId: this.photoId,
      verified: this.verified,
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

const validateVerifyInputs = (payload) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .regex(/^[0-9]{11}$/)
      .length(11)
      .label("Phone Number")
      .required(),
    dob: Joi.string().required().label("Date of Birth").length(10),
    state: Joi.string().max(30).min(3).required().label("State"),
    lga: Joi.string().max(50).min(3).required().label("Local Government Area"),
    address: Joi.string().max(255).min(10).required().label("Address"),
    photoIdUrl: Joi.string().required().label("Photo Id"),
  });
  return schema.validate(payload);
};

module.exports = { User, validateUser, validateVerifyInputs };
