const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const helpers = require("../helpers/index");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");

// * Get single user
const getUser = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID
);
// * Get all registered users
const getUsers = ControllerHandlerFactory.getAllDocuments(User);

// * Update user details for only updating the data which is not the password
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

// * Delete self by the user which sets their active propertie to false
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
