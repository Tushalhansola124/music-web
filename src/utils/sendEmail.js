const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: `
        <h2>Forgot Password</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 10 minutes.</p>
    `,
  });
};

module.exports = sendOTPEmail;