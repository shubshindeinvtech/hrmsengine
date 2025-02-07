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
  const options = {
    timeZone: 'Asia/Kolkata', // Force IST
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);

  // Convert format from DD/MM/YYYY, hh:mm AM/PM → DD-MM-YYYY hh:mmAM/PM
  return formattedDate.replace(/\//g, '-').replace(/\s/g, '');
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
        console.error("Email sending failed:", error);
        sendLog(`Email sending failed: ${error.message}`, "error");
      }
      console.log(formatDate(new Date()), "mail has been sent to", info.envelope.to); //messageId
      sendLog(` mail has been sent to, ${info.envelope.to}`, "error"); //messageId

    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendMail };
