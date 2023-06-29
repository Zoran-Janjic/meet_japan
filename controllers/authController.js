const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, CustomAPIError } = require("../errors");
const sendEmail = require("../helpers/sendEmail");
const crypto = require("crypto");
const helpers = require("../helpers/");
// const createHttpResponse = require("../helpers/createHttpResponse");
// ? Add special route for adding admin privilege

// ? Register new user
const registerUser = async (req, res) => {
  const newUser = await User.create(req.body);
  newUser.password = undefined;
  helpers.createResponseWithJWT(
    res,
    StatusCodes.CREATED,
    "success",
    newUser.createToken(),
    "Account created successfully",
    newUser
  );
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
  // Return success response with the JWT token
  helpers.createResponseWithJWT(
    res,
    StatusCodes.CREATED,
    "success",
    user.createToken(),
    `Welcome back ${user.name}`
  );
};

// ? Forgot existing user password
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
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `Reset token sent to ${user.email}`
    );
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

// ? Reset the forgotten password
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

  helpers.createResponseWithJWT(
    res,
    StatusCodes.OK,
    "success",
    user.createToken(),
    "Password updated successfully."
  );
};

// ? Update user password
// ! Do not use the factory update method for this operation
const updatePassword = async (req, res, next) => {
  const { currentPassword, updatedPassword, passwordConfirmation } = req.body;
  if (!currentPassword || !updatedPassword || !passwordConfirmation) {
    return next(
      new BadRequestError(
        "Please provide the current password and the new password."
      )
    );
  }
  // * Get user from the database
  const user = await User.findById(req.user.id).select("+password");
  // * Check if the user knows the current password first
  // Check if user with the provided email exists and if the password is correct
  if (!user || !(await user.checkPassword(currentPassword))) {
    // If the email or password is incorrect, return an unauthenticated error
    return next(new CustomAPIError("Invalid password.", 401));
  }
  // * If password is correct than update the password and send the new JWT
  // Update the password and passwordConfirmation for the user
  user.password = updatedPassword;
  user.passwordConfirmation = passwordConfirmation;
  // Save the updated user to the database
  await user.save();
  // Return success response with the JWT token
  helpers.createResponseWithJWT(
    res,
    StatusCodes.OK,
    "success",
    user.createToken(),
    "Password updated successfully."
  );
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
};
