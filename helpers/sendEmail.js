const nodemailer = require("nodemailer");

// Create transporter with Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS, // Your Gmail email address
    pass: process.env.EMAIL_PASSCODE, // Your Gmail app password (generated in Gmail settings)
  },
});

// Define function for sending email
async function sendEmail(clientEmail) {
  // Create mail options object with details of the email to be sent
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS, // Your Gmail email address
    to: clientEmail.emailAddress, // Email address of the recipient
    subject: clientEmail.emailSubject, // Subject of the email
    text: clientEmail.emailText, // Body of the email
  };

  // Send email using the transporter
  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(`Email sent: ${info.response}`);
    })
    .catch((error) => {
      console.log(`Error sending email: ${error}`);
    });
}

module.exports = sendEmail;
