const bcrypt = require("bcrypt");
const { User, validateUser: validate } = require("../models/user");

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
module.exports = { createNewUser };
