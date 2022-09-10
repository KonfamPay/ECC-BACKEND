const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMail = (email, subject, message) => {
  const mailOptions = {
    from: "ECC",
    to: email,
    subject,
    text: message,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err.message);
    } else {
      return "Email Sent " + info.response;
    }
  });
};

module.exports = {
  sendMail,
};
