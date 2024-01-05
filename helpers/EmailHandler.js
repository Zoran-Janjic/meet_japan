/* eslint-disable class-methods-use-this */
const nodemailer = require("nodemailer");

module.exports = class EmailHandler {
  constructor(userDetails) {
    this.to = userDetails.email;
    this.from = `MEET JAPAN ${process.env.EMAIL_ADDRESS}`;
  }

  createTransport() {
    // Create transporter with SendGrid or Gmail service

    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
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

    await this.createTransport().sendMail(mailOptions);
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

  async sendPasswordResetTokenEmail(user, resetToken) {
    const resetPasswordEmailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
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
    
        .reset-button {
          display: inline-block;
          background-color: #F2969B;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
        }
    
        .reset-button:hover {
          background-color: #E08192; /* Lighter shade on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset</h1>
        <p>
          Did you forget your password ${user.name}? You can generate a new one by clicking the following link:
          <a href="${resetToken}" class="reset-button">Reset Password</a>.
        </p>
        <p>
          If you didn't initiate this request, we advise you to reset your password to a more secure one.
        </p>
      </div>
    </body>
    </html>
    `;

    await this.sendEmail(
      resetPasswordEmailHtml,
      "Meet Japan | Password Reset Request!"
    );
  }

  async send_new_user_email_confirmation(user, confirmationToken) {
    const confirmEmailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Please confirm your email</title>
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
    
        .reset-button {
          display: inline-block;
          background-color: #F2969B;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
        }
    
        .reset-button:hover {
          background-color: #E08192; /* Lighter shade on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Confirm your email address</h1>
        <p>
          Did you just create a new account with the username: ${user.name}? You can confirm your email address by clicking the following link:
          <a href="${confirmationToken}" class="reset-button">Verify your email</a>.
        </p>
        <p>
          If you didn't initiate this request, please disregard this.
        </p>
      </div>
    </body>
    </html>
    `;

    await this.sendEmail(
      confirmEmailHtml,
      "Meet Japan | Email Confirm Request!"
    );
  }
};
