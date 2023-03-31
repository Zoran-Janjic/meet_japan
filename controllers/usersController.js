const { StatusCodes } = require("http-status-codes");

const getAllUsers = (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Route working" });
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
