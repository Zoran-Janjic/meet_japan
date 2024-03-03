const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, CustomAPIError } = require("../errors");
const EmailHandler = require("../helpers/EmailHandler");
const crypto = require("crypto");
// const helpers = require("../helpers");
const createHttpResponse = require("../helpers/createHttpResponse");
const createResponseWithJWT = require("../helpers/createJWTResponse");
// ? Add special route for adding admin privilege

// ! check cookie for register is being sent
// ? Register new user
const registerUser = async (req, res, next) => {
  try {
    // Create a new user with the provided details
    const newUser = await User.create(req.body);

    // Send welcome email to the user with the email confirmation token
    const confirmationToken = newUser.createConfirmationToken();
    // We need to save it so we save the confirmation token to the user
    await newUser.save({ validateBeforeSave: false });
    //  Send the plain text token to the user
    const accountConfirmationUrl = `${req.protocol}://localhost:3000/confirmRegistrationEmail/${confirmationToken}`;

    await new EmailHandler(newUser).sendNewAccountConfirmationEmail(
      newUser,
      accountConfirmationUrl
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `A confirmation email has been sent to ${newUser.email}. Please confirm your email to complete the registration.`,
    });
  } catch (error) {
    console.log("error => ", error);
    next(error); // Pass the error to the error-handling middleware
  }
};
// Login existing user
const loginUser = async (req, res, next) => {
  try {
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

    // Check if the user has confirmed their email and send an error if not
    if (!user.accountEmailConfirmed) {
      return next(new CustomAPIError("Please confirm your email.", 403));
    }

    // If email and password are correct, create a JWT token for the user
    const jwtToken = user.createToken();

    const cookieOptions = {
      maxAge: 3 * 60 * 60 * 1000, // Set the maxAge in milliseconds,
      sameSite: "none",
      httpOnly: true,
      secure: false,
    };

    // Set 'secure' option for the cookie if in production mode
    // ! Ensure this is set to 'true' before deploying to production
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true; // Cookie will only be sent over HTTPS
      cookieOptions.sameSite = "none"; // Cookie will be sent for cross-site requests
    }
    // Set the JWT cookie in the response
    res.cookie("meet_japan_jwt", jwtToken, cookieOptions);

    res.status(StatusCodes.OK).json({
      success: true,
      jwt_token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.photo,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
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

  try {
    await new EmailHandler(user).sendPasswordResetTokenEmail(
      user,
      resetUrlForUser
    );

    createHttpResponse(
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

  createResponseWithJWT(
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
  createResponseWithJWT(
    res,
    StatusCodes.OK,
    "success",
    user.createToken(),
    "Password updated successfully."
  );
};

// ! Add confirm email handler
const confirmRegistrationEmail = async (req, res, next) => {
  //  Get the token and hash it so we can find a user based on it
  const hashedEmailConfirmationToken = crypto
    .createHash("sha256")
    .update(req.params.confirmationToken)
    .digest("hex");

  // Try to fin the user with the hashed token and the token expiration date
  const user = await User.findOne({
    emailConfirmationToken: hashedEmailConfirmationToken,
    emailConfirmationTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new BadRequestError(
        "Token has expired. Please try again. If the problem persists please contact us directly on the support email."
      )
    );
  }

  // * If the user is found than confirm the email and remove the confirmation token and
  //  the token valid time
  user.accountEmailConfirmed = true;
  user.accountEmailConfirmedAt = Date.now();
  user.emailConfirmationToken = undefined;
  user.emailConfirmationTokenExpiration = undefined;
  // * Save the user to the database and turn off the validation for the password
  await user.save({ validateBeforeSave: false });

  // * Log the user in and send the new JWT
  const jwtToken = user.createToken();

  const cookieOptions = {
    maxAge: 3 * 60 * 60 * 1000, // Set the maxAge in milliseconds,
    sameSite: "none",
    httpOnly: true,
    secure: false,
  };

  // Set 'secure' option for the cookie if in production mode
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true; // Cookie will only be sent over HTTPS
    cookieOptions.sameSite = "none"; // Cookie will be sent for cross-site requests
  }
  // Set the JWT cookie in the response
  res.cookie("meet_japan_jwt", jwtToken, cookieOptions);

  // Send welcome email to the user
  await new EmailHandler(user).sendNewUserAccountConfirmedEmail(user);

  // Return success response with user details (omit password for security)
  res.status(StatusCodes.CREATED).json({
    success: true,
    jwt_token: jwtToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.photo,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  confirmRegistrationEmail,
};
