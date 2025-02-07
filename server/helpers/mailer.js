const nodemailer = require("nodemailer");
const { sendLog } = require('../controllers/admin/settingController');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const formatDate = (date) => {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const time = date.toLocaleTimeString('en-US', options).toLowerCase();
  const formattedTime = time.replace(/\s/g, ''); // Remove space between time and AM/PM
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${formattedTime}`;
};

const sendMail = async (email, subject, content) => {
  try {
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log(formatDate(new Date()), "mail has been sent to", info.envelope.to); //messageId
      sendLog(`${formatDate(new Date())}, mail has been sent to, ${info.envelope.to}`); //messageId

    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMail };
