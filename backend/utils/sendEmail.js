// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Lovely Gas Company" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
