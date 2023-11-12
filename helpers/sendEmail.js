const nodemailer = require("nodemailer");

module.exports = class EmailHandler {
  constructor(userDetails) {
    this.to = userDetails.emailAddress;
    this.from = `MEET JAPAN ${process.env.EMAIL_ADDRESS}`;
    this.subject = `${userDetails.name} ${userDetails.subject}`;
    this.text = userDetails.text;
  }

  // eslint-disable-next-line class-methods-use-this
  createTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      // return nodemailer.createTransport({
      //   service: "SendGrid",
      //   auth: {
      //     user: process.env.SENDGRID_USERNAME,
      //     pass: process.env.SENDGRID_PASSWORD,
      //   },
      // });
      return 1;
    }
    // Create transporter with Gmail service
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS, // Your Gmail email address
        pass: process.env.EMAIL_PASSCODE, // Your Gmail app password (generated in Gmail settings)
      },
    });
  }

  async sendEmail(emailFrom, emailText) {
    const mailOptions = {
      from: emailFrom || this.from, // Your Gmail email address
      to: this.to, // Email address of the recipient
      subject: this.subject, // Subject of the email
      text: emailText || this.text, // Body of the email
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendNewUserWelcome() {
    await this.sendEmail(
      "Meet Japan",
      "Welcome to Meet Japan, we hope you enjoy your time here!"
    );
  }
};
