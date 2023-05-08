const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find();

  res.status(StatusCodes.OK).json({ message: "success", data: { allUsers } });
};

// ! add deleteUserByAdmin  and deleteSelfByUser

const getUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const updateUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if tour exists
    const foundUser = await User.findByIdAndDelete(userId);

    // If tour does not exist send not found response
    if (!foundUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: `User with ${userId} does not exist.`,
      });
    }
    // if tour is found and deleted successfully send the deleted tour
    res.json({
      status: StatusCodes.OK,
      message: `User ${foundUser.name} deleted successfully `,
    });
  } catch (err) {
    console.log(err);
    // If error ocurs deleting tour send response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to delete the user. Please try again later.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
