const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// ? Add special route for adding admin privilege

const registerUser = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

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

  if (!email || !password) {
    return next(new BadRequestError("Please provide email and password."));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password))) {
    return next(new UnauthenticatedError("Invalid email or password."));
  }

  const token = user.createToken();

  res.status(StatusCodes.CREATED).json({ status: "success", token });
};
module.exports = { registerUser, loginUser };
