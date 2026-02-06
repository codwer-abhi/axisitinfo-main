const transporter = require("./transporter");

const sendApprovalEmail = async (toEmail, name, hotelCode) => {
  const mailOptions = {
    from: `"Axis IT Info" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your Account Has Been Approved",
    html: `
      <p>Hi ${name},</p>
      <p>Your account has been <b>approved</b> by Axis IT Info.</p>
      <p>Your Hotel Code is: <b>${hotelCode}</b></p>
      <p>You can now login and use all services.</p>
      <p>Thank you!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendApprovalEmail;
