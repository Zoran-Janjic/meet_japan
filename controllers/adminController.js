// ? Import necessary modules and files
const User = require("../models/User"); // Import User model
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory"); // Import Controller Handler Factory
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants"); // Import Database Operations Constants

// ? Delete user from the database (for admin use)
const deleteUserByAdmin = ControllerHandlerFactory.deleteOneDocument(
  User,
  DatabaseOperationsConstants.DELETE_SINGLE_DOCUMENT_BY_ID
);

// ? Update user details but do not update the password as it requires
// ? a reset token and other properties.
const updateUserDetails = ControllerHandlerFactory.updateDocument(
  User,
  DatabaseOperationsConstants.UPDATE_SINGLE_DOCUMENT_BY_ID
);

// ? Get all registered users
const getUsers = ControllerHandlerFactory.getAllDocuments(User);

// ? Export the functions to be used by other modules
module.exports = {
  deleteUserByAdmin,
  updateUserDetails,
  getUsers,
};
