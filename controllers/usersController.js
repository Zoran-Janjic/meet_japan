const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find();

  res.status(StatusCodes.OK).json({ message: "success", data: { allUsers } });
};

const createUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const getUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const updateUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const deleteUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
