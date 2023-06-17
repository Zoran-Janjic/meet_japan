// Import necessary modules and files
const { StatusCodes } = require("http-status-codes"); // Import StatusCodes from http-status-codes module
const User = require("../models/User"); // Import User model
const helpers = require("../helpers/index"); // Import helper functions
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory"); // Import Controller Handler Factory
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants"); // Import Database Operations Constants

// ? Get single user
const getUser = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID
);

// ? Update user details for only updating the data which is not the password
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

    // ? Create an HTTP response with success status and updated user details
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `User details updated successfully for user ${updatedUser.name}`,
      updatedUser
    );
  } else {
    // ? Create an HTTP response with success status and a message if no data is
    // ?  provided to update the user details
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `No data provided to update the user ${req.user.name} details. Please try again.`,
      updateUser
    );
  }
};

// ? Delete self by the user which sets their active property to false as only admin
// ? can delete users from the db
const deleteSelfUser = async (req, res) => {
  const foundUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  // ? Create an HTTP response with success status and a message confirming the deletion
  helpers.createHttpResponse(
    res,
    StatusCodes.OK,
    "success",
    `User ${foundUser.name} deleted successfully.`
  );
};

// ? Get current user details
const getCurrentUserDetails = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID
);

// ? Export the functions to be used by other modules
module.exports = {
  getUser,
  updateUser,
  deleteSelfUser,
  getCurrentUserDetails,
};
