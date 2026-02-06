const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTPEmail = async (toEmail, otpCode, name) => {
  const mailOptions = {
    from: `"Axis IT Info" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your Axis IT Registration OTP',
    html: `<p>Hi ${name || ''},</p>
           <p>Your OTP for Axis IT Solution registration is: <b>${otpCode}</b></p>
           <p>This OTP is valid for 10 minutes.</p>
           <p>If you did not request this, please ignore.</p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
