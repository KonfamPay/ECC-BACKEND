const bcrypt = require("bcrypt");
const {
  User,
  validateUser: validate,
  validateVerifyInputs,
} = require("../models/user");
const mongoose = require("mongoose");

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
  const { firstName, lastName, email } = req.body;
  user = new User({ firstName, lastName, email, password });
  const result = await user.save();
  const token = user.generateAuthToken();
  res.status(201).json({ token });
};

const verifyUser = async (req, res) => {
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

module.exports = { createNewUser, verifyUser };
