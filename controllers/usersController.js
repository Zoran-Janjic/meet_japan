const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const helpers = require("../helpers/index");

// ! add deleteUserByAdmin  and deleteSelfByUser

const getUser = (req, res) => {
  res.status(200).json({ message: "Route working" });
};

const getUsers = async (req, res) => {
  const allUsers = await User.find();
  helpers.createHttpResponse(
    res,
    StatusCodes.OK,
    "success",
    "All registered users",
    allUsers
  );
};

// ? Update user details
const updateUser = async (req, res) => {
  const fieldsToRemove = [
    "passwordResetToken",
    "passwordResetTokenExpiration",
    "lastPasswordChangedDate",
    "password",
    "role",
    "passwordConfirmation",
  ];

  if (Object.keys(req.body).length > 0) {
    const filteredUserUpdateObject = helpers.filterUpdateUserObject(
      req.body,
      fieldsToRemove
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredUserUpdateObject,
      {
        new: true,
        runValidators: true,
      }
    );

    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `User details updated successfully for user ${updatedUser.name}`,
      updatedUser
    );
  } else {
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `No data provided to update the user ${req.user.name} details. Please try again.`,
      updateUser
    );
  }
};

const deleteSelfUser = async (req, res) => {
  // Check if tour exists
  const foundUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  helpers.createHttpResponse(
    res,
    StatusCodes.OK,
    "success",
    `User ${foundUser.name} deleted successfully.`
  );
};

module.exports = {
  getUser,
  updateUser,
  deleteSelfUser,
  getUsers,
};
