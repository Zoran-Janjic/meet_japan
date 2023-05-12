const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, CustomAPIError } = require("../errors");
const sendEmail = require("../helpers/sendEmail");
const crypto = require("crypto");

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

  //  Send the plain text token to the user
  const resetUrlForUser = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const userEmailMessage = `Did you forget your password? You can generate a new one by clicking the following link: ${resetUrlForUser}.\nIf you didn't initiate this request, we advise you to reset your password to a more secure one.`;

  try {
    await sendEmail({
      emailAddress: user.email,
      emailSubject:
        "Password reset token from Meet Japan.Valid for 10 minutes.",
      emailText: userEmailMessage,
    });

    res.status(StatusCodes.OK).json({
      status: "Success",
      message: `Reset token sent to ${user.email}`,
    });
  } catch (error) {
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

const resetPassword = async (req, res, next) => {
  // * Get the token and hash it so we can find a user based on it

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  // * Check if token has not expired and than set the new password from the provided password

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new BadRequestError(
        "Token has expired. Please try again with a new reset token."
      )
    );
  }
  // * Update the user password
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;

  // * Delete the password reset token and token valid time
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;

  await user.save();
  // * Log the user in and send the new JWT

  const token = user.createToken();

  res.status(StatusCodes.CREATED).json({ status: "success", token });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
