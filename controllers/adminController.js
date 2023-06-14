const User = require("../models/User");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");

// * Delete use from database for admin use
const deleteUserByAdmin = ControllerHandlerFactory.deleteOneDocument(
  User,
  DatabaseOperationsConstants.DELETE_SINGLE_DOCUMENT_BY_ID
);

// * Update user details but do not update the password
const updateUserDetails = ControllerHandlerFactory.updateDocument(
  User,
  DatabaseOperationsConstants.UPDATE_SINGLE_DOCUMENT_BY_ID
);
module.exports = { deleteUserByAdmin, updateUserDetails };
