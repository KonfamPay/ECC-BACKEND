const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const passport = require("passport");

const authenticateUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      message:
        "This email is not registered with any account. Please check the email and try again",
    });
  if (user && user.oauthId)
    return res.status(400).json({
      message:
        "This account was created using a social option. Kindly sign in with Google or Twitter.",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(404).json({
      message:
        "This password does not match the password associated with this account. Kindly check the password and try again",
    });

  const token = user.generateAuthToken();
  res.status(200).send({ token });
};

const signInWithGoogle = async (req, res) => {
  console.log("request recieved", req.body);
  // Check if this user exists
  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user && user.oauthId) {
    const token = user.generateAuthToken();
    return res.status(200).send({ token });
  } else if (user && !user.oauthId) {
    user.oauthId = req.body.oauthId;
    user.profilePic = req.body.profilePic;
    await user.save();
    return res.status(200).send({ token });
  }

  // Create a new user if there is no user
  else if (!user) {
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      oauthId: req.body.oauthId,
      profilePic: req.body.profilePic,
    });
    const result = await user.save();
    const token = user.generateAuthToken();
    return res.status(200).send({ token });
  }
};

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/api/auth/failed",
});

const googleSignInSuccessful = async (req, res) => {
  const user = await User.findOne({ oauthId: req.user.id });
  const token = user.generateAuthToken();
  res.status(200).json({ token });
};

const googleSignInFailed = async (req, res) => {
  res.send(400).json({ message: "Could not log in with google" });
};

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .min(3)
      .max(100)
      .required()
      .label("Email"),
    password: Joi.string().min(8).max(40).required().label("Password"),
  });
  return schema.validate(user);
};

module.exports = {
  authenticateUser,
  signInWithGoogle,
  googleCallback,
  googleSignInSuccessful,
  googleSignInFailed,
};
