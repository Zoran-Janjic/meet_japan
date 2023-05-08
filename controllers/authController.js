const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, CustomAPIError } = require("../errors");
const sendEmail = require("../helpers/sendEmail");
// ? Add special route for adding admin privilege

// ? Register new user
const registerUser = async (req, res) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_ID,
    issuer: "Meet Japan",
  });

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: { user: newUser, token } });
};

// ? Login existing user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return next(new BadRequestError("Please provide email and password."));
  }

  // Find user with matching email and include password field in the result
  const user = await User.findOne({ email }).select("+password");

  // Check if user with the provided email exists and if the password is correct
  if (!user || !(await user.checkPassword(password))) {
    // If the email or password is incorrect, return an unauthenticated error
    return next(new CustomAPIError("Invalid email or password.", 401));
  }
  // If email and password are correct, create a JWT token for the user
  const token = user.createToken();
  // Return success response with the JWT token
  res.status(StatusCodes.CREATED).json({ status: "success", token });
};

// ? Reset and Forgot existing user password
const forgotPassword = async (req, res, next) => {
  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  //  If no user found send error
  if (!user || !req.body.email) {
    return next(
      new BadRequestError(
        `No user with email: ${
          req.body.email ? req.body.email : "INVALID"
        } registered.`
      )
    );
  }

  // If user found generate reset token
  const resetToken = user.createPasswordResetToken();

  // We need to save it so we save the reset token to the user
  await user.save({ validateBeforeSave: false });

  //  Send the token to user password
  const resetUrlForUser = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const userEmailMessage = `Did you forget your password? You can generate a new one by clicking the following link: ${resetUrlForUser}.\nIf you didn't initiate this request, we advise you to reset your password to a more secure one.`;

  try {
    const emailData = await sendEmail({
      emailAddress: user.email,
      emailSubject:
        "Password reset token from Meet Japan.Valid for 10 minutes.",
      emailText: userEmailMessage,
    });

    console.log(emailData);

    res.status(StatusCodes.OK).json({
      status: "Success",
      message: `Reset token sent to ${user.email}`,
    });
  } catch (error) {
    console.log(`Error sending email: ${error}`);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomAPIError(
        "Error sending reset password email. Please contact us directly on: meetjapanhelp@gmail.com",
        500,
        "failed"
      )
    );
  }
};

const resetPassword = (req, res, next) => {
  console.log("reset pasword");
  next();
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
