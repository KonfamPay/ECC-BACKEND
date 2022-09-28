const bcrypt = require("bcrypt");
const {
  User,
  validateUser: validate,
  validateVerifyInputs,
} = require("../models/user");
const mongoose = require("mongoose");
const { sendMail } = require("../utils/node-mailer-transport");
const { EmailCode, validateEmailCode } = require("../models/emailCode");

const createNewUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "This email is already registered to an account, kindly Login.",
    });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  console.log(req.body.password, password);
  const { email } = req.body;
  user = new User({ email, password });
  await user.save();

  // Generate code to send to email
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const emailCode = new EmailCode({ code, userId: user._id });
  const result = await emailCode.save();
  console.log(emailCode);
  sendMail(
    email,
    (subject = "Verify your Email Address"),
    (message = `Use this code to verify your email address: ${code}`),
    (err, info) => {
      if (err) throw new Error("Email failed to send");
    }
  );
  console.log(user);
  const token = user.generateAuthToken();
  res.status(201).json({ token });
};

const verifyAccount = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ message: "The id is required in the body of the request!" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "This is not a valid mongoose id" });

  const user = await User.findById(id);

  if (!user)
    return res.status(404).send({ message: "This user does not exist" });

  if (user.verified)
    return res
      .status(400)
      .send({ message: "This user has already been verified!" });

  const { dob, phoneNumber, address, lga, state, photoId } = req.body;

  const { error } = validateVerifyInputs({
    firstName,
    lastName,
    dob,
    phoneNumber,
    address,
    lga,
    state,
    photoIdUrl: photoId.url,
  });

  if (error) return res.status(400).send({ message: error.details[0].message });

  user.dob = dob;
  user.phoneNumber = phoneNumber;
  user.address = address;
  user.lga = lga;
  user.state = state;
  user.photoId = photoId;

  user.verified = true;
  await user.save();

  const newToken = await user.generateAuthToken();

  res.status(200).json({ token: newToken });
};

const verifyUserEmail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "This Id is not valid!" });

  const user = await User.findById(id);
  if (!user)
    return res.status(404).json({ message: "This user does not exist!" });

  if (user.emailVerified)
    return res
      .status(400)
      .json({ message: "This email has already been verified" });

  let emailCode = await EmailCode.findOne({ userId: id });

  if (!emailCode)
    return res
      .status(400)
      .json({ message: "Please request for another code!" });

  const { code } = req.body;

  const { error } = validateEmailCode({ code });

  if (error) return res.status(400).send(error.details[0].message);

  if (emailCode.code !== code)
    return res
      .status(422)
      .json({ message: "This code is incorrect, please try again" });

  user.emailVerified = true;
  await user.save();

  await EmailCode.deleteOne({ userId: id });
  return res.status(200).json({ message: "Email verified successfully!" });
};

module.exports = { createNewUser, verifyAccount, verifyUserEmail };
