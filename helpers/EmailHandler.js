const nodemailer = require("nodemailer");

module.exports = class EmailHandler {
  constructor(userDetails) {
    this.to = userDetails.email;
    this.from = `MEET JAPAN ${process.env.EMAIL_ADDRESS}`;
  }

  // eslint-disable-next-line class-methods-use-this
  createTransport() {
    // if (process.env.NODE_ENV === "production") {
    // Sendgrid
    // return nodemailer.createTransport({
    //   service: "SendGrid",
    //   auth: {
    //     user: process.env.SENDGRID_USERNAME,
    //     pass: process.env.SENDGRID_PASSWORD,
    //   },
    // });
    // return 1;
    // }
    // Create transporter with Gmail service

    return nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS, // Your Gmail email address
        pass: process.env.EMAIL_PASSCODE, // Your Gmail app password (generated in Gmail settings)
      },
    });
  }

  async sendEmail(html, emailSubject, emailText) {
    const mailOptions = {
      from: this.from, // Your Gmail email address
      to: this.to, // Email address of the recipient
      subject: emailSubject, // Subject of the email
    };

    if (html) {
      mailOptions.html = html;
    } else {
      mailOptions.text = emailText;
    }

    const messageStatus = await this.createTransport().sendMail(mailOptions);
    console.log(messageStatus);
  }

  async sendNewUserWelcome(userName) {
    const welcomeToMeetJapanHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #FCEDEA; /* Sakura Blossom color */
          margin: 0;
          padding: 0;
          text-align: center;
        }
    
        .container {
          background-color: #FFFFFF;
          border-radius: 8px;
          margin: 20px auto;
          padding: 20px;
          width: 80%;
          max-width: 600px;
        }
    
        h1 {
          color: #F2969B; /* Sakura Blossom accent color */
        }
    
        p {
          color: #555555;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
    
        a {
          color: #F2969B;
          text-decoration: none;
          font-weight: bold;
        }
    
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Meet Japan ${userName}</h1>
        <p>
          Thank you for joining our community! We are delighted to have you on board. Get ready to explore, connect, and experience the beauty of our platform.
        </p>
        <p>
          Feel free to explore our features and connect with other members. If you have any questions or need assistance, don't hesitate to <a href="mailto:meetjapanhelp@gmail.com">contact our support team</a>.
        </p>
        <p>
          We look forward to seeing you around!
          Meet Japan Team
        </p>
      </div>
    </body>
    </html>`;

    await this.sendEmail(welcomeToMeetJapanHTML, "Welcome to Meet Japan!");
  }
};
