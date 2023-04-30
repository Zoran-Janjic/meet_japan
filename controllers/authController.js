const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  const newUser = await User.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", data: { user: newUser } });
};

module.exports = { registerUser };
