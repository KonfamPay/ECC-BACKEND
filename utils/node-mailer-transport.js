const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMail = (email, subject, message, cb = () => {}) => {
  const mailOptions = {
    from: "ECC",
    to: email,
    subject,
    text: message,
  };
  let result;
  transporter.sendMail(mailOptions, cb);
};

module.exports = {
  sendMail,
};
