const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, CustomAPIError } = require("../errors");

// ? Add special route for adding admin privilege

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
module.exports = { registerUser, loginUser };
